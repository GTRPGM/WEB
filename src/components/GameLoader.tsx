import { useState, useEffect } from "react";

interface GameLoaderProps {
    onLoadingComplete: () => void;
}

export default function GameLoader({ onLoadingComplete }: GameLoaderProps) {
    const [progress, setProgress] = useState(0);
    const [loadingText, setLoadingText] = useState("데이터를 불러오는 중...");

    const phrases = [
        "월드 데이터를 구축하는 중...",
        "NPC들과 대화 내용을 동기화 중...",
        "심해의 수수께끼를 준비 중...",
        "GM이 당신을 기다리고 있습니다...",
    ];

    useEffect(() => {
        const duration = 15000;
        const intervalTime = 100;
        const increment = 100 / (duration / intervalTime);

        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(onLoadingComplete, 500);
                    return 100;
                }
                return prev + increment;
            });
        }, intervalTime);

        const textTimer = setInterval(() => {
            setLoadingText(phrases[Math.floor(Math.random() * phrases.length)]);
        }, 3000);

        return () => {
            clearInterval(timer);
            clearInterval(textTimer);
        };
    }, [onLoadingComplete]);

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white">
            <div className="w-full max-w-md px-10">
                <div className="mb-100 text-center animate-pulse">
                    <h2 className="text-4xl font-bold text-primary tracking-widest uppercase">TRPG ONLINE</h2>
                    <p className="text-slate-400 mt-2 text-sm uppercase tracking-widest">Mystery Adventure</p>
                </div>

                <div className="flex justify-between mb-2 px-1">
                    <span className="text-xs font-mono text-primary">{loadingText}</span>
                    <span className="text-xs font-mono text-primary">{Math.round(progress)}%</span>
                </div>

                <div className="w-full h-4 bg-slate-800 rounded-full border border-slate-700 p-[2px] shadow-inner">
                    <div
                        className="h-full bg-gradient-to-r from-blue-600 to-primary rounded-full transition-all duration-150 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                        style={{ width: `${progress}% `}}
                    ></div>
                </div>

                <p className="mt-8 text-[10px] text-center text-slate-500 uppercase tracking-tighter italic">
                    Tip: 수수께끼를 많이 풀수록 명예의 전당 점수가 올라갑니다.
                </p>
            </div>
        </div>
    );
}