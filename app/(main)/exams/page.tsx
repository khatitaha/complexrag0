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
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Document = {
    id: string;
    name: string;
    size: number;
};

const ExamsPage: React.FC = () => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [uploadedDocs, setUploadedDocs] = useState<Document[]>([
        { id: "doc1", name: "Math Revision.pdf", size: 523_000 },
        { id: "doc2", name: "History Notes.docx", size: 742_000 },
        { id: "doc3", name: "Physics Quiz.pdf", size: 312_000 },
    ]);
    const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
    const [pendingFiles, setPendingFiles] = useState<File[]>([]);
    const [dragOver, setDragOver] = useState(false);
    const [error, setError] = useState("");

    const MAX_TOTAL_SIZE = 20 * 1024 * 1024; // 20 MB

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
        setSelectedDocs([]); // clear selections on upload
        setError("");
    };

    const handleCreateExam = () => {
        const selectedFileNames = uploadedDocs
            .filter((doc) => selectedDocs.includes(doc.id))
            .map((doc) => doc.name);

        if (selectedFileNames.length > 0) {
            router.push(`/exams/new?files=${encodeURIComponent(selectedFileNames.join(","))}`);
            setIsOpen(false);
        }
    };

    // button behavior
    const actionButtonLabel =
        pendingFiles.length > 0 ? "Upload Files 📤" : "Create Exam 📝";
    const actionButtonVariant =
        pendingFiles.length > 0 ? "primary" : "secondary";

    return (
        <div className="bg-neutral-900 text-neutral-100 min-h-screen p-8">
            <h1 className="text-3xl font-bold mb-6">📚 Exams</h1>

            <Button onClick={() => setIsOpen(true)}>Create New Exam</Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-2xl bg-neutral-800 text-neutral-100 border border-neutral-700">
                    <DialogHeader>
                        <DialogTitle className="text-xl">📝 Exam Builder</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">

                        {/* Existing documents */}
                        <div>
                            <h2 className="font-semibold mb-2">Your Documents 📄</h2>
                            <div className="space-y-2 rounded border border-neutral-700 p-2 max-h-48 overflow-y-auto bg-neutral-900">
                                {uploadedDocs.length === 0 && (
                                    <p className="text-sm text-neutral-400">No uploaded documents yet.</p>
                                )}
                                {uploadedDocs.map((doc) => (
                                    <label
                                        key={doc.id}
                                        className="flex items-center gap-2 cursor-pointer hover:bg-neutral-700 p-2 rounded transition"
                                    >
                                        <Checkbox
                                            checked={selectedDocs.includes(doc.id)}
                                            onCheckedChange={(checked) =>
                                                handleCheckboxChange(doc.id, Boolean(checked))
                                            }
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium">📄 {doc.name}</p>
                                            <p className="text-xs text-neutral-400">
                                                {(doc.size / 1024).toFixed(1)} KB
                                            </p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Drag and drop uploader */}
                        <div
                            className={cn(
                                "border border-dashed border-neutral-600 rounded p-4 text-center transition-colors",
                                dragOver ? "bg-neutral-700" : "bg-neutral-900"
                            )}
                            onDragOver={(e) => {
                                e.preventDefault();
                                setDragOver(true);
                            }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={handleDrop}
                        >
                            <p className="font-semibold mb-1">Upload Documents 📤</p>
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
                                className="inline-block mt-2 cursor-pointer text-primary underline"
                            >
                                Browse files
                            </label>

                            {pendingFiles.length > 0 && (
                                <div className="mt-4 text-left">
                                    <p className="text-sm font-medium mb-1">Pending uploads:</p>
                                    <ul className="list-disc pl-4 text-sm">
                                        {pendingFiles.map((file, idx) => (
                                            <li key={idx}>
                                                📄 {file.name} ({(file.size / 1024).toFixed(1)} KB)
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {error && (
                            <p className="text-red-500 text-sm">{error}</p>
                        )}
                    </div>

                    <DialogFooter className="justify-between mt-4">
                        <div className="flex gap-2">
                            {pendingFiles.length > 0 ? (
                                <Button
                                    className="bg-primary"
                                    onClick={handleUpload}
                                >
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
                        </div>
                        <Button variant="ghost" onClick={() => setIsOpen(false)}>
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ExamsPage;
