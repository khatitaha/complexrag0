'use client'

import { Button } from '@/components/ui/button'
import { useActions } from '@/lib/utils/zustand'
import Link from 'next/link'
import { FiBookOpen, FiClipboard, FiPlay, FiArrowRight, FiFileText, FiTrash2, FiCheckSquare, FiSquare } from 'react-icons/fi'
import { deleteLessons } from './actions';
import { toast } from 'sonner';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';


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

const LessonClient = ({ lessons: initialLessons }: Props) => {
    const { addStudyVersion, addPracticeVersion, addFileId } = useActions()
    const [lessons, setLessons] = useState(initialLessons);
    const [selectedLessons, setSelectedLessons] = useState<string[]>([]);
    const [lessonToDelete, setLessonToDelete] = useState<string[] | null>(null);

    const handleDelete = async () => {
        if (!lessonToDelete) return;

        try {
            await deleteLessons(lessonToDelete);
            setLessons(lessons.filter(lesson => !lessonToDelete.includes(lesson.id)));
            setSelectedLessons([]);
            toast.success("Lessons deleted successfully!");
        } catch (error) {
            toast.error("Failed to delete lessons.");
        } finally {
            setLessonToDelete(null);
        }
    };

    const openConfirmationModal = (lessonIds: string[]) => {
        setLessonToDelete(lessonIds);
    };

    const toggleSelection = (lessonId: string) => {
        setSelectedLessons(prev =>
            prev.includes(lessonId)
                ? prev.filter(id => id !== lessonId)
                : [...prev, lessonId]
        );
    };

    return (

        <div className="min-h-screen dark:bg-neutral-900 bg-white pt-16 px-4">

            <div className="max-w-5xl mx-auto">
                <div className=' flex  justify-between items-center'>
                    <h1 className="text-3xl font-bold mb-6 dark:text-neutral-100 text-neutral-900 ">Your Lessons : </h1>
                    <div className="flex items-center gap-4">
                        {selectedLessons.length > 0 && (
                            <Button onClick={() => openConfirmationModal(selectedLessons)} variant="destructive">
                                <FiTrash2 className="mr-2" />
                                Delete Selected ({selectedLessons.length})
                            </Button>
                        )}
                        <Button asChild>
                            <Link href={'/uploadingfile'}>Create lesson</Link>
                        </Button>
                    </div>
                </div>

                {lessons.length === 0 ? (
                    <p className="text-gray-500 text-center">No lessons available.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" >
                        {lessons.map((lesson) => (
                            <div
                                key={lesson.id}
                                className={`dark:bg-neutral-800 bg-white shadow-xl rounded-xl p-5 hover:shadow-md transition cursor-pointer border-2 ${selectedLessons.includes(lesson.id) ? 'border-blue-500' : 'border-transparent'}`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <Link href={`/l/${lesson.file_id}`} className="flex-grow">
                                        <h2 className="text-lg font-semibold dark:text-neutral-100 text-neutral-900 truncate">
                                            {lesson.title}
                                        </h2>
                                    </Link>
                                    <button onClick={() => toggleSelection(lesson.id)} className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700">
                                        {selectedLessons.includes(lesson.id) ? <FiCheckSquare className="text-blue-500" /> : <FiSquare />}
                                    </button>
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

                                <div className="mt-4 flex justify-between items-center">
                                    <Button asChild >
                                        <Link
                                            href={{
                                                pathname: `/l/${lesson.file_id}`,
                                            }}
                                        >
                                            <FiBookOpen className="mr-2 " />
                                            Open Lesson
                                        </Link>
                                    </Button>
                                    <Button onClick={() => openConfirmationModal([lesson.id])} variant="destructive" size="icon">
                                        <FiTrash2 />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className=' h-12 '>

            </div>
            <Dialog open={!!lessonToDelete} onOpenChange={() => setLessonToDelete(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                    </DialogHeader>
                    <p>This action cannot be undone. This will permanently delete the selected lesson(s).</p>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setLessonToDelete(null)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default LessonClient
