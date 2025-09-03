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
import { FiFileText, FiFile, FiUpload, FiTrash2, FiDownload, FiEye, FiFolder, FiPlus, FiTrendingUp, FiClock, FiHardDrive, FiCheckCircle } from 'react-icons/fi';

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
    const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
    const [isSelectionMode, setIsSelectionMode] = useState(false);

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

    // Multi-selection functions
    const toggleDocSelection = (docId: string) => {
        setSelectedDocs(prev =>
            prev.includes(docId)
                ? prev.filter(id => id !== docId)
                : [...prev, docId]
        );
    };

    const selectAllDocs = () => {
        setSelectedDocs(docsWithEmoji.map(doc => doc.id));
    };

    const clearSelection = () => {
        setSelectedDocs([]);
    };

    const toggleSelectionMode = () => {
        setIsSelectionMode(!isSelectionMode);
        if (isSelectionMode) {
            setSelectedDocs([]);
        }
    };

    const handleBulkDelete = async () => {
        if (selectedDocs.length === 0) return;

        try {
            // Delete all selected documents
            for (const docId of selectedDocs) {
                await deleteFileFromDb(docId);
            }

            // Remove from UI
            setDocsWithEmoji((prev) => prev.filter((doc) => !selectedDocs.includes(doc.id)));
            toast.success(`🗑️ Deleted ${selectedDocs.length} document${selectedDocs.length > 1 ? 's' : ''}!`);

            // Clear selection
            setSelectedDocs([]);
            setIsSelectionMode(false);

        } catch (err) {
            console.error("Bulk delete error:", err);
            toast.error("❌ Failed to delete some documents");
        } finally {
            setDeleteDocId(null); // Close the dialog
            router.refresh();
        }
    };

    // Keyboard shortcuts for selection
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isSelectionMode) return;

            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'a') {
                    e.preventDefault();
                    selectAllDocs();
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
    }, [isSelectionMode, selectAllDocs, clearSelection]);


    // Helper function to get file type icon
    const getFileTypeIcon = (fileName: string) => {
        const extension = fileName.split('.').pop()?.toLowerCase();
        switch (extension) {
            case 'pdf':
                return <FiFileText className="w-6 h-6 text-white" />;
            case 'doc':
            case 'docx':
                return <FiFileText className="w-6 h-6 text-white" />;
            case 'txt':
                return <FiFileText className="w-6 h-6 text-white" />;
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return <FiFile className="w-6 h-6 text-purple-500" />;
            default:
                return <FiFile className="w-6 h-6 text-gray-500" />;
        }
    };

    const totalSize = docsWithEmoji.reduce((acc, doc) => acc + doc.size, 0);
    const totalFiles = docsWithEmoji.length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800 pt-16 px-4">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full px-4 py-2 border border-blue-500/20 mb-6">
                        <FiFolder className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">Document Library</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 dark:from-white dark:via-neutral-100 dark:to-white bg-clip-text text-transparent mb-4">
                        Your Documents
                    </h1>

                    <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mb-8">
                        Manage your learning materials with powerful document organization and AI-powered processing.
                    </p>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
                        <div className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-xl p-4 border border-neutral-200 dark:border-neutral-700">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                    <FiFileText className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-neutral-900 dark:text-white">{totalFiles}</div>
                                    <div className="text-sm text-neutral-600 dark:text-neutral-400">Total Files</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-xl p-4 border border-neutral-200 dark:border-neutral-700">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                    <FiHardDrive className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-neutral-900 dark:text-white">
                                        {(totalSize / (1024 * 1024)).toFixed(1)}MB
                                    </div>
                                    <div className="text-sm text-neutral-600 dark:text-neutral-400">Total Size</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-xl p-4 border border-neutral-200 dark:border-neutral-700">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                    <FiTrendingUp className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-neutral-900 dark:text-white">AI</div>
                                    <div className="text-sm text-neutral-600 dark:text-neutral-400">Ready Files</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Upload Section */}
                <div className="mb-12">
                    <div
                        className={cn(
                            "relative bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-300",
                            dragOver
                                ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 shadow-lg shadow-blue-500/20"
                                : "border-neutral-300 dark:border-neutral-600 hover:border-blue-400 hover:bg-neutral-50/50 dark:hover:bg-neutral-700/50"
                        )}
                        onDragOver={(e) => {
                            e.preventDefault();
                            setDragOver(true);
                        }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                    >
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-4">
                                <FiUpload className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                                Upload Documents
                            </h3>
                            <p className="text-neutral-600 dark:text-neutral-400 mb-4 max-w-md">
                                Drag & drop your files here or browse to upload. Supports PDF, DOCX, TXT, and images (max 20MB total).
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
                                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 cursor-pointer inline-flex items-center gap-2"
                            >
                                <FiPlus className="w-5 h-5" />
                                Browse Files
                            </label>
                        </div>

                        {/* Pending Files */}
                        {pendingFiles.length > 0 && (
                            <div className="mt-6 p-4 bg-neutral-50 dark:bg-neutral-700/50 rounded-xl">
                                <div className="flex items-center gap-2 mb-3">
                                    <FiClock className="w-4 h-4 text-blue-500" />
                                    <span className="font-medium text-neutral-900 dark:text-white">Ready to Upload</span>
                                </div>
                                <div className="space-y-2 max-h-32 overflow-y-auto">
                                    {pendingFiles.map((file, idx) => (
                                        <div key={idx} className="flex items-center justify-between bg-white dark:bg-neutral-800 p-3 rounded-lg border border-neutral-200 dark:border-neutral-600">
                                            <div className="flex items-center gap-3">
                                                {getFileTypeIcon(file.name)}
                                                <div>
                                                    <div className="font-medium text-neutral-900 dark:text-white text-sm">{file.name}</div>
                                                    <div className="text-xs text-neutral-600 dark:text-neutral-400">
                                                        {(file.size / (1024 * 1024)).toFixed(1)} MB
                                                    </div>
                                                </div>
                                            </div>
                                            <FiCheckCircle className="w-5 h-5 text-green-500" />
                                        </div>
                                    ))}
                                </div>
                                <Button
                                    className="w-full mt-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                                    onClick={handleUpload}
                                >
                                    <FiUpload className="w-4 h-4 mr-2" />
                                    Upload {pendingFiles.length} File{pendingFiles.length > 1 ? 's' : ''}
                                </Button>
                            </div>
                        )}

                        {error && (
                            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Documents Grid */}
                {docsWithEmoji.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-24 h-24 bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <FiFolder className="w-12 h-12 text-neutral-400 dark:text-neutral-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">No documents yet</h3>
                        <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-md mx-auto">
                            Upload your first document to start creating lessons and exams from your content.
                        </p>
                        <Button asChild className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-xl">
                            <label htmlFor="fileInput" className="flex items-center gap-2 cursor-pointer">
                                <FiPlus className="w-5 h-5" />
                                Upload Your First Document
                            </label>
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {docsWithEmoji.map((doc, index) => (
                            <div
                                key={doc.id}
                                className={`group relative bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 ${
                                    selectedDocs.includes(doc.id)
                                        ? 'border-blue-500 shadow-blue-500/20 bg-blue-50/50 dark:bg-blue-900/20'
                                        : 'border-transparent hover:border-blue-500/30'
                                }`}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Selection Checkbox */}
                                {isSelectionMode && (
                                    <button
                                        onClick={() => toggleDocSelection(doc.id)}
                                        className="absolute top-4 right-4 w-8 h-8 rounded-lg border-2 border-neutral-300 dark:border-neutral-600 flex items-center justify-center hover:border-blue-500 transition-colors bg-white/90 dark:bg-neutral-800/90 shadow-sm"
                                    >
                                        {selectedDocs.includes(doc.id) ? (
                                            <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center">
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
                                        onClick={() => confirmDeleteDoc(doc.id)}
                                        className="absolute top-4 right-4 w-8 h-8 rounded-lg border border-red-200 dark:border-red-800 flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <FiTrash2 className="w-4 h-4 text-red-500" />
                                    </button>
                                )}

                                {/* Document Content */}
                                <Link href={`${doc.publicUrl}`} target="_blank" className="block">
                                    <div className="mb-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                            {getFileTypeIcon(doc.originalName)}
                                        </div>
                                        <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {doc.emoji} {doc.originalName}
                                        </h3>
                                    </div>

                                    {/* Document Stats */}
                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                                            <FiHardDrive className="w-4 h-4 text-green-500" />
                                            <span>{(doc.size / (1024 * 1024)).toFixed(1)} MB</span>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                                            <FiFileText className="w-4 h-4 text-blue-500" />
                                            <span>{doc.type.split('/')[1]?.toUpperCase() || 'FILE'}</span>
                                        </div>
                                    </div>
                                </Link>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <Button asChild className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg">
                                        <Link href={`${doc.publicUrl}`} target="_blank" className="flex items-center justify-center gap-2">
                                            <FiEye className="w-4 h-4" />
                                            <span>View</span>
                                        </Link>
                                    </Button>

                                    <Button asChild variant="outline" className="border-neutral-300 dark:border-neutral-600 hover:border-blue-500">
                                        <a href={`${doc.publicUrl}`} download className="flex items-center justify-center gap-2">
                                            <FiDownload className="w-4 h-4" />
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Action Buttons - Only show when there are documents */}
                {docsWithEmoji.length > 0 && (
                    <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button asChild className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <label htmlFor="fileInput" className="flex items-center gap-2 cursor-pointer">
                                <FiPlus className="w-5 h-5" />
                                Upload More Documents
                            </label>
                        </Button>

                        <Button asChild variant="outline" className="border-2 border-neutral-300 dark:border-neutral-600 hover:border-blue-500 px-6 py-3 rounded-xl">
                            <Link href="/uploadingfile" className="flex items-center gap-2">
                                <FiFileText className="w-5 h-5" />
                                Create Content
                            </Link>
                        </Button>

                        <Button
                            onClick={toggleSelectionMode}
                            variant="outline"
                            className={`px-6 py-3 rounded-xl border-2 transition-all duration-300 ${
                                isSelectionMode
                                    ? 'border-red-500 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
                                    : 'border-neutral-300 dark:border-neutral-600 hover:border-blue-500'
                            }`}
                        >
                            {isSelectionMode ? 'Exit Selection' : 'Select Multiple'}
                        </Button>
                    </div>
                )}

                {/* Selection Controls */}
                {isSelectionMode && (
                    <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border-2 border-blue-200 dark:border-blue-800 shadow-lg">
                        <div className="text-center mb-4">
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">Selection Mode Active</h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">Select documents to perform bulk operations</p>
                        </div>

                        <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <Button
                                    onClick={selectAllDocs}
                                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                                    title="Select all documents (Ctrl+A)"
                                >
                                    <FiFileText className="w-4 h-4 mr-2" />
                                    Select All ({docsWithEmoji.length})
                                </Button>
                                <Button
                                    onClick={clearSelection}
                                    variant="outline"
                                    className="border-neutral-300 dark:border-neutral-600"
                                    disabled={selectedDocs.length === 0}
                                >
                                    Clear Selection ({selectedDocs.length})
                                </Button>
                            </div>

                            {selectedDocs.length > 0 && (
                                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-white/50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                            <span className="text-white font-bold text-sm">{selectedDocs.length}</span>
                                        </div>
                                        <span className="text-sm font-medium text-neutral-900 dark:text-white">
                                            document{selectedDocs.length > 1 ? 's' : ''} selected
                                        </span>
                                    </div>
                                    <Button
                                        onClick={() => setDeleteDocId('bulk')} // Trigger bulk delete confirmation
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
                                <div className=' h-20'></div>

            </div>

            <Dialog open={!!deleteDocId} onOpenChange={() => setDeleteDocId(null)}>
                <DialogContent className="max-w-md bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm border border-neutral-200 dark:border-neutral-700 shadow-2xl">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                                <FiTrash2 className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold text-neutral-900 dark:text-white">Delete Document</DialogTitle>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">This action cannot be undone</p>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="py-4">
                        <p className="text-neutral-700 dark:text-neutral-300">
                            Are you sure you want to delete this document? All associated lessons and exams will remain intact, but you won't be able to create new content from this file.
                        </p>
                    </div>

                    <DialogFooter className="gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDocId(null)}
                            className="border-neutral-300 dark:border-neutral-600"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteDoc}
                            className="bg-red-500 hover:bg-red-600 text-white"
                        >
                            <FiTrash2 className="w-4 h-4 mr-2" />
                            Delete Document
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Bulk Delete Confirmation Dialog */}
            <Dialog open={deleteDocId === 'bulk'} onOpenChange={() => setDeleteDocId(null)}>
                <DialogContent className="max-w-md bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm border border-neutral-200 dark:border-neutral-700 shadow-2xl">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                                <FiTrash2 className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold text-neutral-900 dark:text-white">Delete Documents</DialogTitle>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">Delete {selectedDocs.length} document{selectedDocs.length > 1 ? 's' : ''}</p>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="py-4">
                        <p className="text-neutral-700 dark:text-neutral-300">
                            Are you sure you want to delete {selectedDocs.length} document{selectedDocs.length > 1 ? 's' : ''}?
                            All associated lessons and exams will remain intact, but you won't be able to create new content from these files.
                        </p>
                    </div>

                    <DialogFooter className="gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDocId(null)}
                            className="border-neutral-300 dark:border-neutral-600"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleBulkDelete}
                            className="bg-red-500 hover:bg-red-600 text-white"
                        >
                            <FiTrash2 className="w-4 h-4 mr-2" />
                            Delete {selectedDocs.length} Document{selectedDocs.length > 1 ? 's' : ''}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
};

export default DocClient;
