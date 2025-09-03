'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronRight, FiChevronDown, FiBookOpen, FiTarget, FiCheckCircle, FiCircle, FiMapPin, FiTrendingUp, FiStar } from 'react-icons/fi';

interface Subheadline {
    title: string;
    content: string;
}

interface Headline {
    title: string;
    content: string;
    subheadlines?: Subheadline[];
}

interface Lesson {
    title: string;
    headlines: Headline[];
}

const Node = ({ node, level = 0, index = 0 }: { node: Lesson | Headline | Subheadline, level: number, index?: number }) => {
    const [isOpen, setIsOpen] = useState(level === 0); // Auto-expand top level
    const [isCompleted, setIsCompleted] = useState(false);
    const children = 'headlines' in node ? node.headlines : ('subheadlines' in node ? node.subheadlines : []);

    const onToggle = () => {
        setIsOpen(!isOpen);
    };

    const onComplete = () => {
        setIsCompleted(!isCompleted);
    };

    // Color schemes for different levels
    const getLevelStyles = () => {
        switch (level) {
            case 0: // Main lessons
                return {
                    bg: 'bg-gradient-to-r from-blue-500 to-cyan-500',
                    border: 'border-blue-200 dark:border-blue-800',
                    icon: <FiBookOpen className="w-5 h-5" />,
                    accent: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20'
                };
            case 1: // Headlines
                return {
                    bg: 'bg-gradient-to-r from-green-500 to-emerald-500',
                    border: 'border-green-200 dark:border-green-800',
                    icon: <FiTarget className="w-4 h-4" />,
                    accent: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20'
                };
            case 2: // Subheadlines
                return {
                    bg: 'bg-gradient-to-r from-purple-500 to-pink-500',
                    border: 'border-purple-200 dark:border-purple-800',
                    icon: <FiMapPin className="w-4 h-4" />,
                    accent: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20'
                };
            default:
                return {
                    bg: 'bg-gradient-to-r from-gray-500 to-slate-500',
                    border: 'border-gray-200 dark:border-gray-800',
                    icon: <FiCircle className="w-4 h-4" />,
                    accent: 'from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20'
                };
        }
    };

    const styles = getLevelStyles();

    return (
        <div className={`relative ${level > 0 ? 'ml-6' : ''}`}>
            {/* Connection lines */}
            {level > 0 && (
                <>
                    <div className="absolute -left-6 top-0 h-full w-px bg-gradient-to-b from-neutral-300 to-neutral-200 dark:from-neutral-700 dark:to-neutral-800" />
                    <div className="absolute -left-6 top-8 h-px w-6 bg-gradient-to-r from-neutral-300 to-neutral-200 dark:from-neutral-700 dark:to-neutral-800" />
                </>
            )}

            <motion.div
                className="flex items-start gap-4 my-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
            >
                {/* Status indicator */}
                <div className="flex flex-col items-center gap-2">
                    <motion.button
                        onClick={onComplete}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200 ${
                            isCompleted
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                : 'bg-neutral-300 dark:bg-neutral-600 hover:bg-neutral-400 dark:hover:bg-neutral-500'
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {isCompleted ? <FiCheckCircle className="w-4 h-4" /> : <FiCircle className="w-4 h-4" />}
                    </motion.button>

                    {/* Progress line for children */}
                    {children && children.length > 0 && (
                        <div className="w-px h-8 bg-gradient-to-b from-neutral-300 to-transparent dark:from-neutral-700" />
                    )}
                </div>

                {/* Content card */}
                <motion.div
                    className={`flex-1 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 ${
                        isCompleted
                            ? 'border-green-300 dark:border-green-700 bg-green-50/50 dark:bg-green-900/10'
                            : `border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600`
                    }`}
                    whileHover={{ y: -2 }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg ${styles.bg}`}>
                                {styles.icon}
                            </div>
                            <div>
                                <h3 className={`font-bold text-lg ${
                                    isCompleted
                                        ? 'text-green-900 dark:text-green-100'
                                        : 'text-neutral-900 dark:text-white'
                                }`}>
                                    {node.title}
                                </h3>
                                {level === 0 && (
                                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                                        <FiTrendingUp className="w-3 h-3" />
                                        <span>{children?.length || 0} topics</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Expand/collapse button */}
                        {children && children.length > 0 && (
                            <motion.button
                                onClick={onToggle}
                                className={`p-2 rounded-lg transition-all duration-200 ${
                                    isOpen
                                        ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white'
                                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                                }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {isOpen ? <FiChevronDown className="w-4 h-4" /> : <FiChevronRight className="w-4 h-4" />}
                            </motion.button>
                        )}
                    </div>

                    {/* Content */}
                    {'content' in node && (
                        <p className={`text-sm leading-relaxed mb-4 ${
                            isCompleted
                                ? 'text-green-800 dark:text-green-200'
                                : 'text-neutral-700 dark:text-neutral-300'
                        }`}>
                            {node.content}
                        </p>
                    )}

                    {/* Completion status */}
                    {isCompleted && (
                        <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
                            <FiCheckCircle className="w-4 h-4" />
                            <span>Completed</span>
                        </div>
                    )}
                </motion.div>
            </motion.div>

            {/* Children */}
            <AnimatePresence>
                {isOpen && children && children.length > 0 && (
                    <motion.div
                        className="ml-12"
                        initial={{ opacity: 0, height: 0, y: -10 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        {children.map((child: Headline | Subheadline, childIndex: number) => (
                            <Node
                                key={`${level}-${childIndex}`}
                                node={child}
                                level={level + 1}
                                index={childIndex}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const HorizontalRoadmap = ({ roadmap }: { roadmap: Lesson[] }) => {
    const totalLessons = roadmap.length;
    const totalTopics = roadmap.reduce((acc, lesson) => acc + lesson.headlines.length, 0);
    const totalSubtopics = roadmap.reduce((acc, lesson) =>
        acc + lesson.headlines.reduce((subAcc, headline) => subAcc + (headline.subheadlines?.length || 0), 0), 0
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800 pt-16 px-4">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full px-4 py-2 border border-indigo-500/20 mb-6">
                        <FiMapPin className="w-4 h-4 text-indigo-500" />
                        <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">Learning Path</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 dark:from-white dark:via-neutral-100 dark:to-white bg-clip-text text-transparent mb-4">
                        📚 Lesson Roadmap
                    </h1>

                    <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto mb-8">
                        Your personalized learning journey with structured topics, clear objectives, and progress tracking.
                    </p>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
                        <div className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-xl p-4 border border-neutral-200 dark:border-neutral-700">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                    <FiBookOpen className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-neutral-900 dark:text-white">{totalLessons}</div>
                                    <div className="text-sm text-neutral-600 dark:text-neutral-400">Lessons</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-xl p-4 border border-neutral-200 dark:border-neutral-700">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                    <FiTarget className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-neutral-900 dark:text-white">{totalTopics}</div>
                                    <div className="text-sm text-neutral-600 dark:text-neutral-400">Topics</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-xl p-4 border border-neutral-200 dark:border-neutral-700">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                    <FiMapPin className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-neutral-900 dark:text-white">{totalSubtopics}</div>
                                    <div className="text-sm text-neutral-600 dark:text-neutral-400">Subtopics</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Roadmap Content */}
                <div className="space-y-8">
                    {roadmap.map((lesson, i) => (
                        <Node
                            key={`lesson-${i}`}
                            node={lesson}
                            level={0}
                            index={i}
                        />
                    ))}
                </div>

                {/* Progress Summary */}
                <div className=' h-20'></div>
            </div>
        </div>
    );
};

export default HorizontalRoadmap;
