"use client"

import React, { useState, useEffect } from 'react'
import { FiCheck, FiX } from 'react-icons/fi'

async function getExercises(fileName: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/generateContent?fileName=${fileName}`, {
        cache: 'no-store'
    })
    if (!response.ok) {
        throw new Error('Failed to fetch exercises')
    }
    const data = await response.json()
    return data.learningContent.exercises
}

export default function ExercisesPage({ params }: { params: { id: string } }) {
    const [exercises, setExercises] = useState<{
        question: string
        options: string[]
        correctAnswer: number
        explanation: string
    }[]>([])
    const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadExercises = async () => {
            try {
                const data = await getExercises(params.id)
                setExercises(data)
            } catch (error) {
                console.error('Error loading exercises:', error)
            } finally {
                setLoading(false)
            }
        }
        loadExercises()
    }, [params.id])

    const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [questionIndex]: answerIndex
        }))
    }

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading exercises...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-black">Practice Exercises</h2>
            <div className="space-y-6">
                {exercises.map((exercise, index) => (
                    <div key={index} className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold mb-4 text-black">Question {index + 1}</h3>
                        <p className="text-gray-700 mb-4">{exercise.question}</p>
                        <div className="space-y-2">
                            {exercise.options.map((option, optionIndex) => (
                                <button
                                    key={optionIndex}
                                    onClick={() => handleAnswerSelect(index, optionIndex)}
                                    className={`w-full text-left p-3 rounded-lg border ${selectedAnswers[index] === optionIndex
                                            ? 'border-blue-500 bg-blue-50 text-black'
                                            : 'border-gray-200 hover:border-blue-300 text-black'
                                        }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                        {selectedAnswers[index] !== undefined && (
                            <div className="mt-4">
                                {selectedAnswers[index] === exercise.correctAnswer ? (
                                    <div className="flex items-center text-green-600">
                                        <FiCheck className="mr-2" />
                                        Correct!
                                    </div>
                                ) : (
                                    <div className="flex items-center text-red-600">
                                        <FiX className="mr-2" />
                                        Incorrect. Try again!
                                    </div>
                                )}
                                <p className="mt-2 text-sm text-gray-600">{exercise.explanation}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
} 