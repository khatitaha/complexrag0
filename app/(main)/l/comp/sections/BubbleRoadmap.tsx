'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiMinus } from 'react-icons/fi';

interface Subheadline {
    title: string;
}

interface Headline {
    title: string;
    subheadlines?: Subheadline[];
}

interface Lesson {
    title: string;
    headlines: Headline[];
}

const Node = ({ node, level = 0, onToggle, openNodes }: { node: Lesson | Headline | Subheadline, level: number, onToggle: (id: string) => void, openNodes: Record<string, boolean> }) => {
    const id = node.title;
    const isOpen = openNodes[id] || false;

    const children = 'headlines' in node ? node.headlines : ('subheadlines' in node ? node.subheadlines : []);

    return (
        <div className={`relative flex items-center my-4 ${level > 0 ? 'ml-12' : ''}`}>
            {level > 0 && <div className="absolute -left-12 top-1/2 w-12 h-px bg-neutral-400" />} 
            <motion.div
                className="flex items-center z-10"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className={`p-4 rounded-full shadow-lg cursor-pointer flex items-center justify-center ${isOpen ? 'bg-blue-500 text-white' : 'bg-white dark:bg-neutral-800'}`}>
                    <span onClick={() => onToggle(id)}>{node.title}</span>
                    {children && children.length > 0 && (
                        <button onClick={() => onToggle(id)} className="ml-4">
                            {isOpen ? <FiMinus /> : <FiPlus />}
                        </button>
                    )}
                </div>
            </motion.div>
            <AnimatePresence>
                {isOpen && children && (
                    <motion.div
                        className="flex flex-col pl-4 mt-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        {children.map((child: Headline | Subheadline, index: number) => (
                            <Node key={index} node={child} level={level + 1} onToggle={onToggle} openNodes={openNodes} />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const BubbleRoadmap = ({ roadmap }: { roadmap: Lesson[] }) => {
    const [openNodes, setOpenNodes] = useState<Record<string, boolean>>({});

    const toggleNode = (id: string) => {
        setOpenNodes(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="p-8 bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 min-h-screen w-full">
            <h1 className="text-3xl font-bold mb-8 text-center">Lesson Roadmap</h1>
            <div className="flex flex-col items-start">
                {roadmap.map((lesson, i) => (
                    <Node key={`lesson-${i}`} node={lesson} level={0} onToggle={toggleNode} openNodes={openNodes} />
                ))}
            </div>
        </div>
    );
};

export default BubbleRoadmap;
