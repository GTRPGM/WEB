import { useState, useCallback, useRef, useEffect } from "react";
import { typingService } from "../services/typingService";
import { useChatStore } from "../store/useChatStore";

export const useTypingGame = () => {
    const { typingSentences, addTypingSentences } = useChatStore();
    const [targetText, setTargetText] = useState("");
    const [userInput, setUserInput] = useState("");
    const [timeLeft, setTimeLeft] = useState(60); 
    const [isFinished, setIsFinished] = useState(false);
    const [isStarted, setIsStarted] = useState(false);
    const [correctCount, setCorrectCount] = useState(0);
    const [sentencesLoaded, setSentencesLoaded] = useState(false);

    const timerRef = useRef<number|null>(null); 
    const isFetching = useRef(false); // 💡 데이터를 가져오는 중인지 확인하는 엄격한 플래그

    // 무작위 문장 선택
    const pickRandomSentence = useCallback(() => {
        if (typingSentences.length > 0) {
            const randomIndex = Math.floor(Math.random() * typingSentences.length);
            setTargetText(typingSentences[randomIndex]);
        }
    }, [typingSentences]);

    // 문장 확보 로직 (중복 호출 방지 강화)
    const prepareSentences = useCallback(async () => {
        // 💡 이미 데이터를 가져오는 중이거나, 문장이 충분하면 중단
        if (isFetching.current) return;
        
        isFetching.current = true; // 잠금

        try {
            let currentPool = [...typingSentences];
            // 최소 4개의 문장이 확보될 때까지 서버에 요청
            if (currentPool.length < 10) {
                const newSent = await typingService.fetchTypingTexts();
                if (newSent && newSent.length > 0) {
                    addTypingSentences(newSent);
                }
            }
            setSentencesLoaded(true);
        } catch (error) {
            console.error("문장 준비 실패:", error);
        } finally {
            isFetching.current = false; // 잠금 해제
        }
    }, [typingSentences, addTypingSentences]);

    const startGame = useCallback(() => {
        if (typingSentences.length === 0) return;
        pickRandomSentence();
        setIsStarted(true);
        setTimeLeft(60);
        setIsFinished(false);
        setCorrectCount(0);
    }, [typingSentences, pickRandomSentence]);

    const handleInput = (value: string) => {
        if (!isStarted || isFinished || typingSentences.length === 0) return;
        
        setUserInput(value);

        if (value === targetText) {
            setCorrectCount(prev => prev + 1);
            setUserInput("");
            pickRandomSentence(); 
        }
    };

    useEffect(() => {
        if (isStarted && !isFinished) {
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
        return () => { if (timerRef.current) window.clearInterval(timerRef.current); };
    }, [isStarted, isFinished]);

    const resetGame = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        isFetching.current = false; // 리셋 시 플래그도 초기화
        setIsStarted(false);
        setIsFinished(false);
        setUserInput("");
    }, []);

    return { 
        targetText, userInput, timeLeft, isFinished, isStarted, 
        correctCount, handleInput, prepareSentences, startGame, 
        sentencesLoaded, resetGame 
    };
};