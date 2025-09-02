import LessonPage from './WB2Client';
import { getLessonFromDb, getStoredMessages } from '../actions';
import LessonConfigurator from './WB0Configurator';

export const revalidate = 3600;

type Props = {
    params: Promise<{ id: string }>;
};

const WB0Page = async (props: Props) => {
    const { id } = await props.params;

    if (!id) {
        return <div>Missing ID</div>;
    }

    // First, try to fetch the lesson content from the database
    const result = await getLessonFromDb(id);

    // Case 1: Lesson exists and is fully generated
    if (result && result.status === 'completed' && result.lesson) {
        const initialChat = await getStoredMessages(result.file_id || result.id);
        return <LessonPage result={result} initialChat={initialChat || []} />;
    }

    // Case 2: Lesson is pending (from URL) or doesn't exist yet (from file upload)
    // In both scenarios, we show the configurator.
    // We pass the fetched result (if it exists) to the configurator for URL-based lessons.
    return <LessonConfigurator id={id} initialLessonData={result} />;
};

export default WB0Page;