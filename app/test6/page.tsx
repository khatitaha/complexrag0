"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";

export default function TestRagAndChat() {
    // 🔹 States for upload
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState<string | null>(null);

    // 🔹 Chat state
    const {
        messages,
        input,
        handleInputChange,
        handleSubmit,
    } = useChat({
        api: "/api/chatWithRev", // ✅ your retrieval endpoint
        body: {
            userId: "test-user-123",
            conversationId: "conv-1",
        },
    });

    // ✅ Upload PDF to /api/rag
    const handleUpload = async () => {
        if (!selectedFile) {
            alert("Please select a file first");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("userId", "test-user-123");
        formData.append("conversationId", "conv-1");

        setUploading(true);
        setUploadResult(null);

        try {
            const res = await fetch("/api/rag", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Upload failed");

            const data = await res.json();
            setUploadResult(
                `✅ Uploaded & processed! ${data.splits} chunks added.`
            );
        } catch (err) {
            console.error("Upload error:", err);
            setUploadResult("❌ Upload failed");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col w-full max-w-lg py-10 mx-auto gap-6">
            <h1 className="text-2xl font-bold text-center">
                🧪 Test RAG + Chat Retrieval
            </h1>

            {/* 🔹 Upload PDF Section */}
            <div className="border p-4 rounded-md space-y-2 bg-gray-800">
                <h2 className="text-lg font-semibold">1️⃣ Upload PDF</h2>
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) =>
                        setSelectedFile(e.target.files ? e.target.files[0] : null)
                    }
                />
                <button
                    className="px-4 py-2 bg-purple-600 text-white rounded"
                    onClick={handleUpload}
                    disabled={uploading}
                >
                    {uploading ? "⏳ Uploading..." : "Upload & Process"}
                </button>
                {uploadResult && <p>{uploadResult}</p>}
            </div>

            {/* 🔹 Chat Section */}
            <div className="border p-4 rounded-md space-y-2 bg-gray-800">
                <h2 className="text-lg font-semibold">2️⃣ Chat with PDF</h2>

                <div className="flex flex-col gap-2 min-h-[200px] p-2 bg-grey-900 rounded border">
                    {messages.map((m) => (
                        <div
                            key={m.id}
                            className={m.role === "user" ? "text-blue-700" : "text-green-700"}
                        >
                            <strong>{m.role === "user" ? "You" : "AI"}:</strong>{" "}
                            {m.content}
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        className="flex-1 border rounded px-3 py-2"
                        placeholder="Ask something about your PDF..."
                        value={input}
                        onChange={handleInputChange}
                    />
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                        type="submit"
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}
