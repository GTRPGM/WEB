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

    const processStream = async (response: Response, isRiddle: boolean) => {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        if (!reader) return;

        try {
            await new Promise(resolve => setTimeout(resolve, 3000));

            let msgId = "";
            if (!isRiddle) {
                msgId = addMessage('GM', '');
            }

            let accumulated = "";
            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                const text = decoder.decode(value);
                accumulated += text;

                if(!isRiddle && msgId) { 
                    updateMessageContent(msgId, accumulated); 
                }
                if (isRiddle) {
                    setRiddleText(accumulated);
                }
            }
        } finally {
            setGmthinking(false);
        }
    };

    const handleSendMessage = async (text: string, username: string) => {
        if (!text.trim()) return;
        const token = useAuthStore.getState().access_token ?? "";
        if (!token) return;

        setGmthinking(true);

        const isOpening = text.includes("오프닝");
        if(username !== "System" && !isOpening) {
            addMessage(username, text);
        }

        try {
            const response = await gameService.generateChat(text, token);
            if (!response.ok) throw new Error();

            await processStream(response, false);
        } catch (error) {
            setGmthinking(false);
            addMessage('GM', '연결에 실패했습니다.');
        }
    };

    const handleAnswerSubmit = async (answer: string) => {
        if (!answer.trim()) return;
        const token = useAuthStore.getState().access_token ?? "";
        
        setGmthinking(true);
        setGameFeedback("");

        try {
            const response = await gameService.checkAnswer(answer, attemptCount, token);
            if (!response.ok) throw new Error();

            const gameData = await response.json();
            const result = gameData.data;
            
            setGameFeedback(result.message);

            if (result.is_correct) {
                setMiniGameActive(false);
                setAttemptCount(1);
                addMessage("GM", `정답입니다! : ${result.message}`);
                setTimeout(() => setIsModalOpen(false), 2000);
            } else {
                setAttemptCount(prev => result.fail_count || prev + 1);
            }
        } catch (error) {
            setGameFeedback("정답 확인 중 오류가 발생했습니다.");
        } finally {
            setGmthinking(false);
        }
    };

    const startMiniGame = async () => {
        const token = useAuthStore.getState().access_token ?? "";
        setIsModalOpen(true);
        setGmthinking(true);
        setRiddleText("");
        setGameFeedback("");

        try {
            const response = await gameService.getMiniGame(token);
            if (!response.ok) throw new Error();
            setMiniGameActive(true);
            setAttemptCount(1);
            
            await processStream(response, true);
        } catch (error) {
            setGmthinking(false);
            setGameFeedback("미니게임을 불러오지 못했습니다.");
        }
    };

    const stopMiniGame = () => {
        setMiniGameActive(false);
        setIsModalOpen(false);
        setRiddleText("");
        setGameFeedback("");
        setGmthinking(false);
    };

    return { handleSendMessage, handleAnswerSubmit, isMiniGameActive, isModalOpen, setIsModalOpen, startMiniGame, stopMiniGame, riddleText, gameFeedback};
}