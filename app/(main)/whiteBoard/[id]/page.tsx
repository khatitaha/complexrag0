import { redirect } from 'next/navigation'
import { generateLearning } from '../../actions';

export default async function WhiteBoardPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // should store the result in here in the zustand store and then redirect to the summary page
    redirect(`/whiteBoard/${id}/summary`)
    // the summury displays the state of s
}
