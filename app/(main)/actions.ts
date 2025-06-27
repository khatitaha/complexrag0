'use server';



import { createClient } from "@/lib/supabase/server";
import { generateLearningContentV1 } from "@/lib/utils/langchain";
import { loadAndSplitDocument } from "@/lib/utils/langchain";
import { cache } from 'react';






export async function saveLearningContentToDbFromAction(Tcontent: any, file_id: string) {
    try {
        const supabase = await createClient()
        const { data, error: userError } = await supabase.auth.getUser();

        const { data: content, error } = await supabase
            .from('learning_content')
            .insert({
                file_id: file_id,
                study: {
                    summary: Tcontent.summary,
                    flashcards: Tcontent.flashcards,
                    explanation: Tcontent.explanation,
                    roadmap: Tcontent.roadmap
                },
                practice:
                {
                    exercises: Tcontent.exercises,
                    exam: Tcontent.exam

                }
                ,
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

export async function wb0Logic(filePath: string, file_id: string) {
    const supabase = await createClient()

    const { data, error: userError } = await supabase.auth.getUser();

    // 1. Try fetching
    const content = await getLearningContentFromDb(file_id);
    console.log("i tried to get the content and i did now im return in it  ")

    if (content) return content;

    try {
        console.log("couldnt find the conent now im generating  ")

        // 2. Generate and save
        const docs = await loadAndSplitDocument(filePath);
        const result = await generateLearningContentV1(docs);
        console.log("just generated and now im saving   ")

        await saveLearningContentToDbFromAction(result, file_id);
        console.log("just saved done saving    ")

        // 3. Re-fetch from DB
        console.log("refetching again after i just saved ")
        const final = await getLearningContentFromDb(file_id);
        console.log("fetched the new generated and saved  ")

        if (final) return final;

        // 4. Fallback return (if something went wrong with DB)
        // return result;



        return {
            file_id: file_id,
            study: {
                summary: result.summary,
                flashcards: result.flashcards,
                explanation: result.explanation,
                roadmap: result.roadmap
            },
            practice:
            {
                exercises: result.exercises,
                exam: result.exam

            }
            ,
            user_id: data.user?.id
        }
    } catch (error) {
        console.error("wb0Logic error", error);
        return null;
    }
}



export const getCachedWb0Logic = cache(async (filePath: string, fileId: string) => {
    return await wb0Logic(filePath, fileId);
});








export async function getLearningContentFromDb(file_id: string) {
    const supabase = await createClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from('learning_content')
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



////////////// not being used 



export async function saveLearningContentToDb(formData: FormData) {
    try {
        const supabase = await createClient()
        const { data: userData, error: userError } = await supabase.auth.getUser();

        const json = formData.get('data')

        const tfileId = formData.get('fileId')
        const tstudy = formData.get('study')
        const tpractice = formData.get('practice')

        const obj = JSON.parse(json as string)

        const fileId = JSON.parse(tfileId as string)
        const study = JSON.parse(tstudy as string)
        const practice = JSON.parse(tpractice as string)




        // console.log('Received object:', obj)

        const { data: content, error } = await supabase
            .from('learning_content')
            .insert({
                file_id: fileId,
                study: study,
                practice: practice,
                user_id: userData.user?.id
            })
            .select()
            .single()

        if (error) {
            console.error('Supabase error:', error)
        } else {
            console.log('Inserted content:', content)
        }
    } catch (err) {
        console.error('Unexpected error:', err)
    }
}


export async function generateLearning(filePath: string, file_id: string) {

    const docs = await loadAndSplitDocument(filePath);
    const result = await generateLearningContentV1(docs)

    const savingToDbResult = await saveLearningContentToDbFromAction(result, file_id)
    return result;


}