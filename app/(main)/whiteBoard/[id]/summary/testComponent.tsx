'use client';

import React, { useEffect, useState } from 'react';
import {
    useLearningContentStore,
    Summary,
    Flashcard,
    LearningContentVersion,
} from '@/lib/utils/zustand';

type Props = {
    study: {
        summary: Summary;
        explanation: string;
        flashcards: Flashcard[];
        roadmap: string;
    };
};

const TestComponent = ({ study }: Props) => {
    const addStudyVersion = useLearningContentStore((s) => s.addStudyVersion);

    const [Tsummary, setTsummary] = useState<LearningContentVersion<Summary>[]>([]);
    const [Tflashcards, setTflashcards] = useState<LearningContentVersion<Flashcard[]>[]>([]);
    const [Texplanation, setTexplanation] = useState<LearningContentVersion<string>[]>([]);
    const [Troadmap, setTroadmap] = useState<LearningContentVersion<string>[]>([]);

    useEffect(() => {
        const summaryVersion: LearningContentVersion<Summary> = {
            id: Date.now(),
            createdAt: new Date(),
            data: study.summary,
        };
        const flashcardVersion: LearningContentVersion<Flashcard[]> = {
            id: Date.now(),
            createdAt: new Date(),
            data: study.flashcards,
        };
        const explanationVersion: LearningContentVersion<string> = {
            id: Date.now(),
            createdAt: new Date(),
            data: study.explanation,
        };
        const roadmapVersion: LearningContentVersion<string> = {
            id: Date.now(),
            createdAt: new Date(),
            data: study.roadmap,
        };

        // Update Zustand store
        addStudyVersion('summary', summaryVersion);
        addStudyVersion('flashcards', flashcardVersion);
        addStudyVersion('explanation', explanationVersion);
        addStudyVersion('roadmap', roadmapVersion);

        // Update local state from store
        setTsummary((prev) => [...prev, summaryVersion]);
        setTflashcards((prev) => [...prev, flashcardVersion]);
        setTexplanation((prev) => [...prev, explanationVersion]);
        setTroadmap((prev) => [...prev, roadmapVersion]);
    }, [study]);

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-xl font-bold">Summary</h1>
                <pre className="text-black">{JSON.stringify(Tsummary, null, 2)}</pre>
            </div>
            <div>
                <h1 className="text-xl font-bold">Flashcards</h1>
                <pre className="text-green-700">{JSON.stringify(Tflashcards, null, 2)}</pre>
            </div>
            <div>
                <h1 className="text-xl font-bold">Explanation</h1>
                <pre className="text-blue-700">{JSON.stringify(Texplanation, null, 2)}</pre>
            </div>
            <div>
                <h1 className="text-xl font-bold">Roadmap</h1>
                <pre className="text-purple-700">{JSON.stringify(Troadmap, null, 2)}</pre>
            </div>
        </div>
    );
};

export default TestComponent;
