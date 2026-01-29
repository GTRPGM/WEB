import { useChatStore } from "../store/useChatStore";

export type StreamUpdateHandler = (accumulated: string) => void

export function useChatStream() {
    const { setGmthinking } = useChatStore();

    const processStream = async (
        response: Response, 
        onUpdate: StreamUpdateHandler
    ) => {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        if (!reader) return;

        try {
            // GM 생각중 딜레이 연출
            await new Promise(resolve => setTimeout(resolve, 3000));

            let accumulated = "";
            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                
                const text = decoder.decode(value);
                accumulated += text;
                onUpdate(accumulated); // 누적된 텍스트를 콜백으로 전달
            }
        } finally {
            setGmthinking(false);
        }
    };

    return { processStream };
}