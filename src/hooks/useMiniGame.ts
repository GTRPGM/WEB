import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
// import { useAuthStore } from "../store/useAuthStore"; // useAuthStore 제거
import { gameService } from "../services/miniGameService";
import { useChatStream } from "./useChatStream"; // useChatStream 임포트
import type { RankingItem } from "../types";
import { useUserStore } from "../store/useUserStore";

export function useMiniGame() { // processStream 인자 제거
    const { setGmthinking } = useChatStore();
    const { processStream } = useChatStream(); // processStream 직접 사용
    const [attemptCount, setAttemptCount] = useState(1);
    const [isMiniGameActive, setMiniGameActive] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [riddleText, setRiddleText] = useState("");
    const [gameFeedback, setGameFeedback] = useState("");
    const [isCorrect, setIsCorrect] = useState(false);
    const { userProfile } = useUserStore();
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
            const userName = userProfile.name || "익명";
            const newRecord = {
                score: score,
                name: userName,
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
        // const token = useAuthStore.getState().access_token ?? ""; // token 제거
        setIsModalOpen(true);
        setGmthinking(true);
        setRiddleText("");
        setGameFeedback("");

        try {
            const riddleData = await gameService.getMiniGame(); // token 제거
            // if (!response.ok) throw new Error(); // axios에서 에러 처리됨

            setMiniGameActive(true);
            setAttemptCount(1);
            setIsCorrect(false);

            // riddleData가 riddle 텍스트를 포함한다고 가정
            await processStream(riddleData.riddle, (text: string) => { setRiddleText(text) });
        } catch {
            setGameFeedback("미니게임을 불러오지 못했습니다.");
        } finally {
            setGmthinking(false);
        }
    };

    const handleAnswerSubmit = async (answer: string) => {
        if (!answer.trim()) return;
        // const token = useAuthStore.getState().access_token ?? ""; // token 제거
        setGmthinking(true);
        setGameFeedback("");

        try {
            const gameData = await gameService.checkAnswer(answer, attemptCount, "RIDDLE"); // token 제거
            // if (!response.ok) throw new Error(); // axios에서 에러 처리됨
            
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
        } catch {
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