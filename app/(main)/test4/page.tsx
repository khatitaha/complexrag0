'use client';

import React, { useState, useCallback, useEffect } from 'react';

type Props = {}

const Page = (props: Props) => {
    // Main layout: Screen 1 container and Screen 3
    const [mainLeftWidth, setMainLeftWidth] = useState(60); // Screen 1 container width
    const [isDraggingMain, setIsDraggingMain] = useState(false);

    // Nested layout inside Screen 1: Screen 1 and Screen 2
    const [nestedLeftWidth, setNestedLeftWidth] = useState(50); // Screen 1 width within its container
    const [isDraggingNested, setIsDraggingNested] = useState(false);

    // Screen visibility states
    const [showScreen1, setShowScreen1] = useState(true);
    const [showScreen2, setShowScreen2] = useState(true);
    const [showScreen3, setShowScreen3] = useState(true);

    // Minimum width threshold (in percentage)
    const MIN_WIDTH_THRESHOLD = 8;

    const handleMouseDown = useCallback((e: React.MouseEvent, resizer: 'main' | 'nested') => {
        e.preventDefault();
        if (resizer === 'main') {
            setIsDraggingMain(true);
        } else {
            setIsDraggingNested(true);
        }
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (isDraggingMain) {
            // Main resizer: between Screen 1 container and Screen 3
            const containerWidth = window.innerWidth;
            const mousePercentage = (e.clientX / containerWidth) * 100;
            const newMainLeftWidth = Math.max(5, Math.min(85, mousePercentage));
            setMainLeftWidth(newMainLeftWidth);

            // Auto-close Screen 3 if it gets too small
            if ((100 - newMainLeftWidth) < MIN_WIDTH_THRESHOLD && showScreen3) {
                setShowScreen3(false);
            }
            // Auto-close Screen 1 container if it gets too small (this would close both Screen 1 and 2)
            if (newMainLeftWidth < MIN_WIDTH_THRESHOLD && (showScreen1 || showScreen2)) {
                setShowScreen1(false);
                setShowScreen2(false);
            }
        } else if (isDraggingNested) {
            // Nested resizer: between Screen 1 and Screen 2 within the left container
            const leftContainer = document.querySelector('[data-container="left"]') as HTMLElement;
            if (leftContainer) {
                const containerRect = leftContainer.getBoundingClientRect();
                const relativeX = e.clientX - containerRect.left;
                const mousePercentage = (relativeX / containerRect.width) * 100;
                const newNestedLeftWidth = Math.max(5, Math.min(85, mousePercentage));
                setNestedLeftWidth(newNestedLeftWidth);

                // Auto-close Screen 1 if it gets too small
                if (newNestedLeftWidth < MIN_WIDTH_THRESHOLD && showScreen1) {
                    setShowScreen1(false);
                }
                // Auto-close Screen 2 if it gets too small
                if ((100 - newNestedLeftWidth) < MIN_WIDTH_THRESHOLD && showScreen2) {
                    setShowScreen2(false);
                }
            }
        }
    }, [isDraggingMain, isDraggingNested, showScreen1, showScreen2, showScreen3]);

    const handleMouseUp = useCallback(() => {
        setIsDraggingMain(false);
        setIsDraggingNested(false);
    }, []);

    useEffect(() => {
        if (isDraggingMain || isDraggingNested) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';

            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
            };
        }
    }, [isDraggingMain, isDraggingNested, handleMouseMove, handleMouseUp]);

    // Calculate actual widths for main layout
    const getMainWidths = () => {
        const leftContainerVisible = showScreen1 || showScreen2;
        if (!leftContainerVisible && !showScreen3) return { left: 0, right: 0 };
        if (!leftContainerVisible) return { left: 0, right: 100 };
        if (!showScreen3) return { left: 100, right: 0 };
        return { left: mainLeftWidth, right: 100 - mainLeftWidth };
    };

    // Calculate actual widths for nested layout
    const getNestedWidths = () => {
        if (!showScreen1 && !showScreen2) return { left: 0, right: 0 };
        if (!showScreen1) return { left: 0, right: 100 };
        if (!showScreen2) return { left: 100, right: 0 };
        return { left: nestedLeftWidth, right: 100 - nestedLeftWidth };
    };

    const mainWidths = getMainWidths();
    const nestedWidths = getNestedWidths();
    const leftContainerVisible = showScreen1 || showScreen2;

    return (
        <div className="bg-neutral-800 flex h-screen relative">
            {/* Control Panel */}
            <div className="absolute top-4 right-4 z-50 bg-neutral-900 p-3 rounded-lg shadow-lg">
                <div className="text-white text-sm font-semibold mb-2 text-center">Screen Controls</div>
                <div className="flex flex-col space-y-2">
                    <button
                        onClick={() => setShowScreen1(!showScreen1)}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${showScreen1
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-neutral-700 hover:bg-neutral-600 text-gray-300'
                            }`}
                    >
                        Screen 1 {showScreen1 ? '✓' : '✗'}
                    </button>
                    <button
                        onClick={() => setShowScreen2(!showScreen2)}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${showScreen2
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-neutral-700 hover:bg-neutral-600 text-gray-300'
                            }`}
                    >
                        Screen 2 {showScreen2 ? '✓' : '✗'}
                    </button>
                    <button
                        onClick={() => setShowScreen3(!showScreen3)}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${showScreen3
                            ? 'bg-red-600 hover:bg-red-700 text-white'
                            : 'bg-neutral-700 hover:bg-neutral-600 text-gray-300'
                            }`}
                    >
                        Screen 3 {showScreen3 ? '✓' : '✗'}
                    </button>
                </div>
                <div className="text-xs text-gray-400 mt-2 text-center">
                    Auto-close at {MIN_WIDTH_THRESHOLD}% width
                </div>
            </div>
            {/* Screen 3 (Left Panel - Primary) */}
            {showScreen3 && (
                <div
                    className="bg-red-950 flex items-center justify-center text-white text-2xl font-bold"
                    style={{ width: `${mainWidths.left}%` }}
                >
                    Screen 3
                </div>
            )}

            {/* Main Resizer (between Screen 3 and right container) */}
            {leftContainerVisible && showScreen3 && (
                <div
                    onMouseDown={(e) => handleMouseDown(e, 'main')}
                    className={`w-2 cursor-col-resize flex items-center justify-center transition-colors duration-200 ${isDraggingMain
                        ? 'bg-orange-500'
                        : 'bg-neutral-600 hover:bg-orange-400'
                        }`}
                    title="Drag to resize main layout"
                >
                    <div className="flex flex-col space-y-1">
                        <div className="w-1 h-1 bg-white rounded-full opacity-60"></div>
                        <div className="w-1 h-1 bg-white rounded-full opacity-60"></div>
                        <div className="w-1 h-1 bg-white rounded-full opacity-60"></div>
                    </div>
                </div>
            )}

            {/* Right Container (contains Screen 1 and Screen 2) */}
            {leftContainerVisible && (
                <div
                    data-container="left"
                    className="flex relative"
                    style={{ width: `${mainWidths.right}%` }}
                >
                    {/* Screen 1 (nested left) */}
                    {showScreen1 && (
                        <div
                            className="bg-green-950 flex items-center justify-center text-white text-2xl font-bold"
                            style={{ width: `${nestedWidths.left}%` }}
                        >
                            Screen 1
                        </div>
                    )}

                    {/* Nested Resizer (between Screen 1 and Screen 2) */}
                    {showScreen1 && showScreen2 && (
                        <div
                            onMouseDown={(e) => handleMouseDown(e, 'nested')}
                            className={`w-2 cursor-col-resize flex items-center justify-center transition-colors duration-200 ${isDraggingNested
                                ? 'bg-blue-500'
                                : 'bg-neutral-600 hover:bg-blue-400'
                                }`}
                            title="Drag to resize nested screens"
                        >
                            <div className="flex flex-col space-y-1">
                                <div className="w-1 h-1 bg-white rounded-full opacity-60"></div>
                                <div className="w-1 h-1 bg-white rounded-full opacity-60"></div>
                                <div className="w-1 h-1 bg-white rounded-full opacity-60"></div>
                            </div>
                        </div>
                    )}

                    {/* Screen 2 (nested right) */}
                    {showScreen2 && (
                        <div
                            className="bg-blue-950 flex items-center justify-center text-white text-2xl font-bold"
                            style={{ width: `${nestedWidths.right}%` }}
                        >
                            Screen 2
                        </div>
                    )}
                </div>
            )}
        </div>

    );
};

export default Page;