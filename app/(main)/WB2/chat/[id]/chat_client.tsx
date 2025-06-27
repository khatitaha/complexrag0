"use client";

import { useState, useRef, useEffect } from "react";
import { Send, MoveDown, Paperclip, Bot, User } from "lucide-react";

export default function ImprovedChatUI() {
    const [messages, setMessages] = useState([
        {
            id: "1",
            role: "assistant",
            content: "Hello! I'm your AI assistant. How can I help you today?",
        },
        {
            id: "2",
            role: "user",
            content: "Can you help me with some React development questions?",
        },
        {
            id: "3",
            role: "assistant",
            content:
                "Absolutely! I'd be happy to help you with **React development**. Whether you need help with components, hooks, state management, or any other React concepts, feel free to ask. What specific area would you like to explore?",
        },
    ]);

    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // this guarantees the scroll happens after DOM fully updates
    useEffect(() => {
        if (messagesEndRef.current) {
            requestAnimationFrame(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            });
        }
    }, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = {
            id: Date.now().toString(),
            role: "user",
            content: input,
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        // simulate a delayed assistant response
        setTimeout(() => {
            const aiMessage = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: `Thanks for your message: "${input}". This is a demo response showing how the chat interface works with **proper formatting** and responsive design.`,
            };
            setMessages((prev) => [...prev, aiMessage]);
            setIsLoading(false);
        }, 1500);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
            {/* Header */}
            <div className="flex-shrink-0 bg-neutral-800/50 backdrop-blur border-b border-neutral-700 px-4 py-3">
                <div className="max-w-4xl mx-auto flex items-center gap-3">
                    <div className="p-2 bg-blue-600 rounded-lg">
                        <Bot size={20} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-white font-semibold">AI Assistant</h1>
                        <p className="text-neutral-400 text-xs">Always here to help</p>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
                <div className="max-w-4xl mx-auto space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"
                                }`}
                        >
                            {message.role === "assistant" && (
                                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mt-1">
                                    <Bot size={16} className="text-white" />
                                </div>
                            )}
                            <div
                                className={`max-w-[80%] md:max-w-[70%] lg:max-w-[60%] px-4 py-3 rounded-2xl ${message.role === "user"
                                    ? "bg-blue-600 text-white rounded-br-md"
                                    : "bg-neutral-700/70 text-white rounded-bl-md border border-neutral-600/50"
                                    }`}
                            >
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: message.content.replace(
                                            /\*\*(.*?)\*\*/g,
                                            "<strong class='font-semibold text-blue-300'>$1</strong>"
                                        ),
                                    }}
                                />
                            </div>
                            {message.role === "user" && (
                                <div className="flex-shrink-0 w-8 h-8 bg-neutral-600 rounded-full flex items-center justify-center mt-1">
                                    <User size={16} className="text-white" />
                                </div>
                            )}
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex gap-3 justify-start">
                            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mt-1">
                                <Bot size={16} className="text-white" />
                            </div>
                            <div className="bg-neutral-700/70 border border-neutral-600/50 px-4 py-3 rounded-2xl rounded-bl-md">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"></div>
                                    <div
                                        className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"
                                        style={{ animationDelay: "0.1s" }}
                                    ></div>
                                    <div
                                        className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"
                                        style={{ animationDelay: "0.2s" }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Scroll to bottom button */}
            <button
                onClick={scrollToBottom}
                className="fixed right-4 bottom-24 md:bottom-28 p-3 bg-neutral-700 hover:bg-neutral-600 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-105 z-10"
            >
                <MoveDown size={20} />
            </button>

            {/* Input */}
            <form
                onSubmit={handleSubmit}
                className="flex-shrink-0 bg-neutral-800/30 backdrop-blur border-t border-neutral-700 px-4 py-4"
            >
                <div className="max-w-4xl mx-auto flex gap-3 items-end">
                    <button
                        type="button"
                        className="flex-shrink-0 p-3 bg-neutral-700 hover:bg-neutral-600 text-neutral-300 hover:text-white rounded-xl transition-colors duration-200"
                    >
                        <Paperclip size={20} />
                    </button>
                    <div className="flex-1 relative">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message here..."
                            className="w-full bg-neutral-700/70 border border-neutral-600/50 text-white placeholder-neutral-400 rounded-xl px-4 py-3 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[50px] max-h-32"
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit(e);
                                }
                            }}
                            onInput={(e) => {
                                const el = e.target as HTMLTextAreaElement;
                                el.style.height = "auto";
                                el.style.height = Math.min(el.scrollHeight, 128) + "px";
                            }}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="absolute right-2 bottom-2 p-2 bg-blue-600 hover:bg-blue-500 disabled:bg-neutral-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
                <p className="text-center text-neutral-500 text-xs mt-2">
                    Press Enter to send, Shift+Enter for new line
                </p>
            </form>
        </div>
    );
}
