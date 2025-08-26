import { useState } from "react";

// const quizQuestions = [
//     {
//         question: "Which of the following is NOT a form of energy?",
//         options: ["Kinetic", "Thermal", "Gravity", "Chemical"],
//         answer: 2, // Gravity
//     },
//     {
//         question: "What unit is energy measured in?",
//         options: ["Joules", "Newtons", "Watts", "Amperes"],
//         answer: 0, // Joules
//     },
//     {
//         question: "How is potential energy calculated?",
//         options: [
//             "mass × velocity²",
//             "force × time",
//             "mass × gravity × height",
//             "energy ÷ time",
//         ],
//         answer: 2, // mass × gravity × height
//     },
// ];


type props = {
    quiz: { question: string, options: string[], answer: number, explanation: string }[];
}

export default function Quiz({ quiz }: props) {
    const [selected, setSelected] = useState<Record<number, number | null>>({});

    const handleSelect = (qIndex: number, optIndex: number) => {
        setSelected((prev) => ({ ...prev, [qIndex]: optIndex }));
    };

    return (
        <div className="max-w-3xl mx-auto px-6 py-12 space-y-10 text-neutral-800 dark:text-neutral-100">
            <h2 className="text-4xl font-bold text-yellow-600 dark:text-yellow-400 drop-shadow-md">
                📝 Quiz
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-lg border-b border-neutral-300 dark:border-neutral-800 pb-4">
                Answer the following questions to test your understanding:
            </p>

            <ol className="space-y-8 list-decimal list-inside">
                {quiz.map((q, index) => (
                    <li
                        key={index}
                        className="bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl p-6 text-lg space-y-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                            {q.question}
                        </p>
                        <div className="space-y-2">
                            {q.options.map((opt, optIndex) => {
                                const isSelected = selected[index] === optIndex;
                                const isCorrect = q.answer === optIndex;
                                const isUserCorrect = selected[index] === q.answer;
                                const isWrong =
                                    selected[index] === optIndex && !isUserCorrect;

                                return (
                                    <button
                                        key={optIndex}
                                        onClick={() => handleSelect(index, optIndex)}
                                        className={`block w-full text-left px-4 py-2 rounded-md border transition-colors
                      ${isSelected && isUserCorrect && isCorrect
                                                ? "bg-green-100 text-green-900 border-green-500 dark:bg-green-800 dark:text-white"
                                                : isWrong
                                                    ? "bg-red-100 text-red-900 border-red-500 dark:bg-red-900 dark:text-white"
                                                    : isCorrect && selected[index] != null
                                                        ? "border-green-400 text-green-700 dark:text-green-300"
                                                        : isSelected
                                                            ? "bg-neutral-200 border-neutral-400 text-neutral-900 dark:bg-neutral-800 dark:border-neutral-500 dark:text-white"
                                                            : "bg-neutral-100 border-neutral-300 text-neutral-800 hover:bg-neutral-200 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                                            }`}
                                    >
                                        {opt}
                                    </button>
                                );
                            })}
                        </div>
                        {selected[index] != null && (
                            <p
                                className={`mt-2 text-sm font-medium ${selected[index] === q.answer
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-red-600 dark:text-red-400"
                                    }`}
                            >
                                {selected[index] === q.answer
                                    ? "✅ Correct!"
                                    : `❌ Incorrect. Correct answer: ${q.options[q.answer]}`}
                            </p>
                        )}
                    </li>
                ))}
            </ol>
        </div>
    );
}
