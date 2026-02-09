import { useChatStore } from "../store/useChatStore";

export type StreamUpdateHandler = (accumulated: string) => void

export function useChatStream() {
    const { setGmthinking } = useChatStore();

    const processStream = async (
        fullMessage: string,
        onUpdate: StreamUpdateHandler
    ) => {
        try {
            // GM 생각중 딜레이 연출
            await new Promise(resolve => setTimeout(resolve, 3000));

            let accumulated = "";
            const words = fullMessage.split(' '); // 단어별로 끊어서 처리
            for (let i = 0; i < words.length; i++) {
                accumulated += (i > 0 ? ' ' : '') + words[i]; // 첫 단어가 아니면 공백 추가
                onUpdate(accumulated);
                await new Promise(resolve => setTimeout(resolve, 100)); // 각 단어 출력 딜레이
            }
        } finally {
            setGmthinking(false);
        }
    };

    return { processStream };
}