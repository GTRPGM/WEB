import { useState, useEffect } from "react";

interface GameLoaderProps {
    progress?: number; 
    data?: {
        phrases: string[];
        tips: string[];
    };
}

export default function GameLoader({ progress = 0, data }: GameLoaderProps) {
    const [loadingText, setLoadingText] = useState("게임 데이터를 불러오는 중...");
    const [currentTip, setCurrentTip] = useState("잠시만 기다려주세요.");

    // 💡 팁 롤링 로직 추가
    useEffect(() => {
        if (!data || !data.tips || data.tips.length === 0) return;

        // 1. 처음 데이터가 들어왔을 때 즉시 하나 표시
        setLoadingText(data.phrases[0] || "데이터 동기화 중...");
        setCurrentTip(data.tips[Math.floor(Math.random() * data.tips.length)]);

        // 2. 3초마다 문장을 무작위로 변경
        const interval = setInterval(() => {
            const nextTip = data.tips[Math.floor(Math.random() * data.tips.length)];
            setCurrentTip(nextTip);
        }, 2000);

        return () => clearInterval(interval);
    }, [data]);

    return (
        <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-base-100 text-base-content overflow-hidden">
            
            <div className="absolute flex items-center justify-center inset-0 pointer-events-none">
                <div className="pulse border-primary" style={{ animationDelay: '0s' }}></div>
                <div className="pulse border-primary/70" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="relative z-10 w-full max-w-md px-10 text-center">
                <div className="mb-16">
                    <h2 className="text-4xl font-black text-primary tracking-tighter uppercase drop-shadow-sm">
                        TRPG ONLINE
                    </h2>
                    <p className="text-base-content/80 mt-2 text-xs font-bold uppercase tracking-widest text-center">
                        Please Wait a Moment
                    </p>
                </div>

                <div className="flex justify-between mb-3 px-1">
                    <span className="text-xs font-bold text-base-content/90">{loadingText}</span>
                    <span className="text-xs font-bold text-primary">{progress}%</span>
                </div>

                <div className="w-full h-3 bg-base-200 rounded-full border border-base-300 p-[1px] shadow-inner">
                    <div
                        className="h-full bg-primary rounded-full transition-all duration-300 ease-out shadow-md"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                {/* 💡 애니메이션이 적용된 팁 영역 */}
                <div className="mt-10 min-h-[4rem] flex items-center justify-center animate-in fade-in duration-1000" key={currentTip}>
                    <p className="text-[13px] text-base-content/80 font-bold italic leading-relaxed px-6 text-center">
                        " { currentTip } "
                    </p>
                </div>
            </div>

            <style>{`
                .pulse {
                    position: absolute;
                    border-style: solid;
                    border-width: 3px;
                    border-radius: 50%;
                    animation: ripple 5s infinite ease-out;
                }
                @keyframes ripple {
                    0% { width: 0; height: 0; opacity: 1; }
                    100% { width: 1200px; height: 1200px; opacity: 0; }
                }
            `}</style>
        </div>
    );
}