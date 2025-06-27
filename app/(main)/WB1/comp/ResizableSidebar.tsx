'use client';

import React, { useCallback, useEffect, useState } from 'react';

interface ResizableSidebarProps {
    defaultWidth?: number;
    minWidth?: number;
    maxWidth?: number;
    children: React.ReactNode;
    className?: string;
}

export default function ResizableSidebar({
    defaultWidth = 300,
    minWidth = 200,
    maxWidth = 1000,
    children,
    className = '',
}: ResizableSidebarProps) {
    const [width, setWidth] = useState(defaultWidth);
    const [isOpen, setIsOpen] = useState(true);
    const [isDragging, setIsDragging] = useState(false);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging) return;

        // Calculate width from the right edge
        const containerRect = document.documentElement.getBoundingClientRect();
        const newWidth = containerRect.right - e.clientX;
        const clampedWidth = Math.max(minWidth, Math.min(newWidth, maxWidth));

        setWidth(clampedWidth);
    }, [isDragging, minWidth, maxWidth]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        if (isDragging) {
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
    }, [isDragging, handleMouseMove, handleMouseUp]);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    // Handle responsive behavior
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsOpen(false);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!isOpen) {
        return (
            <div className="relative">
                <button
                    onClick={toggleSidebar}
                    className="fixed top-4 right-4 z-30 bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-lg shadow-lg transition-all duration-200 border border-gray-600"
                    title="Open sidebar"
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </button>
                <div style={{ width: 0 }} />
            </div>
        );
    }

    return (
        <div
            className={`relative bg-gray-900 text-white border-l border-gray-700 flex-shrink-0 ${className}`}
            style={{ width: `${width}px` }}
        >
            {/* Resize Handle */}
            <div
                onMouseDown={handleMouseDown}
                className="absolute left-0 top-0 w-1 h-full cursor-col-resize z-20 hover:bg-blue-500 transition-colors duration-200"
                style={{
                    marginLeft: '-2px',
                    backgroundColor: isDragging ? '#3b82f6' : 'transparent',
                }}
                title="Drag to resize"
            />

            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-3 border-b border-gray-700 bg-gray-800">
                <h3 className="text-sm font-medium text-gray-200">Sidebar</h3>
                <button
                    onClick={toggleSidebar}
                    className="p-1 hover:bg-gray-600 rounded transition-colors duration-200"
                    title="Close sidebar"
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M9 18l6-6-6-6" />
                    </svg>
                </button>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto">
                <div className="p-4">
                    {children}
                </div>
            </div>
        </div>
    );
}