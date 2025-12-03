import { ChatGroq } from "@langchain/groq";
import { AIMessage, HumanMessage } from '@langchain/core/messages';
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { UIMessage, streamText } from 'ai';
import { createHistoryAwareRetriever } from 'langchain/chains/history_aware_retriever';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import { createRetrievalChain } from 'langchain/chains/retrieval';
import { createClient } from '@/lib/supabase/server';
import { getVectorStore } from "../rag/route";
import { rateLimit } from '@/lib/utils/rateLimit';
import { NextRequest } from "next/server";

const limiter = rateLimit({
    interval: 60 * 1000, // 1 minute
});

const characters = [
    {
        id: "doc-alby",
        name: "Doc Alby",
        image: "/characters/alby.jpg",
        color: "#2E4057",
        description: "Inspired by Einstein. A wild-haired genius who lives in the clouds of thought. Obsessed with theories, but forgets lunch. Loves making the complex feel simple.",
    },
    {
        id: "default",
        name: "Default",
        image: "/characters/default.jpeg",
        color: "#3B3C36",
        description: " ",
    },
    {
        id: "captain-syntax",
        name: "Captain Syntax",
        image: "/characters/syntax.jpeg",
        color: "#1F4E5F",
        description: "Inspired by a mix of Buzz Lightyear and clean coder vibes. Galactic engineer with spotless code. Helmet always on. Mission: crush bugs and push commits.",
    },
    {
        id: "sheikh-byte",
        name: "Sheikh Byte",
        image: "/characters/sheikh.jpeg",
        color: "#433E3F",
        description: "Inspired by Marcus Aurelius. Wears a kufi and quotes wisdom like others breathe. Debugs with patience. Teaches you to code and reflect.",
    },
    {
        id: "tyrion",
        name: "tyrion",
        image: "/characters/tyrion.jpeg",
        color: "#5D3A66",
        description: "Inspired by Tyrion Lannister. Cryptic, clever, and always 3 steps ahead. Writes code like poetry, and roasts you kindly when you deserve it.",
    },
    {
        id: "aria-calm",
        name: "Aria Calm",
        image: "/characters/aria.jpeg",
        color: "#234E52",
        description: "Inspired by a wise anime side character. Soft voice, strong mind. Shell help you through a panic attack and a merge conflict without blinking.",
    },
];

const getCharacterById = (id: string) =>
    characters.find((char) => char.id === id) ?? characters[0];
// Convert UIMessage into a plain text string
const extractText = (msg: UIMessage): string => {
  return msg.parts
    .filter((p) => p.type === "text")
    .map((p) => p.text ?? "")
    .join(" ");
};



const formatChatHistory = (messages: UIMessage[]) => {
  return messages.map((msg) => {
    const text = extractText(msg);
    return msg.role === "user"
      ? new HumanMessage(text)
      : new AIMessage(text);
  });
};



export async function POST(req: NextRequest) {
    try {
        await limiter.check(req, 20); // 20 requests per minute

        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        const body = await req.json();
        const messages = body.messages ?? [];
        const characterId = body.characterId ?? "doc-alby";
        const userId = user.id;
        const conversationId = body.conversationId ?? "no-conversation-id";

        if (!messages.length) {
            return new Response(JSON.stringify({ error: 'No messages provided' }), { status: 400 });
        }

        const currentMessageContent = messages[messages.length - 1].content;

        const retrievalStream = await chatWithRetrieval(messages, currentMessageContent, userId, conversationId, characterId);

        // Stream directly without LangChainAdapter
        return new Response(retrievalStream, {
            headers: { 'Content-Type': 'text/event-stream' },
        });

    } catch (err) {
        if (err instanceof Error && err.message === 'Rate limit exceeded') {
            return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), { status: 429 });
        }
        console.error('Error processing chat request:', err);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
}

export async function chatWithRetrieval(chatHistory: UIMessage[], input: string, userId: string, conversationId: string, characterId: string) {
    const model = new ChatGroq({
        apiKey: process.env.GROQ_API_KEY,
        model: "llama-3.1-8b-instant",
    });

    const character = getCharacterById(characterId);

    const prompt = ChatPromptTemplate.fromMessages([
        ["system", `You are ${character.name}, ${character.description}.
You are a tutor on a learning website. Answer clearly and directly, using the lesson context {context}. If context is insufficient, refer to chat history. If unsure, answer briefly with 'NotConText'.`],
        new MessagesPlaceholder("chat_history"),
        ["user", "{input}"],
    ]);

    const rephrasePrompt = ChatPromptTemplate.fromMessages([
        new MessagesPlaceholder("chat_history"),
        ["user", "{input}"],
        ["user", "Given the above conversation, generate a search query to look up relevant information."],
    ]);

    const vectorStore = await getVectorStore(userId);
    const retreiver = vectorStore.asRetriever({ filter: { conversationId }, k: 3 });


    const historyRetrieverChain = await createHistoryAwareRetriever({
        retriever: retreiver,
        llm: model,
        rephrasePrompt,
    });

    const combineDocsChain = await createStuffDocumentsChain({
        llm: model,
        prompt,
    });

    const conversationChain = await createRetrievalChain({
        combineDocsChain,
        retriever: historyRetrieverChain,
    });

    const responseStream = await conversationChain.stream({
        chat_history: formatChatHistory(chatHistory),
        input,
    });

    console.log("Streaming response from Groq model...");
    console.log("Response stream:", responseStream);
    console.log("Character:", formatChatHistory(chatHistory));
    console.log("Input:", input);

    // Wrap the stream
    return new ReadableStream({
        async start(controller) {
            try {
                for await (const chunk of responseStream) {
                    if (chunk?.answer) controller.enqueue(chunk.answer);
                }
                controller.close();
            } catch (err) {
                console.error("Error in streaming:", err);
                controller.error(err);
            }
        }
    });
}
