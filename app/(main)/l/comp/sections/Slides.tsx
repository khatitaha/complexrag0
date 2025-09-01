'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlay, FiPause, FiChevronLeft, FiChevronRight, FiZap, FiBookOpen, FiTarget, FiAward } from 'react-icons/fi';
import { FaRegLightbulb } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Slide {
    title: string;
    mainText: string;
    keyPoints: string[];
    emojis: string[];
    illustration_idea: string;
    narrationUrl?: string;
}

const iconMap: { [key: string]: React.ReactNode } = {
    "lightbulb": <FaRegLightbulb className="w-16 h-16 text-yellow-400" />,
    "zap": <FiZap className="w-16 h-16 text-blue-500" />,
    "book": <FiBookOpen className="w-16 h-16 text-green-500" />,
    "target": <FiTarget className="w-16 h-16 text-red-500" />,
    "award": <FiAward className="w-16 h-16 text-purple-500" />,
    "default": <div className="w-16 h-16 " />
};

const backgroundClasses = [
    "bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30",
    "bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30",
    "bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30",
    "bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30",
];

const Slides = ({ slides: initialSlides, lessonId }: { slides: Slide[], lessonId: string }) => {
    const [slides, setSlides] = useState(initialSlides);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [audioProgress, setAudioProgress] = useState(0);
    const [audioDuration, setAudioDuration] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);

    const hasNarration = slides.every(slide => slide.narrationUrl);

    const currentBg = useMemo(() => backgroundClasses[currentSlide % backgroundClasses.length], [currentSlide]);

    const parseHighlightedText = (text: string) => {
        if (!text) return null;
        const parts = text.split(/<highlight>(.*?)<\/highlight>/g);
        return parts.map((part, i) =>
            i % 2 === 1 ? (
                <span key={i} className="bg-yellow-200 dark:bg-yellow-600/70 px-1 rounded-md">{part}</span>
            ) : ( part )
        );
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (hasNarration && audio) {
            audio.src = slides[currentSlide].narrationUrl!;
            setAudioProgress(0);
            if (isPlaying) {
                audio.play().catch(e => console.error("Audio play failed:", e));
            }
        }
    }, [currentSlide, slides, isPlaying, hasNarration]);

    const handleNext = () => { if (currentSlide < slides.length - 1) setCurrentSlide(currentSlide + 1); };
    const handlePrev = () => { if (currentSlide > 0) setCurrentSlide(currentSlide - 1); };

    const handleAudioEnded = () => {
        if (currentSlide < slides.length - 1) handleNext();
        else setIsPlaying(false);
    };

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) audioRef.current.pause();
            else audioRef.current.play().catch(e => console.error("Audio play failed:", e));
            setIsPlaying(!isPlaying);
        }
    };

    const handleGenerateAudio = async () => {
        setIsGenerating(true);
        try {
            const response = await fetch('/api/generate-tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slides, lessonId }),
            });
            if (!response.ok) throw new Error('Failed to generate audio');
            const newSlides = await response.json();
            setSlides(newSlides);
        } catch (error) {
            console.error(error);
        } finally {
            setIsGenerating(false);
        }
    };

    const onTimeUpdate = () => { if (audioRef.current) setAudioProgress(audioRef.current.currentTime); };
    const onLoadedMetadata = () => { if (audioRef.current) setAudioDuration(audioRef.current.duration); };
    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (audioRef.current) {
            audioRef.current.currentTime = Number(e.target.value);
            setAudioProgress(audioRef.current.currentTime);
        }
    };

    if (!slides || slides.length === 0) {
        return (
            <div className="flex items-center justify-center h-full p-4 bg-gray-100 dark:bg-neutral-900">
                <Card className="w-full max-w-lg shadow-xl">
                    <CardHeader><CardTitle className="text-center text-2xl">No Slides Available</CardTitle></CardHeader>
                    <CardContent className="text-center">
                        <p className="mb-6 text-muted-foreground">There was an issue generating the slides for this lesson.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!hasNarration) {
        return (
            <div className="flex items-center justify-center h-full p-4 bg-gray-100 dark:bg-neutral-900">
                <Card className="w-full max-w-lg shadow-xl">
                    <CardHeader><CardTitle className="text-center text-2xl">Generate Audio Narration</CardTitle></CardHeader>
                    <CardContent className="text-center">
                        <p className="mb-6 text-muted-foreground">This lesson does not have audio narration yet. Click the button below to generate it.</p>
                        <Button onClick={handleGenerateAudio} disabled={isGenerating} size="lg">{isGenerating ? 'Generating...' : 'Generate Audio'}</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const slide = slides[currentSlide];
    const illustrationKey = Object.keys(iconMap).find(key => slide.illustration_idea.toLowerCase().includes(key)) || 'default';

    return (
        <div className={`w-full h-full flex flex-col items-center justify-center p-4 md:p-8 transition-colors duration-500 ${currentBg}`}>
            <div className="w-full max-w-4xl flex-grow flex items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.div key={currentSlide} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }} className="w-full">
                        <Card className="shadow-2xl rounded-lg overflow-hidden bg-white/80 dark:bg-neutral-900/80 backdrop-blur-lg">
                            <CardHeader className="p-6">
                                <CardTitle className="text-2xl md:text-3xl text-neutral-800 dark:text-neutral-100">{slide.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 md:p-8 grid md:grid-cols-3 gap-8 items-center">
                                <div className="md:col-span-2">
                                    <p className="text-lg md:text-xl leading-relaxed text-neutral-700 dark:text-neutral-300">{parseHighlightedText(slide.mainText)}</p>
                                    <ul className="mt-6 space-y-2">
                                        {slide.keyPoints.map((point, i) => (
                                            <li key={i} className="flex items-start">
                                                <span className="text-blue-500 mr-3">&#10003;</span>
                                                <span className="text-neutral-600 dark:text-neutral-400">{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="flex flex-col items-center justify-center space-y-4">
                                    {iconMap[illustrationKey]}
                                    <div className="flex text-3xl gap-4">
                                        {slide.emojis.map((emoji, i) => <span key={i}>{emoji}</span>)}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="w-full max-w-4xl p-4 bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm rounded-xl shadow-lg mt-8">
                <div className="flex items-center gap-4">
                    <button onClick={togglePlay} className="p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-lg">
                        {isPlaying ? <FiPause size={24} /> : <FiPlay size={24} />}
                    </button>
                    <div className="flex items-center gap-2 w-full">
                        <span className="text-sm font-mono text-neutral-600 dark:text-neutral-400">{formatTime(audioProgress)}</span>
                        <input type="range" value={audioProgress} max={audioDuration || 0} onChange={handleSeek} className="w-full h-2 bg-gray-300 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer" />
                        <span className="text-sm font-mono text-neutral-600 dark:text-neutral-400">{formatTime(audioDuration)}</span>
                    </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                    <button onClick={handlePrev} disabled={currentSlide === 0} className="p-3 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed">
                        <FiChevronLeft size={24} />
                    </button>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Slide {currentSlide + 1} of {slides.length}</span>
                    <button onClick={handleNext} disabled={currentSlide === slides.length - 1} className="p-3 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed">
                        <FiChevronRight size={24} />
                    </button>
                </div>
            </div>

            <audio ref={audioRef} onEnded={handleAudioEnded} onTimeUpdate={onTimeUpdate} onLoadedMetadata={onLoadedMetadata} />
        </div>
    );
};

export default Slides;