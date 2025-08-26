
import LessonPage from './WB2Client';

import { getCachedWb2Logic, getStoredMessages } from '../actions';
import LessonConfigurator from './WB0Configurator';

export const revalidate = 3600;

type Props = {
    params: Promise<{ id: string }>;
    searchParams: { [key: string]: string | undefined };
};

const WB0Page = async (props: Props) => {
    const { id } = await props.params;

    if (!id) {
        return <div>Missing file ID</div>;
    }

    // const publicUrl = `https://clxsgightqnifyrrmhrd.supabase.co/storage/v1/object/public/docs/uploads/${id}`;
    // const result = await getCachedWb2Logic(publicUrl, id);

    // if (!result) {
    //     return <div className='w-full h-screen items-center flex justify-center'>No content available</div>;
    // }
    // console.log("the result that im gonnaput inside the client is : ", result);
    // const initialChat = await getStoredMessages(id);
    // console.log("the initial chat is : ", initialChat)

    // return (
    //     <LessonPage result={result} initialChat={initialChat || []} />
    // );

    return <LessonConfigurator id={id} />;
};

export default WB0Page;