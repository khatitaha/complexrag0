// components/NavbarLayout.tsx
'use client';

import { CircleUserRound } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import {
    FiBook,
    FiHome,
    FiUser,
    FiClock,
    FiMenu,
    FiX,
} from 'react-icons/fi';
import { LiaUniversitySolid } from "react-icons/lia";

export default function NavbarLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="flex h-screen w-screen overflow-hidden">
            {/* Sidebar */}
            <div
                className={`bg-neutral-800 text-white transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-0'
                    } overflow-hidden`}
            >
                <div className="p-4 space-y-4">
                    <h1 className="text-2xl font-bold">Study Hub</h1>
                    <Link href="/home" className="flex items-center gap-2 p-2 rounded hover:bg-neutral-700">
                        <FiHome /> <span>Home</span>
                    </Link>
                    <Link href="/lessons" className="flex items-center gap-2 p-2 rounded hover:bg-neutral-700">
                        <FiBook /> <span>My Lessons</span>
                    </Link>
                    <Link href="/exams" className="flex items-center gap-2 p-2 rounded hover:bg-neutral-700">
                        <LiaUniversitySolid /> <span>Exams</span>
                    </Link>
                    <Link href="/profile" className="flex items-center gap-2 p-2 rounded hover:bg-neutral-700">
                        <FiUser /> <span>Profile</span>
                    </Link>
                    <div className="border-t pt-4">
                        <div className="flex items-center gap-2 text-sm">
                            <FiClock /> Recent Lessons
                        </div>
                    </div>
                </div>
            </div>

            {/* Main area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Topbar */}
                <div className="h-12 bg-neutral-900 text-white flex items-center justify-between px-4 shadow">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="text-white p-2 rounded hover:bg-neutral-700 transition"
                    >
                        {isSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
                    </button>
                    <Link href={'/profile'}><CircleUserRound /></Link>
                </div>

                {/* Page Content */}
                <div className="flex-1 overflow-auto">{children}</div>
            </div>
        </div>
    );
}
