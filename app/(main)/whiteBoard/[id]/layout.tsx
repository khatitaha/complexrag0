"use client"

import React from 'react'
import { FiBook, FiFileText, FiClipboard, FiAward } from 'react-icons/fi'
import { useParams, usePathname } from 'next/navigation'
import Link from 'next/link'

const tabs = [
    { id: 'summary', label: 'Summary', icon: FiFileText, path: '' },
    { id: 'flashcards', label: 'Flashcards', icon: FiBook, path: '/flashcards' },
    { id: 'exercises', label: 'Exercises', icon: FiClipboard, path: '/exercises' },
    { id: 'exam', label: 'Final Exam', icon: FiAward, path: '/exam' },
]

export default function WhiteBoardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const params = useParams()
    const pathname = usePathname()
    const basePath = `/whiteBoard/${params.id}`

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation Bar */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex space-x-8">
                            {tabs.map((tab) => {
                                const Icon = tab.icon
                                const isActive = pathname === `${basePath}${tab.path}`
                                return (
                                    <Link
                                        key={tab.id}
                                        href={`${basePath}${tab.path}`}
                                        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5 mr-2" />
                                        {tab.label}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Content Area */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    )
} 