"use client";

import { useState } from "react";
import LessonPage from "./WB2Client";
import { getCachedWb2Logic, getStoredMessages } from "../actions";

export default function LessonConfigurator({ id }: { id: string }) {
    const [language, setLanguage] = useState("English");
    const [customLanguage, setCustomLanguage] = useState("");
    const [quizCount, setQuizCount] = useState(5);
    const [flashCount, setFlashCount] = useState(5);
    const [note, setNote] = useState("");
    const [result, setResult] = useState<any>(null);
    const [initialChat, setInitialChat] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const handleStart = async () => {
        setLoading(true);
        const publicUrl = `https://clxsgightqnifyrrmhrd.supabase.co/storage/v1/object/public/docs/uploads/${id}`;

        const chosenLanguage =
            language === "Custom" ? customLanguage : language;

        const res = await getCachedWb2Logic(publicUrl, id,
            chosenLanguage,
            quizCount,
            flashCount,
            note,
        );
        console.log(`language : ${chosenLanguage} , quiz : ${quizCount}, flash : ${flashCount}, note : ${note} `)
        const chat = await getStoredMessages(id);

        setResult(res);
        setInitialChat(chat || []);
        setLoading(false);
    };

    if (loading) return <div className="flex items-center justify-center h-screen text-lg">Loading...</div>;

    if (result) {
        return <LessonPage result={result} initialChat={initialChat} />;
    }

    return (
        <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-neutral-900 px-4">
            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg dark:bg-neutral-800">
                <h1 className="text-2xl font-bold text-center mb-6">Configure Your Lesson</h1>

                <div className="space-y-5">
                    {/* Language Selector */}
                    <div className="flex flex-col">
                        <label className="mb-1 font-medium">Language</label>
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="border p-2 rounded"
                        >
                            <option>English</option>
                            <option>Arabic</option>
                            <option>French</option>
                            <option>German</option>
                            <option>Document’s Language</option>
                            <option>Custom</option>
                        </select>
                        {language === "Custom" && (
                            <input
                                type="text"
                                placeholder="Enter language..."
                                value={customLanguage}
                                onChange={(e) => setCustomLanguage(e.target.value)}
                                className="border p-2 rounded mt-2"
                            />
                        )}
                    </div>

                    {/* Quizzes */}
                    <div className="flex flex-col">
                        <label className="mb-1 font-medium">Quizzes ({quizCount})</label>
                        <input
                            type="range"
                            min="2"
                            max="20"
                            value={quizCount}
                            onChange={(e) => setQuizCount(Number(e.target.value))}
                            className="cursor-pointer"
                        />
                    </div>

                    {/* Flashcards */}
                    <div className="flex flex-col">
                        <label className="mb-1 font-medium">Flashcards ({flashCount})</label>
                        <input
                            type="range"
                            min="2"
                            max="20"
                            value={flashCount}
                            onChange={(e) => setFlashCount(Number(e.target.value))}
                            className="cursor-pointer"
                        />
                    </div>

                    {/* Note */}
                    <div className="flex flex-col">
                        <label className="mb-1 font-medium">Special Note</label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Write any special instructions..."
                            className="border p-2 rounded resize-none"
                            rows={3}
                        />
                    </div>
                </div>

                <button
                    onClick={handleStart}
                    className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition"
                >
                    Start Lesson
                </button>
            </div>
        </div>
    );
}
