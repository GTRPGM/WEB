import { create } from 'zustand';
import type { Message } from '../types';
import { useUserStore } from './useUserStore';

interface ChatState {
    messages: Message[];
    isGMThinking: boolean;

    addMessage: (sender: string, content: string) => string;
    updateMessageContent: (id: string, content: string) => void;
    setGmthinking: (thinking: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
    messages: [],
    isGMThinking: false,

    addMessage: (sender, content) => {
        const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const myName = useUserStore.getState().userProfile.name;
        const color = sender === 'GM' ? 'bg-blue-500' : (sender === myName ? 'bg-gray-700' : 'bg-gray-500');
        const newMessage: Message = {
            id,
            sender,
            content,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            color,
        };
        set((state) => ({ messages: [...state.messages, newMessage] }));
        return id;
    },
    
    updateMessageContent: (id, content) => set((state) => ({
        messages: state.messages.map((msg) =>
            msg.id === id ? { ...msg, content } : msg
        )
    })),

    setGmthinking: (thinking) => set({ isGMThinking: thinking }),
}));