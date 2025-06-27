"use client"

import React, { useState, useEffect } from 'react'
import { FiAward } from 'react-icons/fi'

async function getExam(fileName: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/generateExam?fileName=${fileName}`, {
        cache: 'no-store'
    })
    if (!response.ok) {
        throw new Error('Failed to fetch exam')
    }
    const data = await response.json()
    return data.exam.exam.exam
}

export default function ExamPage({ params }: { params: { id: string } }) {
    const [exam, setExam] = useState<{
        question: string
        options: string[]
        correctAnswer: number
    }[]>([])
    const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({})
    const [examSubmitted, setExamSubmitted] = useState(false)
    const [loading, setLoading] = useState(true)

    const handleGenerateExam = async () => {
        try {
            setLoading(true)
            const data = await getExam(params.id)
            setExam(data)
        } catch (error) {
            console.error('Error generating exam:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [questionIndex]: answerIndex
        }))
    }

    const calculateScore = () => {
        if (!exam) return { correct: 0, total: 0, percentage: 0 }

        let correct = 0
        exam.forEach((question, index) => {
            if (selectedAnswers[index] === question.correctAnswer) {
                correct++
            }
        })

        return {
            correct,
            total: exam.length,
            percentage: Math.round((correct / exam.length) * 100)
        }
    }

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading exam...</p>
                </div>
            </div>
        )
    }

    if (!exam || exam.length === 0) {
        return (
            <div className="p-6">
                <div className="text-center py-12">
                    <div className="mb-4">
                        <FiAward className="w-16 h-16 text-gray-400 mx-auto" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Exam Available</h3>
                    <p className="text-gray-600 mb-6">
                        The exam for this content is not yet generated.
                    </p>
                    <button
                        onClick={handleGenerateExam}
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Generate Exam
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-black">Final Exam</h2>
            <div className="bg-white rounded-lg shadow p-6">
                {!examSubmitted ? (
                    <>
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-gray-600">Time Remaining: 45:00</span>
                                <button
                                    onClick={() => setExamSubmitted(true)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                >
                                    Submit Exam
                                </button>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${(Object.keys(selectedAnswers).length / exam.length) * 100}%` }}
                                ></div>
                            </div>
                            <div className="mt-2 text-sm text-gray-500">
                                {Object.keys(selectedAnswers).length} of {exam.length} questions answered
                            </div>
                        </div>
                        <div className="space-y-8">
                            {exam.map((question, index) => (
                                <div key={index} className="border-b pb-6">
                                    <h3 className="text-lg font-semibold mb-4 text-black">
                                        Question {index + 1}
                                    </h3>
                                    <p className="text-gray-700 mb-4">{question.question}</p>
                                    <div className="space-y-2">
                                        {question.options.map((option, optionIndex) => (
                                            <button
                                                key={optionIndex}
                                                onClick={() => handleAnswerSelect(index, optionIndex)}
                                                className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${selectedAnswers[index] === optionIndex
                                                        ? 'border-blue-500 bg-blue-50 text-black'
                                                        : 'border-gray-200 hover:border-blue-300 text-black'
                                                    }`}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-8">
                        <h3 className="text-2xl font-bold mb-4 text-black">Exam Results</h3>
                        <div className="bg-blue-50 rounded-lg p-6 inline-block">
                            <div className="text-4xl font-bold text-blue-600 mb-2">
                                {calculateScore().percentage}%
                            </div>
                            <div className="text-gray-600">
                                {calculateScore().correct} out of {calculateScore().total} correct
                            </div>
                        </div>
                        <div className="mt-8 space-y-4">
                            {exam.map((question, index) => (
                                <div key={index} className="text-left border-b pb-4">
                                    <p className="font-medium mb-2">{question.question}</p>
                                    <div className="flex items-center space-x-2">
                                        <span className={`text-sm ${selectedAnswers[index] === question.correctAnswer
                                                ? 'text-green-600'
                                                : 'text-red-600'
                                            }`}>
                                            Your answer: {question.options[selectedAnswers[index] || 0]}
                                        </span>
                                        {selectedAnswers[index] !== question.correctAnswer && (
                                            <span className="text-sm text-green-600">
                                                Correct answer: {question.options[question.correctAnswer]}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
} 