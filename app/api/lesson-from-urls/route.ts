import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { rateLimit } from '@/lib/utils/rateLimit';

const limiter = rateLimit({
    interval: 60 * 1000, // 1 minute
});

export async function POST(req: NextRequest) {
  try {
    await limiter.check(req, 10); // 10 requests per minute
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'Missing url' }, { status: 400 });
    }

    // Basic URL validation
    const urlRegex = /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})$/;
    if (!urlRegex.test(url)) {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    // TODO: Add further validation to prevent SSRF attacks.
    // This should include checks to ensure the URL does not resolve to an internal or private IP address.

    // Create a pending lesson record in the database
    const { data: newLesson, error } = await supabase
      .from("lessons")
      .insert({
        user_id: user.id,
        status: "pending",
        url: url,
        // Provide default empty values for NOT NULL columns
        lesson: [],
        flashcards: [],
        quiz: [],
        roadmap: [],
        slides: [],
        title: 'New Lesson'
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'Failed to create pending lesson' }, { status: 500 });
    }

    return NextResponse.json({ lessonId: newLesson.id }, { status: 200 });

  } catch (error) {
    if (error instanceof Error && error.message === 'Rate limit exceeded') {
        return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
