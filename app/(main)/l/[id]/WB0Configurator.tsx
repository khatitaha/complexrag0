"use client";

import { useState, useEffect } from "react";
import { FiSettings, FiGlobe, FiHelpCircle, FiLayers, FiEdit3, FiPlay } from "react-icons/fi";
import LessonPage from "./WB2Client";
import { getCachedWb2Logic, getStoredMessages, generateLessonFromUrl } from "../actions";
import { Lesson } from "../actions"; // Import the Lesson type
import { Card } from "@/components/ui/card";

export default function LessonConfigurator({ id, initialLessonData }: { id: string, initialLessonData: Lesson | null }) {
    const [language, setLanguage] = useState("English");
    const [customLanguage, setCustomLanguage] = useState("");
    const [quizCount, setQuizCount] = useState(5);
    const [flashCount, setFlashCount] = useState(5);
    const [note, setNote] = useState("");
    const [result, setResult] = useState<any>(null);
    const [initialChat, setInitialChat] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("");

    const loadingMessages = [
        "Crafting your personalized learning journey...",
        "Unpacking complex ideas, one concept at a time...",
        "Summoning the wisdom of the digital realm...",
        "Polishing the quizzes for maximum brain-power...",
        "Arranging flashcards for optimal memorization...",
        "Just a moment, the AI is consulting its vast knowledge base...",
        "Ensuring every explanation is crystal clear...",
        "Almost there, your lesson is brewing!",
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

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (loading) {
            setLoadingMessage(loadingMessages[0]); // Set initial message
            interval = setInterval(() => {
                setLoadingMessage(prevMessage => {
                    const currentIndex = loadingMessages.indexOf(prevMessage);
                    const nextIndex = (currentIndex + 1) % loadingMessages.length;
                    return loadingMessages[nextIndex];
                });
            }, 3000); // Change message every 3 seconds
        } else {
            setLoadingMessage(""); // Clear message when not loading
        }
        return () => clearInterval(interval);
    }, [loading]);

    const handleStart = async () => {
        setLoading(true);
        const chosenLanguage = language === "Custom" ? customLanguage : language;

        let res;
        // Check if this is a URL-based lesson
        if (initialLessonData && initialLessonData.url) {
            res = await generateLessonFromUrl(
                id,
                chosenLanguage,
                quizCount,
                flashCount,
                note
            );
        } else {
            // Otherwise, it's a file-based lesson
            const publicUrl = `https://clxsgightqnifyrrmhrd.supabase.co/storage/v1/object/public/docs/uploads/${id}`;
            res = await getCachedWb2Logic(
                publicUrl,
                id,
                chosenLanguage,
                quizCount,
                flashCount,
                note
            );
        }

        console.log(`language : ${chosenLanguage} , quiz : ${quizCount}, flash : ${flashCount}, note : ${note} `)
        const chat = await getStoredMessages(id);

        setResult(res);
        setInitialChat(chat || []);
        setLoading(false);
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-50 dark:bg-neutral-900">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-lg font-medium text-neutral-700 dark:text-neutral-300">{loadingMessage}</p>
        </div>
    );

    if (result) {
        return <LessonPage result={result} initialChat={initialChat} />;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-white dark:bg-neutral-900 p-8">
            <Card className="w-full max-w-lg shadow-2xl rounded-2xl overflow-hidden border-0  my-auto">
                <div className="p-8 bg-gradient-to-tr from-green-500 to-cyan-600 text-white text-center">
                    <FiSettings className="w-16 h-16 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold">Customize Your Lesson</h2>
                    <p className="mt-2 opacity-90">Tailor the learning experience to your needs.</p>
                </div>
                <div className="py-2 px-8 bg-white dark:bg-neutral-800">
                    <div className="space-y-6">
                        {/* Language Selector */}
                        <div>
                            <label className="flex items-center mb-2 font-semibold text-neutral-700 dark:text-neutral-300">
                                <FiGlobe className="mr-3 text-cyan-500" /> Language
                            </label>
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="w-full p-3 bg-gray-100 dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
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
                                    className="w-full p-3 bg-gray-100 dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 rounded-lg mt-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
                                />
                            )}
                        </div>

                        {/* Quizzes */}
                        <div>
                            <label className="flex items-center mb-2 font-semibold text-neutral-700 dark:text-neutral-300">
                                <FiHelpCircle className="mr-3 text-cyan-500" /> Quizzes
                                <span className="ml-auto font-bold text-cyan-600 dark:text-cyan-400">{quizCount}</span>
                            </label>
                            <input
                                type="range"
                                min="2"
                                max="20"
                                value={quizCount}
                                onChange={(e) => setQuizCount(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                            />
                        </div>

                        {/* Flashcards */}
                        <div>
                            <label className="flex items-center mb-2 font-semibold text-neutral-700 dark:text-neutral-300">
                                <FiLayers className="mr-3 text-cyan-500" /> Flashcards
                                <span className="ml-auto font-bold text-cyan-600 dark:text-cyan-400">{flashCount}</span>
                            </label>
                            <input
                                type="range"
                                min="2"
                                max="20"
                                value={flashCount}
                                onChange={(e) => setFlashCount(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                            />
                        </div>

                        {/* Note */}
                        <div>
                            <label className="flex items-center mb-2 font-semibold text-neutral-700 dark:text-neutral-300">
                                <FiEdit3 className="mr-3 text-cyan-500" /> Special Note
                            </label>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="e.g., focus on the main historical events..."
                                className="w-full p-3 bg-gray-100 dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 rounded-lg resize-none focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
                                rows={3}
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleStart}
                        className="mt-8 w-full py-4  bg-cyan-600 hover:from-cyan-700 hover:bg-cyan-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                    >
                        <FiPlay className="mr-3" />
                        Generate Lesson
                    </button>
                </div>
            </Card>
        </div>
    );
}
