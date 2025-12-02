import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@/lib/supabase/server';
import { rateLimit } from '@/lib/utils/rateLimit';

const limiter = rateLimit({
    interval: 60 * 1000, // 1 minute
});

const MAX_TEXTS_PER_REQUEST = 512;
const MAX_TEXT_LENGTH = 1000;

export async function POST(req: NextRequest) {
    try {
        await limiter.check(req, 100); // 100 requests per minute
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const { texts } = await req.json();

        if (!Array.isArray(texts) || texts.length > MAX_TEXTS_PER_REQUEST) {
            return NextResponse.json({ error: `Invalid 'texts' field. Expected an array of strings with a maximum of ${MAX_TEXTS_PER_REQUEST} elements.` }, { status: 400 });
        }

        for (const text of texts) {
            if (typeof text !== 'string' || text.length > MAX_TEXT_LENGTH) {
                return NextResponse.json({ error: `Invalid text element. Each text must be a string with a maximum of ${MAX_TEXT_LENGTH} characters.` }, { status: 400 });
            }
        }

        const response = await fetch("http://localhost:8000/embed", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ texts }),
        });

        if (!response.ok) {
            throw new Error(`Embedding server error: ${response.statusText}`);
        }

        const data = await response.json();

        return NextResponse.json(data, { status: 200 });
    } catch (error: any) {
        if (error.message === 'Rate limit exceeded') {
            return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
        }
        console.error("Error calling embedding server:", error);
        return NextResponse.json(
            { error: "Failed to fetch embeddings" },
            { status: 500 }
        );
    }
}
