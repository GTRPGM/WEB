import { create } from 'zustand';
import type { Message } from '../types';
import { useUserStore } from './useUserStore';

const myName = useUserStore((state) => state.userProfile.name);

const getSenderColor = (sender: string) => {
    switch (sender) {
        case 'GM': return 'bg-blue-500';
        case myName: return 'bg-gray-500';
    }
    return 'bg-gray-500';
}

interface ChatState {
    messages: Message[];
    isGMThinking: boolean;

    addMessage: (sender: string, content: string) => void;
    setGmthinking: (thinking: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
    messages: [
        {
            id: '1',
            sender: 'GM',
            content: '안녕하세요',
            time: new Date().toLocaleDateString(),
            color: getSenderColor('GM'),
        }
    ],
    isGMThinking: false,

    addMessage: (sender, content) => set((state) => ({
        messages: [
            ...state.messages,
            {
                id: Date.now().toString(),
                sender,
                content,
                time: new Date().toLocaleDateString(),
                color: getSenderColor(sender),
            }
        ]
    })),

    setGmthinking: (thinking) => set({ isGMThinking: thinking }),
}));