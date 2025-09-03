import { createClient } from '@/lib/supabase/server'
import DocClient from './docClient'

type Props = {}

const DocPage = async (props: Props) => {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user?.id).order('created_at', { ascending: false })
    console.log("we got the data ", data);
    if (error) {
        console.error('Error fetching documents for user:', error)
        return []
    }
    return (
        <div className="min-h-screen">
            <DocClient initialDocs={data || []} />
        </div>
    )
}

export default DocPage