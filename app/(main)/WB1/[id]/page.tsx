'use client';

import { useState } from 'react';
import Quiz from '../comp/sections/quiz';
import Flashcards from '../comp/sections/Flashcards';
import MiniNav from '../comp/miniNav';
import Summary from '../comp/sections/summury';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import PdfViewer from '../comp/pdfViwer';

export default function LessonPage({ params }: { params: { id: string } }) {
    const [selectedSection, setSelectedSection] = useState('Summary');
    const [showDoc, setShowDoc] = useState(true);
    const [docWidth, setDocWidth] = useState(380);

    const renderSection = () => {
        switch (selectedSection) {
            case 'Summary':
                return <Summary study={'sasas'} />;
            case 'Flashcards':
                return <Flashcards />;
            case 'Quiz':
                return <Quiz />;
            default:
                return null;
        }
    };

    return (
        <div className="flex h-screen w-full relative text-white bg-neutral-900">
            {/* Main Content */}
            <div className="flex flex-col flex-1 relative">
                <MiniNav
                    selectedSection={selectedSection}
                    setSelectedSection={setSelectedSection}
                />
                <div className="flex-1 overflow-auto">{renderSection()}</div>
            </div>

            {/* Document Viewer Sidebar */}
            {showDoc && (
                <div
                    className="transition-all duration-300 ease-in-out border-l border-neutral-700 bg-neutral-950 relative flex flex-col"
                    style={{ width: docWidth }}
                >
                    <div className="p-3 border-b border-neutral-800 text-sm text-neutral-300 font-medium">
                        📄 Document Viewer
                    </div>
                    <div className="flex-1 overflow-auto">
                        <PdfViewer url="https://clxsgightqnifyrrmhrd.supabase.co/storage/v1/object/public/docs/uploads/03542d19-2df0-4223-8870-7554366c7739.pdf" />
                    </div>
                    {/* Resize Handle */}
                    <div
                        onMouseDown={(e) => {
                            const startX = e.clientX;
                            const startWidth = docWidth;
                            const onMove = (e: MouseEvent) => {
                                const delta = startX - e.clientX;
                                setDocWidth(Math.min(600, Math.max(250, startWidth + delta)));
                            };
                            const onUp = () => {
                                window.removeEventListener('mousemove', onMove);
                                window.removeEventListener('mouseup', onUp);
                            };
                            window.addEventListener('mousemove', onMove);
                            window.addEventListener('mouseup', onUp);
                        }}
                        className="absolute left-0 top-0 w-1 cursor-col-resize h-full bg-transparent"
                    />
                </div>
            )}

            {/* Toggle Button (Pinned to right edge) */}
            <button
                onClick={() => setShowDoc(!showDoc)}
                className="fixed top-20 right-2 z-50 bg-neutral-800 border border-neutral-600 hover:bg-neutral-700 text-white p-2 rounded-full shadow-md"
                title={showDoc ? 'Hide Document' : 'Show Document'}
            >
                {showDoc ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
            </button>
        </div>
    );
}
