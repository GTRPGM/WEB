import { useState, useEffect } from "react";
import api from "../apiinterceptor";

interface GameLoaderProps {
    onLoadingComplete: () => void;
}

interface LoadingData {
    phrases: string[];
    tips: string[];
}

export default function GameLoader({ onLoadingComplete }: GameLoaderProps) {
    const [progress, setProgress] = useState(0);
    const [loadingText, setLoadingText] = useState("통신 채널 확보 중...");
    const [currentTip, setCurrentTip] = useState("수수께끼를 풀어보세요.");
    const [apiData, setApiData] = useState<LoadingData | null>(null);

    useEffect(() => {
        const fetchLoadingData = async () => {
            try {
                const response = await api.get("/info/loading-messages");
                setApiData(response.data);
                if (response.data.phrases?.length > 0) setLoadingText(response.data.phrases[0]);
                if (response.data.tips?.length > 0) setCurrentTip(response.data.tips[0]);
            } catch (error) {
                console.error("데이터 로드 실패");
            }
        };
        fetchLoadingData();

        const duration = 15000; 
        const intervalTime = 100;
        const increment = 100 / (duration / intervalTime);

        const progressTimer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(progressTimer);
                    setTimeout(handleFinishWithFate, 500);
                    return 100;
                }
                return prev + increment;
            });
        }, intervalTime);

        const handleFinishWithFate = () => {
            if (window.bgm) {
                const audio = window.bgm;
                const fadeOut = setInterval(() => {
                    if (audio.volume > 0.05) {
                        audio.volume -= 0.05;
                    } else {
                        audio.pause();
                        audio.currentTime = 0;
                        clearInterval(fadeOut);
                        window.bgm = undefined;
                        onLoadingComplete();
                    }
                }, 50);
            } else {
                onLoadingComplete();
            }
        };

        const textTimer = setInterval(() => {
            if (apiData) {
                const randomPhrase = apiData.phrases[Math.floor(Math.random() * apiData.phrases.length)];
                const randomTip = apiData.tips[Math.floor(Math.random() * apiData.tips.length)];
                setLoadingText(randomPhrase);
                setCurrentTip(randomTip);
            }
        }, 3500);

        return () => {
            clearInterval(progressTimer);
            clearInterval(textTimer);
        };
    }, [onLoadingComplete, apiData]);

return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white text-gray-800 overflow-hidden">
            
            {/* 📡 배경 애니메이션: 펄스 (진한 파란색으로 변경) */}
            <div className="absolute flex items-center justify-center inset-0 pointer-events-none">
                <div className="pulse border-blue-400" style={{ animationDelay: '0s' }}></div>
                <div className="pulse border-blue-300" style={{ animationDelay: '2s' }}></div>
            </div>


            <div className="relative z-10 w-full max-w-md px-10 text-center">
                <div className="mb-16">
                    <h2 className="text-4xl font-black text-primary tracking-tighter uppercase drop-shadow-sm">
                        TRPG ONLINE
                    </h2>
                    <p className="text-gray-500 mt-2 text-xs font-bold uppercase tracking-widest">
                        Please Wait a Moment
                    </p>
                </div>

                <div className="flex justify-between mb-3 px-1">
                    <span className="text-xs font-bold text-gray-600">{loadingText}</span>
                    <span className="text-xs font-bold text-primary">{Math.round(progress)}%</span>
                </div>

                <div className="w-full h-3 bg-gray-200 rounded-full border border-gray-300 p-[1px] shadow-inner">
                    <div
                        className="h-full bg-primary rounded-full transition-all duration-300 ease-out shadow-md"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                <div className="mt-10 h-4">
                    <p className="text-[11px] text-gray-500 font-bold italic">
                        " { currentTip } "
                    </p>
                </div>
            </div>

            <style>{`
                .pulse {
                    position: absolute;
                    border-style: solid;
                    border-width: 3px; /* 선을 더 두껍게 */
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