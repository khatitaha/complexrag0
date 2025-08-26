import { useEffect, useState } from 'react';

export default function Summary({ study }: { study: any }) {


    // const mockLesson = [
    //     {
    //         title: '1. Introduction to Energy',
    //         lines: [
    //             {
    //                 text: 'Energy is the ability to do work or cause change.',
    //                 explanation: 'This means energy enables movement or transformation in systems.',
    //             },
    //             {
    //                 text: 'It exists in various forms such as kinetic, potential, thermal, etc.',
    //                 explanation: 'Different types of energy correspond to different physical phenomena.',
    //             },
    //         ],
    //     },
    //     {
    //         title: '2. Kinetic vs Potential Energy',
    //         lines: [
    //             {
    //                 text: 'Kinetic energy is the energy of motion.',
    //                 explanation: 'Anything moving possesses kinetic energy proportional to its mass and speed.',
    //             },
    //             {
    //                 text: 'Potential energy is stored energy based on position or condition.',
    //                 explanation: 'It is energy waiting to be released, such as a compressed spring or raised object.',
    //             },
    //             {
    //                 text: 'Gravitational potential energy increases with height.',
    //                 explanation: 'The higher an object is, the more potential energy it stores due to gravity.',
    //             },
    //         ],
    //     },
    //     {
    //         title: '3. Conservation of Energy',
    //         lines: [
    //             {
    //                 text: 'Energy cannot be created or destroyed.',
    //                 explanation: 'This is the first law of thermodynamics — total energy stays constant.',
    //             },
    //             {
    //                 text: 'It can only be transformed from one form to another.',
    //                 explanation: 'For example, chemical energy in food becomes kinetic energy when you move.',
    //             },
    //             {
    //                 text: 'The total energy in an isolated system remains constant.',
    //                 explanation: 'In ideal systems, energy is conserved with no external input or loss.',
    //             },
    //         ],
    //     },
    // ];

    // const lesson = study?.content || mockLesson;

    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    const [highlighted, setHighlighted] = useState<Record<string, boolean>>({});
    const [selectedText, setSelectedText] = useState('');
    const [selectionRange, setSelectionRange] = useState<Range | null>(null);
    const [showToolbar, setShowToolbar] = useState(false);
    const [toolbarPos, setToolbarPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    useEffect(() => {
        const stored = localStorage.getItem('lesson-highlights');
        if (stored) setHighlighted(JSON.parse(stored));
    }, []);

    useEffect(() => {
        const handleMouseUp = () => {
            const selection = window.getSelection();
            if (selection && selection.toString().length > 0) {
                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();
                setSelectedText(selection.toString());
                setSelectionRange(range);
                setToolbarPos({ x: rect.left + window.scrollX, y: rect.top + window.scrollY - 40 });
                setShowToolbar(true);
            } else {
                setShowToolbar(false);
            }
        };

        document.addEventListener('mouseup', handleMouseUp);
        return () => document.removeEventListener('mouseup', handleMouseUp);
    }, []);

    const toggleExpand = (key: string) => {
        setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const toggleHighlight = (key: string) => {
        setHighlighted((prev) => {
            const updated = { ...prev, [key]: !prev[key] };
            localStorage.setItem('lesson-highlights', JSON.stringify(updated));
            return updated;
        });
    };

    const applyStyle = (style: string) => {
        if (!selectionRange) return;

        const isDarkMode = document.documentElement.classList.contains("dark");
        const span = document.createElement("span");
        span.dataset.style = style;

        switch (style) {
            case "bold":
                span.style.fontWeight = "bold";
                break;
            case "italic":
                span.style.fontStyle = "italic";
                break;
            case "larger":
                span.style.fontSize = "1.25rem";
                break;
            case "smaller":
                span.style.fontSize = "0.75rem";
                break;
            case "normal":
                break;

            case "highlight-yellow":
                span.style.backgroundColor = isDarkMode ? "#78350f" : "#fef9c3"; // deep brown vs light pastel yellow
                span.style.color = isDarkMode ? "#fef9c3" : "#78350f";
                break;
            case "highlight-green":
                span.style.backgroundColor = isDarkMode ? "#14532d" : "#d1fae5"; // deep forest vs mint green
                span.style.color = isDarkMode ? "#bbf7d0" : "#064e3b";
                break;
            case "highlight-red":
                span.style.backgroundColor = isDarkMode ? "#7f1d1d" : "#fee2e2"; // deep maroon vs soft pink
                span.style.color = isDarkMode ? "#fecaca" : "#7f1d1d";
                break;
            case "highlight-blue":
                span.style.backgroundColor = isDarkMode ? "#1e3a8a" : "#dbeafe"; // navy vs sky blue
                span.style.color = isDarkMode ? "#bfdbfe" : "#1e3a8a";
                break;

            case "remove":
                if (selectionRange) {
                    const parent = selectionRange.commonAncestorContainer.parentNode;
                    if (parent instanceof HTMLSpanElement) {
                        const text = parent.textContent || "";
                        parent.replaceWith(text);
                        setShowToolbar(false);
                        return;
                    }
                }
                break;
        }

        span.textContent = selectedText;
        selectionRange.deleteContents();
        selectionRange.insertNode(span);
        setShowToolbar(false);
    };


    return (
        <div className="max-w-4xl mx-auto px-6 py-12 space-y-12 text-neutral-800 dark:text-neutral-200 overflow-auto">
            <h1 className="text-4xl font-bold text-neutral-800 dark:text-neutral-100">📘 Lesson Summary</h1>
            <p className="text-neutral-600 dark:text-neutral-400 text-lg border-b border-neutral-800 pb-4">
                A line-by-line walkthrough of the lesson with clear and elegant explanations.
            </p>

            {showToolbar && (
                <div
                    className="fixed z-50 flex flex-wrap gap-2 dark:bg-neutral-800 bg-neutral-200 dark:text-white text-black p-3 rounded-md shadow-lg border border-neutral-600"
                    style={{ top: `${toolbarPos.y}px`, left: `${toolbarPos.x}px` }}
                >
                    <button onClick={() => applyStyle('bold')} className="px-2 py-1 rounded hover:bg-neutral-700">B</button>
                    <button onClick={() => applyStyle('italic')} className="px-2 py-1 rounded hover:bg-neutral-700">I</button>
                    <button onClick={() => applyStyle('larger')} className="px-2 py-1 rounded hover:bg-neutral-700">A+</button>
                    <button onClick={() => applyStyle('smaller')} className="px-2 py-1 rounded hover:bg-neutral-700">A-</button>
                    <button onClick={() => applyStyle('normal')} className="px-2 py-1 rounded hover:bg-neutral-700">Normal</button>
                    <button onClick={() => applyStyle('highlight-yellow')} className="bg-yellow-400 w-5 h-5 rounded"></button>
                    <button onClick={() => applyStyle('highlight-green')} className="bg-green-400 w-5 h-5 rounded"></button>
                    <button onClick={() => applyStyle('highlight-red')} className="bg-red-400 w-5 h-5 rounded"></button>
                    <button onClick={() => applyStyle('highlight-blue')} className="bg-blue-400 w-5 h-5 rounded"></button>
                    <button onClick={() => applyStyle('remove')} className="text-xs text-red-400 underline">Remove</button>
                </div>
            )}

            {study.map((section: any, index: number) => (
                <div key={index} className="space-y-4">
                    <h2 className="text-2xl font-semibold dark:text-neutral-100 text-neutral-800 border-l-4  border-blue-500 pl-5">
                        {section.title}
                    </h2>
                    <div className="space-y-4 pl-8 mt-2">
                        {section.lines.map((line: any, idx: number) => {
                            const lineKey = `${index}-${idx}`;
                            return (
                                <div
                                    key={idx}
                                    className={`rounded-lg px-6 py-4 text-base leading-relaxed shadow-md font-semibold dark:font-semibold transition-colors duration-200 ${highlighted[lineKey] ? 'dark:bg-green-950 bg-green-700 text-white' : 'dark:bg-neutral-800 bg-neutral-300 text-neutral-800 dark:text-neutral-200'
                                        }`}
                                >
                                    <div className="flex justify-between items-start gap-6">
                                        <div className="flex-1">
                                            <span className="dark:text-blue-400 text-blue-600 font-mono mr-2">{idx + 1}.</span>
                                            <span>{line.text}</span>
                                        </div>
                                        <div className="flex flex-col items-end space-y-1">
                                            <button
                                                onClick={() => toggleExpand(lineKey)}
                                                className="text-sm dark:text-blue-300 text-blue-500 hover:text-neutral-600 transition-colors"
                                            >
                                                {expanded[lineKey] ? 'Hide' : 'Explain'}
                                            </button>
                                            <button
                                                onClick={() => toggleHighlight(lineKey)}
                                                className="text-sm dark:text-green-600 text-green-600 hover:text-green-700"
                                            >
                                                {highlighted[lineKey] ? 'UnMark' : 'Mark'}
                                            </button>
                                        </div>
                                    </div>
                                    {expanded[lineKey] && (
                                        <p className="mt-3 dark:text-neutral-300 text-neutral-800 text-base border-t border-neutral-700 pt-3">
                                            {line.explanation}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
