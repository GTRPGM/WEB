import { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { gameService } from "../services/miniGameService";

export function useGameChat() {
    const { addMessage, setGmthinking, updateMessageContent } = useChatStore();
    const [attemptCount, setAttemptCount] = useState(1);
    const [isMiniGameActive, setMiniGameActive] = useState(false);

    const processStream = async (response: Response, msgId: string) => {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        if (!reader) return;

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            const text = decoder.decode(value);
            updateMessageContent(msgId, text);
        }
    };

    const handleSendMessage = async (text: string, username: string) => {
        if (!text.trim()) return;
        const token = useAuthStore.getState().access_token ?? "";

        if (!token) {
            return;
        }
        
        addMessage(username, text);
        setGmthinking(true);

        let gmMsgId = "";
      
        try {
            const isMiniGame = text.includes("미니게임");
            let response: Response;

            if (isMiniGame) {
                response = await gameService.getMiniGame(token);
                setMiniGameActive(true);
                setAttemptCount(1);
            } else if (isMiniGameActive) {
                response = await gameService.checkAnswer(text, attemptCount, token);
            } else {
                response = await gameService.generateChat(text, token);
            }

            if (!response.ok) throw new Error(`Status: ${response.status}`);

            setGmthinking(false);
            gmMsgId = addMessage('GM','');

            if (isMiniGameActive && !isMiniGame) {
                const gameData = await response.json();
                const result = gameData.data;

                if (result.is_correct) {
                    updateMessageContent(gmMsgId, `${result.message}`);
                    setMiniGameActive(false);
                    setAttemptCount(1);
                } else {
                    updateMessageContent(gmMsgId, `${result.message}`);
                    setAttemptCount(result.fail_count || attemptCount + 1);
                }
            } else {
                await processStream(response, gmMsgId);
            }
        } catch (error) {
            setGmthinking(false);
            const errorTargetId = gmMsgId || addMessage('GM','');
            updateMessageContent(errorTargetId, '연결에 실패했습니다. 다시 시도해 주세요.');
        } finally {
            setGmthinking(false);
        }
    };

    return { handleSendMessage, isMiniGameActive };
}