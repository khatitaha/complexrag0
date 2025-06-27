'use client'

import { useActions, useStudy } from '@/lib/utils/zustand';
import { useState } from 'react';
import { FiBook } from 'react-icons/fi';

type Props = {
}

type ExplanationContent = {
    title?: string;
    content: string;
    examples?: string[];
}

export default function Explanation(props: Props) {
    const { addStudyVersion, addPracticeVersion } = useActions()
    const studyState = useStudy()
    const [currentVersionIndex, setCurrentVersionIndex] = useState(0)
    const versions = studyState.explanation || []
    const currentVersion = versions[currentVersionIndex]?.data

    const handleVersionChange = (index: number) => {
        setCurrentVersionIndex(index)
    }

    const renderExplanation = (content: string | ExplanationContent) => {
        if (typeof content === 'string') {
            return (
                <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {content}
                </div>
            )
        }

        return (
            <>
                {content.title && (
                    <h3 className="text-xl font-semibold mb-4 text-white">{content.title}</h3>
                )}
                <div className="text-gray-300 leading-relaxed">
                    {content.content}
                </div>
                {content.examples && content.examples.length > 0 && (
                    <div className="mt-6">
                        <h4 className="text-lg font-semibold mb-3 text-white">Examples</h4>
                        <div className="space-y-4">
                            {content.examples.map((example: string, index: number) => (
                                <div key={index} className="bg-neutral-700 p-4 rounded-lg">
                                    <p className="text-gray-300">{example}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </>
        )
    }

    return (
        <div className="p-6 bg-neutral-900">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <FiBook className="w-6 h-6 text-blue-400 mr-2" />
                    <h2 className="text-2xl font-bold text-white">Detailed Explanation</h2>
                </div>

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
                                <span className="text-xs ml-2 opacity-75">
                                    ({new Date(version.createdAt).toLocaleDateString()})
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {currentVersion ? (
                <div className="bg-neutral-800 rounded-lg shadow-lg p-6">
                    <div className="prose prose-invert max-w-none">
                        {renderExplanation(currentVersion)}
                    </div>
                </div>
            ) : (
                <div className="text-center py-12 bg-neutral-800 rounded-lg shadow">
                    <p className="text-gray-400">No explanation content available in this version.</p>
                </div>
            )}
        </div>
    )
} 