"use client"

import { useCallback, useEffect, useState } from "react";
import Slides from '../comp/sections/Slides';
import HorizontalRoadmap from '../comp/sections/HorizontalRoadmap';
import Summary from "../comp/sections/summury";
import Flashcards from "../comp/sections/Flashcards";
import Quiz from "../comp/sections/quiz";
import PdfViewer from "../comp/pdfViwer";
import MiniNav from "../comp/miniNav";
import { CircleUserRound, Menu, Eye, EyeOff, MessageSquare, FileText, Maximize2, Minimize2, Monitor, Settings } from "lucide-react";
import ImprovedChatUI from "../chat/chat_client";
import { RagMessage } from "../actions";
import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { FiMenu, FiX } from "react-icons/fi";


export default function LessonPage({ result, initialChat }: { result: any, initialChat: RagMessage[] }) {
    const { lesson = [], flashcards = [], quiz = [], title, id, file_id, user_id } = result || {};
    console.log("result", result);
    console.log("lesson", lesson);
    console.log("flashcards", flashcards);
    console.log("quiz", quiz);
    console.log("the id ", id)


    if (!lesson || !flashcards || !quiz) {
        return <div>
            <h1>Lessons</h1>
            {lesson.length === 0 ? (
                <p>No lessons available</p>
            ) : (
                lesson.map((l: any, i: number) => <div key={i}>{l.title}</div>)
            )}
        </div>
    }



    const [isSidebarOpen, setIsSidebarOpen] = useState(true);






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
                return <Summary study={lesson} />;
            case "Flashcards":
                return <Flashcards cards={flashcards} lessonId={id} />;
            case "Quiz":
                return <Quiz quiz={quiz} />;
            case "Slides":
                return <Slides slides={result.slides || []} lessonId={id} />;
            case "Roadmap":
                return <HorizontalRoadmap roadmap={result.roadmap || []} />;
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

    const lessonType = file_id ? 'file' : 'url';
    const ragId = file_id || id;

    return (
        <div className="flex dark:bg-neutral-800 bg-white relative h-screen pt-12">




            {/* Toggle Button for Control Panel */}
            {!showControlPanel && (
                <button
                    onClick={() => setShowControlPanel(true)}
                    className="fixed top-1 right-14 z-50 bg-gradient-to-r from-green-500/80 to-cyan-500/80 hover:from-green-600/90 hover:to-cyan-600/90 text-white p-3 rounded-xl shadow-lg transition-all duration-200 hover:scale-105 border border-green-400/30"
                    title="Show Screen Controls"
                >
                    <div className="flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        <span className="text-sm font-medium hidden sm:inline">Controls</span>
                    </div>
                </button>
            )}

            {/* Draggable Control Panel */}
            {showControlPanel && (
                <div
                    className="fixed z-50 dark:bg-neutral-800 border bg-neutral-200 border-neutral-700 rounded-lg shadow-lg select-none"
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
                        className="flex items-center justify-between p-3 dark:bg-neutral-700 bg-neutral-100 rounded-t-lg cursor-move border-b border-neutral-600"
                    >
                        <div className="flex items-center gap-2 dark:text-white text-black">
                            <Settings className="w-4 h-4" />
                            <span className="text-sm font-semibold">Screen Controls</span>
                        </div>
                        <button
                            onClick={() => setShowControlPanel(false)}
                            className="dark:text-neutral-400 text-neutral-600 hover:text-white transition-colors p-1 rounded hover:bg-neutral-600"
                            title="Hide Control Panel"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Panel Content */}
                    <div className="p-3 space-y-4">
                        {/* Section Visibility Controls */}
                        <div className="space-y-2">
                            <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-2">
                                Panel Visibility
                            </div>

                            {/* Main Content Toggle */}
                            <button
                                onClick={() => setShowMain(!showMain)}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    showMain
                                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                                        : "bg-neutral-700 hover:bg-neutral-600 text-gray-300 hover:text-white"
                                }`}
                                title={showMain ? "Hide main content panel" : "Show main content panel"}
                            >
                                <div className="flex items-center gap-2">
                                    <Monitor className="w-4 h-4" />
                                    <span>Lesson Content</span>
                                </div>
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                                    showMain ? "bg-blue-500" : "bg-neutral-600"
                                }`}>
                                    {showMain ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                </div>
                            </button>

                            {/* Chat Toggle */}
                            <button
                                onClick={() => setShowChat(!showChat)}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    showChat
                                        ? "bg-green-600 hover:bg-green-700 text-white shadow-md"
                                        : "bg-neutral-700 hover:bg-neutral-600 text-gray-300 hover:text-white"
                                }`}
                                title={showChat ? "Hide AI chat assistant" : "Show AI chat assistant"}
                            >
                                <div className="flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4" />
                                    <span>AI Assistant</span>
                                </div>
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                                    showChat ? "bg-green-500" : "bg-neutral-600"
                                }`}>
                                    {showChat ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                </div>
                            </button>
                        </div>

                        {/* Document Controls */}
                        {file_id && showMain && (
                            <div className="pt-3 border-t border-neutral-600 space-y-3">
                                <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                                    Document Viewer
                                </div>

                                {/* Document Toggle */}
                                <button
                                    onClick={() => setShowDocument(!showDocument)}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                        showDocument
                                            ? "bg-purple-600 hover:bg-purple-700 text-white shadow-md"
                                            : "bg-neutral-700 hover:bg-neutral-600 text-gray-300 hover:text-white"
                                    }`}
                                    title={showDocument ? "Hide document viewer" : "Show document viewer"}
                                >
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4" />
                                        <span>Original Document</span>
                                    </div>
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                                        showDocument ? "bg-purple-500" : "bg-neutral-600"
                                    }`}>
                                        {showDocument ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                    </div>
                                </button>

                                {/* Document Size Controls */}
                                {showDocument && (
                                    <div className="space-y-2 pl-2">
                                        <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">Viewer Size:</div>
                                        <div className="grid grid-cols-1 gap-1">
                                            <button
                                                onClick={() => setDocumentSize("half")}
                                                className={`flex items-center justify-between px-2 py-1.5 rounded text-xs transition-all duration-200 ${
                                                    documentSize === "half"
                                                        ? "bg-yellow-600 text-white shadow-sm"
                                                        : "bg-neutral-600 text-neutral-300 hover:bg-neutral-500 hover:text-white"
                                                }`}
                                                title="Show document at 50% width"
                                            >
                                                <span>Compact View</span>
                                                <span className="text-xs opacity-75">50%</span>
                                            </button>
                                            <button
                                                onClick={() => setDocumentSize("large")}
                                                className={`flex items-center justify-between px-2 py-1.5 rounded text-xs transition-all duration-200 ${
                                                    documentSize === "large"
                                                        ? "bg-yellow-600 text-white shadow-sm"
                                                        : "bg-neutral-600 text-neutral-300 hover:bg-neutral-500 hover:text-white"
                                                }`}
                                                title="Show document at 75% width"
                                            >
                                                <span>Wide View</span>
                                                <span className="text-xs opacity-75">75%</span>
                                            </button>
                                            <button
                                                onClick={() => setDocumentSize("full")}
                                                className={`flex items-center justify-between px-2 py-1.5 rounded text-xs transition-all duration-200 ${
                                                    documentSize === "full"
                                                        ? "bg-yellow-600 text-white shadow-sm"
                                                        : "bg-neutral-600 text-neutral-300 hover:bg-neutral-500 hover:text-white"
                                                }`}
                                                title="Show document at full width"
                                            >
                                                <span>Full Screen</span>
                                                <span className="text-xs opacity-75">100%</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Quick Tips */}
                        <div className="pt-3 border-t border-neutral-600">
                            <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-2 uppercase tracking-wide">
                                Pro Tips
                            </div>
                            <div className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1">
                                <div>• Drag panel to reposition</div>
                                <div>• Use resizer to adjust widths</div>
                                <div>• Toggle panels for focus mode</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Section */}
            {showMain && (
                <div
                    className="flex flex-col dark:bg-neutral-950 bg-white border-r border-neutral-700 w-full"
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
                            className="flex flex-col border-r border-neutral-700 h-full"
                            style={{ width: getContentWidth(), minHeight: 0 }}
                        >
                            <div className="flex-1 overflow-y-auto min-h-0">
                                {renderSection()}
                            </div>
                        </div>

                        {/* Document Viewer */}
                        {file_id && showDocument && (
                            <div
                                className="flex flex-col bg-neutral-900"
                                style={{ width: getDocumentWidth() }}
                            >
                                <div className="p-3 border-b border-neutral-700 text-sm text-neutral-300 font-medium bg-neutral-800">
                                    {/* 📄 Document Viewer ({documentSize === "half" ? "50%" : documentSize === "large" ? "75%" : "100%"}) */}
                                </div>
                                <div className="flex-1 overflow-auto">
                                    <PdfViewer url={`https://clxsgightqnifyrrmhrd.supabase.co/storage/v1/object/public/docs/uploads/${file_id}`} />
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
                    className="flex flex-col bg-neutral-800 h-full"
                    style={{ width: showMain ? `${100 - mainWidth}%` : "100%" }}
                >


                    <ImprovedChatUI id={ragId} initialchat={initialChat} />
                </div>
            )}
        </div>
    );
}