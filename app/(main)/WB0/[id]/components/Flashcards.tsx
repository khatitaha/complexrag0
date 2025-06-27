'use client'

import { useActions, useStudy } from '@/lib/utils/zustand';
import { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

type Props = {
}

export default function Flashcards(props: Props) {
    const { addStudyVersion, addPracticeVersion } = useActions()
    const studyState = useStudy()
    const [currentVersionIndex, setCurrentVersionIndex] = useState(studyState.summary.length)
    const [currentCardIndex, setCurrentCardIndex] = useState(0)
    const [isFlipped, setIsFlipped] = useState(false)

    const versions = studyState.flashcards || []
    const currentVersion = versions[currentVersionIndex]
    const currentCards = currentVersion?.data || []
    const currentCard = currentCards[currentCardIndex]

    const handleNext = () => {
        if (currentCardIndex < currentCards.length - 1) {
            setCurrentCardIndex(prev => prev + 1)
            setIsFlipped(false)
        }
    }

    const handlePrevious = () => {
        if (currentCardIndex > 0) {
            setCurrentCardIndex(prev => prev - 1)
            setIsFlipped(false)
        }
    }

    const handleVersionChange = (index: number) => {
        setCurrentVersionIndex(index)
        setCurrentCardIndex(0)
        setIsFlipped(false)
    }

    return (
        <div className="p-6 bg-neutral-900">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Flashcards</h2>

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

            {currentCards.length > 0 ? (
                <div className="max-w-2xl mx-auto">
                    <div className="bg-neutral-800 rounded-lg shadow-lg p-8 min-h-[300px] flex flex-col">
                        <div className="flex-1">
                            <div className="text-center mb-4">
                                <span className="text-sm text-gray-400">
                                    Card {currentCardIndex + 1} of {currentCards.length}
                                </span>
                            </div>
                            <div
                                className="text-xl text-center mb-8 cursor-pointer"
                                onClick={() => setIsFlipped(!isFlipped)}
                            >
                                {isFlipped ? (
                                    <div className="text-blue-400">{currentCard?.answer}</div>
                                ) : (
                                    <div className="text-white">{currentCard?.question}</div>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <button
                                onClick={handlePrevious}
                                disabled={currentCardIndex === 0}
                                className="p-2 rounded-full hover:bg-neutral-700 text-white bg-blue-600 disabled:bg-neutral-700 disabled:cursor-not-allowed"
                            >
                                <FiChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={() => setIsFlipped(!isFlipped)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                {isFlipped ? 'Show Question' : 'Show Answer'}
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={currentCardIndex === currentCards.length - 1}
                                className="p-2 rounded-full hover:bg-neutral-700 text-white bg-blue-600 disabled:bg-neutral-700 disabled:cursor-not-allowed"
                            >
                                <FiChevronRight className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-12 bg-neutral-800 rounded-lg shadow">
                    <p className="text-gray-400">No flashcards available in this version.</p>
                </div>
            )}
        </div>
    )
} 