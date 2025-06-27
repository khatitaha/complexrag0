"use client";

import { Flashcard, LearningContentVersion, Summary, useActions, useLearningContentStore, useStudy } from '@/lib/utils/zustand';
import { useEffect, useState } from 'react';
import { FiFile } from 'react-icons/fi';

type Props = {
    study: {
        summary: Summary;
        explanation: string;
        flashcards: Flashcard[];
        roadmap: string;
    };
};


export default function SummaryClient(props: Props) {
    const { study } = props;

    const { addStudyVersion } = useActions();
    const stateStudy = useStudy();


    // const [Tsummary, setTsummary] = useState<LearningContentVersion<Summary>[]>([]);
    // const [Tflashcards, setTflashcards] = useState<LearningContentVersion<Flashcard[]>[]>([]);
    // const [Texplanation, setTexplanation] = useState<LearningContentVersion<string>[]>([]);
    // const [Troadmap, setTroadmap] = useState<LearningContentVersion<string>[]>([]);

    const [summary, setSummary] = useState<Summary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        try {
            const now = Date.now();
            const nowDate = new Date();

            const summaryVersion: LearningContentVersion<Summary> = {
                id: now,
                createdAt: nowDate,
                data: study.summary,
            };
            const flashcardVersion: LearningContentVersion<Flashcard[]> = {
                id: now + 1,
                createdAt: nowDate,
                data: study.flashcards,
            };
            const explanationVersion: LearningContentVersion<string> = {
                id: now + 2,
                createdAt: nowDate,
                data: study.explanation,
            };
            const roadmapVersion: LearningContentVersion<string> = {
                id: now + 3,
                createdAt: nowDate,
                data: study.roadmap,
            };

            // Update Zustand store


            addStudyVersion('summary', summaryVersion);
            addStudyVersion('flashcards', flashcardVersion);
            addStudyVersion('explanation', explanationVersion);
            addStudyVersion('roadmap', roadmapVersion);

      

            setSummary(study.summary);
            setLoading(false);
        } catch (err) {
            setError("Failed to load study data.");
            setLoading(false);
        }
    }, [study]);

    const latestSummary = Tsummary.length > 0 ? Tsummary[Tsummary.length - 1] : null;

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading summary...</p>

                    <h2 className="mt-4 font-bold">All Summaries:</h2>
                    <pre>{JSON.stringify(Tsummary, null, 2)}</pre>

                    <h2 className="mt-4 font-bold">Latest Summary:</h2>
                    <pre>{JSON.stringify(latestSummary, null, 2)}</pre>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
                    {error}
                </div>
            </div>
        );
    }

    if (!summary) {
        return (
            <div className="p-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-600">
                    No summary available
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex items-center mb-6">
                <FiFile className="w-6 h-6 text-blue-500 mr-2" />
                <h2 className="text-2xl font-bold text-black">{summary.title}</h2>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4 text-black">Content Summary</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{summary.content}</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4 text-black">Key Points</h3>
                <ul className="list-disc list-inside space-y-2">
                    {summary.keyPoints.map((point, index) => (
                        <li key={index} className="text-gray-700">{point}</li>
                    ))}
                </ul>
            </div>

            {summary.formulas && summary.formulas.length > 0 && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 text-black">Important Formulas</h3>
                    <ul className="list-disc list-inside space-y-2">
                        {summary.formulas.map((formula, index) => (
                            <li key={index} className="text-gray-700">{formula}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
