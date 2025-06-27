// components/MiniNav.tsx
'use client';
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
        <nav className="flex ml-5 space-x-4 py-2">
            {navItems.map((item) => (
                <button
                    key={item.label}
                    onClick={() => setSelectedSection(item.label)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm font-medium capitalize ${selectedSection === item.label
                        ? 'bg-neutral-700 text-white'
                        : 'hover:bg-neutral-700 text-neutral-300'
                        }`}
                >
                    {item.icon}
                    <span>{item.label}</span>
                </button>
            ))}
        </nav>
    );
}
