import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { gameService } from "../services/miniGameService";
import type { StreamUpdateHandler } from "./useChatStream";
import type { RankingItem } from "../types";

export function useMiniGame(processStream: (res: Response, onUpdate: StreamUpdateHandler) => Promise<void> ) {
    const { setGmthinking } = useChatStore();
    const [attemptCount, setAttemptCount] = useState(1);
    const [isMiniGameActive, setMiniGameActive] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [riddleText, setRiddleText] = useState("");
    const [gameFeedback, setGameFeedback] = useState("");
    const [isCorrect, setIsCorrect] = useState(false);
    const [score, setScore] = useState<number>(() => {
        const saved = sessionStorage.getItem("miniGame_score");
        return saved ? Number(saved) : 0;
    });
    const [solvedCount, setSolvedCount] = useState<number>(() => {
        const saved = sessionStorage.getItem("miniGame_solvedCount");
        return saved ? Number(saved) : 0;
    });
    const [rankings, setRankings] = useState<RankingItem[]>(() => {
        const saved = sessionStorage.getItem("miniGame_rankings");
        return saved ? JSON.parse(saved) : [];
    });
    const closeOnlyModal = () => {
        setIsModalOpen(false);
    };

    const finishGame = () => {
        if (score > 0) {
            const newRecord = {
                score: score,
                date: new Date().toLocaleDateString(),
            };

            const savedRankings = sessionStorage.getItem("miniGame_rankings");
            const currentRankings = savedRankings ? JSON.parse(savedRankings) : [];

            const updatedRankings = [...currentRankings, newRecord]
                .sort((a,b) => b.score - a.score)
                .slice(0,10);

            sessionStorage.setItem("miniGame_rankings",JSON.stringify(updatedRankings));
            setRankings(updatedRankings);
        }

        setScore(0);
        setSolvedCount(0);
        setMiniGameActive(false);
        setIsCorrect(false);
        setRiddleText("");
        setGameFeedback("");
    }

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
            setIsCorrect(false);

            await processStream(response, (text: string) => { setRiddleText(text) });
        } catch (error) {
            setGameFeedback("미니게임을 불러오지 못했습니다.");
        } finally {
            setGmthinking(false);
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
            console.log("서버 응답 데이터:", gameData);
            const result = gameData.data || gameData;
            setGameFeedback(result.message);

            if (result && result.result === 'correct') {
                setScore(prev => prev + 10);
                setSolvedCount(prev => prev + 1)

                setAttemptCount(1);
                setIsCorrect(true);

                setGameFeedback(result.message);
            } else {
                setIsCorrect(false);
                setGameFeedback(result.message);
                setAttemptCount(prev => result.fail_count || prev + 1);
            }
        } catch (error) {
            setGameFeedback("정답 확인 중 오류가 발생했습니다.");
        } finally {
            setGmthinking(false);
        }
    };

    const handleNextGame = () => {
        setIsCorrect(false);
        setGameFeedback("");
        setRiddleText("");
        startMiniGame();
    };

    const stopMiniGame = () => {
        setMiniGameActive(false);
        setIsModalOpen(false);
        setRiddleText("");
        setGameFeedback("");
        setGmthinking(false);
        setIsCorrect(false);
        setScore(0);
    };

    useEffect(() => {
        sessionStorage.setItem("miniGame_score", score.toString());
        sessionStorage.setItem("miniGame_solvedCount", solvedCount.toString());
    }, [score, solvedCount]);

    return { 
        isMiniGameActive, isModalOpen, setIsModalOpen, 
        riddleText, gameFeedback, startMiniGame, handleAnswerSubmit, stopMiniGame, setRiddleText,
        score, solvedCount, isCorrect, handleNextGame, rankings, finishGame, closeOnlyModal
    };
}