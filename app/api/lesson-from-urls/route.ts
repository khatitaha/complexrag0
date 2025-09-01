import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { loadAndSplitWebPage } from '@/lib/utils/langchain';
import { generateLearningContentV2 } from '@/lib/utils/langchain';
import { saveLearningContentToDbFromAction } from '@/app/(main)/l/actions';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'Missing url' }, { status: 400 });
    }

    const docs = await loadAndSplitWebPage(url);
    
    // Using default values for quizCount, flashCount, and note for now
    const learningContent = await generateLearningContentV2(docs, 'English', 5, 5, '');

    // We need a way to save content that doesn't have a file_id.
    // For now, we will pass null for the file_id.
    // This will require a change in the saveLearningContentToDbFromAction function.
    const newLesson = await saveLearningContentToDbFromAction(learningContent, null);

    if (!newLesson) {
      throw new Error('Failed to save lesson to database');
    }

    return NextResponse.json({ lessonId: newLesson.id }, { status: 200 });

  } catch (error) {
    console.error('Lesson from URL error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
