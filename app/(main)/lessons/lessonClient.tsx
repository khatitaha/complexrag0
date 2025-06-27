'use client'

import { Button } from '@/components/ui/button'
import { ExamQuestion, Exercise, Flashcard, LearningContentVersion, Summary, useActions } from '@/lib/utils/zustand'
import Link from 'next/link'
import { FiBookOpen, FiClipboard, FiPlay, FiArrowRight, FiFileText } from 'react-icons/fi'



export type Lesson = {
    id: string;
    file_id: string
    study: {
        summary: Summary
        flashcards: Flashcard[]
        explanation: string
        roadmap: string
    }
    practice: {
        exercises: Exercise[]
        exam: ExamQuestion[]
    }
}


type Props = {
    lessons: Lesson[]
}

const LessonClient = ({ lessons }: Props) => {
    const { addStudyVersion, addPracticeVersion, addFileId } = useActions()

    return (
        <div className="min-h-screen bg-neutral-900 py-8 px-4">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-neutral-100">Your Lessons</h1>

                {lessons.length === 0 ? (
                    <p className="text-gray-500 text-center">No lessons available.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {lessons.map((lesson) => (
                            <div
                                key={lesson.id}
                                className="bg-neutral-800 shadow-sm rounded-xl p-5 hover:shadow-md transition"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-semibold text-neutral-100 truncate">
                                        Lesson {lesson.file_id.slice(0, 8)}...
                                    </h2>
                                    <Link
                                        href={`/whiteBoard/${lesson.file_id}`}
                                        className="text-blue-600 hover:text-blue-800"
                                        title="Continue learning"
                                    >
                                        <FiArrowRight className="w-5 h-5" />
                                    </Link>
                                </div>

                                <div className="space-y-2 text-sm text-neutral-200">
                                    <div className='flex justify-between'>
                                        <div className="flex gap-2 flex-row">
                                            <FiBookOpen className="text-indigo-500" />
                                            <span>Summary</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FiClipboard className="text-green-500" />
                                            <span>Flashcards: {lesson.study.flashcards.length}</span>
                                        </div>

                                    </div>

                                    <div className='flex justify-between'>
                                        <div className="flex items-center gap-2">
                                            <FiFileText className="text-yellow-500" />
                                            <span>Explanations: {lesson.study.explanation.length}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FiFileText className="text-pink-500" />
                                            <span>Roadmaps: {lesson.study.roadmap.length}</span>
                                        </div>
                                    </div>

                                    <div className='flex  justify-between gap-2'>

                                        <div className="flex items-center gap-2">
                                            <FiPlay className="text-red-500" />
                                            <span>Exercises {lesson.practice.exercises.length}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FiPlay className="text-purple-500" />
                                            <span>Exams: {lesson.practice.exam.length}</span>
                                        </div>
                                    </div>


                                </div>

                                <div className="mt-4">
                                    <Link
                                        onClick={
                                            () => {
                                                const now = Date.now();
                                                addStudyVersion("summary", { id: now, createdAt: new Date(), data: lesson.study.summary })
                                                addStudyVersion("flashcards", { id: now, createdAt: new Date(), data: lesson.study.flashcards })
                                                addStudyVersion("roadmap", { id: now, createdAt: new Date(), data: lesson.study.roadmap })
                                                addStudyVersion("explanation", { id: now, createdAt: new Date(), data: lesson.study.explanation })
                                                addPracticeVersion("exercises", { id: now, createdAt: new Date(), data: lesson.practice.exercises })
                                                addPracticeVersion("exam", { id: now, createdAt: new Date(), data: lesson.practice.exam })



                                                console.log(" we did this also ", lesson.file_id)

                                                addFileId(lesson.file_id);
                                            }
                                        }
                                        href={{
                                            pathname: `/WB0/${lesson.file_id}`,
                                            query: { fromLibrary: "true" },
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
