'use client'

import React, { useEffect, useRef, useState } from 'react'
import Flashcards from './components/Flashcards'
import Summary from './components/Summary'
import Roadmap from './components/Roadmap'
import Explanation from './components/Explanation'
import Exercies from './components/Exercies';
import Exam from './components/Exam';
import { useActions, useFileId, usePractice, useStudy } from '@/lib/utils/zustand'

const sections = ['Summary', 'Roadmap', 'Flashcards', 'Explanation', 'Exercices', 'Exam']

type Props = {
    result: any;
    fileId: string;
    fromLibrary: boolean;
}

export default function SimpleNavbarPage({ result, fileId }: Props) {
    const { addStudyVersion, addPracticeVersion, addFileId } = useActions()


    const [selectedSection, setSelectedSection] = useState('Summary')
    const [hasHydrated, setHasHydrated] = useState(false)
    const loadedIntoZustand = useRef(false)



    useEffect(() => {
        console.log(" the datat i have insied of the client is ", result)
        setHasHydrated(true)

    }, [])

    useEffect(() => {
        if (!result || loadedIntoZustand.current === true) return

        const now = Date.now()
        loadedIntoZustand.current = true

        addFileId(fileId)

        addStudyVersion("summary", {
            id: now,
            createdAt: new Date(),
            data: result.study.summary,
        })

        addStudyVersion("flashcards", {
            id: now,
            createdAt: new Date(),
            data: result.study.flashcards,
        })

        addStudyVersion("roadmap", {
            id: now,
            createdAt: new Date(),
            data: result.study.roadmap,
        })

        addStudyVersion("explanation", {
            id: now,
            createdAt: new Date(),
            data: result.study.explanation,
        })
        addPracticeVersion("exercises", {
            id: now,
            createdAt: new Date(),
            data: result.practice.exercises,
        })
        addPracticeVersion("exam", {
            id: now,
            createdAt: new Date(),
            data: result.practice.exam,
        })

    }, [result, addStudyVersion, addFileId, fileId, addPracticeVersion])

    if (!hasHydrated) {
        return <div className="text-white text-xl p-10">Loading...</div>
    }

    const renderSection = () => {
        switch (selectedSection) {
            case 'Flashcards':
                return <Flashcards />
            case 'Summary':
                return <Summary study={result} fileId={fileId} />
            case 'Roadmap':
                return <Roadmap />
            case 'Explanation':
                return <Explanation />
            case 'Exercices':
                return <Exercies />
            case 'Exam':
                return <Exam />
            default:
                return null
        }
    }

    return (
        <div className="min-h-screen bg-neutral-900">
            <nav className="flex space-x-4 bg-neutral-800 shadow p-4">
                {sections.map((section) => (
                    <button
                        key={section}
                        onClick={() => setSelectedSection(section)}
                        className={`px-4 py-2 rounded ${selectedSection === section
                            ? 'bg-neutral-500 text-neutral-100'
                            : 'bg-neutral-200 text-neutral-700'
                            }`}
                    >
                        {section}
                    </button>
                ))}
            </nav>

            <main className="p-6 text-lg bg-neutral-700">
                {renderSection()}
            </main>
        </div>
    )
}
