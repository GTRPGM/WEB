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
    const timerRef = useRef<number|null>(null); 

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
            setSentenceList(["서버 연결 실패. 다시 시도해 주세요."]);
        }
    }, []);

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

        return () => {
            if (timerRef.current) window.clearInterval(timerRef.current);
        };
    }, [sentenceList.length, isFinished]);

    const handleInput = (value: string) => {
        if (isFinished) return;
        setUserInput(value);

        if (value === sentenceList[currentIndex]) {
            setCorrectCount(prev => prev + 1);
            setUserInput("");
            setCurrentIndex(prev => (prev < sentenceList.length - 1 ? prev + 1 : 0));
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