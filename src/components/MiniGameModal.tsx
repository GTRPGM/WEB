import { useState } from "react";
import type { MiniGameModalProps } from "../types";

export default function MiniGameModal({ 
  isOpen, 
  onClose, 
  onStart, // 시작 함수 추가
  onAnswer,
  isActive,
  riddleText,
  gameFeedback
}: MiniGameModalProps) {
  const [inputValue, setInputValue] = useState("");

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box bg-slate-900 border-2 border-primary shadow-2xl">
        <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
          수수께끼 챌린지
        </h3>

        {!isActive ? (
          <div className="text-center py-6 animate-fade-in">
            <p className="mb-6 text-slate-300">
            수수께끼를 풀 준비가 되었나요?
            </p>
            <button className="btn btn-primary w-full shadow-lg" onClick={onStart}>
              수수께끼 불러오기
            </button>
          </div>
        ) : (
          <div className="animate-fade-in">
            <div className="bg-slate-800 p-4 rounded-lg mb-4 min-h-[120px] border border-slate-700 shadow-inner">
              <p className="text-white leading-relaxed whitespace-pre-wrap text-sm">
                {riddleText || "GM이 문제를 내고 있습니다..."}
              </p>
            </div>

            {gameFeedback && (
                <div className={`p-2 mb-2 rounded text-center text-sm font-bold ${
                gameFeedback.includes("정답") ? "text-green-400 bg-green-400/10" : "text-red-400 bg-red-400/10"
              }`}>
                {gameFeedback}
              </div>
            )}

            <form onSubmit={(e) => {
              e.preventDefault();
              onAnswer(inputValue);
              setInputValue("");
            }}>
              <p className="text-xs text-slate-400 mb-2 px-1">정답을 입력하세요:</p>
              <input 
                className="input input-bordered w-full bg-slate-800 mb-4 text-white focus:border-primary"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="답변 입력..."
                autoFocus
              />
              <button className="btn btn-primary w-full shadow-md">정답 제출</button>
            </form>
          </div>
        )}
        
        <div className="modal-action">
          <button className="btn btn-ghost btn-sm text-slate-500" onClick={onClose}>닫기</button>
        </div>
      </div>
      <div className="modal-backdrop bg-black/50" onClick={onClose}></div>
    </div>
  );
}