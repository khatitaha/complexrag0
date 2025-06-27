'use client'

import { useActions, useFileId, useStudy } from '@/lib/utils/zustand';
import { useEffect, useState } from 'react';
import { FiFile } from 'react-icons/fi';

type Props = {
    study: any;
    fileId: string;
}

export default function Summary({ study, fileId }: Props) {
    const { addStudyVersion, addPracticeVersion, addFileId } = useActions()
    const studyState = useStudy()
    const [currentVersionIndex, setCurrentVersionIndex] = useState(0)
    const versions = studyState.summary || []
    const currentVersion = versions[currentVersionIndex]?.data

    const TfileId = useFileId()

    const handleVersionChange = (index: number) => {
        setCurrentVersionIndex(index)
    }



    return (
        <div className="p-6 bg-neutral-900">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <FiFile className="w-6 h-6 text-blue-400 mr-2" />
                    <h2 className="text-2xl font-bold text-white">Summary</h2>
                    <h1>{TfileId}</h1>
                </div>
                <button
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    onClick={() => {
                        const now = Date.now();
                        addStudyVersion("summary", { id: now, createdAt: new Date(), data: study.summary })
                        addStudyVersion("flashcards", { id: now, createdAt: new Date(), data: study.flashcards })
                        addStudyVersion("roadmap", { id: now, createdAt: new Date(), data: study.roadmap })
                        addStudyVersion("explanation", { id: now, createdAt: new Date(), data: study.explanation })
                        addPracticeVersion("exercises", { id: now, createdAt: new Date(), data: study.exercises })
                        addPracticeVersion("exam", { id: now, createdAt: new Date(), data: study.exam })

                        addFileId(fileId);
                    }}
                >
                    Save Progress
                </button>
            </div>

            {/* Version Selector */}
            {versions.length > 0 && (
                <div className="mb-6 bg-neutral-800 rounded-lg shadow p-4">
                    <h3 className="text-lg font-semibold mb-3 text-white">Versions</h3>
                    <div className="flex flex-wrap gap-2">
                        {versions.map((version: any, index: number) => (
                            <button
                                key={index}
                                onClick={() => handleVersionChange(index)}
                                className={`px-3 py-1 rounded ${currentVersionIndex === index
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-neutral-700 text-gray-300 hover:bg-neutral-600'
                                    }`}
                            >
                                Version {index + 1}
                                {/* <span className="text-xs ml-2 opacity-75">
                                    ({new Date(version.createdAt).toLocaleDateString()})
                                </span> */}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {currentVersion ? (
                <div className="space-y-6">
                    <div className="bg-neutral-800 rounded-lg shadow-lg p-6">
                        <h3 className="text-lg font-semibold mb-4 text-white">
                            {currentVersion.title || 'Summary'}
                        </h3>
                        <p className="text-gray-300 whitespace-pre-wrap">{currentVersion.content}</p>
                    </div>

                    {currentVersion.keyPoints && currentVersion.keyPoints.length > 0 && (
                        <div className="bg-neutral-800 rounded-lg shadow-lg p-6">
                            <h3 className="text-lg font-semibold mb-4 text-white">Key Points</h3>
                            <ul className="list-disc list-inside space-y-2">
                                {currentVersion.keyPoints.map((point: string, i: number) => (
                                    <li key={i} className="text-gray-300">{point}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {currentVersion.formulas && currentVersion.formulas.length > 0 && (
                        <div className="bg-neutral-800 rounded-lg shadow-lg p-6">
                            <h3 className="text-lg font-semibold mb-4 text-white">Important Formulas</h3>
                            <ul className="list-disc list-inside space-y-2">
                                {currentVersion.formulas.map((formula: string, i: number) => (
                                    <li key={i} className="text-gray-300 font-mono">{formula}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-12 bg-neutral-800 rounded-lg shadow">
                    <p className="text-gray-400">No summary content available in this version.</p>
                </div>
            )}
        </div>
    )
} 