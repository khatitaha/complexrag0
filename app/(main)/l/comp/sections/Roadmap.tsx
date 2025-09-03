'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronRight, FiPlusCircle, FiMinusCircle } from 'react-icons/fi';

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

const Node = ({ title, children, onToggle, isOpen, level = 0 }: { title: string, children?: React.ReactNode, onToggle: () => void, isOpen: boolean, level?: number }) => {
    const Icon = isOpen ? FiMinusCircle : FiPlusCircle;

    return (
        <div style={{ paddingLeft: `${level * 2}rem` }} className="my-2">
            <div className="flex items-center">
                <Icon className="cursor-pointer text-blue-500 mr-2" onClick={onToggle} />
                <div className="p-3 bg-white dark:bg-neutral-800 rounded-lg shadow-md cursor-pointer flex-grow" onClick={onToggle}>
                    {title}
                </div>
            </div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 border-l-2 border-blue-500 ml-3 pl-4"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const Roadmap = ({ roadmap }: { roadmap: Lesson[] }) => {
    const [openNodes, setOpenNodes] = useState<Record<string, boolean>>({});

    const toggleNode = (id: string) => {
        setOpenNodes(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 min-h-screen w-full">
            <h1 className="text-3xl font-bold mb-8">Lesson Roadmap is this one</h1>
            <div className="space-y-4">
                {roadmap.map((lesson, i) => (
                    <Node
                        key={`lesson-${i}`}
                        title={lesson.title}
                        onToggle={() => toggleNode(lesson.title)}
                        isOpen={!!openNodes[lesson.title]}
                        level={0}
                    >
                        {lesson.headlines.map((headline, j) => (
                            <Node
                                key={`headline-${i}-${j}`}
                                title={headline.title}
                                onToggle={() => toggleNode(headline.title)}
                                isOpen={!!openNodes[headline.title]}
                                level={1}
                            >
                                {headline.subheadlines?.map((subheadline, k) => (
                                    <div key={`subheadline-${i}-${j}-${k}`} className="pl-8 my-2">
                                        <div className="p-3 bg-white dark:bg-neutral-800 rounded-lg shadow-md">
                                            {subheadline.title}
                                        </div>
                                    </div>
                                ))}
                            </Node>
                        ))}
                    </Node>
                ))}
            </div>
        </div>
    );
};

export default Roadmap;