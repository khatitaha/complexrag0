import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";

import crypto from "crypto";

export interface CleanDoc {
    id: string;
    pageContent: string;
    metadata: {
        source?: string | null;
        page: number | null;
        startLine: number | null;
        endLine: number | null;
        userId: string;
        conversationId: string;
    };
}

export async function loadAndSplitPdfFile(
    fileBlob: Blob,
    userId: string,
    conversationId: string
): Promise<CleanDoc[]> {
    const loader = new PDFLoader(fileBlob);
    const docs = await loader.load();

    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });

    const allSplits = await splitter.splitDocuments(docs);

    const cleanedDocs = allSplits.map((doc) => ({
        id: doc.id ?? crypto.randomUUID(),
        pageContent: doc.pageContent
            .replace(/\n+/g, " ") // remove multiple newlines
            .replace(/\s+/g, " ") // remove extra spaces
            .replace(/•\s*/g, "") // remove bullet points
            .trim(),
        metadata: {
            source: doc.metadata.source ?? null,
            page: doc.metadata.loc?.pageNumber ?? null,
            startLine: doc.metadata.loc?.lines?.from ?? null,
            endLine: doc.metadata.loc?.lines?.to ?? null,
            userId,
            conversationId,
        },
    }));

    return cleanedDocs;
}

async function getEmbeddingsFromSelfHost(chunks: string[]): Promise<number[][]> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/embed`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texts: chunks }),
    });

    if (!response.ok) {
        throw new Error("Failed to fetch embeddings");
    }

    const data = await response.json();
    return data.embeddings; // array of arrays
}

