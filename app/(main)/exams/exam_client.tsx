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
import { FiFileText, FiLink, FiPlus, FiTrash2 } from 'react-icons/fi';

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
            toast.success("📝 Exam created!");
            setIsOpen(false);
            router.push(`/exams/${createdExam?.examId}`);
        } catch (error) {
            toast.error("Failed to create exam.");
            console.error("Exam creation error:", error);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="dark:bg-neutral-950 bg-white dark:text-neutral-100 text-neutral-900 h-full p-6 space-y-6 pt-16">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">📚 Exams : </h1>
                <Button onClick={() => setIsOpen(true)}>+ Create Exam</Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {exams.map((exam) => (
                    <Link
                        key={exam.examId}
                        className="rounded-xl dark:bg-neutral-900 bg-white border shadow-xl  hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors p-4 flex flex-col gap-2" href={`/exams/${exam.examId}`}>
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-semibold flex items-center gap-2">
                                {exam.emoji} {exam.title}
                            </h3>
                            <button
                                onClick={(e) => { e.preventDefault(); setDeleteExamId(exam.examId); }}
                                className="text-red-500 hover:text-red-600 text-sm"
                            >
                                🗑️ Delete
                            </button>
                        </div>
                    </Link>
                ))}
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-2xl dark:bg-neutral-900 bg-neutral-200 dark:text-neutral-100 text-neutral-900 border border-neutral-700">
                    <DialogHeader>
                        <DialogTitle className="text-xl">📝 Create Exam</DialogTitle>
                    </DialogHeader>
                    {isCreating ? (
                        <div className="flex flex-col items-center justify-center h-64 text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                            <p className="text-lg font-medium text-neutral-700 dark:text-neutral-300">{loadingMessage}</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <h2 className="text-sm font-semibold mb-2 flex items-center gap-2"><FiFileText /> From Your Documents</h2>
                                <div className="rounded border border-neutral-700 p-2 max-h-48 overflow-y-auto dark:bg-neutral-950 bg-neutral-200 space-y-1">
                                    {documents?.length === 0 && (
                                        <p className="text-xs dark:text-neutral-400 text-neutral-600">No uploaded documents yet.</p>
                                    )}
                                    {documents?.map((doc) => (
                                        <label
                                            key={doc.id}
                                            className="flex items-center gap-2 cursor-pointer hover:bg-neutral-300 dark:hover:bg-neutral-700 p-2 rounded transition"
                                        >
                                            <Checkbox
                                                checked={selectedDocs.includes(doc.id)}
                                                onCheckedChange={(checked) => handleCheckboxChange(doc.id, Boolean(checked))}
                                            />
                                            <span className="font-medium">📄 {doc.originalName}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="relative flex py-2 items-center">
                                <div className="flex-grow border-t border-gray-400 dark:border-neutral-700"></div>
                                <span className="flex-shrink mx-4 text-gray-500 dark:text-neutral-500 text-sm">OR</span>
                                <div className="flex-grow border-t border-gray-400 dark:border-neutral-700"></div>
                            </div>

                            <div>
                                <h2 className="text-sm font-semibold mb-2 flex items-center gap-2"><FiLink /> From Web URLs</h2>
                                <div className="space-y-2">
                                    {urls.map((url, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <Input
                                                type="url"
                                                placeholder="https://example.com/article"
                                                value={url}
                                                onChange={(e) => handleUrlChange(index, e.target.value)}
                                            />
                                            <Button variant="ghost" size="icon" onClick={() => removeUrlInput(index)} disabled={urls.length === 1}>
                                                <FiTrash2 className="text-red-500" />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button onClick={addUrlInput} variant="outline" className="w-full">
                                        <FiPlus className="mr-2" /> Add Another URL
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="justify-end mt-4">
                        <Button variant="ghost" onClick={() => setIsOpen(false)} disabled={isCreating}>Cancel</Button>
                        <Button
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={handleCreateExam}
                            disabled={isCreating || (selectedDocs.length === 0 && urls.every(u => u.trim() === ''))}
                        >
                            {isCreating ? 'Creating Exam...' : 'Create Exam 📝'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={!!deleteExamId} onOpenChange={() => setDeleteExamId(null)}>
                <DialogContent className="max-w-sm dark:bg-neutral-900 bg-neutral-200 dark:text-neutral-100 text-neutral-900 border border-neutral-700">
                    <DialogHeader>
                        <DialogTitle>⚠️ Confirm Deletion</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm dark:text-neutral-300 text-neutral-600">Are you sure you want to delete this exam? This cannot be undone.</p>
                    <DialogFooter className="mt-4 flex gap-2">
                        <Button className="bg-red-600 hover:bg-red-700" onClick={handleDeleteExam}>Yes, delete</Button>
                        <Button variant="ghost" onClick={() => setDeleteExamId(null)}>Cancel</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ExamsClient;