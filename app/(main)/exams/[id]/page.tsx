import React from 'react'
import ExamClient from './examClient'
import { getExamContentFromDb } from '../actions';

export const revalidate = 3600;

type Props = {
    params: Promise<{ id: string }>;

}

const ExamPage = async (props: Props) => {
    const { id } = await props.params;
    if (!id) {
        return <div>Missing file ID</div>;
    }
    const exam = await getExamContentFromDb(id);
    console.log("the result that im gonnaput inside the client is : ", exam);

    return (
        <ExamClient exam={exam} />
    )
}

export default ExamPage;




