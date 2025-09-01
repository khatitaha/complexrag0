import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Document } from "langchain/document";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import { LocalEmbeddings } from "@/lib/utils/localEmbeddings";
import { createClient } from "@/lib/supabase/server";
import { getLessonFromDb } from "@/app/(main)/l/actions";

interface CleanDoc {
    id: string;
    pageContent: string;
    metadata: {
        page: any;
        startLine: any;
        endLine: any;
    };
}

function convertDocumentsToCleanDocs(docs: Document<Record<string, any>>[], userId: string, lessonId: string): CleanDoc[] {
    return docs.map(doc => ({
        id: doc.id ?? crypto.randomUUID(),
        pageContent: doc.pageContent.replace(/\n+/g, ' ').replace(/•(\S)/g, '• $1').trim(),
        metadata: {
            source: 'lesson',
            page: null,
            startLine: null,
            endLine: null,
            userId,
            lessonId,
        }
    }));
}

async function getVectorStore(userId: string) {
    const embeddings = new LocalEmbeddings();
    const pinecone = new PineconeClient({ apiKey: process.env.PINECONE_API_KEY || "" });
    const pineconeIndex = pinecone.Index("complexrag");
    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
        namespace: userId,
        pineconeIndex,
        maxConcurrency: 5,
    });
    return vectorStore;
}

async function storeSplitsToPineConeIndex(allSplits: CleanDoc[], userId: string) {
    const vectorStore = await getVectorStore(userId);
    await vectorStore.addDocuments(allSplits);
}

export async function POST(req: Request) {
    let lessonId: string | undefined;
    try {
        const body = await req.json();
        lessonId = body.lessonId;
    } catch {
        return new Response('Invalid JSON body', { status: 400 });
    }
    if (!lessonId) {
        return new Response('Missing lessonId', { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return new Response('Unauthorized', { status: 401 });
    }
    const userId = user.id;

    try {
        const lesson = await getLessonFromDb(lessonId);
        if (!lesson) {
            return new Response('Lesson not found', { status: 404 });
        }

        const lessonText = lesson.slides.map((slide: any) => slide.mainText || slide.text).join('\n\n');

        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });

        const documents = await splitter.createDocuments([lessonText]);

        const allSplits = convertDocumentsToCleanDocs(documents, userId, lessonId);

        await storeSplitsToPineConeIndex(allSplits, userId);

        return new Response(JSON.stringify({ message: 'Lesson processed successfully', splits: allSplits.length, lessonId }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err) {
        console.error(err);
        return new Response('Error processing lesson', { status: 500 });
    }
}
