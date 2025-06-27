import { useState } from 'react';

const initialFlashcardsData = [
    {
        question: 'What is the definition of energy?',
        answer: 'Energy is the ability to do work or cause change.',
    },
    {
        question: "State Newton's First Law.",
        answer: 'An object will remain at rest or in motion unless acted upon by a force.',
    },
    {
        question: 'What is kinetic energy?',
        answer: 'Kinetic energy is the energy an object has due to its motion.',
    },
];

const colorThemes: Record<string, [string, string]> = {
    cyan: ['bg-cyan-950', 'bg-cyan-900'],
    green: ['bg-green-950', 'bg-green-900'],
    red: ['bg-red-950', 'bg-red-900'],
    yellow: ['bg-yellow-950', 'bg-yellow-900'],
    purple: ['bg-purple-950', 'bg-purple-900'],
    neutral: ['bg-neutral-900', 'bg-neutral-800']
};

export default function Flashcards() {
    const [flashcards, setFlashcards] = useState(initialFlashcardsData);
    const [current, setCurrent] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [theme, setTheme] = useState<keyof typeof colorThemes>('cyan');
    const [newCard, setNewCard] = useState({ question: '', answer: '' });
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
            setNewCard({ question: '', answer: '' });
            setShowAddCard(false);
        }
    };

    const saveToDB = () => {
        console.log('Saving to DB:', flashcards);
        alert('Flashcards saved to database! (Mock)');
    };

    const [frontBg, backBg] = colorThemes[theme];

    return (
        <div className="max-w-6xl mx-auto px-6 py-12 text-neutral-100 flex gap-8">
            {/* Sidebar Add Form */}
            {showAddCard && (
                <div className="w-80 flex-shrink-0 space-y-4 bg-neutral-900 p-6 rounded-xl border border-neutral-700 shadow-lg">
                    <h3 className="text-lg font-semibold text-neutral-300">➕ Add Flashcard</h3>
                    <input
                        type="text"
                        placeholder="Question"
                        value={newCard.question}
                        onChange={(e) => setNewCard({ ...newCard, question: e.target.value })}
                        className="w-full px-3 py-2 rounded-md bg-neutral-800 border border-neutral-600 text-white"
                    />
                    <input
                        type="text"
                        placeholder="Answer"
                        value={newCard.answer}
                        onChange={(e) => setNewCard({ ...newCard, answer: e.target.value })}
                        className="w-full px-3 py-2 rounded-md bg-neutral-800 border border-neutral-600 text-white"
                    />
                    <button
                        onClick={addFlashcard}
                        className="px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-md text-white w-full"
                    >
                        ➕ Add Card
                    </button>
                </div>
            )}

            <div className="flex-1 space-y-10">
                <h2 className="text-4xl font-bold text-cyan-100 drop-shadow-md">🧠 Flashcards</h2>

                {/* Theme Picker */}
                <div className="flex gap-3 flex-wrap mb-4">
                    {(Object.keys(colorThemes) as (keyof typeof colorThemes)[]).map((color) => (
                        <button
                            key={color}
                            onClick={() => setTheme(color)}
                            className={`px-3 py-1 text-sm font-medium rounded-full border border-neutral-700 hover:border-white transition-colors ${theme === color ? 'bg-white text-black' : 'bg-neutral-800 text-white'}`}
                        >
                            {color.charAt(0).toUpperCase() + color.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Controls */}
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={shuffleCards}
                        className="px-4 py-2 bg-yellow-700 hover:bg-yellow-600 rounded-md text-white font-semibold shadow-lg"
                    >
                        🔀 Shuffle
                    </button>
                    <button
                        onClick={saveToDB}
                        className="px-4 py-2 bg-green-700 hover:bg-green-600 rounded-md text-white font-semibold shadow-lg"
                    >
                        💾 Save to DB
                    </button>
                    <button
                        onClick={() => setShowAddCard(!showAddCard)}
                        className="px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-md text-white font-semibold shadow-lg"
                    >
                        ➕ Add Card
                    </button>
                </div>

                {/* Flashcard Number */}
                <div className="text-center text-sm text-neutral-400">
                    Card {current + 1} of {flashcards.length}
                </div>

                {/* Flashcard */}
                <div className="relative h-72 ">
                    <div
                        className={`absolute inset-0 transition-transform duration-500 transform-style-preserve-3d ${flipped ? 'rotate-y-180' : ''} `}
                    >
                        <div className={`absolute inset-0 backface-hidden ${frontBg} rounded-xl shadow-xl border border-neutral-700 p-8 flex flex-col justify-between items-center text-center`}>
                            <div className="text-xl font-semibold">{flashcards[current].question}</div>
                            <button
                                onClick={() => setFlipped(true)}
                                className="mt-4 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-md text-sm text-white"
                            >
                                Show Answer
                            </button>
                        </div>
                        <div className={`absolute inset-0 backface-hidden rotate-y-180 ${backBg} rounded-xl shadow-xl border border-neutral-700 p-8 flex flex-col justify-between items-center text-center`}>
                            <div className="text-xl font-medium">{flashcards[current].answer}</div>
                            <button
                                onClick={() => setFlipped(false)}
                                className="mt-4 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-md text-sm text-white"
                            >
                                Hide Answer
                            </button>
                        </div>
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center gap-4">
                    <button
                        onClick={prevCard}
                        className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-md text-white shadow-md hover:shadow-lg transition-all"
                    >
                        ⬅ Previous
                    </button>
                    <button
                        onClick={nextCard}
                        className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-md text-white shadow-md hover:shadow-lg transition-all"
                    >
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
