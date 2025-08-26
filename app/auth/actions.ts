"use server"
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation';






export const signUpWithGoogle = async () => {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: 'http://localhost:3000/auth/callback',
        },
    })

    console.log(data);

    if (data.url) {
        redirect(data.url)
    }
    if (error) {
        console.error(error)
    }
}




