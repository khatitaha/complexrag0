import { createClient } from '@/lib/supabase/server'
import React from 'react'
import LessonClient from './lessonClient'

type Props = {}

const LessonsPage = async (props: Props) => {

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
        .from('learning_content')
        .select('*')
        .eq('user_id', user?.id)
    console.log("we got the data ", data);
    if (error) {
        console.error('Error fetching lessons for user:', error)
        return []
    }

    return (
        <div>
            <LessonClient lessons={data} />
        </div>
    )
}

export default LessonsPage