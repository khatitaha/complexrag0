'use server';



import { createClient } from "@/lib/supabase/server";
import { generateLearningContentV2 } from "@/lib/utils/langchain";
import { loadAndSplitDocument } from "@/lib/utils/langchain";
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



export async function saveLearningContentToDbFromAction(Tcontent: any, file_id: string) {
    try {
        const supabase = await createClient()
        const { data, error: userError } = await supabase.auth.getUser();

        const { data: content, error } = await supabase
            .from('lessons')
            .insert({
                file_id: file_id,
                lesson: Tcontent.lesson,
                flashcards: Tcontent.flashcards,
                quiz: Tcontent.quiz,
                title: Tcontent.title,
                user_id: data.user?.id
            })
            .select()
            .single()

        if (error) {
            console.error('Supabase error:', error)
        }
    } catch (err) {
        console.error('Unexpected error:', err)
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
        // We no longer need to check for existing content here,
        // as the page component does that now.
        // We can go straight to generating the content.

        console.log("Generating new lesson content...");

        const docs = await loadAndSplitDocument(filePath);
        const result = await generateLearningContentV2(docs, language, quizCount,
            flashCount,
            note,);

        await saveLearningContentToDbFromAction(result, file_id);

        // Return the newly generated content
        return {
            file_id: file_id,
            lesson: result.lesson,
            flashcards: result.flashcards,
            quiz: result.quiz,
            title: result.title,
            user_id: user?.id
        };

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








export async function getLearningContentFromDb(file_id: string) {
    const supabase = await createClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('file_id', file_id)
        .eq('user_id', userData.user?.id)

    // ⚠️ Ignore "no rows" error if that's expected
    if (error && error.code !== 'PGRST116') {
        console.error('Supabase fetch error:', error);
        return null;
    }

    if (!data || data.length === 0) {
        return null; // Nothing found — exactly what you expect sometimes
    }

    return data[0]; // Return the first match
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