"use client"

import { useCallback, useEffect, useState } from "react";
import Summary from "../comp/sections/summury";
import Flashcards from "../comp/sections/Flashcards";
import Quiz from "../comp/sections/quiz";
import PdfViewer from "../comp/pdfViwer";
import MiniNav from "../comp/miniNav";
import { Menu } from "lucide-react";
import ImprovedChatUI from "../chat/[id]/chat_client";


export default function LessonPage() {
    // Track which sections are visible
    const [showMain, setShowMain] = useState(true);
    const [showChat, setShowChat] = useState(true);

    // Document viewer state within main section
    const [showDocument, setShowDocument] = useState(false);
    const [documentSize, setDocumentSize] = useState("half"); // "half", "large", "full"

    // Width percentage for main section (chat takes the rest)
    const [mainWidth, setMainWidth] = useState(60);

    // Dragging state for resize
    const [isDragging, setIsDragging] = useState(false);

    // Control panel state
    const [showControlPanel, setShowControlPanel] = useState(true);
    const [controlPanelPosition, setControlPanelPosition] = useState({ x: 80, y: 5 });
    const [isDraggingPanel, setIsDraggingPanel] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    // Selected section for main area
    const [selectedSection, setSelectedSection] = useState("Summary");

    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            const panelWidth = 200;
            const panelHeight = 300;

            const currentXpx = (controlPanelPosition.x / 100) * window.innerWidth;
            const currentYpx = (controlPanelPosition.y / 100) * window.innerHeight;

            const maxX = window.innerWidth - panelWidth;
            const maxY = window.innerHeight - panelHeight;

            const clampedXpx = Math.max(0, Math.min(maxX, currentXpx));
            const clampedYpx = Math.max(0, Math.min(maxY, currentYpx));

            setControlPanelPosition({
                x: (clampedXpx / window.innerWidth) * 100,
                y: (clampedYpx / window.innerHeight) * 100
            });
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [controlPanelPosition]);


    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (isDragging) {
            const containerWidth = window.innerWidth;
            const mousePercentage = (e.clientX / containerWidth) * 100;
            const newMainWidth = Math.max(20, Math.min(80, mousePercentage));
            setMainWidth(newMainWidth);
        }

        if (isDraggingPanel) {
            const newXpx = e.clientX - dragOffset.x;
            const newYpx = e.clientY - dragOffset.y;

            const panelWidth = 200;
            const panelHeight = 300;
            const maxX = window.innerWidth - panelWidth;
            const maxY = window.innerHeight - panelHeight;

            const clampedXpx = Math.max(0, Math.min(maxX, newXpx));
            const clampedYpx = Math.max(0, Math.min(maxY, newYpx));

            setControlPanelPosition({
                x: (clampedXpx / window.innerWidth) * 100,
                y: (clampedYpx / window.innerHeight) * 100,
            });
        }

    }, [isDragging, isDraggingPanel, dragOffset]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        setIsDraggingPanel(false);
    }, []);

    const handlePanelMouseDown = useCallback((e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
        setIsDraggingPanel(true);
        e.preventDefault();
    }, []);

    useEffect(() => {
        if (isDragging || isDraggingPanel) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);

            if (isDragging) {
                document.body.style.cursor = "col-resize";
            } else if (isDraggingPanel) {
                document.body.style.cursor = "move";
            }

            document.body.style.userSelect = "none";

            return () => {
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
                document.body.style.cursor = "";
                document.body.style.userSelect = "";
            };
        }
    }, [isDragging, isDraggingPanel, handleMouseMove, handleMouseUp]);

    const renderSection = () => {
        switch (selectedSection) {
            case "Summary":
                return <Summary study="sasas" />;
            case "Flashcards":
                return <Flashcards />;
            case "Quiz":
                return <Quiz />;
            default:
                return null;
        }
    };

    const getDocumentWidth = () => {
        switch (documentSize) {
            case "half":
                return "50%";
            case "large":
                return "75%";
            case "full":
                return "100%";
            default:
                return "50%";
        }
    };

    const getContentWidth = () => {
        if (!showDocument) return "100%";
        switch (documentSize) {
            case "half":
                return "50%";
            case "large":
                return "25%";
            case "full":
                return "0%";
            default:
                return "50%";
        }
    };

    return (
        <div className="flex h-full bg-neutral-900 relative">
            {/* Toggle Button for Control Panel */}
            {!showControlPanel && (
                <button
                    onClick={() => setShowControlPanel(true)}
                    className="fixed top-2 right-20 z-50 bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 p-2 rounded-lg shadow-lg transition-colors"
                    title="Show Control Panel"
                >
                    <Menu />
                </button>
            )}

            {/* Draggable Control Panel */}
            {showControlPanel && (
                <div
                    className="fixed z-50 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg select-none"
                    style={{
                        left: hasMounted
                            ? `${(controlPanelPosition.x / 100) * window.innerWidth}px`
                            : undefined,
                        top: hasMounted
                            ? `${(controlPanelPosition.y / 100) * window.innerHeight}px`
                            : undefined,
                        cursor: isDraggingPanel ? "move" : "default",
                    }}


                >
                    {/* Panel Header */}
                    <div
                        onMouseDown={handlePanelMouseDown}
                        className="flex items-center justify-between p-3 bg-neutral-700 rounded-t-lg cursor-move border-b border-neutral-600"
                    >
                        <div className="text-white text-sm font-semibold">Screen Controls</div>
                        <button
                            onClick={() => setShowControlPanel(false)}
                            className="text-neutral-400 hover:text-white transition-colors ml-2"
                            title="Hide Control Panel"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Panel Content */}
                    <div className="p-3">
                        <div className="flex flex-col space-y-2">
                            <button
                                onClick={() => setShowMain(!showMain)}
                                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${showMain
                                    ? "bg-red-600 hover:bg-red-700 text-white"
                                    : "bg-neutral-700 hover:bg-neutral-600 text-gray-300"
                                    }`}
                            >
                                Main {showMain ? "✓" : "✗"}
                            </button>
                            <button
                                onClick={() => setShowChat(!showChat)}
                                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${showChat
                                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                                    : "bg-neutral-700 hover:bg-neutral-600 text-gray-300"
                                    }`}
                            >
                                Chat {showChat ? "✓" : "✗"}
                            </button>
                        </div>

                        {/* Document Controls */}
                        {showMain && (
                            <div className="mt-3 pt-3 border-t border-neutral-600">
                                <div className="text-white text-sm font-semibold mb-2 text-center">Document</div>
                                <div className="flex flex-col space-y-2">
                                    <button
                                        onClick={() => setShowDocument(!showDocument)}
                                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${showDocument
                                            ? "bg-green-600 hover:bg-green-700 text-white"
                                            : "bg-neutral-700 hover:bg-neutral-600 text-gray-300"
                                            }`}
                                    >
                                        {showDocument ? "Hide Doc" : "Show Doc"}
                                    </button>

                                    {showDocument && (
                                        <div className="flex flex-col space-y-1">
                                            <button
                                                onClick={() => setDocumentSize("half")}
                                                className={`px-2 py-1 rounded text-xs transition-colors ${documentSize === "half"
                                                    ? "bg-yellow-600 text-white"
                                                    : "bg-neutral-600 text-neutral-300 hover:bg-neutral-500"
                                                    }`}
                                            >
                                                Half (50%)
                                            </button>
                                            <button
                                                onClick={() => setDocumentSize("large")}
                                                className={`px-2 py-1 rounded text-xs transition-colors ${documentSize === "large"
                                                    ? "bg-yellow-600 text-white"
                                                    : "bg-neutral-600 text-neutral-300 hover:bg-neutral-500"
                                                    }`}
                                            >
                                                Large (75%)
                                            </button>
                                            <button
                                                onClick={() => setDocumentSize("full")}
                                                className={`px-2 py-1 rounded text-xs transition-colors ${documentSize === "full"
                                                    ? "bg-yellow-600 text-white"
                                                    : "bg-neutral-600 text-neutral-300 hover:bg-neutral-500"
                                                    }`}
                                            >
                                                Full (100%)
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Main Section */}
            {showMain && (
                <div
                    className="flex flex-col bg-neutral-950 border-r border-neutral-700"
                    style={{ width: showChat ? `${mainWidth}%` : "100%" }}
                >
                    <MiniNav
                        selectedSection={selectedSection}
                        setSelectedSection={setSelectedSection}
                    />

                    {/* Main Content Area */}
                    <div className="flex-1 flex overflow-hidden">
                        {/* Section Content */}
                        <div
                            className="flex flex-col overflow-auto border-r border-neutral-700"
                            style={{ width: getContentWidth() }}
                        >
                            <div className="flex-1">
                                {renderSection()}
                            </div>
                        </div>

                        {/* Document Viewer */}
                        {showDocument && (
                            <div
                                className="flex flex-col bg-neutral-900"
                                style={{ width: getDocumentWidth() }}
                            >
                                <div className="p-3 border-b border-neutral-700 text-sm text-neutral-300 font-medium bg-neutral-800">
                                    {/* 📄 Document Viewer ({documentSize === "half" ? "50%" : documentSize === "large" ? "75%" : "100%"}) */}
                                </div>
                                <div className="flex-1 overflow-auto">
                                    <PdfViewer url="https://clxsgightqnifyrrmhrd.supabase.co/storage/v1/object/public/docs/uploads/03542d19-2df0-4223-8870-7554366c7739.pdf" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Resizer between Main and Chat */}
            {showMain && showChat && (
                <div
                    onMouseDown={handleMouseDown}
                    className="w-2 cursor-col-resize bg-neutral-600 hover:bg-orange-400 transition-colors flex-shrink-0"
                >
                    <div className="flex flex-col h-full justify-center items-center space-y-1">
                        <div className="w-1 h-1 rounded-full bg-white opacity-60"></div>
                        <div className="w-1 h-1 rounded-full bg-white opacity-60"></div>
                        <div className="w-1 h-1 rounded-full bg-white opacity-60"></div>
                    </div>
                </div>
            )}

            {/* Chat Section */}
            {showChat && (
                <div
                    className="flex flex-col bg-neutral-800"
                    style={{ width: showMain ? `${100 - mainWidth}%` : "100%" }}
                >


                    <ImprovedChatUI />
                </div>
            )}
        </div>
    );
}