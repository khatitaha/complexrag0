"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Send, Bot, User } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { RagMessage, storeRagMessage } from "../actions";
import { Button } from "@/components/ui/button";
import { useAutoScrollToBottom } from "@/hooks/useAutoScrolltoBottom";


import clsx from "clsx";

const characters = [
    {
        id: "doc-alby",
        name: "Doc Alby",

        image: "/characters/alby.jpg",
        color: "#2E4057", // Deep blue-gray
        description:
            "Inspired by Einstein. A wild-haired genius who lives in the clouds of thought. Obsessed with theories, but forgets lunch. Loves making the complex feel simple.",
    },
    {
        id: "default",
        name: "Default",
        image: "/characters/default.jpeg",
        color: "#3B3C36", // Charcoal with a hint of bronze
        description:
            " "
    },
    {
        id: "captain-syntax",
        name: "Captain Syntax",
        image: "/characters/syntax.jpeg",
        color: "#1F4E5F", // Ocean steel
        description:
            "Inspired by a mix of Buzz Lightyear and clean coder vibes. Galactic engineer with spotless code. Helmet always on. Mission: crush bugs and push commits.",
    },
    {
        id: "sheikh-byte",
        name: "Sheikh Byte",
        image: "/characters/sheikh.jpeg",
        color: "#433E3F", // Muted maroon-gray
        description:
            "Inspired by Marcus Aurelius. Wears a kufi and quotes wisdom like others breathe. Debugs with patience. Teaches you to code and reflect.",
    },
    {
        id: "tyrion",
        name: "tyrion",
        image: "/characters/tyrion.jpeg",
        color: "#5D3A66", // Deep violet
        description:
            "Inspired by Tyrion Lannister. Cryptic, clever, and always 3 steps ahead. Writes code like poetry, and roasts you kindly when you deserve it.",
    },
    {
        id: "aria-calm",
        name: "Aria Calm",
        image: "/characters/aria.jpeg",
        color: "#234E52", // Teal-black forest
        description:
            "Inspired by a wise anime side character. Soft voice, strong mind. Shell help you through a panic attack and a merge conflict without blinking.",
    },
];







function useTutorChat({ lessonId, initialMessages, chatCharacterId }: { lessonId: string, initialMessages: RagMessage[], chatCharacterId: string }) {
    // Chat state from Vercel AI
    const {
        messages,
        input,
        handleInputChange,
        handleSubmit,
        setMessages,
        status
    } = useChat({
        api: "/api/chatWithRev",
        body: {
            conversationId: lessonId,
            characterId: chatCharacterId,
        },
        initialMessages: initialMessages.map(msg => ({
            id: msg.id,
            role: msg.role as "user" | "assistant",
            content: msg.message,
        })),
    });


    // RAG state
    const [ragLoading, setRagLoading] = useState(false);
    const [ragError, setRagError] = useState<string | null>(null);
    const [ragSuccess, setRagSuccess] = useState(false);


    const fireRag = async () => {
        console.log("fireRag for lesson:", lessonId);
        setRagLoading(true);
        setRagError(null);
        try {
            const res = await fetch("/api/prepare-rag-from-lesson", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lessonId }),
            });
            if (!res.ok) throw new Error("RAG preparation failed");
            setRagSuccess(true);
        } catch (err) {
            console.log(err);
            setRagError("❌ RAG preparation failed");
        } finally {
            setRagLoading(false);
        }
    };

    return {
        messages,
        input,
        handleInputChange,
        handleSubmit,
        setMessages,
        ragLoading,
        ragError,
        ragSuccess,
        fireRag,
        status
    };
}

export default function ImprovedChatUI({ id, initialchat }: { id: string, initialchat: RagMessage[] | null }) {


    const [hovered, setHovered] = useState<string | null>(null);
    const [selected, setSelected] = useState<string | null>(null);
    const chatCharacter = useMemo(() => {
        return characters.find((c) => c.id === selected);
    }, [selected]);



    const activeCharacter = characters.find((c) => c.id === (hovered || selected));

    // Onboarding flow state
    const [step, setStep] = useState<"intro" | "chat" | "characterChoosing">(() => {
        // If we have initial chat messages, start directly in chat mode
        return initialchat && initialchat.length > 0 ? "chat" : "intro";
    });
    // const filePath = `https://clxsgightqnifyrrmhrd.supabase.co/storage/v1/object/public/docs/uploads/${id}`;
    const chat = useTutorChat({ lessonId: id, initialMessages: initialchat || [], chatCharacterId: chatCharacter?.id ?? "doc-alby" });

    // Track the last stored message to avoid duplicate storage
    const lastStoredMessageRef = useRef<string | null>(null);
    const lastMessageLengthRef = useRef<number>(0);

    // Save messages when they change - only store complete messages, not streaming chunks
    useEffect(() => {
        if (chat.messages.length > 0) {
            const currentLength = chat.messages.length;

            const lastMessage = chat.messages[currentLength - 1];

            // Only store if:
            // 1. It's a new message (not from initial load)
            // 2. We haven't stored this message before
            // 3. The message count has stabilized (no new messages added recently)
            if (lastMessage &&
                !initialchat?.some(msg => msg.id === lastMessage.id) &&
                lastStoredMessageRef.current !== lastMessage.id &&
                currentLength > lastMessageLengthRef.current) {

                // Wait a bit to ensure the message is complete (not still streaming)
                const timeoutId = setTimeout(() => {
                    storeRagMessage({
                        message: lastMessage.content,
                        role: lastMessage.role,
                        fileId: id,
                        chatId: `chat-${id}`,
                        character: "tutor",
                    });

                    // Mark this message as stored
                    lastStoredMessageRef.current = lastMessage.id;
                }, 1000); // Wait 1 second to ensure streaming is complete

                return () => clearTimeout(timeoutId);
            }

            lastMessageLengthRef.current = currentLength;
        }
    }, [chat.messages, id, initialchat]);
    const { containerRef, bottomRef, showScrollButton } = useAutoScrollToBottom([chat.messages]);


    // Move to chat step when ragSuccess becomes true
    useEffect(() => {
        if (chat.ragSuccess) setStep("chat");
    }, [chat.ragSuccess]);

    // When user accepts, fire RAG and go to chat on success
    const handleAccept = async () => {
        await chat.fireRag();
    };


    const onClickCharacterButton = () => {
        setStep("characterChoosing");
    }

    if (step === "intro") {
        return (
            <div className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-950 from-white via-neutral-100 to-neutral-100">
                {/* Subtle light glow from bottom */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[100%] h-[40%] bg-gradient-to-t from-purple-500/20 via-cyan-400/10 to-transparent blur-3xl"></div>
                {/* Heading */}
                <div className="relative z-10 text-center">
                    <h1 className="text-4xl font-extrabold dark:text-white mb-4">
                        Welcome to <span className="text-purple-400">Tutor</span>
                    </h1>
                    <p className="dark:text-gray-400 text-gray-600 mb-8 max-w-lg mx-auto">
                        Your AI learning companion is ready.
                    </p>
                    <button className="px-8 py-3 rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-purple-500 to-cyan-500 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-[1.02] transition-transform" onClick={handleAccept} disabled={chat.ragLoading}>
                        {chat.ragLoading ? (
                            <span className="flex items-center gap-2">
                                <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                                Processing...
                            </span>
                        ) : (
                            "🚀 Start Using Tutor"
                        )}
                    </button>

                    {/* Error Message */}
                    {chat.ragError && (
                        <p className="mt-4 text-sm text-red-400 font-medium">
                            {chat.ragError}
                        </p>
                    )}
                </div>
            </div>
        );
    }


    if (step === "characterChoosing") {
        // Compute color with fallback
        const charColor = activeCharacter?.color || '#38bdf8';
        return (
            <div
                className="w-full h-screen flex flex-col items-center px-4 py-10 transition-colors duration-500  relative overflow-y-scroll"
                style={{
                    background: `radial-gradient(ellipse at 60% 40%, ${charColor}cc 0%, transparent 70%), linear-gradient(135deg, #0f172a 0%, #1e293b 100%)`
                }}
            >
                {/* Animated glowing character color blob */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vw] max-w-5xl max-h-5xl rounded-full z-0 pointer-events-none animate-pulse-glow"
                    style={{
                        background: `radial-gradient(circle, ${charColor}ee 0%, transparent 80%)`,
                        filter: 'blur(120px)',
                        opacity: 0.85
                    }}
                />
                {/* Subtle secondary blurred blob for depth */}
                <div className="absolute bottom-[-120px] right-[-120px] w-[40vw] h-[40vw] max-w-xl max-h-xl rounded-full z-0 pointer-events-none"
                    style={{
                        background: `radial-gradient(circle, ${charColor}55 0%, transparent 70%)`,
                        filter: 'blur(100px)',
                        opacity: 0.25
                    }}
                />
                {/* Overlay tint for main content area */}
                <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: `linear-gradient(120deg, ${charColor}22 0%, transparent 100%)` }} />

                <div className="text-center mb-6 z-10 backdrop-blur-md bg-white/5 rounded-xl px-4 py-2">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
                        Choose Your Tutor
                    </h1>
                </div>

                {/* Character Grid */}
                <div className="w-full max-w-4xl px-2 mb-4 z-10">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {characters.map((char) => {
                            const isSelected = selected === char.id;
                            const isHovered = hovered === char.id;
                            return (
                                <button
                                    key={char.id}
                                    type="button"
                                    onMouseEnter={() => setHovered(char.id)}
                                    onMouseLeave={() => setHovered(null)}
                                    onClick={() => setSelected(char.id)}
                                    className={clsx(
                                        "flex flex-col items-center rounded-lg shadow p-2 bg-white/90 dark:bg-neutral-900 border-2 focus:outline-none transform transition-transform duration-200",
                                        isSelected
                                            ? `border-[${char.color}] scale-105 ring-2 ring-[${char.color}] shadow-[0_0_24px_4px_${char.color}55]`
                                            : isHovered
                                                ? `border-[${char.color}] scale-105 shadow-[0_0_16px_2px_${char.color}33]`
                                                : "border-transparent hover:scale-105 hover:border-blue-200"
                                    )}
                                    style={{ minHeight: 180, maxHeight: 220 }}
                                >
                                    <img
                                        src={char.image}
                                        alt={char.name}
                                        className="w-full h-36 object-cover rounded mb-2"
                                    />
                                    <h3 className="text-base font-semibold mb-1 text-neutral-900 dark:text-white">{char.name}</h3>
                                    {/* <p className="text-xs text-gray-500 dark:text-gray-300 text-center line-clamp-2">{char.description}</p> */}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Description */}
                {activeCharacter && (
                    <div className="text-center max-w-md w-full mb-4 px-4 py-2 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-xl shadow z-10">
                        <h2 className="text-lg font-bold text-zinc-800 dark:text-white mb-1">
                            {activeCharacter.name}
                        </h2>
                        <p className="text-zinc-700 dark:text-gray-200 text-sm">{activeCharacter.description}</p>
                    </div>
                )}

                {/* Continue Button */}
                <div className="w-full flex justify-center mt-2 z-10">
                    <button
                        onClick={() => setStep("chat")}
                        disabled={!selected}
                        style={{
                            background: selected ? charColor : '#334155',
                            boxShadow: selected ? `0 0 24px 4px ${charColor}88` : undefined
                        }}
                        className={clsx(
                            "px-6 py-3 rounded-lg text-base font-semibold transition-all duration-300 shadow-md hover:shadow-xl",
                            selected ? "text-white hover:brightness-110 hover:scale-105 hover:shadow-[0_0_32px_8px_var(--tw-shadow-color)]" : "opacity-50 cursor-not-allowed text-gray-200 bg-gray-700 hover:bg-gray-700"
                        )}
                    >
                        {selected
                            ? `Continue with ${characters.find((c) => c.id === selected)?.name}`
                            : "Select a character to continue"}
                    </button>
                </div>
                {/* Animated glow keyframes */}
                <style jsx>{`
                  @keyframes pulse-glow {
                    0%, 100% { opacity: 0.85; filter: blur(120px); }
                    50% { opacity: 1; filter: blur(140px); }
                  }
                  .animate-pulse-glow {
                    animation: pulse-glow 4s ease-in-out infinite;
                  }
                `}</style>
            </div>
        );
    }


    // Chat UI (same as before)
    return (
        <div className="flex flex-col relative z-20 bg-gradient-to-br  dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 from-white via-neutral-100 to-neutral-100 h-full">
            {/* glow */}
            {/* Animated glowing character color blob */}
            {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vw] max-w-5xl max-h-5xl rounded-full z-0 pointer-events-none animate-pulse-glow"
                style={{
                    background: `radial-gradient(circle, ${chatCharacter?.color}ee 0%, transparent 80%)`,
                    filter: 'blur(120px)',
                    opacity: 0.1
                }}
            /> */}
            {/* Subtle secondary blurred blob for depth */}
            {/* <div className="absolute bottom-[-120px] right-[-120px] w-[40vw] h-[40vw] max-w-xl max-h-xl rounded-full z-0 pointer-events-none"
                style={{
                    background: `radial-gradient(circle, ${chatCharacter?.color}55 0%, transparent 70%)`,
                    filter: 'blur(100px)',
                    opacity: 0.1
                }}
            /> */}
            {/* Overlay tint for main content area */}
            <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: `linear-gradient(120deg, ${chatCharacter?.color}22 0%, transparent 100%)` }} />
            <div
                className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"
                style={{
                    background: `radial-gradient(ellipse at 30% 20%, ${chatCharacter?.color || "#38bdf8"}33 0%, transparent 70%)`,
                    filter: "blur(120px)",
                    opacity: 0.1,
                    zIndex: 0,
                }}
            />

            {/* HEADER */}
            <div
                className="flex-shrink-0 backdrop-blur border-b border-neutral-700 px-4 py-3 "
                style={{
                    backgroundColor: `${chatCharacter?.color || "#1e293b"}22`
                }}
            >
                <div className="max-w-4xl mx-auto flex items-center gap-3 justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-3">
                            {chatCharacter?.image ? (
                                <img
                                    src={chatCharacter.image}
                                    alt={chatCharacter.name}
                                    className="w-16 h-16 rounded-full object-cover"
                                />
                            ) : (
                                <div className="p-2 rounded-lg" style={{ backgroundColor: chatCharacter?.color || "#3b82f6" }}>
                                    <Bot size={20} className="text-white" />
                                </div>
                            )}
                            <div>
                                <h1 className="font-semibold  dark:text-white">{chatCharacter?.name || "AI Tutor"}</h1>
                                <p className="dark:text-neutral-400 text-neutral-600 text-xs">Ask anything about your uploaded document</p>
                            </div>
                        </div>

                    </div>

                    <Button className="  font-semibold " onClick={onClickCharacterButton}>change character</Button>
                </div>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
                <div className="max-w-4xl mx-auto space-y-4">
                    {chat.messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            {/* Assistant avatar */}
                            {message.role === "assistant" && chatCharacter?.image && (
                                <img
                                    src={chatCharacter.image}
                                    alt={chatCharacter.name}
                                    className="flex-shrink-0 w-8 h-8 rounded-full object-cover mt-1"
                                />
                            )}


                            {/* Bubble */}
                            <div
                                className={`max-w-[80%] md:max-w-[70%] lg:max-w-[60%] px-4 py-3 rounded-2xl ${message.role === "user"
                                    ? "bg-blue-600 text-white rounded-br-md"
                                    : "text-white rounded-bl-md border border-neutral-600/50"
                                    }`}
                                style={
                                    message.role === "assistant"
                                        ? { backgroundColor: chatCharacter?.color || "#334155" }
                                        : undefined
                                }
                            >

                                <div>
                                    {message.content}
                                </div>
                            </div>

                            {/* User avatar */}
                            {message.role === "user" && (
                                <div className="flex-shrink-0 w-8 h-8 bg-neutral-600 rounded-full flex items-center justify-center mt-1">
                                    <User size={16} className="text-white" />
                                </div>
                            )}
                        </div>
                    ))}

                    {chat.status === "submitted" && (
                        <div className="flex gap-3 justify-start">
                            {chatCharacter?.image && (
                                <img
                                    src={chatCharacter.image}
                                    alt={chatCharacter.name}
                                    className="flex-shrink-0 w-8 h-8 rounded-full object-cover mt-1"
                                />
                            )}
                            <div
                                className="px-4 py-3 rounded-2xl text-white rounded-bl-md border border-neutral-600/50 bg-neutral-700/60 flex items-center gap-2"
                                style={{ backgroundColor: chatCharacter?.color || "#334155" }}
                            >
                                <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
                                <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.4s]"></span>
                            </div>
                        </div>
                        // <h1 className=" text-7xl text-white h-full flex items-center justify-center bg-red-500 ">
                        //     THIS SHIT IS LOADING G HOLD ON
                        // </h1>
                    )}

                    <div />
                </div>
            </div>

            {/* INPUT */}
            <form
                onSubmit={chat.handleSubmit}
                className="flex-shrink-0 dark:bg-neutral-800/30 backdrop-blur border-t border-neutral-700 px-4 py-4"
            >
                <div className="max-w-4xl mx-auto flex gap-3 items-end">
                    {/* Textarea */}
                    <div className="flex-1 relative flex items-center justify-center">
                        <textarea
                            value={chat.input}
                            onChange={chat.handleInputChange}
                            placeholder="Type your message here..."
                            className="w-full  border border-gray-300  rounded-xl px-4 py-3 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700/70 bg-neutral-100 border-neutral-600/50 dark:text-white  dark:placeholder-neutral-400 placeholder-neutral-600 min-h-[50px] max-h-32"
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    chat.handleSubmit(e);
                                }
                            }}
                            onInput={(e) => {
                                const el = e.target as HTMLTextAreaElement;
                                el.style.height = "auto";
                                el.style.height = Math.min(el.scrollHeight, 128) + "px";
                            }}
                        />
                        {/* Send button */}
                        <button
                            type="submit"
                            disabled={!chat.input.trim()}
                            className="absolute right-2 bottom-2 p-2 text-white rounded-lg transition-colors duration-200 "
                            style={{
                                backgroundColor: !chat.input.trim()
                                    ? "#cbd5e1"
                                    : chatCharacter?.color || "#3b82f6",
                                cursor: !chat.input.trim() ? "not-allowed" : "pointer",
                            }}
                        >
                            <Send size={18} />
                        </button>

                    </div>
                </div>
                <p className="text-center  text-neutral-500 text-xs mt-2">
                    Press Enter to send, Shift+Enter for new line
                </p>
            </form>
        </div>
    );
}
