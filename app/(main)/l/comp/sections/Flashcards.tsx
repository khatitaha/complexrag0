import { useState } from 'react';
import { addFlashcardsToDb } from '../../actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';


// const initialFlashcardsData = [
//     {
//         question: 'What is the definition of energy?',
//         answer: 'Energy is the ability to do work or cause change.',
//     },
//     {
//         question: "State Newton's First Law.",
//         answer: 'An object will remain at rest or in motion unless acted upon by a force.',
//     },
//     {
//         question: 'What is kinetic energy?',
//         answer: 'Kinetic energy is the energy an object has due to its motion.',
//     },
// ];

// Each theme: [lightFront, darkFront, lightBack, darkBack]
const colorThemes: Record<string, { front: string; back: string }> = {
    cyan: {
        front: "bg-cyan-100 dark:bg-cyan-950",
        back: "bg-cyan-200 dark:bg-cyan-900",
    },
    green: {
        front: "bg-green-100 dark:bg-green-950",
        back: "bg-green-200 dark:bg-green-900",
    },
    red: {
        front: "bg-red-100 dark:bg-red-950",
        back: "bg-red-200 dark:bg-red-900",
    },
    yellow: {
        front: "bg-yellow-100 dark:bg-yellow-950",
        back: "bg-yellow-200 dark:bg-yellow-900",
    },
    purple: {
        front: "bg-purple-100 dark:bg-purple-950",
        back: "bg-purple-200 dark:bg-purple-900",
    },
    neutral: {
        front: "bg-neutral-100 dark:bg-neutral-900",
        back: "bg-neutral-200 dark:bg-neutral-800",
    },
};



type props = {
    cards: { question: string, answer: string }[];
    lessonId: string;
}





export default function Flashcards({ cards, lessonId }: props) {
    const router = useRouter();

    const [flashcards, setFlashcards] = useState(cards);
    const [current, setCurrent] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [theme, setTheme] = useState<keyof typeof colorThemes>("cyan");
    const [newCard, setNewCard] = useState({ question: "", answer: "" });
    const [showAddCard, setShowAddCard] = useState(false);

    const nextCard = () => {
        setFlipped(false);
        setCurrent((prev) => (prev + 1) % flashcards.length);
    };

    const prevCard = () => {
        setFlipped(false);
        setCurrent((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    };

    const shuffleCards = () => {
        setFlashcards((prev) => [...prev].sort(() => Math.random() - 0.5));
        setCurrent(0);
        setFlipped(false);
    };

    const addFlashcard = () => {
        if (newCard.question && newCard.answer) {
            setFlashcards([...flashcards, newCard]);
            setNewCard({ question: "", answer: "" });
            setShowAddCard(false);
        }
    };

    const saveToDB = async () => {


        try {
            console.log("we are gonna try to add the falshacards now to the db", lessonId);
            console.log("Saving to DB:", flashcards);
            await addFlashcardsToDb({ lessonId, updatedFlashcards: flashcards });

            toast.success(" flashcards uploaded  ✅");

        } catch (err) {
            console.error("couldnt save new flashcards", err);
            toast.error("❌ couldnt save new flashcards");
        } finally {
            router.refresh();

        }
    };

    const themeColors = colorThemes[theme]; // ✅ has both light+dark classes

    return (
        <div className="max-w-6xl mx-auto px-6 py-12 flex gap-8 text-neutral-800 dark:text-neutral-100">
            {/* Sidebar */}
            {showAddCard && (
                <div className="w-80 flex-shrink-0 space-y-4 bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-300 dark:border-neutral-700 shadow-lg">
                    <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300">
                        ➕ Add Flashcard
                    </h3>
                    <input
                        type="text"
                        placeholder="Question"
                        value={newCard.question}
                        onChange={(e) => setNewCard({ ...newCard, question: e.target.value })}
                        className="w-full px-3 py-2 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white"
                    />
                    <input
                        type="text"
                        placeholder="Answer"
                        value={newCard.answer}
                        onChange={(e) => setNewCard({ ...newCard, answer: e.target.value })}
                        className="w-full px-3 py-2 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white"
                    />
                    <button
                        onClick={addFlashcard}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-md text-white w-full"
                    >
                        ➕ Add Card
                    </button>
                </div>
            )}

            <div className="flex-1 space-y-10">
                <h2 className="text-4xl font-bold text-cyan-700 dark:text-cyan-100 drop-shadow-md">
                    🧠 Flashcards
                </h2>

                {/* Theme Picker */}
                <div className="flex gap-3 flex-wrap mb-4">
                    {(Object.keys(colorThemes) as (keyof typeof colorThemes)[]).map(
                        (color) => (
                            <button
                                key={color}
                                onClick={() => setTheme(color)}
                                className={`px-3 py-1 text-sm font-medium rounded-full border transition-colors ${theme === color
                                    ? "bg-black text-white dark:bg-white dark:text-black"
                                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-white border-neutral-300 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                                    }`}
                            >
                                {color.charAt(0).toUpperCase() + color.slice(1)}
                            </button>
                        )
                    )}
                </div>

                {/* Controls */}
                <div className="flex flex-wrap gap-3">
                    <button className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 rounded-md text-black font-semibold shadow-md" onClick={shuffleCards}>
                        🔀 Shuffle
                    </button>
                    <button className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-md text-white font-semibold shadow-md" onClick={saveToDB}>
                        💾 Save to DB
                    </button>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-md text-white font-semibold shadow-md" onClick={() => setShowAddCard(true)}  >
                        ➕ Add Card
                    </button>
                </div>
                z
                {/* Flashcard number */}
                <div className="text-center text-sm text-neutral-500 dark:text-neutral-400">
                    Card {current + 1} of {flashcards.length}
                </div>

                {/* Flashcard */}
                <div className="relative h-72">
                    <div
                        className={`absolute inset-0 transition-transform duration-500 transform-style-preserve-3d ${flipped ? "rotate-y-180" : ""
                            }`}
                    >
                        {/* FRONT */}
                        <div
                            className={`absolute inset-0 backface-hidden rounded-xl shadow-xl border border-neutral-300 dark:border-neutral-700 p-8 flex flex-col justify-between items-center text-center ${themeColors.front}`}
                        >
                            <div className="text-xl font-semibold">
                                {flashcards[current].question}
                            </div>
                            <button
                                onClick={() => setFlipped(true)}
                                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm text-white"
                            >
                                Show Answer
                            </button>
                        </div>

                        {/* BACK */}
                        <div
                            className={`absolute inset-0 backface-hidden rotate-y-180 rounded-xl shadow-xl border border-neutral-300 dark:border-neutral-700 p-8 flex flex-col justify-between items-center text-center ${themeColors.back}`}
                        >
                            <div className="text-xl font-medium">
                                {flashcards[current].answer}
                            </div>
                            <button
                                onClick={() => setFlipped(false)}
                                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm text-white"
                            >
                                Hide Answer
                            </button>
                        </div>
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center gap-4">
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white shadow-md" onClick={prevCard}>
                        ⬅ Previous
                    </button>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white shadow-md" onClick={nextCard}>
                        Next ➡
                    </button>
                </div>

                <style jsx>{`
            .transform-style-preserve-3d {
              transform-style: preserve-3d;
              perspective: 1000px;
            }
            .rotate-y-180 {
              transform: rotateY(180deg);
            }
            .backface-hidden {
              backface-visibility: hidden;
            }
          `}</style>
            </div>
        </div>
    );
}
