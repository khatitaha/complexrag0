'use client'

import { useActions, useStudy } from '@/lib/utils/zustand';
import { useState } from 'react';
import { FiMap } from 'react-icons/fi';

type Props = {
}

export default function Roadmap(props: Props) {
    const { addStudyVersion, addPracticeVersion } = useActions()
    const studyState = useStudy()
    const [currentVersionIndex, setCurrentVersionIndex] = useState(0)
    const versions = studyState.roadmap || []
    const currentVersion = versions[currentVersionIndex]?.data

    const handleVersionChange = (index: number) => {
        setCurrentVersionIndex(index)
    }

    return (
        <div className="p-6 bg-neutral-900">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <FiMap className="w-6 h-6 text-blue-400 mr-2" />
                    <h2 className="text-2xl font-bold text-white">Learning Roadmap</h2>
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
                <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-600"></div>

                    <div className="space-y-8">
                        {Array.isArray(currentVersion) ? currentVersion.map((step: string, index: number) => (
                            <div key={index} className="relative pl-12">
                                {/* Timeline dot */}
                                <div className="absolute left-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                                    {index + 1}
                                </div>

                                <div className="bg-neutral-800 rounded-lg shadow-lg p-6">
                                    <p className="text-gray-300 leading-relaxed">{step}</p>
                                </div>
                            </div>
                        )) : (
                            <div className="relative pl-12">
                                <div className="absolute left-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                                    1
                                </div>
                                <div className="bg-neutral-800 rounded-lg shadow-lg p-6">
                                    <p className="text-gray-300 leading-relaxed">{currentVersion}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="text-center py-12 bg-neutral-800 rounded-lg shadow">
                    <p className="text-gray-400">No roadmap content available in this version.</p>
                </div>
            )}
        </div>
    )
} 