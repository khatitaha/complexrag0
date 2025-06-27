"use client"

import { useActions, usePractice, useStudy } from '@/lib/utils/zustand';
import { useState } from 'react';
import { FiCheck, FiX } from 'react-icons/fi';

type Props = {
}

export default function Exercises(props: Props) {
    const { addStudyVersion, addPracticeVersion } = useActions()
    const practiceState = usePractice()
    const [currentVersionIndex, setCurrentVersionIndex] = useState(0)
    const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
    const versions = practiceState.exercises || []
    const currentVersion = versions[currentVersionIndex]?.data || []

    const handleVersionChange = (index: number) => {
        setCurrentVersionIndex(index)
        setSelectedAnswers([])
    }

    const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
        setSelectedAnswers(prev => {
            const newAnswers = [...prev]
            newAnswers[questionIndex] = answerIndex
            return newAnswers
        })
    }

    return (
        <div className="p-6 bg-neutral-900">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Practice Exercises</h2>

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

            <div className="space-y-6">
                {currentVersion.length > 0 ? (
                    currentVersion.map((exercise: any, index: number) => (
                        <div key={index} className="bg-neutral-800 rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold mb-4 text-white">Question {index + 1}</h3>
                            <p className="text-gray-300 mb-4">{exercise.question}</p>
                            <div className="space-y-2">
                                {exercise.options.map((option: string, optionIndex: number) => (
                                    <button
                                        key={optionIndex}
                                        onClick={() => handleAnswerSelect(index, optionIndex)}
                                        className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${selectedAnswers[index] === optionIndex
                                            ? 'border-blue-500 bg-blue-900/30 text-white'
                                            : 'border-neutral-600 hover:border-blue-500 text-gray-300'
                                            }`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                            {selectedAnswers[index] !== undefined && (
                                <div className="mt-4">
                                    {selectedAnswers[index] === exercise.correctAnswer ? (
                                        <div className="flex items-center text-green-400">
                                            <FiCheck className="mr-2" />
                                            Correct!
                                        </div>
                                    ) : (
                                        <div className="flex items-center text-red-400">
                                            <FiX className="mr-2" />
                                            Incorrect. Try again!
                                        </div>
                                    )}
                                    <p className="mt-2 text-sm text-gray-400">{exercise.explanation}</p>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-neutral-800 rounded-lg shadow">
                        <p className="text-gray-400">No exercises available in this version.</p>
                    </div>
                )}
            </div>
        </div>
    )
}