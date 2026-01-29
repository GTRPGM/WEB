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
        // 1. 백엔드 데이터 가져오기 (인터셉터 사용)
        const fetchLoadingData = async () => {
            try {
                // 암호화 없이 일반적인 GET 요청
                const response = await api.get("/info/loading-messages");
                setApiData(response.data);
                
                if (response.data.phrases?.length > 0) setLoadingText(response.data.phrases[0]);
                if (response.data.tips?.length > 0) setCurrentTip(response.data.tips[0]);
            } catch (error) {
                console.error("데이터 로드 실패, 기본 문구를 사용합니다.");
                // 실패 시 기본 문구 유지
            }
        };
        fetchLoadingData();

        // 2. 로딩 바 진행 (15초 기준)
        const duration = 15000; 
        const intervalTime = 100;
        const increment = 100 / (duration / intervalTime);

        const progressTimer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(progressTimer);
                    setTimeout(onLoadingComplete, 800); // 100% 도달 후 부드럽게 전환
                    return 100;
                }
                return prev + increment;
            });
        }, intervalTime);

        // 3. 문구 및 팁 순환 변경
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
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white">
            <div className="absolute flex items-center justify-center inset-0">
                <div className="pulse" style={{ animationDelay: '0s' }}></div>
                <div className="pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="absolute inset-0 pointer-events-none">
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className="bubble"
                        style={{
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${3 + Math.random() * 4}s`,
                            width: `${10 + Math.random() * 20}px`,
                            height: `${10 + Math.random() * 20}px`,
                        }}
                    />
                ))}
            </div>

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
                    "{ currentTip }"
                </p>
            </div>

            <style>{`
                .bubble {
                    position: absolute;
                    bottom: -50px;
                    background: rgba(59, 130, 246, 0.2);
                    border-radius: 50%;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    animation: rise infinite ease-in;
                }

                @keyframes rise {
                    0% { transform: translateY(0) scale(1); opacity: 0; }
                    20% { opacity: 0.5; }
                    100% { transform: translateY(-120vh) scale(1.5); opacity: 0; }
                }

                .pulse {
                position: absolute;
                border: 2px solid rgba(59, 130, 246, 0.4);
                border-radius: 50%;
                animation: ripple 4s infinite ease-out;
                }

                @keyframes ripple {
                0% { width: 0; height: 0; opacity: 1; }
                100% { width: 500px; height: 500px; opacity: 0; }
                }
            `}</style>
        </div>
    );
}