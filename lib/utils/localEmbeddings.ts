import { Embeddings, EmbeddingsParams } from "@langchain/core/embeddings";

export class LocalEmbeddings extends Embeddings {
    constructor(fields?: EmbeddingsParams) {
        super(fields ?? {});
    }

    // embed a single query
    async embedQuery(text: string): Promise<number[]> {
        return this.callLocalEmbeddingAPI([text]).then((res) => res[0]);
    }

    // embed multiple chunks
    async embedDocuments(texts: string[]): Promise<number[][]> {
        return this.callLocalEmbeddingAPI(texts);
    }

    private async callLocalEmbeddingAPI(texts: string[]): Promise<number[][]> {
        const response = await fetch("http://localhost:8000/embed", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ texts }),
        });

        const data = await response.json();

        // Make sure your local server returns `embeddings: number[][]`
        return data.embeddings;
    }
}
