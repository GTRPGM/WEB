import { useCallback } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { gameService } from "../services/miniGameService";
import { useChatStream } from "./useChatStream";
import { useMiniGame } from "./useMiniGame";

export function useGameChat() {
    const { addMessage, updateMessageContent, setGmthinking } = useChatStore();
    const { processStream } = useChatStream();
    const miniGame = useMiniGame(processStream);

    const handleSendMessage = useCallback(async (text: string, username: string) => {
        if (!text.trim()) return;
        const token = useAuthStore.getState().access_token ?? "";
        
        setGmthinking(true);
        if (username !== "System" && !text.includes("오프닝")) {
            addMessage(username, text);
        }

        try {
            const response = await gameService.generateChat(text, token);
            if (!response.ok) throw new Error();

            // 1. 먼저 빈 메시지 생성 후 ID 확보
            const msgId = addMessage('GM', '');
            
            // 2. 스트림 처리하며 해당 메시지 내용 업데이트
            await processStream(response, (accumulated: string) => {
                updateMessageContent(msgId, accumulated);
            });
        } catch (error) {
            setGmthinking(false);
            addMessage('GM', '연결에 실패했습니다.');
        }
    }, [addMessage, updateMessageContent,setGmthinking, processStream]);

    return {
        handleSendMessage,
        ...miniGame
    };
}