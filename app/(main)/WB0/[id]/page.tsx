import React from 'react'
import { getCachedWb0Logic } from '../../actions';
import SimpleNavbarPage from './WB0Clinet';

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

    const publicUrl = `https://clxsgightqnifyrrmhrd.supabase.co/storage/v1/object/public/docs/uploads/${id}`;
    const result = await getCachedWb0Logic(publicUrl, id);

    if (!result) {
        return <div className='w-full h-screen items-center flex justify-center'>No content available</div>;
    }
    console.log("the result that im gonnaput inside the client is : ", result);
    return (
        <SimpleNavbarPage
            result={result}
            fileId={id}
            fromLibrary={false}
        />
    );
};

export default WB0Page;
