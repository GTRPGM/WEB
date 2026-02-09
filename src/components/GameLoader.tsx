import { useState } from "react";
// import api from "../apiinterceptor"; // api import removed as it's no longer used

export default function GameLoader() {
    const [loadingText] = useState("게임 데이터를 불러오는 중...");
    const [currentTip] = useState("잠시만 기다려주세요.");

    // All internal logic for timing and completion removed.
    // The component will just display its UI until unmounted by parent.

    return (
        <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-white text-gray-800 overflow-hidden">
            
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
                </div>

                <div className="w-full h-3 bg-gray-200 rounded-full border border-gray-300 p-[1px] shadow-inner">
                    <div
                        className="h-full bg-primary rounded-full transition-all duration-300 ease-out shadow-md"
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