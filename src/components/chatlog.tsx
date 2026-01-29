import { useRef, useEffect } from "react";
import type { Message } from "../types";
import { useChatStore } from "../store/useChatStore";

interface ChatLogProps {
    messages: Message[];
    isGMThinking: boolean;
}

export default function ChatLog({ messages }: ChatLogProps) {
    const isGMThinking = useChatStore((state) => state.isGMThinking);
    const containerRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (containerRef.current) {
            containerRef.current.scrollTo({
                top: containerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }

    useEffect(() => {
        scrollToBottom();
        const timer = setTimeout(scrollToBottom, 100);
        return () => clearTimeout(timer);
    }, [messages, isGMThinking]);

    return (
        <div
            ref={containerRef}
            className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth"
        >
            <div className="flex flex-col w-full max-w-4xl mx-auto">

                { messages.map((msg) => {
                    
                    const isGM = msg.sender === 'GM';
                    return (
                    <div key={msg.id} className="flex items-start gap-3 hover:bg-gray-50 p-1 rounded-lg transition-colors group">
                        <div className={`w-10 h-10 rounded ${msg.color || 'bg-gray-500'} text-white flex items-center justify-center font-bold shrink-0 mt-[1px]`}>
                            {msg.sender ? msg.sender[0].toUpperCase() : 'P'}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className={`font-bold leading-none ${isGM ? 'text-purple-700' : 'text-gray-900'}`}>{msg.sender}</span>
                                <span className="text-xs text-gray-400">{msg.time}</span>
                            </div>
                            <p className="mt-1 leading-relaxed text-gray-800">{msg.content}</p>
                        </div>
                    </div>
                    );
                })}

                {isGMThinking && (
                    <div className="flex items-start gap-3 p-1 animate-pulse mb-10">
                        <div className="w-10 h-10 rounded bg-blue-500 text-white flex items-center justify-center font-bold shrink-0">G</div>
                        <div className="bg-gray-100 px-3 py-2 rounded-2xl rounded-tl-none shadow-sm flex items-center justify-center h-9">
                            <span className="loading loading-dots loading-md text-primary"></span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}