import { useEffect, memo, useCallback } from "react";
import { useTypingGame } from "../hooks/useTypingGame";
import { typingService } from "../services/typingService";

interface TypingGameModalProps {
    isOpen: boolean;
    onClose: () => void;
    onStatusChange: (open: boolean) => void;
}


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

    const handleSaveAndClose = useCallback(() => {
        if (isFinished) {
            typingService.saveTypingResult({ correctCount, avgWpm: 0 });
        }
        onClose();
    }, [isFinished, correctCount, onClose]);


    useEffect(() => {
        if (isOpen) {
            startNewGame();
            onStatusChange(isOpen);
        }
        onStatusChange(isOpen); 
    }, [isOpen, startNewGame, onStatusChange]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* 배경 오버레이 */}
            <div className="absolute inset-0 bg-neutral/50 backdrop-blur-sm" onClick={onClose}></div>

            {/* 모달 창 본문 */}
            <div className="relative z-[10000] w-full max-w-2xl bg-base-100 border border-base-300 shadow-2xl p-8 rounded-3xl text-base-content animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-black uppercase tracking-tight text-base-content">제한시간: 1분</h3>
                    <div className="flex items-center gap-4">
                        <span className="badge badge-lg font-bold bg-info/20 text-info border-none px-4 py-4">성공: {correctCount}</span>
                        <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">✕</button>
                    </div>
                </div>

                {/* 시간 바 */}
                <div className="w-full bg-base-200 h-2.5 rounded-full mb-8 overflow-hidden border border-base-200">
                    <div 
                        className={`h-full transition-all duration-1000 ease-linear ${timeLeft < 10 ? 'bg-error' : 'bg-primary'}`}
                        style={{ width: `${(timeLeft / 60) * 100}%` }}
                    ></div>
                </div>

                {!isFinished ? (
                    <div className="space-y-6">
                        <div className="bg-base-200 p-10 rounded-2xl border border-base-200 shadow-inner relative min-h-[140px] flex items-center justify-center">
                            <div className="absolute inset-0 p-10 text-base-content/50 text-2xl font-mono break-all leading-relaxed select-none">
                                {targetText}
                            </div>
                            <div className="relative text-2xl font-mono break-all leading-relaxed w-full text-left">
                                {userInput.split("").map((char, i) => (
                                    <span key={i} className={char === targetText[i] ? "text-primary font-bold" : "text-error bg-error/10"}>
                                        {char}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <input
                            className="input input-bordered w-full bg-base-100 border-base-300 focus:border-primary text-xl h-16 px-6 shadow-sm"
                            value={userInput}
                            onChange={(e) => handleInput(e.target.value)}
                            placeholder="최대한 빠르게 타이핑하세요!"
                            autoFocus
                        />
                        <div className="text-center">
                            <span className={`text-2xl font-black ${timeLeft < 10 ? 'text-error animate-bounce' : 'text-base-content/70'}`}>
                                {timeLeft}s
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-10 animate-in slide-in-from-bottom-4">
                        <h4 className="text-3xl font-black text-base-content mb-2">시간 종료!</h4>
                        <div className="bg-info/10 rounded-2xl p-8 my-8 border border-info/20">
                            <p className="text-base-content/80 font-bold uppercase tracking-widest mb-1">최종 기록</p>
                            <p className="text-6xl font-black text-primary">{correctCount} <span className="text-2xl">문장 성공</span></p>
                        </div>
                        <div className="flex gap-4">
                            <button className="btn btn-primary flex-1 text-primary-content font-bold h-14" onClick={handleSaveAndClose}>기록 저장 및 닫기</button>
                            <button className="btn btn-outline border-base-300 flex-1 h-14 text-base-content/90" onClick={startNewGame}>다시 도전</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
});

export default TypingGameModal;