import { useState } from "react";
import { gameService } from "../services/miniGameService";
import { useAuthStore } from "../store/useAuthStore";

export default function SidebarQuizButton() {
    const [quizText, setQuizText] = useState("마우스를 올려 퀴즈를 확인하세요!");
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [userAnswer, setUserAnswer] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [quizLoaded, setQuizLoaded] = useState(false); // 퀴즈 로드 여부 추적

    // 1. 마우스 호버 시 퀴즈 텍스트 가져오기
    const handleMouseEnter = async () => {
        if (quizLoaded) { // 이미 퀴즈가 로드된 경우 다시 불러오지 않음
            return;
        }

        const token = useAuthStore.getState().access_token;

        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (payload.exp * 1000 < Date.now()) {
                setQuizText("세션이 만료되었습니다. 다시 로그인해주세요.");
                return;
            }
        }

        if (!token || token === "null") {
            setQuizText("로그인이 필요합니다.");
            return;
        }

        try {
            const data = await gameService.getRandomQuiz(); // Directly get data
            setQuizText(data); // data is already the text
            setQuizLoaded(true); // 퀴즈 로드 완료
        } catch (error) {
            console.error("Network Error:", error);
            setQuizText("문제를 불러오지 못했습니다.");
        }
    };

    // 2. 정답 제출 및 서버 검증 (flag: "QUIZ")
    const handleQuizSubmit = async () => {
        if (!userAnswer.trim() || isSubmitting) return;

        const token = useAuthStore.getState().access_token ?? "";
        if (!token) {
            alert("로그인 정보가 없습니다.");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await gameService.checkAnswer(userAnswer, 1, "QUIZ");
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error("Submit Error Details:", errorText);
                throw new Error(`서버 오류 (${response.status})`);
            }

            const result = await response.json();
            console.log("Quiz Result:", result);

            if (result.is_correct || result.status === "success" || result.correct) {
                alert("🎉 정답입니다! 도감이 업데이트되었습니다.");
                setIsPopupOpen(false);
                setUserAnswer("");
                setQuizText("마우스를 올려 퀴즈를 확인하세요!"); // 성공 후 초기화
                setQuizLoaded(false); // 정답 맞췄으므로 다음 호버 시 새 퀴즈 로드
            } else {
                alert(`❌ 틀렸습니다! 다시 생각해보세요.\n(힌트: ${result.message || '오답입니다.'})`);
            }
        } catch (error: unknown) {
            console.error("Submit Error:", error);
            alert("정답 확인 중 에러가 발생했습니다. CORS 환경이나 서버 상태를 확인해주세요.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {/* --- 사이드바 하단 버튼 영역 --- */}
            <div className="p-4 bg-base-300/50 border-t border-base-300 flex items-center gap-3 mt-auto">
                <div 
                    className="tooltip tooltip-right before:whitespace-pre-wrap before:max-w-[200px]" 
                    data-tip={quizText}
                    onMouseEnter={handleMouseEnter}
                >
                    <button 
                        className="btn btn-circle bg-slate-800 hover:bg-slate-900 text-white border-none shadow-lg hover:scale-110 transition-all flex items-center justify-center text-lg"
                        onClick={() => setIsPopupOpen(true)}
                    >
                        ?
                    </button>
                </div>
            </div>

            {/* --- 정답 입력 팝업 (흰색 테마) --- */}
            {isPopupOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-white/60 backdrop-blur-md">
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 w-96 shadow-[0_20px_50px_rgba(0,0,0,0.1)] animate-in fade-in zoom-in duration-300">
                        <h3 className="text-slate-900 font-extrabold text-xl mb-4 flex items-center gap-2">
                            <span className="text-2xl">💡</span> 오늘의 도감 퀴즈
                        </h3>

                        {/* 문제 표시 영역 */}
                        <div className="bg-slate-50 p-5 rounded-2xl mb-6 text-base text-slate-700 leading-relaxed border border-slate-100 min-h-[80px] italic">
                            "{quizText}"
                        </div>

                        {/* 정답 입력창 */}
                        <input 
                            type="text"
                            className="input input-bordered w-full bg-white border-slate-200 text-slate-900 focus:border-slate-500 h-12 rounded-xl mb-6 transition-all outline-none"
                            placeholder="정답을 입력하세요..."
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleQuizSubmit()}
                            disabled={isSubmitting}
                            autoFocus
                        />

                        {/* 버튼 그룹 */}
                        <div className="flex gap-3">
                            <button 
                                className={`flex-1 h-12 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-all ${
                                    isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-800 hover:bg-slate-900'
                                }`}
                                onClick={handleQuizSubmit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "확인 중..." : "제출하기"}
                            </button>
                            <button 
                                className="px-6 h-12 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl transition-all font-medium" 
                                onClick={() => setIsPopupOpen(false)}
                            >
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}