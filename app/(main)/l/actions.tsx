'use server';



import { createClient } from "@/lib/supabase/server";
import { generateLearningContentV2 } from "@/lib/utils/langchain";
import { loadAndSplitDocument, loadAndSplitWebPage } from "@/lib/utils/langchain";
import { cache } from 'react';

export type RagMessage = {
    id: string,
    message: string,
    chatId: string,
    fileId: string,
    role: string,
    character: string
    created_at: Date
    user_od: string;

}

export type Lesson = {
    id: string;
    created_at: string;
    user_id: string;
    status: 'pending' | 'generating' | 'completed' | 'failed';
    file_id: string | null;
    file_paths: string[] | null; // For lessons created from multiple files
    url: string | null; // For lessons created from a URL
    lesson: any | null;
    flashcards: any | null;
    quiz: any | null;
    roadmap: any | null;
    slides: any | null;
    title: string | null;
};

export type GeneratedLearningContent = {
    lesson: Array<{
        title: string;
        lines: Array<{
            text: string;
            explanation: string;
        }>;
    }>;
    flashcards: Array<{
        question: string;
        answer: string;
    }>;
    quiz: Array<{
        question: string;
        options: string[];
        answer: number;
        explanation: string;
    }>;
    slides: Array<{
        title: string;
        mainText: string;
        keyPoints: string[];
        emojis: string[];
        illustration_idea: string;
    }>;
    roadmap: Array<{
        title: string;
        headlines: Array<{
            title: string;
            content: string;
            subheadlines?: Array<{
                title: string;
                content: string;
            }>;
        }>;
    }>;
    title: string;
};



export async function saveLearningContentToDbFromAction(Tcontent: GeneratedLearningContent, file_id: string | null) {
    try {
        const supabase = await createClient()
        const { data } = await supabase.auth.getUser(); // Removed userError

        const lessonData: Partial<Lesson> = { // Use Partial<Lesson> as we are only setting some fields
            lesson: Tcontent.lesson,
            flashcards: Tcontent.flashcards,
            quiz: Tcontent.quiz,
            roadmap: Tcontent.roadmap,
            slides: Tcontent.slides,
            title: Tcontent.title,
            user_id: data.user?.id,
            status: 'completed'
        };

        if (file_id) {
            lessonData.file_id = file_id;
        }

        const { data: newLesson, error } = await supabase // Renamed 'content' to 'newLesson' for clarity
            .from('lessons')
            .insert(lessonData)
            .select()
            .single()

        if (error) {
            console.error('Supabase error:', error)
            return null;
        }
        return newLesson;
    } catch (err) {
        console.error('Unexpected error:', err)
        return null;
    }
}


//get content try in db , if !exesit , try to generate , if cant generate show failure state

export async function wb2Logic(filePath: string, file_id: string, language: string,
    quizCount: number,
    flashCount: number,
    note: string) {
    console.log(`language : ${language} , quiz : ${quizCount}, flash : ${flashCount}, note : ${note} from logic  `)

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser();

    try {
        console.log("Generating new lesson content...");

        const docs = await loadAndSplitDocument(filePath);
        const result = await generateLearningContentV2(docs, language, quizCount,
            flashCount,
            note,);

        // Check if a lesson for this file_id already exists for the user
        const { data: existingLesson } = await supabase
            .from('lessons')
            .select('id')
            .eq('file_id', file_id)
            .eq('user_id', user?.id)
            .maybeSingle(); // Use maybeSingle to avoid error if no lesson is found

        if (existingLesson) {
            // If it exists, update it
            const { data: updatedLesson, error } = await supabase
                .from('lessons')
                .update({
                    lesson: result.lesson,
                    flashcards: result.flashcards,
                    quiz: result.quiz,
                    roadmap: result.roadmap,
                    slides: result.slides,
                    title: result.title,
                    status: 'completed',
                })
                .eq('id', existingLesson.id)
                .select()
                .single();

            if (error) throw error;
            return updatedLesson;
        } else {
            // Otherwise, insert a new lesson
            const newLesson = await saveLearningContentToDbFromAction(result, file_id);
            if (!newLesson) {
                throw new Error("Failed to save the new lesson to the database.");
            }
            return newLesson;
        }

    } catch (error) {
        console.error("wb2Logic error", error);
        return null;
    }
}



export const getCachedWb2Logic = cache(async (filePath: string, fileId: string, language: string,
    quizCount: number,
    flashCount: number,
    note: string) => {
    return await wb2Logic(filePath, fileId, language,
        quizCount,
        flashCount,
        note);
});








export async function getLessonFromDb(id: string) {
    const supabase = await createClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();

    // First, try to fetch by primary key (id)
    const { data: lesson, error: lessonError } = await supabase // Renamed 'error' to 'lessonError'
        .from('lessons')
        .select('*')
        .eq('id', id)
        .eq('user_id', userData.user?.id)
        .single();

    if (lesson) {
        return lesson;
    }

    // If not found, try to fetch by file_id
    const { data: lessonByFileId, error: fileError } = await supabase
        .from('lessons')
        .select('*')
        .eq('file_id', id)
        .eq('user_id', userData.user?.id)
        .single();
    
    if (fileError && fileError.code !== 'PGRST116') { // PGRST116 is the code for no rows found
        console.error('Supabase fetch error:', fileError);
    }

    return lessonByFileId;
}





export async function addFlashcardAction(lessonId: string, newFlashcards: any) {

}


export async function addFlashcardsToDb(data: { lessonId: string; updatedFlashcards: { question: string, answer: string }[] }) {
    const supabase = await createClient()

    await supabase
        .from("lessons")
        .update({ flashcards: data.updatedFlashcards })
        .eq("id", data.lessonId);
}



///rag messages



export async function getStoredMessages(file_id: string): Promise<RagMessage[] | null> {
    const supabase = await createClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('fileId', file_id)
        .eq('user_id', userData.user?.id)

    // ⚠️ Ignore "no rows" error if that's expected
    if (error && error.code !== 'PGRST116') {
        console.error('Supabase fetch error:', error);
        return null;
    }

    if (!data || data.length === 0) {
        return null; // Nothing found — exactly what you expect sometimes
    }

    return data;
}


export async function storeRagMessage(ragMessage: {
    id?: string | null,
    message: string,
    chatId: string,
    fileId: string,
    role: string,
    character: string
    created_at?: Date | null

}) {
    console.log("we are try to store the messages", ragMessage);
    const supabase = await createClient()
    const { data, error: userError } = await supabase.auth.getUser();



    try {
        const result = await supabase
            .from("messages").insert({
                ...ragMessage, user_id: data.user?.id
            })
            .select()
            .single()
        console.log("the result of the rag message is : ", result)
    } catch (error) {
        console.log("error in storing the rag message", error)
    }

}

export async function createLessonFromFiles(filePaths: string[], language: string, quizCount: number, flashCount: number, note: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("User not authenticated.");
    }

    try {
        const allDocs = await Promise.all(
            filePaths.map(async (filePath) => {
                try {
                    const publicUrl = `https://clxsgightqnifyrrmhrd.supabase.co/storage/v1/object/public/docs/uploads/${filePath}`;
                    return await loadAndSplitDocument(publicUrl);
                } catch (err) {
                    console.error(`❌ Failed to load ${filePath}:`, err);
                    return [];
                }
            })
        );

        const mergedDocs = allDocs.flat();

        if (mergedDocs.length === 0) {
            throw new Error("No content could be loaded from the provided files.");
        }

        const result = await generateLearningContentV2(mergedDocs, language, quizCount, flashCount, note);

        const newLesson = await saveLearningContentToDbFromAction(result, null); // file_id is null for combined lessons

        if (!newLesson) {
            throw new Error("Failed to save the combined lesson to the database.");
        }

        return newLesson.id;

    } catch (error) {
        console.error("Error creating combined lesson from files:", error);
        throw error;
    }
}

export async function generateLessonFromUrl(
    lessonId: string,
    language: string,
    quizCount: number,
    flashCount: number,
    note: string
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("User not authenticated.");
    }

    try {
        // 1. Fetch the pending lesson to get the URL
        const { data: lesson, error: fetchError } = await supabase
            .from('lessons')
            .select('url')
            .eq('id', lessonId)
            .eq('user_id', user.id)
            .single();

        if (fetchError || !lesson || !lesson.url) {
            throw new Error(`Failed to fetch pending lesson or URL not found for lesson ${lessonId}`);
        }

        // 2. Load and split content from the URL
        const docs = await loadAndSplitWebPage(lesson.url);

        // 3. Generate the learning content
        const Tcontent = await generateLearningContentV2(docs, language, quizCount, flashCount, note);

        // 4. Update the existing lesson record with the new content
        const { data: updatedLesson, error: updateError } = await supabase
            .from('lessons')
            .update({
                lesson: Tcontent.lesson,
                flashcards: Tcontent.flashcards,
                quiz: Tcontent.quiz,
                roadmap: Tcontent.roadmap,
                slides: Tcontent.slides,
                title: Tcontent.title,
                status: 'completed', // Update status to completed
            })
            .eq('id', lessonId)
            .select()
            .single();

        if (updateError) {
            console.error('Supabase update error:', updateError);
            throw new Error("Failed to update the lesson in the database.");
        }

        return updatedLesson;

    } catch (error) {
        console.error("Error generating lesson from URL:", error);
        // Optionally, update the lesson status to 'failed'
        await supabase.from('lessons').update({ status: 'failed' }).eq('id', lessonId);
        return null;
    }
}