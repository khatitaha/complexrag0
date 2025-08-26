"use client";

import React, { useEffect, useState } from "react";
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
import { deleteFileFromDb } from "./actions";
import { useRouter } from "next/navigation";

const fileEmojis = ["📄", "📑", "📂", "🗂️", "📋", "📝"];

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

type props = {
    initialDocs: Doc[]
}



const DocClient: React.FC<props> = (props: props) => {
    const router = useRouter();

    const { initialDocs } = props;
    // const [docs, setDocs] = useState<Doc[]>([
    //     { id: "doc1", name: "Math Notes.pdf", size: 523_000, emoji: "📄" },
    //     { id: "doc2", name: "History.docx", size: 742_000, emoji: "📑" },
    // ]);
    const [docs, setDocs] = useState<Doc[]>(initialDocs);
    const [docsWithEmoji, setDocsWithEmoji] = useState<Doc[]>([]);

    // ✅ Assign random emoji ONCE after hydration
    useEffect(() => {
        console.log("we got from the server", initialDocs);

        // Always fallback to [] so map doesn't crash
        setDocsWithEmoji(
            (initialDocs ?? []).map((doc) => ({
                ...doc,
                emoji:
                    doc.emoji ??
                    fileEmojis[Math.floor(Math.random() * fileEmojis.length)],
            }))
        );
    }, [initialDocs]);


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

    const handleUpload = async () => {
        if (pendingFiles.length === 0) return;

        try {
            const formData = new FormData();
            pendingFiles.forEach((file) => {
                formData.append("files", file);
            });

            // Call your Next.js API route
            const res = await fetch('/api/uploadedFile', {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const errorData = await res.json();
                toast.error(`❌ Upload failed: ${errorData.error || "Unknown error"}`);
                return;
            }

            const data = await res.json();

            // Map uploaded files into docs
            const newDocs = data.files.map((file: any) => ({
                id: file.fileName, // use unique filename from API
                name: file.originalName,
                size: file.size,
                emoji: fileEmojis[Math.floor(Math.random() * fileEmojis.length)],
            }));



            // Clear pending files
            setPendingFiles([]);
            setError("");
            router.refresh();

        } catch (err) {
            console.error("Upload error:", err);
            toast.error("❌ Upload failed due to network error");
        }
    };


    const confirmDeleteDoc = (id: string) => {
        console.log("Opening delete dialog for doc:", id);
        setDeleteDocId(id); // just open the dialog
    };

    const handleDeleteDoc = async () => {
        if (!deleteDocId) return;

        try {
            console.log("Deleting file from DB + storage:", deleteDocId);

            // Call your delete API
            await deleteFileFromDb(deleteDocId);

            // Remove it from UI
            setDocsWithEmoji((prev) => prev.filter((doc) => doc.id !== deleteDocId));
            toast.success("🗑️ Document deleted!");

        } catch (err) {
            console.error("Delete error:", err);
            toast.error("❌ Failed to delete document");
        } finally {
            setDeleteDocId(null); // close dialog
            router.refresh();

        }
    };


    return (
        <div className="dark:bg-neutral-950 dark:text-neutral-100 min-h-screen p-6 space-y-6 pt-16">
            <h1 className="text-3xl font-bold">📂 Your Documents</h1>

            <div
                className={cn(
                    "border border-dashed border-neutral-600 rounded-xl p-6 text-center transition-colors",
                    dragOver ? "dark:bg-neutral-800 bg-neutral-200" : "dark:bg-neutral-900 bg-neutral-100"
                )}
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
            >
                <p className="font-medium mb-1">Upload Documents 📤</p>
                <p className="text-xs dark:text-neutral-400 text-neutral-600 mb-3">
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
                                    {file.name} ({(file.size / (1024 * 1024)).toFixed(1)} MB)
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
                {docsWithEmoji.map((doc) => (
                    <div
                        key={doc.id}
                        className="relative rounded-xl dark:bg-neutral-900 bg-white shadow-xl border border-neutral-200 p-4 flex flex-col gap-2 hover:bg-neutral-850 transition"
                    >
                        <button
                            onClick={() => confirmDeleteDoc(doc.id)}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-600 text-sm"
                            title="Delete"
                        >
                            🗑️
                        </button>

                        <Link href={`${doc.publicUrl}`} className="block" target="_blank">
                            <div className="flex items-center gap-2 text-lg font-semibold mb-1">
                                <span>{doc.emoji}</span>
                                <span className="truncate">{doc.originalName}</span>
                            </div>
                        </Link>
                        <p className="text-xs dark:text-neutral-400 text-neutral-600">
                            {(doc.size / (1024 * 1024)).toFixed(1)} MB
                        </p>
                    </div>
                ))}
            </div>

            <Dialog open={!!deleteDocId} onOpenChange={() => setDeleteDocId(null)}>
                <DialogContent className="max-w-sm dark:bg-neutral-900 bg-neutral-200 dark:text-neutral-100 text-neutral-900 border border-neutral-700">
                    <DialogHeader>
                        <DialogTitle>⚠️ Confirm Deletion</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm dark:text-neutral-300 text-neutral-600">
                        Are you sure you want to delete this document? This cannot be undone.
                    </p>
                    <DialogFooter className="mt-4 flex gap-2">
                        <Button
                            className="bg-red-600 hover:bg-red-700"
                            onClick={handleDeleteDoc}  // ✅ now calls the correct handler
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

export default DocClient;
