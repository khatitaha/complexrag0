'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { examCreationLogic } from "./actions";
import { FiFileText, FiLink, FiPlus, FiTrash2, FiClipboard, FiTrendingUp, FiClock, FiStar, FiTarget, FiBookOpen, FiZap } from 'react-icons/fi';

type Doc = {
    id: string;
    originalName: string;
    size: number;
    emoji: string | null;
    publicUrl: string;
    type: string;
    path: string;
    newFileName: string;
    user_id: string;
};

type Exam = {
    examId: string;
    title: string;
    emoji: string;
    created_at: Date;
};

type Props = {
    examss: Exam[] | null,
    documents: Doc[] | null
}

const ExamsClient = (props: Props) => {
    const { documents, examss } = props;
    const router = useRouter();

    const [exams, setExams] = useState<Exam[]>(examss ?? []);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
    const [urls, setUrls] = useState<string[]>(['']);
    const [isCreating, setIsCreating] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("");
    const [deleteExamId, setDeleteExamId] = useState<string | null>(null);
    const [selectedExams, setSelectedExams] = useState<string[]>([]);
    const [isSelectionMode, setIsSelectionMode] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isCreating) {
            setLoadingMessage(loadingMessages[0]); // Set initial message
            interval = setInterval(() => {
                setLoadingMessage(prevMessage => {
                    const currentIndex = loadingMessages.indexOf(prevMessage);
                    const nextIndex = (currentIndex + 1) % loadingMessages.length;
                    return loadingMessages[nextIndex];
                });
            }, 3000); // Change message every 3 seconds
        } else {
            setLoadingMessage(""); // Clear message when not creating
        }
        return () => clearInterval(interval);
    }, [isCreating]);

    const loadingMessages = [
        "Brewing a fresh batch of questions...",
        "Consulting the academic spirits...",
        "Polishing the answer keys...",
        "Ensuring maximum brain-teasing potential...",
        "Just adding a sprinkle of challenge...",
        "Almost there, don't quiz out!",
        "If at first you don't succeed, call it version 1.0.",
        "My code doesn't have bugs, it has random features.",
        "Why do programmers prefer dark mode? Because light attracts bugs.",
        "Debugging: Removing the needles from the haystack, one by one.",
        "The only thing worse than a bug is a feature that works perfectly, but is completely useless.",
        "Compiling thoughts, please wait...",
        "Generating brilliance, one byte at a time...",
        "Thinking outside the box, but inside the server...",
        "Just a moment, the AI is having a coffee break...",
        "Calculating the optimal level of difficulty...",
        "Summoning the knowledge from the digital ether...",
        "Almost ready to test your wits!",
        "Don't worry, I'm not judging your past answers... yet.",
        "Preparing questions that will make you say 'Aha!' (or 'Ugh!').",
    ];

    const handleDeleteExam = () => {
        if (!deleteExamId) return;
        setExams((prev) => prev.filter((exam) => exam.examId !== deleteExamId));
        toast.success("🗑️ Exam deleted!");
        setDeleteExamId(null);
    };

    // Multi-selection functions
    const toggleExamSelection = (examId: string) => {
        setSelectedExams(prev =>
            prev.includes(examId)
                ? prev.filter(id => id !== examId)
                : [...prev, examId]
        );
    };

    const selectAllExams = () => {
        setSelectedExams(exams.map(exam => exam.examId));
    };

    const clearSelection = () => {
        setSelectedExams([]);
    };

    const toggleSelectionMode = () => {
        setIsSelectionMode(!isSelectionMode);
        if (isSelectionMode) {
            setSelectedExams([]);
        }
    };

    const handleBulkDelete = async () => {
        if (selectedExams.length === 0) return;

        try {
            // Delete all selected exams
            for (const examId of selectedExams) {
                // Here you would call your delete API for each exam
                // For now, we'll just remove from local state
                setExams((prev) => prev.filter((exam) => exam.examId !== examId));
            }

            toast.success(`🗑️ Deleted ${selectedExams.length} exam${selectedExams.length > 1 ? 's' : ''}!`);

            // Clear selection
            setSelectedExams([]);
            setIsSelectionMode(false);

        } catch (err) {
            console.error("Bulk delete error:", err);
            toast.error("❌ Failed to delete some exams");
        }
    };

    const handleCheckboxChange = (id: string, checked: boolean) => {
        setSelectedDocs((prev) =>
            checked ? [...prev, id] : prev.filter((docId) => docId !== id)
        );
    };

    const handleUrlChange = (index: number, value: string) => {
        const newUrls = [...urls];
        newUrls[index] = value;
        setUrls(newUrls);
    };

    const addUrlInput = () => {
        setUrls([...urls, '']);
    };

    const removeUrlInput = (index: number) => {
        const newUrls = urls.filter((_, i) => i !== index);
        setUrls(newUrls);
    };

    const handleCreateExam = async () => {
        if (documents == null) return;

        const selectedFilesPaths = documents?.filter((doc) => selectedDocs.includes(doc.id))
            .map((doc) => doc.publicUrl);
        
        const validUrls = urls.filter(url => url.trim() !== '');

        if (selectedFilesPaths.length === 0 && validUrls.length === 0) {
            toast.error("Please select at least one document or provide a URL.");
            return;
        }

        setIsCreating(true);
        try {
            const createdExam = await examCreationLogic(selectedFilesPaths, validUrls);

            // Validate that exam was created successfully
            if (!createdExam || !createdExam.examId) {
                throw new Error("Exam creation failed - no exam ID returned");
            }

            toast.success("📝 Exam created successfully!");
            setIsOpen(false);

            // Only navigate if we have a valid exam ID
            router.push(`/exams/${createdExam.examId}`);

        } catch (error) {
            console.error("Exam creation error:", error);
            toast.error(error instanceof Error ? error.message : "Failed to create exam. Please try again.");
            setIsOpen(false); // Close dialog on error
        } finally {
            setIsCreating(false); // Always reset loading state
        }
    };

    // Keyboard shortcuts for selection
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isSelectionMode) return;

            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'a') {
                    e.preventDefault();
                    selectAllExams();
                }
            }

            if (e.key === 'Escape') {
                clearSelection();
                setIsSelectionMode(false);
            }
        };

        if (isSelectionMode) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [isSelectionMode, selectAllExams, clearSelection]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800 pt-16 px-4">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full px-4 py-2 border border-purple-500/20 mb-6">
                        <FiTarget className="w-4 h-4 text-purple-500" />
                        <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">Test Your Knowledge</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 dark:from-white dark:via-neutral-100 dark:to-white bg-clip-text text-transparent mb-4">
                        Your Exams
                    </h1>

                    <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mb-8">
                        Challenge yourself with AI-generated exams tailored to your learning materials and track your progress.
                    </p>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
                        <div className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-xl p-4 border border-neutral-200 dark:border-neutral-700">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                    <FiClipboard className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-neutral-900 dark:text-white">{exams.length}</div>
                                    <div className="text-sm text-neutral-600 dark:text-neutral-400">Total Exams</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-xl p-4 border border-neutral-200 dark:border-neutral-700">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                    <FiTrendingUp className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-neutral-900 dark:text-white">
                                        {documents?.length || 0}
                                    </div>
                                    <div className="text-sm text-neutral-600 dark:text-neutral-400">Source Documents</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-xl p-4 border border-neutral-200 dark:border-neutral-700">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                    <FiStar className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-neutral-900 dark:text-white">AI</div>
                                    <div className="text-sm text-neutral-600 dark:text-neutral-400">Powered Tests</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button
                            onClick={() => setIsOpen(true)}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <div className="flex items-center gap-2">
                                <FiPlus className="w-5 h-5" />
                                Create New Exam
                            </div>
                        </Button>

                        <Button asChild variant="outline" className="border-2 border-neutral-300 dark:border-neutral-600 hover:border-purple-500 px-6 py-3 rounded-xl">
                            <Link href="/uploadingfile" className="flex items-center gap-2">
                                <FiFileText className="w-5 h-5" />
                                Upload Documents
                            </Link>
                        </Button>

                        {exams.length > 0 && (
                            <Button
                                onClick={toggleSelectionMode}
                                variant="outline"
                                className={`px-6 py-3 rounded-xl border-2 transition-all duration-300 ${
                                    isSelectionMode
                                        ? 'border-red-500 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
                                        : 'border-neutral-300 dark:border-neutral-600 hover:border-purple-500'
                                }`}
                            >
                                {isSelectionMode ? 'Exit Selection' : 'Select Multiple'}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Selection Controls */}
                {isSelectionMode && (
                    <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border-2 border-purple-200 dark:border-purple-800 shadow-lg">
                        <div className="text-center mb-4">
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">Selection Mode Active</h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">Select exams to perform bulk operations</p>
                        </div>

                        <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <Button
                                    onClick={selectAllExams}
                                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                                    title="Select all exams (Ctrl+A)"
                                >
                                    <FiTarget className="w-4 h-4 mr-2" />
                                    Select All ({exams.length})
                                </Button>
                                <Button
                                    onClick={clearSelection}
                                    variant="outline"
                                    className="border-neutral-300 dark:border-neutral-600"
                                    disabled={selectedExams.length === 0}
                                >
                                    Clear Selection ({selectedExams.length})
                                </Button>
                            </div>

                            {selectedExams.length > 0 && (
                                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-white/50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                                            <span className="text-white font-bold text-sm">{selectedExams.length}</span>
                                        </div>
                                        <span className="text-sm font-medium text-neutral-900 dark:text-white">
                                            exam{selectedExams.length > 1 ? 's' : ''} selected
                                        </span>
                                    </div>
                                    <Button
                                        onClick={() => setDeleteExamId('bulk')} // Trigger bulk delete confirmation
                                        variant="destructive"
                                        className="bg-red-500 hover:bg-red-600"
                                    >
                                        <FiTrash2 className="w-4 h-4 mr-2" />
                                        Delete Selected
                                    </Button>
                                </div>
                            )}

                            <div className="text-xs text-neutral-500 dark:text-neutral-400 text-center lg:text-left">
                                <div className="flex items-center gap-2 mb-1">
                                    <span>💡</span>
                                    <span>Tip: Press <kbd className="px-1 py-0.5 bg-neutral-200 dark:bg-neutral-700 rounded text-xs font-mono">Ctrl+A</kbd> to select all</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>⌨️</span>
                                    <span>Press <kbd className="px-1 py-0.5 bg-neutral-200 dark:bg-neutral-700 rounded text-xs font-mono">Esc</kbd> to exit selection mode</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Exams Grid */}
                {exams.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-24 h-24 bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <FiTarget className="w-12 h-12 text-neutral-400 dark:text-neutral-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">No exams yet</h3>
                        <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-md mx-auto">
                            Create your first AI-powered exam from your documents or web content to test your knowledge.
                        </p>
                        <Button
                            onClick={() => setIsOpen(true)}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl"
                        >
                            <div className="flex items-center gap-2">
                                <FiPlus className="w-5 h-5" />
                                Create Your First Exam
                            </div>
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {exams.map((exam, index) => (
                            <div
                                key={exam.examId}
                                className={`group relative bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 ${
                                    selectedExams.includes(exam.examId)
                                        ? 'border-purple-500 shadow-purple-500/20 bg-purple-50/50 dark:bg-purple-900/20'
                                        : 'border-transparent hover:border-purple-500/30'
                                }`}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Selection Checkbox */}
                                {isSelectionMode && (
                                    <button
                                        onClick={() => toggleExamSelection(exam.examId)}
                                        className="absolute top-4 right-4 w-8 h-8 rounded-lg border-2 border-neutral-300 dark:border-neutral-600 flex items-center justify-center hover:border-purple-500 transition-colors bg-white/90 dark:bg-neutral-800/90 shadow-sm"
                                    >
                                        {selectedExams.includes(exam.examId) ? (
                                            <div className="w-5 h-5 bg-purple-500 rounded flex items-center justify-center">
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        ) : (
                                            <div className="w-5 h-5 border-2 border-neutral-400 rounded"></div>
                                        )}
                                    </button>
                                )}

                                {/* Delete Button */}
                                {!isSelectionMode && (
                                    <button
                                        onClick={(e) => { e.preventDefault(); setDeleteExamId(exam.examId); }}
                                        className="absolute top-4 right-4 w-8 h-8 rounded-lg border border-red-200 dark:border-red-800 flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <FiTrash2 className="w-4 h-4 text-red-500" />
                                    </button>
                                )}

                                {/* Exam Content */}
                                <Link href={`/exams/${exam.examId}`} className="block">
                                    <div className="mb-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                            <FiTarget className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                            {exam.emoji} {exam.title}
                                        </h3>
                                    </div>

                                    {/* Exam Stats */}
                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                                            <FiClock className="w-4 h-4 text-blue-500" />
                                            <span>Created {new Date(exam.created_at).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}</span>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                                            <FiZap className="w-4 h-4 text-yellow-500" />
                                            <span>AI-Generated Questions</span>
                                        </div>
                                    </div>
                                </Link>

                                {/* Action Button */}
                                <Button asChild className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg">
                                    <Link href={`/exams/${exam.examId}`} className="flex items-center justify-center gap-2">
                                        <FiBookOpen className="w-4 h-4" />
                                        <span>Take Exam</span>
                                    </Link>
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
                                <div className=' h-20'></div>

            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-2xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm border border-neutral-200 dark:border-neutral-700 shadow-2xl">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                <FiTarget className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-bold text-neutral-900 dark:text-white">Create New Exam</DialogTitle>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">Generate AI-powered questions from your content</p>
                            </div>
                        </div>
                    </DialogHeader>

                    {isCreating ? (
                        <div className="flex flex-col items-center justify-center h-64 text-center py-8">
                            <div className="relative mb-6">
                                <div className="w-16 h-16 border-4 border-purple-200 dark:border-purple-800 rounded-full animate-spin"></div>
                                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"></div>
                            </div>
                            <p className="text-lg font-medium text-neutral-700 dark:text-neutral-300 mb-2">{loadingMessage}</p>
                            <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 max-w-xs mx-auto">
                                <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <FiFileText className="w-4 h-4 text-blue-500" />
                                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">From Your Documents</h2>
                                </div>
                                <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700 p-4 max-h-48 overflow-y-auto">
                                    {documents?.length === 0 ? (
                                        <div className="text-center py-8">
                                            <FiFileText className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                                            <p className="text-sm text-neutral-600 dark:text-neutral-400">No documents uploaded yet.</p>
                                            <Button asChild variant="outline" size="sm" className="mt-3">
                                                <Link href="/uploadingfile">Upload Documents</Link>
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {documents?.map((doc) => (
                                                <label
                                                    key={doc.id}
                                                    className="flex items-center gap-3 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700 p-3 rounded-lg transition-all duration-200"
                                                >
                                                    <Checkbox
                                                        checked={selectedDocs.includes(doc.id)}
                                                        onCheckedChange={(checked) => handleCheckboxChange(doc.id, Boolean(checked))}
                                                        className="border-neutral-300 dark:border-neutral-600"
                                                    />
                                                    <div className="flex items-center gap-2 flex-1">
                                                        <FiFileText className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                                        <span className="font-medium text-neutral-900 dark:text-white text-sm">{doc.originalName}</span>
                                                    </div>
                                                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                                        {(doc.size / 1024 / 1024).toFixed(1)}MB
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="relative flex py-4 items-center">
                                <div className="flex-grow border-t border-neutral-300 dark:border-neutral-600"></div>
                                <div className="bg-white dark:bg-neutral-900 px-3">
                                    <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">OR</span>
                                </div>
                                <div className="flex-grow border-t border-neutral-300 dark:border-neutral-600"></div>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <FiLink className="w-4 h-4 text-green-500" />
                                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">From Web URLs</h2>
                                </div>
                                <div className="space-y-3">
                                    {urls.map((url, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <Input
                                                type="url"
                                                placeholder="https://example.com/article"
                                                value={url}
                                                onChange={(e) => handleUrlChange(index, e.target.value)}
                                                className="flex-1 border-neutral-300 dark:border-neutral-600 focus:border-purple-500"
                                            />
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => removeUrlInput(index)}
                                                disabled={urls.length === 1}
                                                className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                                            >
                                                <FiTrash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button
                                        onClick={addUrlInput}
                                        variant="outline"
                                        className="w-full border-dashed border-neutral-300 dark:border-neutral-600 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                                    >
                                        <FiPlus className="mr-2 w-4 h-4" />
                                        Add Another URL
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="gap-3 pt-6">
                        <Button
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                            disabled={isCreating}
                            className="border-neutral-300 dark:border-neutral-600"
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6"
                            onClick={handleCreateExam}
                            disabled={isCreating || (selectedDocs.length === 0 && urls.every(u => u.trim() === ''))}
                        >
                            {isCreating ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Creating Exam...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <FiTarget className="w-4 h-4" />
                                    Create Exam
                                </div>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={!!deleteExamId} onOpenChange={() => setDeleteExamId(null)}>
                <DialogContent className="max-w-md bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm border border-neutral-200 dark:border-neutral-700 shadow-2xl">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                                <FiTrash2 className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold text-neutral-900 dark:text-white">
                                    {deleteExamId === 'bulk' ? 'Delete Exams' : 'Delete Exam'}
                                </DialogTitle>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">This action cannot be undone</p>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="py-4">
                        <p className="text-neutral-700 dark:text-neutral-300">
                            {deleteExamId === 'bulk'
                                ? `Are you sure you want to delete ${selectedExams.length} exam${selectedExams.length > 1 ? 's' : ''}? All associated questions and progress will be permanently removed.`
                                : 'Are you sure you want to delete this exam? All associated questions and progress will be permanently removed.'
                            }
                        </p>
                    </div>

                    <DialogFooter className="gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setDeleteExamId(null)}
                            className="border-neutral-300 dark:border-neutral-600"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={deleteExamId === 'bulk' ? handleBulkDelete : handleDeleteExam}
                            className="bg-red-500 hover:bg-red-600 text-white"
                        >
                            <FiTrash2 className="w-4 h-4 mr-2" />
                            {deleteExamId === 'bulk'
                                ? `Delete ${selectedExams.length} Exam${selectedExams.length > 1 ? 's' : ''}`
                                : 'Delete Exam'
                            }
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ExamsClient;