'use client'

import { Button } from '@/components/ui/button'
import { ExamQuestion, Exercise, Flashcard, LearningContentVersion, Summary, useActions } from '@/lib/utils/zustand'
import Link from 'next/link'
import { FiBookOpen, FiClipboard, FiPlay, FiArrowRight, FiFileText } from 'react-icons/fi'



export type Lesson = {
    id: string;
    file_id: string
    lesson: { title: string, content: string }[]
    flashcards: { question: string, answer: string }[]
    quiz: { question: string, options: string[], answer: number, explanation: string }[]
    title: string
    user_id: string
}


type Props = {
    lessons: Lesson[]
}

const LessonClient = ({ lessons }: Props) => {
    const { addStudyVersion, addPracticeVersion, addFileId } = useActions()

    return (

        <div className="min-h-screen dark:bg-neutral-900 bg-white pt-16 px-4">

            <div className="max-w-5xl mx-auto">
                <div className=' flex  justify-between'>
                    <h1 className="text-3xl font-bold mb-6 dark:text-neutral-100 text-neutral-900 ">Your Lessons : </h1>
                    <Button><Link href={'/uploadingfile'} className=''>Create lesson</Link></Button>

                </div>

                {lessons.length === 0 ? (
                    <p className="text-gray-500 text-center">No lessons available.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" >
                        {lessons.map((lesson) => (
                            <div
                                key={lesson.id}
                                className="dark:bg-neutral-800 bg-white shadow-xl rounded-xl p-5 hover:shadow-md transition cursor-pointer"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-semibold dark:text-neutral-100 text-neutral-900 truncate">
                                        {lesson.title}
                                    </h2>

                                </div>

                                <div className="space-y-2 text-sm dark:text-neutral-100 text-neutral-900">
                                    <div className='flex justify-between'>
                                        <div className="flex gap-2 flex-row">
                                            <FiBookOpen className="text-indigo-500" />
                                            <span>Summary</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FiClipboard className="text-green-500" />
                                            <span>Flashcards: {lesson.flashcards.length}</span>
                                        </div>

                                    </div>

                                    <div className='flex justify-between'>
                                        <div className="flex items-center gap-2">
                                            <FiFileText className="text-yellow-500" />
                                            <span>Explanations: {lesson.quiz.length}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FiFileText className="text-pink-500" />
                                            <span>Roadmaps: {lesson.quiz.length}</span>
                                        </div>
                                    </div>

                                    <div className='flex  justify-between gap-2'>

                                        <div className="flex items-center gap-2">
                                            <FiPlay className="text-red-500" />
                                            <span>Exercises {lesson.quiz.length}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FiPlay className="text-purple-500" />
                                            <span>Exams: {lesson.quiz.length}</span>
                                        </div>
                                    </div>


                                </div>

                                <div className="mt-4">
                                    <Link

                                        href={{
                                            pathname: `/l/${lesson.file_id}`,
                                            // query: { fromLibrary: "true" },
                                        }}
                                        className="inline-block bg-blue-600 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700"
                                    >
                                        Open Lesson
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default LessonClient
