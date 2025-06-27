import React from 'react'
import TestComponent from './testComponent'
import { generateLearning } from '@/app/(main)/actions'
import SummaryClient from './summuryClient'

type SummaryPageProps = {
    params: Promise<{ id: string }>
}

const SummaryPage = async ({ params }: SummaryPageProps) => {
    const { id } = await params;

    const result = await generateLearning(`uploads/${id}`);
    console.log(result);

    return (
        <div>
            {/* <TestComponent study={result} /> */}
            <SummaryClient study={result} />
        </div>
    )
}

export default SummaryPage;
