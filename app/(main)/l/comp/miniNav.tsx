// components/MiniNav.tsx
'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FiBookOpen, FiLayers, FiEdit3, FiMap, FiMonitor, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const navItems = [
    { label: 'Summary', icon: <FiBookOpen size={18} />, shortLabel: 'Sum' },
    { label: 'Flashcards', icon: <FiLayers size={18} />, shortLabel: 'Cards' },
    { label: 'Quiz', icon: <FiEdit3 size={18} />, shortLabel: 'Quiz' },
    { label: 'Roadmap', icon: <FiMap size={18} />, shortLabel: 'Map' },
    { label: 'Slides', icon: <FiMonitor size={18} />, shortLabel: 'Slides' },
];

export default function MiniNav({
    selectedSection,
    setSelectedSection,
}: {
    selectedSection: string;
    setSelectedSection: (label: string) => void;
}) {
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [sidebarWidth, setSidebarWidth] = useState(64); // Default sidebar width in pixels

    useEffect(() => {
        const checkScreenSize = () => {
            const width = window.innerWidth;
            setIsMobile(width < 768);
            setIsTablet(width >= 768 && width < 1024);
        };

        const checkSidebar = () => {
            // Check if sidebar exists and get its width
            const sidebar = document.querySelector('[class*="w-64"], [class*="w-0"]');
            if (sidebar) {
                const computedStyle = window.getComputedStyle(sidebar);
                const width = parseInt(computedStyle.width);
                setSidebarWidth(width || 64);
            }
        };

        checkScreenSize();
        checkSidebar();

        window.addEventListener('resize', checkScreenSize);

        // More frequent sidebar checking for better responsiveness
        const intervalId = setInterval(checkSidebar, 100); // Check every 100ms

        // Watch for sidebar changes
        const observer = new MutationObserver(checkSidebar);
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'style']
        });

        return () => {
            window.removeEventListener('resize', checkScreenSize);
            clearInterval(intervalId);
            observer.disconnect();
        };
    }, []);

    const leftOffset = sidebarWidth + 16; // sidebar width + padding

    if (isMobile) {
        return (
            <nav className="fixed top-0 left-10 z-30  ">
                <div className="px-4 py-2">
                    {/* Mobile: Horizontal scrollable nav */}
                    <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                        {navItems.map((item) => (
                            <button
                                key={item.label}
                                onClick={() => setSelectedSection(item.label)}
                                className={`flex items-center gap-1 px-3 py-2 rounded-md transition-colors text-xs font-medium whitespace-nowrap flex-shrink-0 ${
                                    selectedSection === item.label
                                        ? 'bg-neutral-300 text-black dark:bg-neutral-700 dark:text-white shadow-sm'
                                        : 'hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
                                }`}
                            >
                                {item.icon}
                                <span className="hidden sm:inline">{item.shortLabel}</span>
                            </button>
                        ))}
                        <Link
                            href={'/exams'}
                            className="flex items-center gap-1 px-3 py-2 rounded-md transition-colors text-xs font-medium whitespace-nowrap flex-shrink-0 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400"
                        >
                            <FiEdit3 size={16} />
                            <span className="hidden sm:inline">Exams</span>
                        </Link>
                    </div>
                </div>
            </nav>
        );
    }

    if (isTablet) {
        return (
            <nav
                className="fixed top-0 z-30  transition-all duration-100 ease-in-out"
                style={{ left: `${leftOffset}px`, right: '140px' }} // Leave more space for control panel
            >
                <div className="px-3 py-2">
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                        {navItems.map((item) => (
                            <button
                                key={item.label}
                                onClick={() => setSelectedSection(item.label)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm font-medium whitespace-nowrap flex-shrink-0 ${
                                    selectedSection === item.label
                                        ? 'bg-neutral-300 text-black dark:bg-neutral-700 dark:text-white shadow-sm'
                                        : 'hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
                                }`}
                            >
                                {item.icon}
                                <span>{item.shortLabel}</span>
                            </button>
                        ))}
                        <Link
                            href={'/exams'}
                            className="flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm font-medium whitespace-nowrap flex-shrink-0 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400"
                        >
                            <FiEdit3 size={18} />
                            <span>Exams</span>
                        </Link>
                    </div>
                </div>
            </nav>
        );
    }

    // Desktop: Original horizontal layout but responsive
    return (
        <nav
            className="fixed top-0 z-30  transition-all duration-100 ease-in-out"
            style={{ left: `${leftOffset}px`, right: '140px' }} // Leave space for control panel
        >
            <div className="px-4 py-2">
                <div className="flex gap-3">
                    {navItems.map((item) => (
                        <button
                            key={item.label}
                            onClick={() => setSelectedSection(item.label)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors text-sm font-medium ${
                                selectedSection === item.label
                                    ? 'bg-neutral-300 text-black dark:bg-neutral-700 dark:text-white shadow-sm'
                                    : 'hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
                            }`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </button>
                    ))}
                    <Link
                        href={'/exams'}
                        className="flex items-center gap-2 px-4 py-2 rounded-md transition-colors text-sm font-medium hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400"
                    >
                        <FiEdit3 size={18} />
                        <span>Create Exams</span>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
