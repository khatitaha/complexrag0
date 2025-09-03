import { useEffect, useState } from 'react';
import { FiChevronDown, FiChevronUp, FiBookmark, FiType, FiBold, FiItalic, FiMinus, FiPlus, FiRotateCcw, FiX, FiEdit3, FiMessageSquare } from 'react-icons/fi';

export default function Summary({ study }: { study: any }) {
    
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
        <div className="max-w-5xl mx-auto px-6 py-8 space-y-8 overflow-auto">
            {/* Header Section */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full px-4 py-2 border border-blue-500/20 mb-6">
                    <FiType className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">Lesson Summary</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 dark:from-white dark:via-neutral-100 dark:to-white bg-clip-text text-transparent mb-4">
                    📘 Interactive Summary
                </h1>

                <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
                    Explore your lesson line by line with detailed explanations, highlighting tools, and interactive features.
                </p>
            </div>

            {/* Enhanced Toolbar */}
            {showToolbar && (
                <div
                    className="fixed z-50 bg-white/95 dark:bg-neutral-800/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-700 p-4 animate-in fade-in-0 zoom-in-95 duration-200"
                    style={{ top: `${toolbarPos.y}px`, left: `${toolbarPos.x}px` }}
                >
                    <div className="flex items-center gap-1 mb-3">
                        <FiEdit3 className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                        <span className="text-sm font-medium text-neutral-900 dark:text-white">Text Tools</span>
                    </div>

                    <div className="grid grid-cols-5 gap-2 mb-3">
                        <button
                            onClick={() => applyStyle('bold')}
                            className="flex items-center justify-center w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-700 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                            title="Bold"
                        >
                            <FiBold className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                        </button>
                        <button
                            onClick={() => applyStyle('italic')}
                            className="flex items-center justify-center w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-700 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                            title="Italic"
                        >
                            <FiItalic className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                        </button>
                        <button
                            onClick={() => applyStyle('larger')}
                            className="flex items-center justify-center w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-700 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                            title="Larger Text"
                        >
                            <FiPlus className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                        </button>
                        <button
                            onClick={() => applyStyle('smaller')}
                            className="flex items-center justify-center w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-700 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                            title="Smaller Text"
                        >
                            <FiMinus className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                        </button>
                        <button
                            onClick={() => applyStyle('normal')}
                            className="flex items-center justify-center w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-700 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                            title="Normal Text"
                        >
                            <FiRotateCcw className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                        </button>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm font-medium text-neutral-900 dark:text-white">Highlights:</span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 mb-3">
                        <button
                            onClick={() => applyStyle('highlight-yellow')}
                            className="w-full h-8 rounded-lg bg-gradient-to-r from-yellow-200 to-yellow-300 dark:from-yellow-800 dark:to-yellow-700 hover:scale-105 transition-transform"
                            title="Yellow Highlight"
                        />
                        <button
                            onClick={() => applyStyle('highlight-green')}
                            className="w-full h-8 rounded-lg bg-gradient-to-r from-green-200 to-green-300 dark:from-green-800 dark:to-green-700 hover:scale-105 transition-transform"
                            title="Green Highlight"
                        />
                        <button
                            onClick={() => applyStyle('highlight-red')}
                            className="w-full h-8 rounded-lg bg-gradient-to-r from-red-200 to-red-300 dark:from-red-800 dark:to-red-700 hover:scale-105 transition-transform"
                            title="Red Highlight"
                        />
                        <button
                            onClick={() => applyStyle('highlight-blue')}
                            className="w-full h-8 rounded-lg bg-gradient-to-r from-blue-200 to-blue-300 dark:from-blue-800 dark:to-blue-700 hover:scale-105 transition-transform"
                            title="Blue Highlight"
                        />
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => applyStyle('remove')}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors text-sm font-medium"
                        >
                            <FiX className="w-4 h-4" />
                            Remove
                        </button>

                        <button
                            onClick={async () => {
                                if ((window as any).handleSelectedText) {
                                    (window as any).handleSelectedText(selectedText);

                                    // Also copy to clipboard
                                    try {
                                        await navigator.clipboard.writeText(selectedText);
                                    } catch (err) {
                                        console.log('Clipboard copy failed, but text was sent to chat');
                                    }

                                    setShowToolbar(false);
                                }
                            }}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-200 hover:scale-105 text-sm font-medium"
                            title="Send to AI chat & copy to clipboard"
                        >
                            <FiMessageSquare className="w-4 h-4" />
                            Ask AI
                        </button>
                    </div>
                </div>
            )}

            {/* Lesson Sections */}
            <div className="space-y-8">
                {study.map((section: any, index: number) => (
                    <div key={index} className="space-y-6">
                        {/* Section Header */}
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-lg">{index + 1}</span>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">
                                    {section.title}
                                </h2>
                                <div className="w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                            </div>
                        </div>

                        {/* Lesson Lines */}
                        <div className="space-y-4 ml-16">
                            {section.lines.map((line: any, idx: number) => {
                                const lineKey = `${index}-${idx}`;
                                return (
                                    <div
                                        key={idx}
                                        className={`group relative rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 ${
                                            highlighted[lineKey]
                                                ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-300 dark:border-green-700'
                                                : 'bg-white/90 dark:bg-neutral-800/90 border-neutral-200 dark:border-neutral-700 hover:border-blue-300 dark:hover:border-blue-600'
                                        }`}
                                    >
                                        {/* Line Number Badge */}
                                        <div className="absolute -left-4 top-6 w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                                            <span className="text-white font-bold text-sm">{idx + 1}</span>
                                        </div>

                                        {/* Content */}
                                        <div className="flex justify-between items-start gap-6">
                                            <div className="flex-1">
                                                <p className={`text-lg leading-relaxed ${
                                                    highlighted[lineKey]
                                                        ? 'text-green-900 dark:text-green-100'
                                                        : 'text-neutral-800 dark:text-neutral-200'
                                                }`}>
                                                    {line.text}
                                                </p>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                <button
                                                    onClick={() => toggleExpand(lineKey)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
                                                >
                                                    {expanded[lineKey] ? (
                                                        <>
                                                            <FiChevronUp className="w-4 h-4" />
                                                            <span className="text-sm font-medium">Hide</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FiChevronDown className="w-4 h-4" />
                                                            <span className="text-sm font-medium">Explain</span>
                                                        </>
                                                    )}
                                                </button>

                                                <button
                                                    onClick={() => toggleHighlight(lineKey)}
                                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg ${
                                                        highlighted[lineKey]
                                                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                                                            : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-green-100 dark:hover:bg-green-900/20'
                                                    }`}
                                                >
                                                    {highlighted[lineKey] ? (
                                                        <>
                                                            <FiBookmark className="w-4 h-4" />
                                                            <span className="text-sm font-medium">Marked</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FiBookmark className="w-4 h-4" />
                                                            <span className="text-sm font-medium">Mark</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Expanded Explanation */}
                                        {expanded[lineKey] && (
                                            <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700">
                                                <div className="flex items-start gap-3">
                                                    <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                                        <span className="text-white text-xs font-bold">💡</span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                                                            Explanation
                                                        </h4>
                                                        <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                                                            {line.explanation}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Instructions */}
            <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                        <FiType className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                            How to Use This Summary
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-neutral-700 dark:text-neutral-300">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                <span>Select text to see formatting tools</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                <span>Click "Explain" for detailed breakdowns</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                <span>Use "Mark" to highlight important lines</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                                <span>Highlights are saved automatically</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
