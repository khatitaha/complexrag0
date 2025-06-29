"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Printer, CheckCircle, XCircle, Clock, FileText } from "lucide-react";

type Question = {
    id: string;
    type: "multiple" | "short";
    text: string;
    options?: string[];
    correct?: string;
    solution?: string;
    points?: number;
};

const questions: Question[] = [
    {
        id: "q1",
        type: "multiple",
        text: "Which of these is the largest ocean on Earth?",
        options: ["Atlantic", "Pacific", "Indian", "Arctic"],
        correct: "Pacific",
        solution: "The Pacific Ocean is the largest ocean by surface area and volume, covering approximately 63 million square miles.",
        points: 2,
    },
    {
        id: "q2",
        type: "multiple",
        text: "Which number is prime?",
        options: ["15", "21", "19", "25"],
        correct: "19",
        solution: "19 is a prime number because it is only divisible by 1 and itself. 15, 21, and 25 are all composite numbers.",
        points: 2,
    },
    {
        id: "q3",
        type: "multiple",
        text: "What gas do humans breathe in to survive?",
        options: ["Carbon Dioxide", "Oxygen", "Hydrogen", "Nitrogen"],
        correct: "Oxygen",
        solution: "Humans breathe oxygen from the atmosphere, which is essential for cellular respiration and energy production.",
        points: 2,
    },
    {
        id: "q4",
        type: "short",
        text: "Define photosynthesis and explain its importance in the ecosystem.",
        solution: "Photosynthesis is the process by which green plants, algae, and some bacteria convert light energy into chemical energy stored in glucose and other organic compounds. This process uses carbon dioxide and water, releasing oxygen as a byproduct. Photosynthesis is crucial for the ecosystem as it provides the primary source of energy for most life forms and maintains atmospheric oxygen levels.",
        points: 5,
    },
    {
        id: "q5",
        type: "short",
        text: "Explain what a computer algorithm is and provide an example of its application.",
        solution: "An algorithm is a step-by-step procedure or set of rules designed to solve a specific problem or perform a computation. It consists of a finite sequence of well-defined instructions that, when executed, produce a desired output. Examples include sorting algorithms (like bubble sort), search algorithms (like binary search), and machine learning algorithms used in recommendation systems.",
        points: 5,
    },
    {
        id: "q6",
        type: "multiple",
        text: "Which programming paradigm emphasizes objects and classes?",
        options: ["Procedural", "Object-Oriented", "Functional", "Declarative"],
        correct: "Object-Oriented",
        solution: "Object-Oriented Programming (OOP) emphasizes objects and classes, focusing on data and behavior encapsulation.",
        points: 2,
    },
];

const ExamPage = () => {
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState<number | null>(null);
    const [totalPoints, setTotalPoints] = useState<number>(0);

    const handleAnswer = (id: string, val: string) => {
        setAnswers((prev) => ({ ...prev, [id]: val }));
    };

    const handleSubmit = () => {
        let correct = 0;
        let earnedPoints = 0;
        const multipleChoiceQuestions = questions.filter((q) => q.type === "multiple");

        questions.forEach((q) => {
            if (q.type === "multiple" && answers[q.id] === q.correct) {
                correct++;
                earnedPoints += q.points || 0;
            }
        });

        setScore(correct);
        setTotalPoints(earnedPoints);
        setSubmitted(true);
        toast.success(`Scored ${correct}/${multipleChoiceQuestions.length} multiple choice questions (${earnedPoints} points)`);
    };

    const handlePrint = () => {
        window.print();
    };

    const getTotalPossiblePoints = () => {
        return questions.reduce((total, q) => total + (q.points || 0), 0);
    };

    return (
        <>
            <style jsx global>{`
                @media print {
                    /* Override all parent layout constraints */
                    html, body {
                        height: auto !important;
                        min-height: auto !important;
                        max-height: none !important;
                        overflow: visible !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        background: white !important;
                        color: black !important;
                    }
                    
                    /* Override any parent containers */
                    div, main, section, article {
                        height: auto !important;
                        min-height: auto !important;
                        max-height: none !important;
                        overflow: visible !important;
                        position: static !important;
                        transform: none !important;
                    }
                    
                    /* Specifically target the layout containers */
                    .flex, .flex-1, .overflow-hidden, .overflow-auto {
                        height: auto !important;
                        min-height: auto !important;
                        max-height: none !important;
                        overflow: visible !important;
                        display: block !important;
                    }
                    
                    /* Hide all non-print content */
                    .print-hidden {
                        display: none !important;
                    }
                    
                    /* Show print content */
                    .print-visible {
                        display: block !important;
                    }
                    
                    /* Exam page styling */
                    .print-exam-page {
                        page-break-after: always;
                        margin: 0 !important;
                        padding: 20px !important;
                        font-family: serif !important;
                        background: white !important;
                        color: black !important;
                        height: auto !important;
                        min-height: auto !important;
                        max-height: none !important;
                        overflow: visible !important;
                        position: static !important;
                    }
                    
                    /* Answer page styling */
                    .print-answer-page {
                        page-break-before: always;
                        margin: 0 !important;
                        padding: 20px !important;
                        font-family: serif !important;
                        background: white !important;
                        color: black !important;
                        height: auto !important;
                        min-height: auto !important;
                        max-height: none !important;
                        overflow: visible !important;
                        position: static !important;
                    }
                    
                    /* Ensure content flows properly */
                    .space-y-6 > * + * {
                        margin-top: 1.5rem !important;
                    }
                    
                    .mb-6 {
                        margin-bottom: 1.5rem !important;
                    }
                    
                    .mb-8 {
                        margin-bottom: 2rem !important;
                    }
                    
                    /* Force page breaks where needed */
                    .page-break {
                        page-break-before: always;
                    }
                    
                    /* Remove any flexbox constraints */
                    .flex, .flex-1, .flex-col {
                        display: block !important;
                    }
                }
            `}</style>

            <div className="min-h-screen bg-neutral-950 text-neutral-100 print:bg-white print:text-black print:min-h-0 print:h-auto">
                {/* Digital Exam Interface */}
                <div className="print-hidden">
                    <div className="max-w-4xl mx-auto p-6 space-y-6">
                        {/* Header */}
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                    📝 Midterm Examination
                                </h1>
                                <p className="text-neutral-400 mt-2">Computer Science 101 - Fall 2024</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <Badge variant="outline" className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    90 minutes
                                </Badge>
                                <Badge variant="outline" className="flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    {questions.length} questions
                                </Badge>
                            </div>
                        </div>

                        {/* Instructions */}
                        <Card className="bg-neutral-900 border-neutral-700">
                            <CardHeader>
                                <CardTitle className="text-xl">Instructions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-neutral-300">
                                <p>• Read each question carefully before answering</p>
                                <p>• Multiple choice questions are worth 2 points each</p>
                                <p>• Short answer questions are worth 5 points each</p>
                                <p>• Total possible points: {getTotalPossiblePoints()}</p>
                                <p>• You may use a calculator and reference materials</p>
                            </CardContent>
                        </Card>

                        {/* Questions */}
                        <div className="space-y-6">
                            {questions.map((q, idx) => (
                                <Card key={q.id} className="bg-neutral-900 border-neutral-700">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-lg">
                                                Question {idx + 1}
                                            </CardTitle>
                                            <Badge variant="secondary" className="bg-neutral-800">
                                                {q.points} pts
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <p className="text-neutral-200 leading-relaxed">{q.text}</p>

                                        {q.type === "multiple" ? (
                                            <div className="space-y-3">
                                                {q.options!.map((opt, optIdx) => (
                                                    <label key={opt} className="flex items-center gap-3 p-3 rounded-lg border border-neutral-700 hover:bg-neutral-800 cursor-pointer transition-colors">
                                                        <input
                                                            type="radio"
                                                            name={q.id}
                                                            value={opt}
                                                            checked={answers[q.id] === opt}
                                                            onChange={() => handleAnswer(q.id, opt)}
                                                            disabled={submitted}
                                                            className="w-4 h-4 text-blue-600 bg-neutral-800 border-neutral-600 focus:ring-blue-500"
                                                        />
                                                        <span className="font-medium">{String.fromCharCode(65 + optIdx)}.</span>
                                                        <span className="flex-1">{opt}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        ) : (
                                            <textarea
                                                rows={6}
                                                className="w-full p-4 rounded-lg border border-neutral-700 bg-neutral-800 text-neutral-200 placeholder-neutral-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                                placeholder="Type your answer here..."
                                                value={answers[q.id] || ""}
                                                onChange={(e) => handleAnswer(q.id, e.target.value)}
                                                disabled={submitted}
                                            />
                                        )}

                                        {/* Show results after submission */}
                                        {submitted && (
                                            <div className="mt-4 p-4 rounded-lg bg-neutral-800 border border-neutral-600">
                                                <div className="flex items-center gap-2 mb-2">
                                                    {q.type === "multiple" ? (
                                                        answers[q.id] === q.correct ? (
                                                            <CheckCircle className="w-5 h-5 text-green-400" />
                                                        ) : (
                                                            <XCircle className="w-5 h-5 text-red-400" />
                                                        )
                                                    ) : (
                                                        <FileText className="w-5 h-5 text-blue-400" />
                                                    )}
                                                    <span className="font-semibold">Solution:</span>
                                                </div>
                                                <p className="text-neutral-300 leading-relaxed">{q.solution}</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-6">
                            <Button
                                onClick={handleSubmit}
                                disabled={submitted}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                            >
                                Submit Exam
                            </Button>
                            <Button
                                onClick={handlePrint}
                                variant="outline"
                                className="border-neutral-600 hover:bg-neutral-800 px-8 py-3"
                            >
                                <Printer className="w-4 h-4 mr-2" />
                                Print Exam
                            </Button>
                        </div>

                        {/* Results */}
                        {submitted && (
                            <Card className="bg-neutral-900 border-neutral-700">
                                <CardHeader>
                                    <CardTitle className="text-xl text-center">Exam Results</CardTitle>
                                </CardHeader>
                                <CardContent className="text-center space-y-2">
                                    <p className="text-2xl font-bold text-blue-400">
                                        {score}/{questions.filter(q => q.type === "multiple").length} Multiple Choice Correct
                                    </p>
                                    <p className="text-lg text-neutral-300">
                                        Total Points: {totalPoints}/{getTotalPossiblePoints()}
                                    </p>
                                    <p className="text-sm text-neutral-400">
                                        Short answer questions will be graded manually by your instructor.
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Print Layout - Exam Page */}
                <div className="print-visible print-exam-page hidden">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold mb-2">Midterm Examination</h1>
                        <h2 className="text-xl font-semibold mb-1">Computer Science 101</h2>
                        <p className="text-lg mb-4">Fall 2024</p>
                        <div className="border-t-2 border-black pt-4">
                            <div className="grid grid-cols-2 gap-8 text-sm">
                                <div>
                                    <p><strong>Student Name:</strong> _________________________________</p>
                                    <p><strong>Student ID:</strong> _________________________________</p>
                                </div>
                                <div>
                                    <p><strong>Date:</strong> _________________________________</p>
                                    <p><strong>Time Limit:</strong> 90 minutes</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6 p-4 border-2 border-black">
                        <h3 className="font-bold text-lg mb-2">Instructions:</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>Read each question carefully before answering</li>
                            <li>Multiple choice questions are worth 2 points each</li>
                            <li>Short answer questions are worth 5 points each</li>
                            <li>Total possible points: {getTotalPossiblePoints()}</li>
                            <li>You may use a calculator and reference materials</li>
                            <li>Write clearly and show all work for full credit</li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        {questions.map((q, idx) => (
                            <div key={q.id} className="mb-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg">
                                        Question {idx + 1}. ({q.points} points)
                                    </h3>
                                </div>
                                <p className="mb-3 leading-relaxed">{q.text}</p>

                                {q.type === "multiple" ? (
                                    <div className="ml-4 space-y-2">
                                        {q.options!.map((opt, optIdx) => (
                                            <div key={opt} className="flex items-center gap-2">
                                                <span className="font-bold">({String.fromCharCode(65 + optIdx)})</span>
                                                <span>_____</span>
                                                <span>{opt}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="ml-4 space-y-2">
                                        {[...Array(8)].map((_, line) => (
                                            <div key={line} className="border-b border-black w-full h-6"></div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Print Layout - Answer Key Page */}
                <div className="print-visible print-answer-page hidden">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold mb-2">Answer Key</h1>
                        <h2 className="text-xl font-semibold mb-1">Computer Science 101 - Midterm</h2>
                        <p className="text-lg mb-4">Fall 2024</p>
                        <div className="border-t-2 border-black pt-4">
                            <p><strong>Total Points:</strong> {getTotalPossiblePoints()}</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {questions.map((q, idx) => (
                            <div key={q.id} className="mb-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg">
                                        Question {idx + 1}. ({q.points} points)
                                    </h3>
                                </div>
                                <p className="mb-2 font-semibold">{q.text}</p>

                                {q.type === "multiple" ? (
                                    <div className="ml-4">
                                        <p className="font-bold text-green-700">
                                            Answer: {q.correct}
                                        </p>
                                        <div className="ml-4 space-y-2">
                                            {q.options!.map((opt, optIdx) => (
                                                <div key={opt} className="flex items-center gap-2">
                                                    <span className="font-bold">({String.fromCharCode(65 + optIdx)})</span>
                                                    <span className={opt === q.correct ? "font-bold text-green-700" : ""}>
                                                        {opt === q.correct ? "✓" : "○"} {opt}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="ml-4">
                                        <p className="font-bold text-green-700 mb-2">Sample Answer:</p>
                                        <div className="ml-4 p-3 bg-gray-100 rounded border">
                                            <p className="text-sm leading-relaxed">{q.solution}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-3 ml-4 p-2 bg-gray-50 rounded">
                                    <p className="text-sm italic"><strong>Explanation:</strong> {q.solution}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ExamPage;
