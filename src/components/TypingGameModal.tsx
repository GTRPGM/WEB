import { useEffect, memo, useCallback } from "react";
import { useTypingGame } from "../hooks/useTypingGame";
import { typingService } from "../services/typingService";

const TypingGameModal = memo(({ isOpen, onClose, onStatusChange }: { isOpen: boolean; onClose: () => void; onStatusChange: (open: boolean) => void; }) => {
    const { 
        targetText, userInput, timeLeft, isFinished, isStarted,
        correctCount, handleInput, prepareSentences, startGame, 
        sentencesLoaded, resetGame 
    } = useTypingGame();

    // 저장 로직을 포함한 닫기
    const handleSaveAndClose = useCallback(() => {
        if (correctCount > 0) {
            typingService.saveTypingResult({ correctCount, avgWpm: 0 });
        }
        onClose();
    }, [correctCount, onClose]);

    useEffect(() => {
        if (isOpen) {
            prepareSentences(); 
        } else {
            resetGame();
        }
        onStatusChange(isOpen);
    }, [isOpen, prepareSentences, resetGame, onStatusChange]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* 배경 클릭 시 닫기 */}
            <div className="absolute inset-0 bg-neutral/50 backdrop-blur-sm" onClick={onClose}></div>
            
            <div className="relative z-[10000] w-full max-w-2xl bg-base-100 p-8 rounded-3xl shadow-2xl border border-base-300 animate-in fade-in zoom-in duration-200">
                
                {/* 우측 상단 X 버튼 (상시 노출) */}
                <button 
                    onClick={onClose} 
                    className="absolute top-6 right-6 btn btn-ghost btn-sm btn-circle text-base-content/40 hover:text-base-content transition-colors"
                >
                    ✕
                </button>

                {!isStarted ? (
                    /* 1. 게임 시작 전 */
                    <div className="text-center py-10">
                        <h3 className="text-3xl font-black mb-6 uppercase tracking-tight text-primary">Ready to Type?</h3>
                        <div className="bg-base-200 p-8 rounded-2xl mb-8 min-h-[120px] flex items-center justify-center italic text-base-content/70 text-lg">
                            {sentencesLoaded ? "문장 준비 완료! 시작 버튼을 누르세요." : "서버에서 문장을 보충하는 중..."}
                        </div>
                        <button 
                            className="btn btn-primary w-full h-16 text-xl font-bold rounded-2xl shadow-lg shadow-primary/20" 
                            onClick={startGame} 
                            disabled={!sentencesLoaded}
                        >
                            게임 시작
                        </button>
                    </div>
                ) : !isFinished ? (
                    /* 2. 게임 진행 중 */
                    <div className="space-y-6">
                        <div className="flex justify-between items-end">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-bold text-base-content/50 uppercase tracking-widest">Progress</span>
                                <span className="badge badge-lg font-bold bg-primary/10 text-primary border-none px-4 py-4">성공: {correctCount}</span>
                            </div>
                            <span className={`font-mono text-3xl font-black ${timeLeft < 10 ? 'text-error animate-pulse' : ''}`}>{timeLeft}s</span>
                        </div>

                        <div className="w-full bg-base-200 h-2 rounded-full overflow-hidden">
                            <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${(timeLeft / 60) * 100}%` }}></div>
                        </div>

                        <div className="bg-base-200 p-8 rounded-2xl border border-base-200 shadow-inner min-h-[180px] flex flex-col items-center justify-center text-center">
                            <div className="text-base-content/30 text-xl font-mono break-all leading-relaxed mb-4 select-none w-full">{targetText}</div>
                            <div className="text-2xl font-mono break-all leading-relaxed w-full border-t border-base-300 pt-4">
                                {userInput.split("").map((char, i) => (
                                    <span key={i} className={char === targetText[i] ? "text-primary font-bold" : "text-error bg-error/10"}>{char}</span>
                                ))}
                                <span className="inline-block w-0.5 h-7 bg-primary animate-pulse ml-1 align-middle"></span>
                            </div>
                        </div>

                        <input 
                            className="input input-bordered w-full h-16 text-xl px-6 bg-base-100 focus:border-primary shadow-sm" 
                            value={userInput} 
                            onChange={(e) => handleInput(e.target.value)} 
                            placeholder="위 문장을 똑같이 입력하세요!" 
                            autoFocus 
                        />
                    </div>
                ) : (
                    /* 3. 게임 종료 */
                    <div className="text-center py-10">
                        <h4 className="text-4xl font-black text-primary mb-4 uppercase tracking-tighter">Time Over!</h4>
                        <div className="bg-primary/5 rounded-3xl p-10 mb-8 border border-primary/10">
                            <p className="text-6xl font-black text-primary mb-2">{correctCount}</p>
                            <p className="text-base-content/60 font-bold tracking-widest uppercase text-sm">Sentences Completed</p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <button className="btn btn-primary w-full h-14 font-bold text-lg" onClick={handleSaveAndClose}>기록 저장 후 닫기</button>
                            <button className="btn btn-outline w-full h-14 font-bold" onClick={startGame}>다시 도전</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
});

export default TypingGameModal;