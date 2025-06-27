"use client"

import { useActions, useStudy } from "@/lib/utils/zustand"
const page = () => {
    const study = useStudy();
    const { addStudyVersion, getLatestStudy, getLatestPractice, addPracticeVersion } = useActions();
    console.log(study);
    return (
        <div>
            <h1>Study</h1>
            <pre>{JSON.stringify(study, null, 2)}</pre>
            <div className="flex gap-2">

                <button onClick={() => addStudyVersion("summary", { id: 1, createdAt: new Date(), data: { title: "Test", content: "Test", keyPoints: ["Test"], formulas: ["Test"] } })}>Add Study Version</button>
                <button onClick={() => getLatestStudy("summary")}>Get Latest Study</button>
                <button onClick={() => getLatestPractice("exercises")}>Get Latest Practice</button>
                <button onClick={() => addPracticeVersion("exercises", { id: 1, createdAt: new Date(), data: [{ question: "Test", options: ["Test"], correctAnswer: 0, explanation: "Test" }] })}>Add Practice Version</button>
            </div>
        </div>
    )
}

export default page