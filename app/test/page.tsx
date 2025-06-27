"use client"

import { useActions, useFileId, useStudy } from "@/lib/utils/zustand"

import dynamic from 'next/dynamic'

const PDFViewer = dynamic(() => import("../components/PDFViwer"), {
    ssr: false,
})

const page = () => {
    const study = useStudy();
    const fileId = useFileId();

    const { addStudyVersion, getLatestStudy, getLatestPractice, addPracticeVersion, addFileId } = useActions();
    console.log(study);
    return (
        <div>
            <h1>Study</h1>
            <pre>{JSON.stringify(study, null, 2)}</pre>
            fileId
            <pre>{JSON.stringify(fileId, null, 2)}</pre>

            <div className="flex gap-2">

                <button onClick={() => addStudyVersion("summary", { id: 1, createdAt: new Date(), data: { title: "Test", content: "Test", keyPoints: ["Test"], formulas: ["Test"] } })}>Add Study Version</button>
                <button onClick={() => getLatestStudy("summary")}>Get Latest Study</button>
                <button onClick={() => getLatestPractice("exercises")}>Get Latest Practice</button>
                <button onClick={() => addPracticeVersion("exercises", { id: 1, createdAt: new Date(), data: [{ question: "Test", options: ["Test"], correctAnswer: 0, explanation: "Test" }] })}>Add Practice Version</button>

                <button onClick={() => addFileId("thefildidaljlj@.com")}>Add Practice Version</button>
                < PDFViewer url={'https://clxsgightqnifyrrmhrd.supabase.co/storage/v1/object/public/docs/uploads/221ec80a-b2ac-4c9f-acda-cf91525a9fd4.pdf'} />

            </div>
        </div>
    )
}

export default page