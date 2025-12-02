import { ChatGroq } from "@langchain/groq";
import { AIMessage, HumanMessage } from '@langchain/core/messages';
import { ChatPromptTemplate, MessagesPlaceholder, PromptTemplate } from '@langchain/core/prompts';
import { Message, streamText } from 'ai';
import { createHistoryAwareRetriever } from 'langchain/chains/history_aware_retriever';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import { createRetrievalChain } from 'langchain/chains/retrieval';
import { LangChainAdapter, Message as VercelChatMessage } from 'ai';
import { createClient } from '@/lib/supabase/server';
import { getVectorStore } from "../rag/route";
import { rateLimit } from '@/lib/utils/rateLimit'
import { NextRequest } from "next/server";

const limiter = rateLimit({
    interval: 60 * 1000, // 1 minute
})

const characters = [
    {
        id: "doc-alby",
        name: "Doc Alby",
        image: "/characters/alby.jpg",
        color: "#2E4057", // Deep blue-gray
        description:
            "Inspired by Einstein. A wild-haired genius who lives in the clouds of thought. Obsessed with theories, but forgets lunch. Loves making the complex feel simple.",
    },
    {
        id: "default",
        name: "Default",
        image: "/characters/default.jpeg",
        color: "#3B3C36", // Charcoal with a hint of bronze
        description:
            " "
    },
    {
        id: "captain-syntax",
        name: "Captain Syntax",
        image: "/characters/syntax.jpeg",
        color: "#1F4E5F", // Ocean steel
        description:
            "Inspired by a mix of Buzz Lightyear and clean coder vibes. Galactic engineer with spotless code. Helmet always on. Mission: crush bugs and push commits.",
    },
    {
        id: "sheikh-byte",
        name: "Sheikh Byte",
        image: "/characters/sheikh.jpeg",
        color: "#433E3F", // Muted maroon-gray
        description:
            "Inspired by Marcus Aurelius. Wears a kufi and quotes wisdom like others breathe. Debugs with patience. Teaches you to code and reflect.",
    },
    {
        id: "tyrion",
        name: "tyrion",
        image: "/characters/tyrion.jpeg",
        color: "#5D3A66", // Deep violet
        description:
            "Inspired by Tyrion Lannister. Cryptic, clever, and always 3 steps ahead. Writes code like poetry, and roasts you kindly when you deserve it.",
    },
    {
        id: "aria-calm",
        name: "Aria Calm",
        image: "/characters/aria.jpeg",
        color: "#234E52", // Teal-black forest
        description:
            "Inspired by a wise anime side character. Soft voice, strong mind. Shell help you through a panic attack and a merge conflict without blinking.",
    },
];

const formatVercelMessages = (chatHistory: VercelChatMessage[]) => {
    const formattedDialogueTurns = chatHistory.map((message) => {
        if (message.role === "user") {
            return new HumanMessage(message.content);
        } else if (message.role === "assistant") {
            return new AIMessage(message.content);
        } else {
            return new AIMessage(message.content);
        }
    });
    return formattedDialogueTurns;
};

const getCharacterById = (id: string) =>
    characters.find((char) => char.id === id) ?? characters[0];

const formatMessage = (message: VercelChatMessage) => {
    return `${message.role}: ${message.content}`;
};

export async function POST(req: NextRequest) {
    try {
        await limiter.check(req, 20) // 20 requests per minute
        // Get authenticated user
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const messages = body.messages ?? [];
        const characterId = body.characterId ?? "doc-alby";
        const userId = user.id;
        const conversationId = body.conversationId ?? "no conversationId";

        const currentMessageContent = messages[messages.length - 1].content;

        // Get the retrieval chain result stream
        const retrievalStream = await chatWithretreival(messages, currentMessageContent, userId, conversationId, characterId);

        return LangChainAdapter.toDataStreamResponse(retrievalStream);
    } catch (error) {
        if (error instanceof Error && error.message === 'Rate limit exceeded') {
            return Response.json({ error: 'Rate limit exceeded' }, { status: 429 });
        }
        console.error('Error processing chat request:', error);
        return Response.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function chatWithretreival(chatHistory: Message[], input: string, userId: string, conversationId: string, characterId: string) {
    const model = new ChatGroq({
        apiKey: process.env.GROQ_API_KEY, // Default value.
        model: "llama-3.1-8b-instant"
    });
    const character = getCharacterById(characterId);

    const prompt = ChatPromptTemplate.fromMessages(
        [
            [
                "system",
                `You are ${character.name}, ${character.description}.
    You are a tutor on a learning website. Your priority is to answer the user's question clearly, directly, and in as few words as possible.
    Add only a light touch (10%) of your personality — no actions like *adjusts glasses* or *smiles*, and no roleplay.
    Keep the focus on the answer
    Base answers on the study material or lesson : {context}. If context is insufficient, refer to chat history. 
    If still unsure, answer briefly and end with 'NotConText'.
    If asked about your identity, say your name is ${character.name}.`,
            ],
            new MessagesPlaceholder("chat_history"),
            ["user", "{input}"],
        ]
    )
    const rephrasePrompt = ChatPromptTemplate.fromMessages([
        new MessagesPlaceholder("chat_history"),
        ["user", "{input}"],
        [
            "user",
            "Given the above conversation, generate a search query to look up in order to get information relevant to the conversation",
        ],
    ]);

    const vectorStore = await getVectorStore(userId);
    const filter = { conversationId: conversationId };
    const retreiver = vectorStore.asRetriever({
        filter,
        k: 3, // Number of results
    });

    const historyretrieverChain = await createHistoryAwareRetriever({
        retriever: retreiver,
        llm: model,
        rephrasePrompt: rephrasePrompt
    });

    const chain = await createStuffDocumentsChain({
        llm: model,
        prompt,
    });
    const conversationChain = await createRetrievalChain({
        combineDocsChain: chain,
        retriever: historyretrieverChain,
    });

    const response = await conversationChain.stream({
        chat_history: formatVercelMessages(chatHistory),
        input: input
    });
    
    const formattedResponse = new ReadableStream({
        async start(controller) {
            try {
                for await (const chunk of response) {  // Iterate over the stream
                    if (chunk?.answer) {
                        controller.enqueue(chunk.answer);  // Send only valid answers
                    }
                }
                controller.close();
            } catch (error) {
                console.error("Error processing stream:", error);
                controller.error(error);
            }
        }
    });

    return formattedResponse;
}