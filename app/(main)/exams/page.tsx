"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Document = {
    id: string;
    name: string;
    size: number;
};

type Exam = {
    id: string;
    name: string;
    files: string[];
    emoji: string;
};

const ExamsPage: React.FC = () => {
    const studyEmojis = [
        "📚", "📝", "🧮", "🔬", "🧪", "📖", "🧠", "📊", "📓", "🖊️"
    ];

    const router = useRouter();

    const [uploadedDocs, setUploadedDocs] = useState<Document[]>([
        { id: "doc1", name: "Math Revision.pdf", size: 523_000 },
        { id: "doc2", name: "History Notes.docx", size: 742_000 },
        { id: "doc3", name: "Physics Quiz.pdf", size: 312_000 },
    ]);

    const [exams, setExams] = useState<Exam[]>([
        {
            id: "exam1",
            name: "Math Practice",
            files: ["Math Revision.pdf"],
            emoji: "🧮"
        },
        {
            id: "exam2",
            name: "Physics Midterm",
            files: ["Physics Notes.pdf"],
            emoji: "🔬"
        },
    ]);


    const [isOpen, setIsOpen] = useState(false);
    const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
    const [pendingFiles, setPendingFiles] = useState<File[]>([]);
    const [dragOver, setDragOver] = useState(false);
    const [error, setError] = useState("");
    const [deleteExamId, setDeleteExamId] = useState<string | null>(null);


    const MAX_TOTAL_SIZE = 20 * 1024 * 1024; // 20 MB


    const handleDeleteExam = () => {
        if (!deleteExamId) return;
        setExams((prev) => prev.filter((exam) => exam.id !== deleteExamId));
        toast.success("🗑️ Exam deleted!");
        setDeleteExamId(null);
    };



    const handleCheckboxChange = (id: string, checked: boolean) => {
        setSelectedDocs((prev) =>
            checked ? [...prev, id] : prev.filter((docId) => docId !== id)
        );
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(false);

        const files = Array.from(e.dataTransfer.files);
        if (!files.length) return;

        const totalSize =
            files.reduce((acc, f) => acc + f.size, 0) +
            pendingFiles.reduce((acc, f) => acc + f.size, 0);

        if (totalSize > MAX_TOTAL_SIZE) {
            setError("Total file size cannot exceed 20 MB.");
            return;
        }

        setPendingFiles((prev) => [...prev, ...files]);
        setError("");
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        if (!files.length) return;

        const totalSize =
            files.reduce((acc, f) => acc + f.size, 0) +
            pendingFiles.reduce((acc, f) => acc + f.size, 0);

        if (totalSize > MAX_TOTAL_SIZE) {
            setError("Total file size cannot exceed 20 MB.");
            return;
        }

        setPendingFiles((prev) => [...prev, ...files]);
        setError("");
    };

    const handleUpload = () => {
        if (pendingFiles.length === 0) return;

        const newUploaded = pendingFiles.map((file) => ({
            id: `doc-${Date.now()}-${file.name}`,
            name: file.name,
            size: file.size,
        }));

        setUploadedDocs((prev) => [...prev, ...newUploaded]);
        toast.success("✅ Files uploaded successfully!");
        setPendingFiles([]);
        setSelectedDocs([]);
        setError("");
    };

    const handleCreateExam = () => {
        const selectedFileNames = uploadedDocs
            .filter((doc) => selectedDocs.includes(doc.id))
            .map((doc) => doc.name);

        if (selectedFileNames.length > 0) {
            const newExam: Exam = {
                id: `exam-${Date.now()}`,
                name: `Exam ${exams.length + 1}`,
                files: selectedFileNames,
                emoji: studyEmojis[Math.floor(Math.random() * studyEmojis.length)],
            };
            setExams((prev) => [...prev, newExam]);
            toast.success("📝 Exam created!");
            setIsOpen(false);
            router.push(`/exams/${newExam.id}`);
        }
    };

    return (
        <div className="bg-neutral-950 text-neutral-100 h-full p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">📚 Exams</h1>
                <Button onClick={() => setIsOpen(true)}>+ Create Exam</Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {exams.map((exam) => (
                    <Link
                        key={exam.id}
                        className="rounded-xl bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 transition-colors p-4 flex flex-col gap-2" href={`/exams/${exam.id}`}                    >
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-semibold flex items-center gap-2">
                                {exam.emoji} {exam.name}
                            </h3>
                            <button
                                onClick={() => setDeleteExamId(exam.id)}
                                className="text-red-500 hover:text-red-600 text-sm"
                            >
                                🗑️ Delete
                            </button>
                        </div>
                        <p className="text-sm text-neutral-400">{exam.files.length} file(s) used</p>
                        <div className="flex gap-2 flex-wrap">
                            {exam.files.map((file, i) => (
                                <span
                                    key={i}
                                    className="bg-neutral-700 text-xs rounded px-2 py-0.5"
                                >
                                    📄 {file}
                                </span>
                            ))}
                        </div>

                    </Link>
                ))}
            </div>


            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-2xl bg-neutral-900 text-neutral-100 border border-neutral-700">
                    <DialogHeader>
                        <DialogTitle className="text-xl">📝 Create Exam</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">

                        <div>
                            <h2 className="text-sm font-semibold mb-1">Your Documents</h2>
                            <div className="rounded border border-neutral-700 p-2 max-h-48 overflow-y-auto bg-neutral-950 space-y-1">
                                {uploadedDocs.length === 0 && (
                                    <p className="text-xs text-neutral-400">No uploaded documents yet.</p>
                                )}
                                {uploadedDocs.map((doc) => (
                                    <label
                                        key={doc.id}
                                        className="flex items-center gap-2 cursor-pointer hover:bg-neutral-800 p-2 rounded transition"
                                    >
                                        <Checkbox
                                            checked={selectedDocs.includes(doc.id)}
                                            onCheckedChange={(checked) =>
                                                handleCheckboxChange(doc.id, Boolean(checked))
                                            }
                                        />
                                        <div className="flex-1">
                                            <span className="font-medium">📄 {doc.name}</span>
                                            <span className="text-xs text-neutral-400 ml-2">
                                                ({(doc.size / 1024).toFixed(1)} KB)
                                            </span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* drag/drop */}
                        <div
                            className={cn(
                                "border border-dashed border-neutral-600 rounded p-4 text-center",
                                dragOver ? "bg-neutral-800" : "bg-neutral-950"
                            )}
                            onDragOver={(e) => {
                                e.preventDefault();
                                setDragOver(true);
                            }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={handleDrop}
                        >
                            <p className="font-medium mb-1">Upload Documents 📤</p>
                            <p className="text-xs text-neutral-400 mb-2">
                                Drag & drop or browse (max 20MB)
                            </p>
                            <input
                                type="file"
                                multiple
                                onChange={handleFileSelect}
                                className="hidden"
                                id="fileInput"
                            />
                            <label
                                htmlFor="fileInput"
                                className="cursor-pointer text-primary underline"
                            >
                                Browse files
                            </label>

                            {pendingFiles.length > 0 && (
                                <div className="mt-3 text-left">
                                    <p className="text-xs font-medium">Pending uploads:</p>
                                    <ul className="list-disc pl-4 text-xs">
                                        {pendingFiles.map((file, idx) => (
                                            <li key={idx}>
                                                📄 {file.name} ({(file.size / 1024).toFixed(1)} KB)
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {error && (
                                <p className="text-red-500 text-xs mt-2">{error}</p>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="justify-between mt-4">
                        {pendingFiles.length > 0 ? (
                            <Button className="bg-primary" onClick={handleUpload}>
                                Upload Files 📤
                            </Button>
                        ) : (
                            <Button
                                className="bg-blue-600 hover:bg-blue-700"
                                onClick={handleCreateExam}
                                disabled={selectedDocs.length === 0}
                            >
                                Create Exam 📝
                            </Button>
                        )}
                        <Button variant="ghost" onClick={() => setIsOpen(false)}>
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={!!deleteExamId} onOpenChange={() => setDeleteExamId(null)}>
                <DialogContent className="max-w-sm bg-neutral-900 text-neutral-100 border border-neutral-700">
                    <DialogHeader>
                        <DialogTitle>⚠️ Confirm Deletion</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-neutral-300">
                        Are you sure you want to delete this exam? This cannot be undone.
                    </p>
                    <DialogFooter className="mt-4 flex gap-2">
                        <Button
                            className="bg-red-600 hover:bg-red-700"
                            onClick={handleDeleteExam}
                        >
                            Yes, delete
                        </Button>
                        <Button variant="ghost" onClick={() => setDeleteExamId(null)}>
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
};

export default ExamsPage;
