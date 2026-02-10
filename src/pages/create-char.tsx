import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";

declare global {
    interface Window {
        bgm?: HTMLAudioElement;
    }
}

export default function CreateChar() { // onStartGame prop 제거
    const [inputName, setInputName] = useState('');
    const navigate = useNavigate();
    const setCharacterName = useUserStore((state) => state.setCharacterName);

    const handleJoinWorld = () => {
        if (inputName.trim()) {
            const audio = new Audio("./assets/sounds/cinematic_tension_soundridemusic.mp3");
            audio.loop = true;
            audio.play().catch(e => console.log("재생 실패:", e));
            
            window.bgm = audio;

            setCharacterName(inputName);
            // onStartGame 호출 제거

            navigate('/select-scenario'); // gamemain 대신 select-scenario로 이동
        }
    };

    const handleBackToLogin = () => {
        navigate('/login');
    };

    

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
            <div className="card w-full max-w-md bg-base-100 shadow-xl border border-base-300">
                <h2 className="card-title text-3xl font-black text-base-content mb-2 uppercase tracking-widest text-center w-full justify-center">
                    TRPG Online
                </h2>
                <p className="text-base-content/80 mb-6 font-medium tracking-widest text-center w-full justify-center">이름을 입력하세요.</p>

                <input
                    type="text"
                    placeholder="이름"
                    className="input input-bordered w-full focus:input primary text-center text-lg"
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleJoinWorld()}
                />

                <button
                    onClick={handleJoinWorld}
                    disabled={!inputName.trim()}
                    className="btn btn-primary w-full mt-4 text-primary-content font-bold"
                >
                    시작하기
                </button>
                <button
                    onClick={handleBackToLogin}
                    className="btn btn-ghost btn-sm mt-2 text-base-content/70"
                >
                    로그인 화면으로 돌아가기
                </button>
            </div>
        </div>
    )
}