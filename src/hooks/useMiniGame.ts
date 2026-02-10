import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { gameService } from "../services/miniGameService";
import type { RankingItem } from "../types";
import { useUserStore } from "../store/useUserStore";

export function useMiniGame() {
    const { setGmthinking } = useChatStore();
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

    const closeOnlyModal = () => setIsModalOpen(false);

    const finishGame = () => {
        if (score > 0) {
            const userName = userProfile?.name || "익명";
            const newRecord = {
                score: score,
                name: userName,
                date: new Date().toLocaleDateString(),
            };
            const savedRankings = sessionStorage.getItem("miniGame_rankings");
            const currentRankings = savedRankings ? JSON.parse(savedRankings) : [];
            const updatedRankings = [...currentRankings, newRecord]
                .sort((a, b) => b.score - a.score)
                .slice(0, 10);
            sessionStorage.setItem("miniGame_rankings", JSON.stringify(updatedRankings));
            setRankings(updatedRankings);
        }
        setScore(0);
        setSolvedCount(0);
        setMiniGameActive(false);
        setIsCorrect(false);
        setRiddleText("");
        setGameFeedback("");
    };

    /**
     * 💡 순수 문자열(String) 응답 처리 로직
     */
    const startMiniGame = async () => {
        setIsModalOpen(true);
        setGmthinking(true);
        setRiddleText("");
        setGameFeedback("");

        try {
            const response = await gameService.getMiniGame();
            
            // 💡 핵심: 응답이 "string"이므로 Axios를 쓴다면 response.data가 문자열일 것입니다.
            // 만약 gameService에서 이미 .data를 반환한다면 response 자체가 문자열입니다.
            const fullText = typeof response === 'string' ? response : response.data;

            if (!fullText || typeof fullText !== 'string') {
                throw new Error("서버 응답이 올바른 문자열 형식이 아닙니다.");
            }

            setMiniGameActive(true);
            setAttemptCount(1);
            setIsCorrect(false);

            // 타이핑 효과 연출
            let i = 0;
            setRiddleText("");
            const typingInterval = setInterval(() => {
                setRiddleText((prev) => prev + fullText.charAt(i));
                i++;
                if (i >= fullText.length) {
                    clearInterval(typingInterval);
                }
            }, 30);

        } catch (error) {
            console.error("미니게임 로딩 에러:", error);
            setGameFeedback("미니게임을 불러오지 못했습니다.");
        } finally {
            setGmthinking(false);
        }
    };

    const handleAnswerSubmit = async (answer: string) => {
        if (!answer.trim()) return;
        setGmthinking(true);
        setGameFeedback("");

        try {
            const response = await gameService.checkAnswer(answer, attemptCount, "RIDDLE");
            const result = response.data || response;
            
            // 정답 여부 판단 (서버 응답 필드명에 따라 조정)
            if (result && (result.result === 'correct' || result.is_correct)) {
                setScore(prev => prev + 10);
                setSolvedCount(prev => prev + 1);
                setAttemptCount(1);
                setIsCorrect(true);
                setGameFeedback(result.message || "정답입니다!");
            } else {
                setIsCorrect(false);
                setGameFeedback(result.message || "오답입니다. 다시 도전해보세요!");
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