'use client';

import { useState, useMemo } from 'react';
import { addFlashcardsToDb } from '../../actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiPlus, FiSave, FiShuffle, FiRotateCcw, FiX, FiDroplet } from 'react-icons/fi';

const colorThemes: Record<string, { front: string; back: string; text: string }> = {
    cyan: {
        front: "bg-cyan-100 dark:bg-cyan-900 border-cyan-200 dark:border-cyan-800",
        back: "bg-cyan-200 dark:bg-cyan-800 border-cyan-300 dark:border-cyan-700",
        text: "text-cyan-800 dark:text-cyan-100"
    },
    green: {
        front: "bg-green-100 dark:bg-green-900 border-green-200 dark:border-green-800",
        back: "bg-green-200 dark:bg-green-800 border-green-300 dark:border-green-700",
        text: "text-green-800 dark:text-green-100"
    },
    red: {
        front: "bg-red-100 dark:bg-red-900 border-red-200 dark:border-red-800",
        back: "bg-red-200 dark:bg-red-800 border-red-300 dark:border-red-700",
        text: "text-red-800 dark:text-red-100"
    },
    yellow: {
        front: "bg-yellow-100 dark:bg-yellow-900 border-yellow-200 dark:border-yellow-800",
        back: "bg-yellow-200 dark:bg-yellow-800 border-yellow-300 dark:border-yellow-700",
        text: "text-yellow-800 dark:text-yellow-100"
    },
    purple: {
        front: "bg-purple-100 dark:bg-purple-900 border-purple-200 dark:border-purple-800",
        back: "bg-purple-200 dark:bg-purple-800 border-purple-300 dark:border-purple-700",
        text: "text-purple-800 dark:text-purple-100"
    },
    neutral: {
        front: "bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700",
        back: "bg-neutral-200 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600",
        text: "text-neutral-800 dark:text-neutral-100"
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
    const [theme, setTheme] = useState<keyof typeof colorThemes>("neutral");
    const [newCard, setNewCard] = useState({ question: "", answer: "" });
    const [showAddCard, setShowAddCard] = useState(false);
    const [direction, setDirection] = useState(0);

    const nextCard = () => {
        setDirection(1);
        setFlipped(false);
        setCurrent((prev) => (prev + 1) % flashcards.length);
    };

    const prevCard = () => {
        setDirection(-1);
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
            await addFlashcardsToDb({ lessonId, updatedFlashcards: flashcards });
            toast.success("Flashcards saved successfully!");
        } catch (err) {
            toast.error("Failed to save flashcards.");
        }
    };

    const themeColors = useMemo(() => colorThemes[theme], [theme]);

    const cardVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 500 : -500,
            opacity: 0,
            scale: 0.8
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 500 : -500,
            opacity: 0,
            scale: 0.8
        })
    };

    return (
        <div className="h-full w-full bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 flex flex-col p-4 sm:p-6 lg:p-8">
            <div className="flex-shrink-0 flex justify-between items-center mb-4">
                <h1 className="text-2xl sm:text-3xl font-bold">Flashcards</h1>
                <div className="flex items-center gap-2">
                    <button onClick={() => setShowAddCard(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 transition-colors">
                        <FiPlus />
                        <span>Add Card</span>
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {showAddCard && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
                        onClick={() => setShowAddCard(false)}
                    >
                        <motion.div
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -50, opacity: 0 }}
                            className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-xl w-full max-w-md"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold">Add a new flashcard</h2>
                                <button onClick={() => setShowAddCard(false)}><FiX /></button>
                            </div>
                            <input
                                type="text"
                                placeholder="Question"
                                value={newCard.question}
                                onChange={(e) => setNewCard({ ...newCard, question: e.target.value })}
                                className="w-full p-2 mb-2 border rounded bg-neutral-100 dark:bg-neutral-700"
                            />
                            <textarea
                                placeholder="Answer"
                                value={newCard.answer}
                                onChange={(e) => setNewCard({ ...newCard, answer: e.target.value })}
                                className="w-full p-2 mb-2 border rounded bg-neutral-100 dark:bg-neutral-700"
                            />
                            <button onClick={addFlashcard} className="w-full p-2 bg-green-500 text-white rounded">Add Card</button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex-grow flex flex-col items-center justify-center">
                <div className="relative h-80 w-full max-w-2xl mb-4">
                    <AnimatePresence initial={false} custom={direction}>
                        <motion.div
                            key={current}
                            custom={direction}
                            variants={cardVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                            className="absolute w-full h-full cursor-pointer"
                            style={{ perspective: 1000 }}
                            onClick={() => setFlipped(!flipped)}
                        >
                            <motion.div
                                className={`absolute w-full h-full rounded-2xl shadow-lg flex items-center justify-center p-8 text-center text-xl sm:text-2xl font-semibold border ${themeColors.front} ${themeColors.text}`}
                                style={{ backfaceVisibility: 'hidden' }}
                                animate={{ rotateY: flipped ? 180 : 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                {flashcards[current]?.question}
                            </motion.div>
                            <motion.div
                                className={`absolute w-full h-full rounded-2xl shadow-lg flex items-center justify-center p-8 text-center text-lg sm:text-xl ${themeColors.back} ${themeColors.text}`}
                                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                                animate={{ rotateY: flipped ? 0 : -180 }}
                                transition={{ duration: 0.6 }}
                            >
                                {flashcards[current]?.answer}
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="flex justify-center items-center mb-4">
                    <button onClick={() => setFlipped(!flipped)} className="flex items-center gap-2 px-4 py-2 bg-neutral-200 dark:bg-neutral-800 rounded-full font-semibold hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors">
                        <FiRotateCcw />
                        <span>Flip Card</span>
                    </button>
                </div>

                <div className="flex justify-between items-center w-full max-w-2xl">
                    <button onClick={prevCard} className="p-4 rounded-full bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors">
                        <FiChevronLeft size={24} />
                    </button>
                    <div className="text-lg font-semibold">{current + 1} / {flashcards.length}</div>
                    <button onClick={nextCard} className="p-4 rounded-full bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors">
                        <FiChevronRight size={24} />
                    </button>
                </div>

                <div className="w-full max-w-2xl bg-neutral-200 dark:bg-neutral-800 rounded-full h-2.5 mt-6">
                    <motion.div
                        className="bg-blue-500 h-2.5 rounded-full"
                        animate={{ width: `${((current + 1) / flashcards.length) * 100}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
            </div>

            <div className="flex-shrink-0 flex flex-col items-center gap-4 mt-8">
                <div className="flex items-center gap-4">
                    <button onClick={shuffleCards} className="flex items-center gap-2 px-4 py-2 bg-neutral-200 dark:bg-neutral-800 rounded-full font-semibold hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors">
                        <FiShuffle />
                        <span>Shuffle</span>
                    </button>
                    <button onClick={saveToDB} className="flex items-center gap-2 px-4 py-2 bg-neutral-200 dark:bg-neutral-800 rounded-full font-semibold hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors">
                        <FiSave />
                        <span>Save</span>
                    </button>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-full bg-neutral-200 dark:bg-neutral-800">
                    <FiDroplet />
                    {(Object.keys(colorThemes) as (keyof typeof colorThemes)[]).map((color) => (
                        <button
                            key={color}
                            onClick={() => setTheme(color)}
                            className={`w-8 h-8 rounded-full border-2 transition-all duration-300 ${theme === color ? 'border-blue-500 scale-110' : 'border-transparent'} ${colorThemes[color].front}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}