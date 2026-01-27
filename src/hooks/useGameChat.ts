import { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { gameService } from "../services/miniGameService";

export function useGameChat() {
    const { addMessage, setGmthinking, updateMessageContent } = useChatStore();
    const [attemptCount, setAttemptCount] = useState(1);
    const [isMiniGameActive, setMiniGameActive] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [riddleText, setRiddleText] = useState("");
    const [gameFeedback, setGameFeedback] = useState("");

    const processStream = async (response: Response, msgId: string, isRiddle: boolean) => {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";
        if (!reader) return;

        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        try {
            await delay(3000);
            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                const text = decoder.decode(value);
                accumulated += text;

                if(!isRiddle && msgId) { updateMessageContent(msgId, accumulated); }

                if (isRiddle) {
                    setRiddleText(accumulated);
                }
            }
            await delay(1500);
        } finally {
            setGmthinking(false);
        }
    };

    const handleSendMessage = async (text: string, username: string) => {
        if (!text.trim()) return;
        const token = useAuthStore.getState().access_token ?? "";
        if (!token) return;

        const isMiniGame = text.includes("미니게임");
        const isOpening = text.includes("오프닝");

        setGmthinking(true);
        
        if(username !== "System" && !isMiniGame && !isMiniGameActive && !isOpening) {
            addMessage(username, text);
        }


        setGameFeedback("");
        let gmMsgId = "";
      
        try {
            let response: Response;

            if (isMiniGame) {
                setRiddleText("");
                response = await gameService.getMiniGame(token);
                setMiniGameActive(true);
                setAttemptCount(1);
            } else if (isMiniGameActive) {
                response = await gameService.checkAnswer(text, attemptCount, token);
            } else {
                response = await gameService.generateChat(text, token);
            }

            if (!response.ok) throw new Error(`Status: ${response.status}`);

            if (isMiniGame) {
                gmMsgId = addMessage("GM", '수수께끼 미니게임이 시작되었습니다.');
            } else if (!isMiniGameActive) {
                gmMsgId = addMessage('GM','');
            }

            if (isMiniGameActive && !isMiniGame) {
                const gameData = await response.json();
                const result = gameData.data;

                await new Promise(resolve => setTimeout(resolve, 3000));

                setGameFeedback(result.message);
                setGmthinking(false);

                if (result.is_correct) {
                    setMiniGameActive(false);
                    setAttemptCount(1);
                    setTimeout(() => setIsModalOpen(false), 1500);
                } else {
                    setAttemptCount( result.fail_count || attemptCount + 1);
                }
                setGmthinking(false);
            } else {
                await processStream(response, gmMsgId, isMiniGame);
            }
        } catch (error) {
            setGmthinking(false);
            const errorTargetId = gmMsgId || addMessage('GM','');
            updateMessageContent(errorTargetId, '연결에 실패했습니다. 다시 시도해 주세요.');
        }
    };

    return { handleSendMessage, isMiniGameActive, isModalOpen, setIsModalOpen, startMiniGame: (u: string) => { setIsModalOpen(true); handleSendMessage("미니게임 시작", u); }, stopMiniGamestopMiniGame: () => { setMiniGameActive(false); setIsModalOpen(false); setRiddleText(""); }, riddleText, gameFeedback };
}