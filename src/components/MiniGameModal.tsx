import { useState } from "react";
import type { MiniGameModalProps } from "../types";

export default function MiniGameModal({ 
  isOpen, 
  onClose, 
  onStart, // 시작 함수 추가
  onAnswer,
  onNext,
  isActive,
  isCorrect,
  riddleText,
  gameFeedback,
  onFinish,
  rankings,
  score,
  solvedCount
}: MiniGameModalProps) {
  const [inputValue, setInputValue] = useState("");
  const [showRanking, setShowRanking] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box bg-slate-900 border-2 border-primary shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
            {showRanking ? "명예의 전당" : "수수께끼 챌린지"}
          </h3>
          <div className="flex gap-2">
            <span className="badge badge-secondary p-3 font-bold">{solvedCount}개</span>
            <span className="badge badge-primary p-3 font-bold">{score}점</span>
          </div>
        </div>

        <div className="tabs tabs-boxed bg-slate-800 mb-4">
          <button
            className={`tab flex-1 ${!showRanking ? "tab-active" : "text-slate-400"}`}
            onClick={() => setShowRanking(false)}
          >게임</button>
          <button 
            className={`tab flex-1 ${showRanking ? "tab-active" : "text-slate-400"}`}
            onClick={() => setShowRanking(true)}
          >랭킹</button>
        </div>

        {!showRanking ? (
          !isActive ? (
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

            {isCorrect ? (
              <div className="animate-bounce-in">
                <button
                  className="btn btn-secondary w-full shadow-md text-white font-bold"
                  onClick={() => {
                    onNext();
                    setInputValue("");
                  }}
                >다음 문제 불러오기</button>
                <button 
                    className="btn btn-ghost btn-sm w-full text-error" 
                    onClick={() => { if(confirm("현재 점수를 저장하고 종료할까요?")) onFinish(); }}
                  >여기서 그만하고 점수 저장하기</button>
              </div>
            ) : (
              <div className="space-y-4">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  onAnswer(inputValue);
                  setInputValue("");
                }}>
                  <p className="text-xs text-slate-400 mb-2 px-1">정답을 입력하세요:</p>
                  <input 
                      className="input input-bordered w-full bg-slate-800 mb-4 text-white focus:border-primary border-slate-700"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="답변 입력..."
                      autoFocus
                    />
                    <button className="btn btn-primary w-full shadow-md">정답 제출</button>
                </form>
              <div className="divider opacity-20 my-1"></div>
                <button 
                  className="btn btn-ghost btn-xs w-full text-slate-500 hover:text-error transition-colors"
                  onClick={() => { if(confirm("점수를 기록하고 종료하시겠습니까?")) onFinish(); }}
                >
                  점수 기록하고 그만두기
                </button>
              </div>
            )}
          </div>
        )
      ) : (
          /* 랭킹판 영역 */
          <div className="animate-fade-in">
            <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
              <table className="table w-full text-slate-300">
                <thead>
                  <tr className="bg-slate-700/50 text-primary border-none">
                    <th>순위</th>
                    <th>이름</th>
                    <th className="text-right">점수</th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.length > 0 ? (
                    rankings.map((rk: any, index: number) => (
                      <tr key={index} className={index === 0 ? "text-yellow-400 font-bold" : ""}>
                        <td>{index + 1}위 {index === 0 }</td>
                        <td className="text-xs">{rk.date}</td>
                        <td className="text-right font-mono">{rk.score}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={3} className="text-center py-10">아직 기록이 없습니다.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
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