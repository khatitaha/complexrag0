"use client";
import { useEffect, useRef, useState } from "react";


export function useAutoScrollToBottom(dependencies: any[] = []) {
    const bottomRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [showScrollButton, setShowScrollButton] = useState(false);

    // Auto-scroll when deps (like messages) change
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, dependencies);

    // Listen for scroll to show/hide button
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const onScroll = () => {
            const atBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 100;
            setShowScrollButton(!atBottom);
        };

        container.addEventListener("scroll", onScroll);
        return () => container.removeEventListener("scroll", onScroll);
    }, []);

    return { bottomRef, containerRef, showScrollButton };
}