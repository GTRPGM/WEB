import { useRef, useEffect } from "react";
import type { Message } from "../types";

interface ChatLogProps {
    messages: Message[];
}

export default function ChatLog({ messages }: ChatLogProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <div className="flex-1 items-center overflow-y-auto p-6 space-y-4">
            <div className="flex flex-col w-full max-w-4xl mx-auto">
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
                )
                <div ref={scrollRef} />
            </div>
        </div>
    );
}