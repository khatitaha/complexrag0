import LessonPage from './WB2Client';
import { getLearningContentFromDb, getStoredMessages } from '../actions';
import LessonConfigurator from './WB0Configurator';

export const revalidate = 3600;

type Props = {
    params: { id: string };
};

const WB0Page = async (props: Props) => {
    const { id } = props.params;

    if (!id) {
        return <div>Missing file ID</div>;
    }

    // First, try to fetch the lesson content from the database
    const result = await getLearningContentFromDb(id);

    if (result) {
        // If the lesson content exists, fetch the chat and display the lesson
        const initialChat = await getStoredMessages(id);
        return <LessonPage result={result} initialChat={initialChat || []} />;
    } else {
        // If the lesson content does not exist, show the configurator
        return <LessonConfigurator id={id} />;
    }
};

export default WB0Page;