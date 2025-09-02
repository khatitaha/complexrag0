import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const { texts } = await req.json(); // ✅ Get chunks from request body

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
        console.error("Error calling embedding server:", error);
        return NextResponse.json(
            { error: "Failed to fetch embeddings" },
            { status: 500 }
        );
    }
}
