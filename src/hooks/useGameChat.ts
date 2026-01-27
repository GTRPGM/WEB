import { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { gameService } from "../services/miniGameService";

export function useGameChat() {
    const { addMessage, setGmthinking, updateMessageContent } = useChatStore();
    const [attemptCount, setAttemptCount] = useState(1);
    const [isMiniGameActive, setMiniGameActive] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [riddleText, setRiddelText] = useState("");
    const [gameFeedback, setGameFeedback] = useState("");

    const processStream = async (response: Response, msgId: string, isRiddle: boolean) => {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";
        if (!reader) return;

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            const text = decoder.decode(value);
            accumulated += text;

            if(!isRiddle && msgId) { updateMessageContent(msgId, accumulated); }

            if (isRiddle) {
                setRiddelText(accumulated);
            }
        }
    };

    const handleSendMessage = async (text: string, username: string) => {
        if (!text.trim()) return;
        const token = useAuthStore.getState().access_token ?? "";

        if (!token) {
            return;
        }
        const isMiniGame = text.includes("미니게임");
        
        if (!isMiniGame && !isMiniGameActive) { addMessage(username, text); }
        setGmthinking(true);
        setGameFeedback("");
        let gmMsgId = "";
      
        try {
            let response: Response;

            if (isMiniGame) {
                setRiddelText("");
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

            if (isMiniGame) {
                gmMsgId = addMessage("GM", '수수께끼 미니게임이 시작되었습니다.');
            } else if (!isMiniGameActive) {
                gmMsgId = addMessage('GM','');
            }

            if (isMiniGameActive && !isMiniGame) {
                const gameData = await response.json();
                const result = gameData.data;

                setGameFeedback(result.message);

                if (result.is_correct) {
                    setMiniGameActive(false);
                    setAttemptCount(1);
                    setTimeout(() => setIsModalOpen(false), 1500);
                } else {
                    setAttemptCount( prev => prev + 1);
                }
            } else {
                await processStream(response, gmMsgId, isMiniGame);
            }
        } catch (error) {
            setGmthinking(false);
            const errorTargetId = gmMsgId || addMessage('GM','');
            updateMessageContent(errorTargetId, '연결에 실패했습니다. 다시 시도해 주세요.');
        } finally {
            setGmthinking(false);
        }
    };

    const startMiniGame = (username: string) => {
        setIsModalOpen(true);
        handleSendMessage("미니게임 시작", username);
    }

    const stopMiniGame = () => {
        setMiniGameActive(false);
        setIsModalOpen(false);
        setAttemptCount(1);
        setRiddelText("");
    };

    return { handleSendMessage, isMiniGameActive, isModalOpen, setIsModalOpen, startMiniGame, stopMiniGame, riddleText, gameFeedback };
}