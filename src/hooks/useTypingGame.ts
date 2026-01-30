import { useState, useEffect, useCallback, useRef } from "react";
import { typingService } from "../services/typingService";

export const useTypingGame = () => {
    const [sentenceList, setSentenceList] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userInput, setUserInput] = useState("");
    
    const [timeLeft, setTimeLeft] = useState(60); 
    const [isFinished, setIsFinished] = useState(false);
    const [correctCount, setCorrectCount] = useState(0);

    // NodeJS.Timeout 대신 범용적인 number 또는 null 사용
    const timerRef = useRef<any>(null); 

    const startNewGame = useCallback(async () => {
        try {
            const sentences = await typingService.fetchTypingTexts();
            setSentenceList(sentences);
            setCurrentIndex(0);
            setUserInput("");
            setTimeLeft(60);
            setIsFinished(false);
            setCorrectCount(0);
        } catch (error) {
            console.error("Failed to load sentences", error);
            setSentenceList(["The quick brown fox jumps over the lazy dog."]);
        }
    }, []);

    // 타이머 로직: timeLeft가 변할 때마다 실행되는 대신, 게임 시작 시 한 번만 실행되도록 최적화
    useEffect(() => {
        if (sentenceList.length > 0 && !isFinished) {
            timerRef.current = window.setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        if (timerRef.current) clearInterval(timerRef.current);
                        setIsFinished(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        // Cleanup: 컴포넌트가 사라지거나 게임이 끝날 때 타이머 제거
        return () => {
            if (timerRef.current) window.clearInterval(timerRef.current);
        };
    }, [sentenceList.length, isFinished]);

    const handleInput = (value: string) => {
        if (isFinished) return;
        setUserInput(value);

        const currentTarget = sentenceList[currentIndex];

        // 정확히 일치할 경우 다음 문장으로
        if (value === currentTarget) {
            setCorrectCount(prev => prev + 1);
            setUserInput("");
            
            if (currentIndex < sentenceList.length - 1) {
                setCurrentIndex(prev => prev + 1);
            } else {
                setCurrentIndex(0); // 문장 다 쓰면 처음부터 다시
            }
        }
    };

    return { 
        targetText: sentenceList[currentIndex] || "", 
        userInput, 
        timeLeft, 
        isFinished, 
        correctCount,
        handleInput, 
        startNewGame 
    };
};