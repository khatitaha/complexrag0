'use server';

import { createClient } from '@/lib/supabase/server';

export async function deleteLessons(lessonIds: string[]) {
    const supabase = await createClient();
    const { error } = await supabase
        .from('lessons')
        .delete()
        .in('id', lessonIds);

    if (error) {
        console.error('Error deleting lessons:', error);
        throw new Error('Failed to delete lessons');
    }
}
