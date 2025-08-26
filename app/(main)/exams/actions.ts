'use server';



import { createClient } from "@/lib/supabase/server";
import { generateExamContentV2 } from "@/lib/utils/langchain";
import { loadAndSplitDocument } from "@/lib/utils/langchain";
import { cache } from 'react';


type Exam = {
    examId?: string,
    title: string;
    shortQuestions: {
        id: number;
        question: string;
        answer: string;
    }[];
    multipleOptionsQuestions: {
        options: string[];
        id: number;
        question: string;
        answer: number;
        explanation: string;
    }[]
};


export async function saveExamContentToDbFromAction(exam: Exam) {
    const generatedId = crypto.randomUUID();

    try {

        const supabase = await createClient()
        const { data, error: userError } = await supabase.auth.getUser();

        const { data: content, error } = await supabase
            .from('exams')
            .insert({
                examId: generatedId,
                title: exam.title,
                multipleOptionsQuestions: exam.multipleOptionsQuestions,
                shortQuestions: exam.shortQuestions,
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
    return generatedId;
}


//get content try in db , if !exesit , try to generate , if cant generate show failure state

export async function examCreationLogic(filePaths: string[]): Promise<Exam | null> {
    const supabase = await createClient()
    const { data, error: userError } = await supabase.auth.getUser();

    try {
        console.log("couldnt find the conent now im generating  ")

        // 2. Generate and save
        // ✅ Load and split all docs in parallel
        const allDocs = await Promise.all(
            filePaths.map(async (path) => {
                try {
                    return await loadAndSplitDocument(path); // returns an array per file
                } catch (err) {
                    console.error(`❌ Failed to load ${path}:`, err);
                    return [];
                }
            })
        );

        // ✅ Merge into ONE big array
        const mergedDocs = allDocs.flat();

        console.log(`✅ Merged ${mergedDocs.length} docs from ${filePaths.length} files`);

        const result = await generateExamContentV2(mergedDocs);
        console.log("just generated and now im saving   ")

        const examId = await saveExamContentToDbFromAction(result);
        console.log("just saved done saving ")



        // 3. Re-fetch from DB
        console.log("refetching again after i just saved ")
        const final = await getExamContentFromDb(examId);
        console.log("fetched the new generated and saved ")

        if (final) return final;

        // 4. Fallback return (if something went wrong with DB)
        // return result;



        return {
            examId: examId,
            title: result.title,
            multipleOptionsQuestions: result.multipleOptionsQuestions,
            shortQuestions: result.shortQuestions,
        }
    } catch (error) {
        console.error("craeting exam error", error);
        return null;
    }
}



export const getExamCreationLogic = cache(async (filePaths: string[]) => {
    return await examCreationLogic(filePaths);
});








export async function getExamContentFromDb(examId: string) {
    const supabase = await createClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from('exams')
        .select('*')
        .eq('examId', examId)
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

