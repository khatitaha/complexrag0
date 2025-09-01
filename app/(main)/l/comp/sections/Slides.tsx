'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlay, FiPause, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Slide {
    title: string;
    text: string;
    narrationUrl?: string;
}

const Slides = ({ slides: initialSlides, lessonId }: { slides: Slide[], lessonId: string }) => {
    const [slides, setSlides] = useState(initialSlides);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [audioProgress, setAudioProgress] = useState(0);
    const [audioDuration, setAudioDuration] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);

    const hasNarration = slides.every(slide => slide.narrationUrl);

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

    const handleNext = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(currentSlide + 1);
        }
    };

    const handlePrev = () => {
        if (currentSlide > 0) {
            setCurrentSlide(currentSlide - 1);
        }
    };

    const handleAudioEnded = () => {
        if (currentSlide < slides.length - 1) {
            handleNext();
        } else {
            setIsPlaying(false);
        }
    };

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(e => console.error("Audio play failed:", e));
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleGenerateAudio = async () => {
        setIsGenerating(true);
        try {
            const response = await fetch('/api/generate-tts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    slides,
                    lessonId,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate audio');
            }

            const newSlides = await response.json();
            setSlides(newSlides);
        } catch (error) {
            console.error(error);
        } finally {
            setIsGenerating(false);
        }
    };

    const onTimeUpdate = () => {
        if (audioRef.current) {
            setAudioProgress(audioRef.current.currentTime);
        }
    };

    const onLoadedMetadata = () => {
        if (audioRef.current) {
            setAudioDuration(audioRef.current.duration);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (audioRef.current) {
            audioRef.current.currentTime = Number(e.target.value);
            setAudioProgress(audioRef.current.currentTime);
        }
    };

    if (!hasNarration) {
        return (
            <div className="flex items-center justify-center h-full p-4 bg-gray-100 dark:bg-neutral-900">
                <Card className="w-full max-w-lg shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-center text-2xl">Generate Audio Narration</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="mb-6 text-muted-foreground">
                            This lesson does not have audio narration yet. Click the button below to generate it.
                        </p>
                        <Button onClick={handleGenerateAudio} disabled={isGenerating} size="lg">
                            {isGenerating ? 'Generating...' : 'Generate Audio'}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-100 dark:bg-neutral-900 p-4 md:p-8">
            <div className="w-full max-w-4xl flex-grow flex items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="w-full"
                    >
                        <Card className="shadow-2xl rounded-lg overflow-hidden">
                            <CardHeader className="bg-gray-50 dark:bg-neutral-800 p-6">
                                <CardTitle className="text-2xl md:text-3xl">{slides[currentSlide].title}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 md:p-8">
                                <p className="text-lg md:text-xl leading-relaxed">{slides[currentSlide].text}</p>
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
                        <span className="text-sm font-mono">{formatTime(audioProgress)}</span>
                        <input
                            type="range"
                            value={audioProgress}
                            max={audioDuration || 0}
                            onChange={handleSeek}
                            className="w-full h-2 bg-gray-300 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-sm font-mono">{formatTime(audioDuration)}</span>
                    </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                    <button onClick={handlePrev} disabled={currentSlide === 0} className="p-3 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed">
                        <FiChevronLeft size={24} />
                    </button>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        Slide {currentSlide + 1} of {slides.length}
                    </span>
                    <button onClick={handleNext} disabled={currentSlide === slides.length - 1} className="p-3 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed">
                        <FiChevronRight size={24} />
                    </button>
                </div>
            </div>

            <audio 
                ref={audioRef} 
                onEnded={handleAudioEnded} 
                onTimeUpdate={onTimeUpdate}
                onLoadedMetadata={onLoadedMetadata}
            />
        </div>
    );
};

export default Slides;
