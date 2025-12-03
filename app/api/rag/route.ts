import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Document } from "langchain/document";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
// import { LocalEmbeddings } from "@/lib/utils/localEmbeddings";
import { loadAndSplitDocument } from "@/lib/utils/langchain";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/utils/rateLimit";
import { NextRequest } from "next/server";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";

const limiter = rateLimit({
    interval: 60 * 1000, // 1 minute
});

interface CleanDoc {
    id: string;
    pageContent: string;
    metadata: {
        page: any;
        startLine: any;
        endLine: any;
    };
}

// Conversion function: Document<Record<string, any>>[] to CleanDoc[]
function convertDocumentsToCleanDocs(docs: Document<Record<string, any>>[], userId: string, filePathId: string): CleanDoc[] {
    return docs.map(doc => ({
        id: doc.id ?? crypto.randomUUID(),
        pageContent: doc.pageContent.replace(/\n+/g, ' ').replace(/•(\S)/g, '• $1').trim(),
        metadata: {
            source: doc.metadata.source ?? null,
            page: doc.metadata.loc?.pageNumber ?? null,
            startLine: doc.metadata.loc?.lines?.from ?? null,
            endLine: doc.metadata.loc?.lines?.to ?? null,
            userId,
            filePathId,
        }
    }));
}

export async function POST(req: NextRequest) {
    try {
        await limiter.check(req, 5); // 5 requests per minute
        let filePathId: string | undefined;
        try {
            const body = await req.json();
            filePathId = body.filePathId;
        } catch {
            return new Response('Invalid JSON body', { status: 400 });
        }
        if (!filePathId) {
            return new Response('Missing filePathid', { status: 400 });
        }

        // Get userId from Supabase
        const supabase = await createClient();
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
            return new Response('Unauthorized', { status: 401 });
        }
        const userId = user.id;

        // Verify that the filePathId belongs to the authenticated user and get the publicUrl
        const { data: document, error: docError } = await supabase
            .from('documents')
            .select('id, publicUrl')
            .eq('id', filePathId)
            .eq('user_id', userId)
            .single();

        if (docError || !document) {
            return new Response('Forbidden: You do not have access to this document.', { status: 403 });
        }

        const filePath = document.publicUrl;

        // Load and split document
        let docs: Document<Record<string, any>>[];
        try {
            docs = await loadAndSplitDocument(filePath);
        } catch (err) {
            return new Response('Error loading document', { status: 500 });
        }

        // Convert to CleanDoc[]
        const allSplits = convertDocumentsToCleanDocs(docs, userId, filePathId);
        try {
            await storeSplitsToPineConeIndex(allSplits, userId);
        } catch (error) {
            return new Response('Error storing splits', { status: 500 });
        }
        return new Response(JSON.stringify({ message: 'File processed successfully', splits: allSplits.length, filePathId }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        if (error instanceof Error && error.message === 'Rate limit exceeded') {
            return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), { status: 429, headers: { 'Content-Type': 'application/json' } });
        }
        console.error('Unexpected error in RAG endpoint:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

//   const prepareFiles
export async function loadAndSplitPdfFile(filePath: string | Blob, userId: string, filePathId: string): Promise<CleanDoc[]> {
    const loader = new PDFLoader(filePath);
    const docs = await loader.load();

    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000, chunkOverlap: 200
    });
    const allSplits = await splitter.splitDocuments(docs);
    const cleanedDocs = allSplits.map(doc => ({
        id: doc.id ?? crypto.randomUUID(), // Ensure an ID exists
        pageContent: doc.pageContent.replace(/\n+/g, ' ')
            .replace(/•(\S)/g, '• $1') // Add space after bullet points
            .trim()
        , // Remove extra spaces and new lines
        metadata: {
            source: doc.metadata.source ?? null,
            page: doc.metadata.loc['pageNumber'] ?? null,
            startLine: doc.metadata.loc['lines']["from"] ?? null,
            endLine: doc.metadata.loc['lines']["to"] ?? null,
            userId: userId,
            filePathId: filePathId
        }
    }));

    return cleanedDocs as CleanDoc[];
}

export async function getVectorStore(userId: string) {
    // const embeddings = new LocalEmbeddings();
    const embeddings = new HuggingFaceInferenceEmbeddings({
      apiKey: process.env.HF_API_KEY, 
      model: 'intfloat/e5-large-v2',
    });
    const pinecone = new PineconeClient(
        {
            apiKey: process.env.PINECONE_API_KEY || "",

        }
    );
    const pineconeIndex = pinecone.Index("complexrag");
    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
        namespace: userId,
        pineconeIndex,
        maxConcurrency: 5,
    });
    return vectorStore;
}

//   const storeVectores
export async function storeSplitsToPineConeIndex(allSplits: CleanDoc[], userId: string) {
    const vectorStore = await getVectorStore(userId);
    await vectorStore.addDocuments(allSplits);
}
