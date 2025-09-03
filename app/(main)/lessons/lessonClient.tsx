'use client'

import { Button } from '@/components/ui/button'
import { useActions } from '@/lib/utils/zustand'
import Link from 'next/link'
import { FiBookOpen, FiClipboard, FiPlay, FiArrowRight, FiFileText, FiTrash2, FiCheckSquare, FiSquare, FiPlus, FiTrendingUp, FiClock, FiStar, FiLayers } from 'react-icons/fi'
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
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800 pt-16 px-4">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-cyan-400/20 to-green-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/10 to-green-500/10 rounded-full px-4 py-2 border border-cyan-500/20 mb-6">
                        <FiBookOpen className="w-4 h-4 text-cyan-500" />
                        <span className="text-sm text-cyan-600 dark:text-cyan-400 font-medium">Your Learning Journey</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 dark:from-white dark:via-neutral-100 dark:to-white bg-clip-text text-transparent mb-4">
                        Your Lessons
                    </h1>

                    <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mb-8">
                        Continue your learning journey with personalized lessons, interactive content, and AI-powered assistance.
                    </p>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
                        <div className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-xl p-4 border border-neutral-200 dark:border-neutral-700">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                    <FiBookOpen className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-neutral-900 dark:text-white">{lessons.length}</div>
                                    <div className="text-sm text-neutral-600 dark:text-neutral-400">Total Lessons</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-xl p-4 border border-neutral-200 dark:border-neutral-700">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                    <FiLayers className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-neutral-900 dark:text-white">
                                        {lessons.reduce((acc, lesson) => acc + lesson.flashcards.length, 0)}
                                    </div>
                                    <div className="text-sm text-neutral-600 dark:text-neutral-400">Flashcards</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-xl p-4 border border-neutral-200 dark:border-neutral-700">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                    <FiPlay className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-neutral-900 dark:text-white">
                                        {lessons.reduce((acc, lesson) => acc + lesson.quiz.length, 0)}
                                    </div>
                                    <div className="text-sm text-neutral-600 dark:text-neutral-400">Exercises</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        {selectedLessons.length > 0 && (
                            <Button
                                onClick={() => openConfirmationModal(selectedLessons)}
                                variant="destructive"
                                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <FiTrash2 className="mr-2" />
                                Delete Selected ({selectedLessons.length})
                            </Button>
                        )}

                        <Button asChild className="bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-700 hover:to-cyan-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <Link href="/uploadingfile" className="flex items-center gap-2">
                                <FiPlus className="w-5 h-5" />
                                Create New Lesson
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Lessons Grid */}
                {lessons.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-24 h-24 bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <FiBookOpen className="w-12 h-12 text-neutral-400 dark:text-neutral-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">No lessons yet</h3>
                        <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-md mx-auto">
                            Start your learning journey by creating your first lesson from a document or URL.
                        </p>
                        <Button asChild className="bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-700 hover:to-cyan-700 text-white px-6 py-3 rounded-xl">
                            <Link href="/uploadingfile" className="flex items-center gap-2">
                                <FiPlus className="w-5 h-5" />
                                Create Your First Lesson
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {lessons.map((lesson, index) => (
                            <div
                                key={lesson.id}
                                className={`group relative bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 ${
                                    selectedLessons.includes(lesson.id)
                                        ? 'border-blue-500 shadow-blue-500/20'
                                        : 'border-transparent hover:border-neutral-200 dark:hover:border-neutral-700'
                                }`}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Selection Indicator */}
                                <button
                                    onClick={() => toggleSelection(lesson.id)}
                                    className="absolute top-4 right-4 w-8 h-8 rounded-lg border-2 border-neutral-300 dark:border-neutral-600 flex items-center justify-center hover:border-blue-500 transition-colors"
                                >
                                    {selectedLessons.includes(lesson.id) ? (
                                        <FiCheckSquare className="w-5 h-5 text-blue-500" />
                                    ) : (
                                        <FiSquare className="w-5 h-5 text-neutral-400" />
                                    )}
                                </button>

                                {/* Lesson Content */}
                                <Link href={`/l/${lesson.file_id || lesson.id}`} className="block">
                                    <div className="mb-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-green-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                            <FiBookOpen className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2 line-clamp-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                                            {lesson.title}
                                        </h3>
                                    </div>

                                    {/* Lesson Stats */}
                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                                                <FiLayers className="w-4 h-4 text-green-500" />
                                                <span>{lesson.flashcards.length} Flashcards</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                                                <FiPlay className="w-4 h-4 text-purple-500" />
                                                <span>{lesson.quiz.length} Exercises</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                                            <FiFileText className="w-4 h-4 text-blue-500" />
                                            <span>Complete lesson with roadmap</span>
                                        </div>
                                    </div>
                                </Link>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <Button asChild className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg">
                                        <Link href={`/l/${lesson.file_id || lesson.id}`} className="flex items-center justify-center gap-2">
                                            <FiBookOpen className="w-4 h-4" />
                                            <span className="hidden sm:inline">Open</span>
                                        </Link>
                                    </Button>

                                    <Button
                                        onClick={() => openConfirmationModal([lesson.id])}
                                        variant="outline"
                                        size="icon"
                                        className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                                    >
                                        <FiTrash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className=' h-20'></div>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!lessonToDelete} onOpenChange={() => setLessonToDelete(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <FiTrash2 className="w-5 h-5 text-red-500" />
                            Delete Lessons
                        </DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-neutral-600 dark:text-neutral-400">
                            Are you sure you want to delete {lessonToDelete?.length === 1 ? 'this lesson' : `these ${lessonToDelete?.length} lessons`}?
                            This action cannot be undone.
                        </p>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setLessonToDelete(null)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default LessonClient
