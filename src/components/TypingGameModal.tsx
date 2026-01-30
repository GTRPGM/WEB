import { useEffect, memo } from "react";
import { useTypingGame } from "../hooks/useTypingGame";

// 1. 이 인터페이스에 onStatusChange를 반드시 추가해야 합니다!
interface TypingGameModalProps {
    isOpen: boolean;
    onClose: () => void;
    onStatusChange: (open: boolean) => void; // 이 줄이 빠져있을 확률이 높습니다.
}

// 2. 인자(Props) 부분에서도 onStatusChange를 구조분해 할당으로 받아옵니다.
const TypingGameModal = memo(({ isOpen, onClose, onStatusChange }: TypingGameModalProps) => {
    const { 
        targetText, 
        userInput, 
        timeLeft, 
        isFinished, 
        correctCount, 
        handleInput, 
        startNewGame 
    } = useTypingGame();

    // 모달이 열릴 때 초기화 및 부모 상태 업데이트
    useEffect(() => {
        if (isOpen) {
            startNewGame();
        }
        // 모달의 열림/닫힘 상태를 부모(GameMain)의 Active 전광판에 반영
        onStatusChange(isOpen); 
    }, [isOpen, startNewGame, onStatusChange]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* 배경 오버레이 */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

            {/* 모달 창 본문 */}
            <div className="relative z-[10000] w-full max-w-2xl bg-white border border-gray-200 shadow-2xl p-8 rounded-3xl text-gray-800 animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-black uppercase tracking-tight text-gray-900">제한시간: 1분</h3>
                    <div className="flex items-center gap-4">
                        <span className="badge badge-lg font-bold bg-blue-100 text-blue-700 border-none px-4 py-4">성공: {correctCount}</span>
                        <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">✕</button>
                    </div>
                </div>

                {/* 시간 바 */}
                <div className="w-full bg-gray-100 h-2.5 rounded-full mb-8 overflow-hidden border border-gray-50">
                    <div 
                        className={`h-full transition-all duration-1000 ease-linear ${timeLeft < 10 ? 'bg-red-500' : 'bg-primary'}`}
                        style={{ width: `${(timeLeft / 60) * 100}%` }}
                    ></div>
                </div>

                {!isFinished ? (
                    <div className="space-y-6">
                        <div className="bg-gray-50 p-10 rounded-2xl border border-gray-100 shadow-inner relative min-h-[140px] flex items-center justify-center">
                            <div className="absolute inset-0 p-10 text-gray-300 text-2xl font-mono break-all leading-relaxed select-none">
                                {targetText}
                            </div>
                            <div className="relative text-2xl font-mono break-all leading-relaxed w-full text-left">
                                {userInput.split("").map((char, i) => (
                                    <span key={i} className={char === targetText[i] ? "text-primary font-bold" : "text-red-500 bg-red-50"}>
                                        {char}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <input
                            className="input input-bordered w-full bg-white border-gray-200 focus:border-primary text-xl h-16 px-6 shadow-sm"
                            value={userInput}
                            onChange={(e) => handleInput(e.target.value)}
                            placeholder="최대한 빠르게 타이핑하세요!"
                            autoFocus
                        />
                        <div className="text-center">
                            <span className={`text-2xl font-black ${timeLeft < 10 ? 'text-red-500 animate-bounce' : 'text-gray-400'}`}>
                                {timeLeft}s
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-10 animate-in slide-in-from-bottom-4">
                        <h4 className="text-3xl font-black text-gray-800 mb-2">시간 종료!</h4>
                        <div className="bg-blue-50 rounded-2xl p-8 my-8 border border-blue-100">
                            <p className="text-gray-500 font-bold uppercase tracking-widest mb-1">최종 기록</p>
                            <p className="text-6xl font-black text-primary">{correctCount} <span className="text-2xl">문장 성공</span></p>
                        </div>
                        <div className="flex gap-4">
                            <button className="btn btn-primary flex-1 text-white font-bold h-14" onClick={onClose}>기록 저장 및 닫기</button>
                            <button className="btn btn-outline border-gray-200 flex-1 h-14 text-gray-600" onClick={startNewGame}>다시 도전</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
});

export default TypingGameModal;