import { createClient } from "@/lib/supabase/server"
import ExamsClient from "./exam_client"

type Props = {}

const examPage = async (props: Props) => {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { data: docs, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user?.id).order('created_at', { ascending: false })
    console.log("we got the data ", docs);

    const { data: exams, error: examError } = await supabase
        .from('exams')
        .select('*')
        .eq('user_id', user?.id)
    console.log("we got the EXAAAAAAMs ", exams);
    if (error) {
        console.error('Error fetching documents for user:', error)
        return []
    }
    return (
        <ExamsClient documents={docs} examss={exams} />
    )
}

export default examPage