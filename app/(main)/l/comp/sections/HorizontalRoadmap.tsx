'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronRight } from 'react-icons/fi';

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

const Node = ({ node, level = 0 }: { node: Lesson | Headline | Subheadline, level: number }) => {
    const [isOpen, setIsOpen] = useState(false);
    const children = 'headlines' in node ? node.headlines : ('subheadlines' in node ? node.subheadlines : []);

    const onToggle = () => {
        setIsOpen(!isOpen);
    }

    return (
        <div className={`relative ${level > 0 ? 'ml-8' : ''}`}>
            {level > 0 && <div className="absolute -left-8 top-0 h-full w-px bg-neutral-300 dark:bg-neutral-700" />}
            {level > 0 && <div className="absolute -left-8 top-1/2 h-px w-8 bg-neutral-300 dark:bg-neutral-700" />}
            <div className="flex items-center my-2">
                <motion.div
                    className="p-3 bg-white dark:bg-neutral-800 rounded-lg shadow-md cursor-pointer flex-grow"
                    onClick={onToggle}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="font-bold flex items-center">
                        <FiChevronRight className={`mr-2 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                        {node.title}
                    </div>
                    {'content' in node && <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 pl-6">{node.content}</p>}
                </motion.div>
            </div>
            <AnimatePresence>
                {isOpen && children && (
                    <motion.div
                        className="pl-8"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        {children.map((child: Headline | Subheadline, index: number) => (
                            <Node key={index} node={child} level={level + 1} />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const HorizontalRoadmap = ({ roadmap }: { roadmap: Lesson[] }) => {
    return (
        <div className="p-8 bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 min-h-screen w-full">
            <h1 className="text-3xl font-bold mb-8">Lesson Roadmap</h1>
            <div className="flex flex-col items-start">
                {roadmap.map((lesson, i) => (
                    <Node
                        key={`lesson-${i}`}
                        node={lesson}
                        level={0}
                    />
                ))}
            </div>
        </div>
    );
};

export default HorizontalRoadmap;
