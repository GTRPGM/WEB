import { create } from 'zustand';
import type { Message } from '../types';

// 랜덤으로 할당할 배경색 Tailwind 클래스 배열
const randomColors = [
    'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-lime-500',
    'bg-emerald-500', 'bg-cyan-500', 'bg-indigo-500', 'bg-violet-500',
    'bg-fuchsia-500', 'bg-rose-500'
];

const getSenderColor = (sender: string, myName: string) => {
    switch (sender) {
        case 'GM': return 'bg-blue-500';
        case myName: return 'bg-gray-500';
        default: {
            const randomIndex = Math.floor(Math.random() * randomColors.length);
            return randomColors[randomIndex];
        }
    }
}

interface ChatState {
    messages: Message[];
    isGMThinking: boolean;
    sessionId: string | null;
    playerId: string | null; // Add playerId to state
    isLoadingGameSession: boolean; // 게임 세션 로딩 상태 추가
    currentActId: string | null; // 현재 Act ID
    currentSequenceId: string | null; // 현재 Sequence ID

    addMessage: (sender: string, content: string, myName: string, type?: Message['type']) => string;
    updateMessageContent: (id: string, content:string) => void;
    setGmthinking: (thinking: boolean) => void;
    setSessionId: (id: string) => void;
    setPlayerId: (id: string) => void; // Add setPlayerId action
    setLoadingGameSession: (isLoading: boolean) => void; // setLoadingGameSession 액션 추가
    setCurrentActAndSequenceId: (actId: string, sequenceId: string) => void; // Act 및 Sequence ID 설정 액션 추가

    addSummaryMessage: (content: string, myName: string) => string; // 요약 메시지 추가 액션
}

export const useChatStore = create<ChatState>((set) => ({
    messages: [],
    isGMThinking: false,
    sessionId: null,
    playerId: null, // Initialize playerId
    isLoadingGameSession: false, // 초기 상태에 isLoadingGameSession 추가
    currentActId: null, // 초기 Act ID
    currentSequenceId: null, // 초기 Sequence ID

    addMessage: (sender, content, myName, type) => {
        const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const myName = useUserStore.getState().userProfile.name;
        const color = sender === 'GM' ? 'bg-blue-500' : (sender === myName ? 'bg-gray-700' : 'bg-gray-500');
        const newMessage: Message = {
            id,
            sender,
            content,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            color: getSenderColor(sender, myName),
            isGM: sender === 'GM',
            isUserMessage: sender === myName, // isUserMessage 속성 추가
            type,
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
    setSessionId: (id: string) => set({ sessionId: id }),
    setPlayerId: (id: string) => set({ playerId: id }), // Implement setPlayerId
    setLoadingGameSession: (isLoading) => set({ isLoadingGameSession: isLoading }), // setLoadingGameSession 구현
    setCurrentActAndSequenceId: (actId, sequenceId) => set({ currentActId: actId, currentSequenceId: sequenceId }),

    addSummaryMessage: (content, myName) => {
        const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newMessage: Message = {
            id,
            sender: 'GM', // Always GM for summary
            content,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            color: getSenderColor('GM', myName),
            isGM: true,
            isUserMessage: false,
            type: 'narration', // Always narration for summary
        };
        set((state) => ({ messages: [...state.messages, newMessage] }));
        return id;
    },
}));