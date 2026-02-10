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

    const getTextColorClass = (bgColorClass: string | undefined) => {
        if (!bgColorClass) return 'text-base-content'; // Default color
        return bgColorClass.replace('bg-', 'text-');
    };
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
                    // Determine layout based on sender type
                    const layoutClasses = msg.type === 'user' ? 'justify-end' 
                                        : (msg.type === 'narration' || msg.type === 'action') ? 'justify-center' 
                                        : 'justify-start';

                    const showAvatar = msg.type !== 'user' && msg.type !== 'narration' && msg.type !== 'action';
                    const showHeader = msg.type !== 'narration' && msg.type !== 'action';
                    
                    // Determine content style based on message type
                    const getContentClasses = () => {
                        switch (msg.type) {
                            case 'user':
                                return 'bg-primary text-primary-content p-3 rounded-2xl rounded-br-none text-left';
                            case 'narration':
                                return 'bg-base-300/15 text-base-content p-3 rounded-2xl text-center';
                            case 'dialogue':
                                return 'bg-base-300 text-primary-content p-3 rounded-2xl rounded-tl-none text-left';
                            case 'action':
                                return 'text-base-content/90 italic'; // Italic, no background
                            default: // Fallback for older messages or system messages
                                return msg.isGM ? 'bg-base-200 text-base-content p-3 rounded-2xl text-center' 
                                     : msg.isUserMessage ? 'bg-primary text-primary-content p-3 rounded-2xl rounded-br-none text-left'
                                     : 'bg-base-300 text-base-content p-3 rounded-2xl rounded-tl-none text-left';
                        }
                    };

                    return (
                    <div 
                        key={msg.id} 
                        className={`flex items-start gap-3 p-1 rounded-lg transition-colors group ${layoutClasses}`}
                    >
                        {/* Avatar for dialogue/action messages */}
                        {showAvatar && (
                            <div className={`w-10 h-10 rounded ${msg.color || 'bg-neutral'} text-neutral-content flex items-center justify-center font-bold shrink-0 mt-[1px]`}>
                                {msg.sender ? msg.sender[0].toUpperCase() : 'P'}
                            </div>
                        )}
                        
                        <div className={`flex-1 flex flex-col ${
                            msg.type === 'user' ? 'items-end' 
                            : (msg.type === 'narration' || msg.type === 'action') ? 'items-center' 
                            : 'items-start'
                        }`}>
                            {/* Name and Time for non-narration messages */}
                            {showHeader && (
                                <div className="flex items-center gap-2">
                                    <span className={`font-bold leading-none ${msg.isGM ? 'text-secondary' : (msg.isUserMessage ? 'text-base-content' : getTextColorClass(msg.color))}`}>{msg.sender}</span>
                                    <span className="text-xs text-base-content/70">{msg.time}</span>
                                </div>
                            )}
                            
                            {/* Actual Message Content */}
                            <p className={`mt-1 leading-relaxed whitespace-pre-wrap ${getContentClasses()}`}>
                                {msg.content}
                            </p>
                        </div>
                    </div>
                    );
                })}

                {isGMThinking && (
                    <div className="flex justify-center p-1 animate-pulse mb-10">
                        <div className="bg-base-300 px-3 py-2 rounded-2xl shadow-sm flex items-center justify-center h-9">
                            <span className="loading loading-dots loading-md text-primary"></span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}