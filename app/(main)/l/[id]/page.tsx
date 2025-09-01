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

    if (result) {
        // If the lesson content exists, fetch the chat and display the lesson
        const initialChat = await getStoredMessages(result.file_id || result.id);
        return <LessonPage result={result} initialChat={initialChat || []} />;
    } else {
        // If the lesson content does not exist, show the configurator for file-based lessons
        return <LessonConfigurator id={id} />;
    }
};

export default WB0Page;