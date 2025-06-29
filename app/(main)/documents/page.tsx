"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const fileEmojis = ["📄", "📑", "📂", "🗂️", "📋", "📝"];

type Doc = {
    id: string;
    name: string;
    size: number;
    emoji: string;
};

const DocsPage: React.FC = () => {
    const [docs, setDocs] = useState<Doc[]>([
        { id: "doc1", name: "Math Notes.pdf", size: 523_000, emoji: "📄" },
        { id: "doc2", name: "History.docx", size: 742_000, emoji: "📑" },
    ]);

    const [pendingFiles, setPendingFiles] = useState<File[]>([]);
    const [dragOver, setDragOver] = useState(false);
    const [error, setError] = useState("");
    const [deleteDocId, setDeleteDocId] = useState<string | null>(null);

    const MAX_TOTAL_SIZE = 20 * 1024 * 1024; // 20 MB

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
        const newDocs = pendingFiles.map((file) => ({
            id: `doc-${Date.now()}-${file.name}`,
            name: file.name,
            size: file.size,
            emoji: fileEmojis[Math.floor(Math.random() * fileEmojis.length)],
        }));
        setDocs((prev) => [...prev, ...newDocs]);
        toast.success("✅ Files uploaded!");
        setPendingFiles([]);
        setError("");
    };

    const confirmDeleteDoc = (id: string) => {
        setDeleteDocId(id);
    };

    const handleDeleteDoc = () => {
        if (!deleteDocId) return;
        setDocs((prev) => prev.filter((doc) => doc.id !== deleteDocId));
        toast.success("🗑️ Document deleted!");
        setDeleteDocId(null);
    };

    return (
        <div className="bg-neutral-950 text-neutral-100 min-h-screen p-6 space-y-6">
            <h1 className="text-3xl font-bold">📂 Your Documents</h1>

            <div
                className={cn(
                    "border border-dashed border-neutral-600 rounded-xl p-6 text-center transition-colors",
                    dragOver ? "bg-neutral-800" : "bg-neutral-900"
                )}
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
            >
                <p className="font-medium mb-1">Upload Documents 📤</p>
                <p className="text-xs text-neutral-400 mb-3">
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
                    <div className="mt-4 text-left">
                        <p className="text-sm font-medium mb-1">Pending uploads:</p>
                        <ul className="list-disc pl-5 text-sm">
                            {pendingFiles.map((file, idx) => (
                                <li key={idx}>
                                    {file.name} ({(file.size / 1024).toFixed(1)} KB)
                                </li>
                            ))}
                        </ul>
                        <Button className="mt-2 bg-primary" size="sm" onClick={handleUpload}>
                            Upload Files
                        </Button>
                    </div>
                )}

                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {docs.map((doc) => (
                    <div
                        key={doc.id}
                        className="relative rounded-xl bg-neutral-900 border border-neutral-700 p-4 flex flex-col gap-2 hover:bg-neutral-850 transition"
                    >
                        <button
                            onClick={() => confirmDeleteDoc(doc.id)}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-600 text-sm"
                            title="Delete"
                        >
                            🗑️
                        </button>
                        <Link href={`/docs/${doc.id}`} className="block">
                            <div className="flex items-center gap-2 text-lg font-semibold mb-1">
                                <span>{doc.emoji}</span>
                                <span className="truncate">{doc.name}</span>
                            </div>
                        </Link>
                        <p className="text-xs text-neutral-400">
                            {(doc.size / 1024).toFixed(1)} KB
                        </p>
                    </div>
                ))}
            </div>

            <Dialog open={!!deleteDocId} onOpenChange={() => setDeleteDocId(null)}>
                <DialogContent className="max-w-sm bg-neutral-900 text-neutral-100 border border-neutral-700">
                    <DialogHeader>
                        <DialogTitle>⚠️ Confirm Deletion</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-neutral-300">
                        Are you sure you want to delete this document? This cannot be undone.
                    </p>
                    <DialogFooter className="mt-4 flex gap-2">
                        <Button
                            className="bg-red-600 hover:bg-red-700"
                            onClick={handleDeleteDoc}
                        >
                            Yes, delete
                        </Button>
                        <Button variant="ghost" onClick={() => setDeleteDocId(null)}>
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default DocsPage;
