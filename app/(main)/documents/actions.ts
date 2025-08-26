"use server"

import { createClient } from "@/lib/supabase/server"


export async function deleteFileFromDb(fileId: string) {
    const supabase = await createClient();

    // 1. Get the document first to find its storage path
    const { data: docData, error: fetchError } = await supabase
        .from("documents")
        .select("path")
        .eq("id", fileId)
        .single();

    if (fetchError || !docData) {
        console.error("❌ Could not find document to delete", fetchError);
        throw new Error("Document not found");
    }

    const filePath = `uploads/${docData.path}`;

    // 2. Delete from Supabase Storage
    const { error: storageError } = await supabase.storage
        .from("docs")
        .remove([filePath]);

    if (storageError) {
        console.error("❌ Failed to delete file from storage:", storageError);
        throw new Error("Storage delete failed");
    }

    // 3. Delete from DB
    const { error: dbError } = await supabase
        .from("documents")
        .delete()
        .eq("id", fileId);

    if (dbError) {
        console.error("❌ Failed to delete DB record:", dbError);
        throw new Error("DB delete failed");
    }

    console.log(`✅ Successfully deleted file ${filePath} and DB record ${fileId}`);
    return true;
}
