// hooks/useMiniGame.ts
import { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { gameService } from "../services/miniGameService";
import type { StreamUpdateHandler } from "./useChatStream";

export function useMiniGame(processStream: (res: Response, onUpdate: StreamUpdateHandler) => Promise<void> ) {
    const { addMessage, setGmthinking } = useChatStore();
    const [attemptCount, setAttemptCount] = useState(1);
    const [isMiniGameActive, setMiniGameActive] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [riddleText, setRiddleText] = useState("");
    const [gameFeedback, setGameFeedback] = useState("");

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
            await processStream(response, (text: string) => { setRiddleText(text) });
        } catch (error) {
            setGmthinking(false);
            setGameFeedback("미니게임을 불러오지 못했습니다.");
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

    const stopMiniGame = () => {
        setMiniGameActive(false);
        setIsModalOpen(false);
        setRiddleText("");
        setGameFeedback("");
        setGmthinking(false);
    };

    return { 
        isMiniGameActive, isModalOpen, setIsModalOpen, 
        riddleText, gameFeedback, startMiniGame, handleAnswerSubmit, stopMiniGame, setRiddleText
    };
}