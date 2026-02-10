import { create } from 'zustand';
import type { Message } from '../types';

const themeColors = ['bg-primary', 'bg-secondary', 'bg-accent', 'bg-info', 'bg-success', 'bg-warning', 'bg-error'];

const getSenderColor = (sender: string, myName: string) => {
    switch (sender) {
        case 'GM': return 'bg-secondary';
        case myName: return 'bg-neutral';
        default: return themeColors[Math.floor(Math.random() * themeColors.length)];
    }
}

interface ChatState {
    messages: Message[];
    isGMThinking: boolean;
    sessionId: string | null;
    playerId: string | null;
    isLoadingGameSession: boolean;
    currentActId: string | null;
    currentSequenceId: string | null;
    typingSentences: string[]; // 타자 문장 저장소

    addMessage: (sender: string, content: string, myName: string, type?: Message['type']) => string;
    updateMessageContent: (id: string, content: string) => void;
    setGmthinking: (thinking: boolean) => void;
    setSessionId: (id: string) => void;
    setPlayerId: (id: string) => void;
    setLoadingGameSession: (isLoading: boolean) => void;
    setCurrentActAndSequenceId: (actId: string, sequenceId: string) => void;
    addSummaryMessage: (content: string, myName: string) => string;
    addTypingSentences: (newSentences: string[]) => void; // 문장 추가 액션
    
    // 💡 로그아웃 시 모든 상태를 초기화하는 액션 추가
    resetAll: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
    messages: [],
    isGMThinking: false,
    sessionId: null,
    playerId: null,
    isLoadingGameSession: false,
    currentActId: null,
    currentSequenceId: null,
    typingSentences: [], 

    addMessage: (sender, content, myName, type) => {
        const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newMessage: Message = {
            id, sender, content,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            color: getSenderColor(sender, myName),
            isGM: sender === 'GM',
            isUserMessage: sender === myName,
            type,
        };
        set((state) => ({ messages: [...state.messages, newMessage] }));
        return id;
    },

    updateMessageContent: (id, content) => set((state) => ({
        messages: state.messages.map((msg) => msg.id === id ? { ...msg, content } : msg)
    })),

    setGmthinking: (thinking) => set({ isGMThinking: thinking }),
    setSessionId: (id: string) => set({ sessionId: id }),
    setPlayerId: (id: string) => set({ playerId: id }),
    setLoadingGameSession: (isLoading) => set({ isLoadingGameSession: isLoading }),
    setCurrentActAndSequenceId: (actId, sequenceId) => set({ currentActId: actId, currentSequenceId: sequenceId }),

    addSummaryMessage: (content, myName) => {
        const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newMessage: Message = {
            id, sender: 'GM', content,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            color: getSenderColor('GM', myName),
            isGM: true, isUserMessage: false, type: 'narration',
        };
        set((state) => ({ messages: [...state.messages, newMessage] }));
        return id;
    },

    addTypingSentences: (newSentences) => set((state) => ({
        typingSentences: Array.from(new Set([...state.typingSentences, ...newSentences])) 
    })),

    // 💡 모든 상태 초기화 구현
    resetAll: () => set({
        messages: [],
        isGMThinking: false,
        sessionId: null,
        playerId: null,
        isLoadingGameSession: false,
        currentActId: null,
        currentSequenceId: null,
        typingSentences: []
    }),
}));