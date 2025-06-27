'use client'

import React, { useEffect, useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { useLearningContentStore } from '@/lib/utils/zustand'
import type { Flashcard, LearningContentVersion } from '@/lib/utils/zustand'

async function getFlashcards(fileName: string): Promise<Flashcard[]> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/generateContent?fileName=${fileName}`, {
        cache: 'no-store'
    })
    if (!response.ok) throw new Error('Failed to fetch flashcards')
    const data = await response.json()
    return data.learningContent.flashcards
}

export default function FlashcardsPage({ params }: { params: { id: string } }) {
    const [currentFlashcard, setCurrentFlashcard] = useState(0)
    const [showAnswer, setShowAnswer] = useState(false)
    const [loading, setLoading] = useState(true)

    const flashcardVersions = useLearningContentStore(state => state.study.flashcards)
    const addVersion = useLearningContentStore(state => state.addStudyVersion)
    const getLatest = useLearningContentStore(state => state.getLatestStudy)

    const latestVersion = getLatest('flashcards')

    useEffect(() => {
        const load = async () => {
            if (!latestVersion) {
                try {
                    const data = await getFlashcards(params.id)
                    const version: LearningContentVersion<Flashcard[]> = {
                        id: Date.now(),
                        createdAt: new Date(),
                        data,
                    }
                    addVersion('flashcards', version)
                } catch (error) {
                    console.error('Error fetching flashcards:', error)
                }
            }
            setLoading(false)
        }

        load()
    }, [params.id, latestVersion, addVersion])

    const flashcards = latestVersion?.data ?? []

    const handleNavigation = (dir: 'next' | 'prev') => {
        setShowAnswer(false)
        if (!flashcards.length) return

        setCurrentFlashcard((prev) =>
            dir === 'next'
                ? (prev + 1) % flashcards.length
                : (prev - 1 + flashcards.length) % flashcards.length
        )
    }

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading flashcards...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-black">Flashcards</h2>
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-8 min-h-[300px] flex flex-col">
                    <div className="flex-1">
                        <div className="text-center mb-4">
                            <span className="text-sm text-gray-500">
                                Card {currentFlashcard + 1} of {flashcards.length}
                            </span>
                        </div>
                        <div
                            className="text-xl text-center mb-8 cursor-pointer"
                            onClick={() => setShowAnswer(!showAnswer)}
                        >
                            {showAnswer ? (
                                <div className="text-blue-600">{flashcards[currentFlashcard]?.answer}</div>
                            ) : (
                                <div className="text-gray-800">{flashcards[currentFlashcard]?.question}</div>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <button
                            onClick={() => handleNavigation('prev')}
                            className="p-2 rounded-full hover:bg-gray-500 text-white bg-blue-500"
                        >
                            <FiChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={() => setShowAnswer(!showAnswer)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            {showAnswer ? 'Show Question' : 'Show Answer'}
                        </button>
                        <button
                            onClick={() => handleNavigation('next')}
                            className="p-2 rounded-full hover:bg-gray-500 text-white bg-blue-500"
                        >
                            <FiChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
