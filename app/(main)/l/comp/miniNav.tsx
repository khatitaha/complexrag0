// components/MiniNav.tsx
'use client';
import Link from 'next/link';
import { useState } from 'react';
import { FiBookOpen, FiLayers, FiEdit3 } from 'react-icons/fi';

const navItems = [
    { label: 'Summary', icon: <FiBookOpen size={18} /> },
    { label: 'Flashcards', icon: <FiLayers size={18} /> },
    { label: 'Quiz', icon: <FiEdit3 size={18} /> },
];

export default function MiniNav({
    selectedSection,
    setSelectedSection,
}: {
    selectedSection: string;
    setSelectedSection: (label: string) => void;
}) {
    return (
        <nav className="flex space-x-4 py-2  bg-transparent px-5 fixed top-0  left-20 z-10  ">
            {navItems.map((item) => (
                <button
                    key={item.label}
                    onClick={() => setSelectedSection(item.label)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm font-medium capitalize ${selectedSection === item.label
                        ? 'bg-neutral-300 text-black dark:bg-neutral-700 dark:text-white'
                        : 'hover:bg-neutral-300 text-neutral-600 dark:hover:bg-neutral-700 dark:hover:text-white'
                        }`}
                >
                    {item.icon}
                    <span>{item.label}</span>
                </button>
            ))}
            <Link href={'/exams'} className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm font-medium capitalize 
                
                 hover:bg-neutral-300 dark:text-neutral-400 text-neutral-600 dark:hover:bg-neutral-700 dark:hover:text-white shadow-sm shadow-neutral-600 '
                }`}>create Exams</Link>
        </nav>
    );
}
