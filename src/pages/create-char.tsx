import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";

declare global {
    interface Window {
        bgm?: HTMLAudioElement;
    }
}

export default function CreateChar() {
    const [inputName, setInputName] = useState('');
    const navigate = useNavigate();
    const setCharacterName = useUserStore((state) => state.setCharacterName);

    // 💡 로그인 페이지와 동일한 배경 이미지 경로 설정
    const bgImageUrl = "/assets/background/login-bg.png";

    const handleJoinWorld = () => {
        if (inputName.trim()) {
            const audio = new Audio("./assets/sounds/cinematic_tension_soundridemusic.mp3");
            audio.loop = true;
            audio.play().catch(e => console.log("재생 실패:", e));
            
            window.bgm = audio;
            setCharacterName(inputName);

            // 💡 부드러운 전환을 위해 약간의 지연 후 이동
            setTimeout(() => {
                navigate('/select-scenario');
            }, 300);
        }
    };

    const handleBackToLogin = () => {
        navigate('/login');
    };

    return (
        <div 
            className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat relative px-4"
            style={{ 
                backgroundImage: `url('${bgImageUrl}')`,
                backgroundColor: '#1a1a1a'
            }}
        >
            {/* 배경 오버레이 (가독성을 위한 어두운 레이어) */}
            <div className="absolute inset-0 bg-base-100/35 backdrop-blur-[4px]"></div>

            {/* 메인 카드 박스 */}
            <div className="relative z-10 card w-full max-w-md bg-base-100/90 backdrop-blur-md shadow-2xl border border-white/10 animate-in fade-in zoom-in duration-500">
                <div className="card-body p-10 items-center">
                    
                    {/* 상단 타이틀 섹션 */}
                    <div className="text-center mb-8">
                        <h2 className="text-4xl font-black text-primary mb-2 uppercase tracking-tighter drop-shadow-md">
                            Character
                        </h2>
                        <div className="h-1 w-12 bg-primary mx-auto rounded-full opacity-50 mb-4"></div>
                        <p className="text-base-content/70 font-bold text-xs uppercase tracking-[0.2em] italic">
                            Who are you in this world?
                        </p>
                    </div>

                    <div className="w-full space-y-6">
                        {/* 이름 입력 필드 */}
                        <div className="form-control">
                            <label className="label text-[10px] font-black uppercase text-base-content/40 tracking-widest px-1 mb-1">
                                Adventurer Name
                            </label>
                            <input
                                type="text"
                                placeholder="당신의 이름을 새기세요..."
                                className="input input-bordered w-full bg-base-200/50 focus:input-primary text-center text-lg font-bold h-14"
                                value={inputName}
                                onChange={(e) => setInputName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleJoinWorld()}
                                autoFocus
                            />
                        </div>

                        {/* 액션 버튼 섹션 */}
                        <div className="pt-2 space-y-3">
                            <button
                                onClick={handleJoinWorld}
                                disabled={!inputName.trim()}
                                className="btn btn-primary w-full h-14 text-lg font-black rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.01] transition-all disabled:opacity-50"
                            >
                                여정 시작하기
                            </button>
                            
                            <button
                                onClick={handleBackToLogin}
                                className="btn btn-ghost btn-block btn-sm text-base-content/40 hover:text-base-content hover:bg-transparent font-bold text-[11px] uppercase tracking-tighter transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to Login
                            </button>
                        </div>
                    </div>

                    {/* 하단 데코레이션 */}
                    <div className="mt-8 opacity-20 pointer-events-none">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="currentColor" className="text-base-content">
                            <path d="M20 0L23.5 16.5L40 20L23.5 23.5L20 40L16.5 23.5L0 20L16.5 16.5L20 0Z" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}