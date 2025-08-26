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
    FiUpload,
} from 'react-icons/fi';
import { LiaUniversitySolid } from "react-icons/lia";
import { FaRegFileAlt } from "react-icons/fa";
import { ThemeSwitcher } from '@/components/theme-switcher';
import WebsiteLogo from '@/components/identity/Logo';

export default function NavbarLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="flex h-screen w-screen overflow-hidden print-hidden">

            {/* Sidebar */}
            <div
                className={`dark:bg-neutral-800 bg-neutral-100 dark:text-white transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-0'
                    } overflow-hidden`}
            >
                <div className="p-4 space-y-4  print:hidden pt-12">
                    <WebsiteLogo />
                    <Link href="/home" className="flex items-center gap-2 p-2 rounded hover:bg-neutral-300 dark:hover:bg-neutral-700">
                        <FiHome /> <span>Home</span>
                    </Link>
                    <Link href="/uploadingfile" className="flex items-center gap-2 p-2 rounded hover:bg-neutral-300 dark:hover:bg-neutral-700">
                        <FiUpload /> <span>Upload Lesson</span>
                    </Link>
                    <Link href="/lessons" className="flex items-center gap-2 p-2 rounded hover:bg-neutral-300 dark:hover:bg-neutral-700">
                        <FiBook /> <span>My Lessons</span>
                    </Link>
                    <Link href="/exams" className="flex items-center gap-2 p-2 rounded hover:bg-neutral-300 dark:hover:bg-neutral-700">
                        <LiaUniversitySolid /> <span>Exams</span>
                    </Link>
                    <Link href="/documents" className="flex items-center gap-2 p-2 rounded hover:bg-neutral-300 dark:hover:bg-neutral-700">
                        <FaRegFileAlt /> <span>documents</span>
                    </Link>
                    <Link href="/profile" className="flex items-center gap-2 p-2 rounded hover:bg-neutral-300 dark:hover:bg-neutral-700">
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
            <div className="flex-1 flex flex-col  h-full">
                {/* Topbar */}
                <div className="h-12 dark:bg-transparent  bg-neutral-100 dark:text-white text-black flex items-center justify-between px-4 py-6 shadow print:hidden fixed top-0 left-0 right-0 z-10">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="dark:text-white text-black  p-2 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 transition print-hidden"
                    >
                        {isSidebarOpen ? <FiX size={20} className='print:hidden' /> : <FiMenu size={20} className='print:hidden' />}
                    </button>
                    <div className="flex items-center gap-2 print:hiddenn">
                        <ThemeSwitcher />

                        <Link href={'/profile'}><CircleUserRound className='print:hidden' /></Link>
                    </div>
                </div>

                {/* Page Content */}
                <div className="overflow-y-auto h-screen">{children}</div>
            </div>
        </div>
    );
}
