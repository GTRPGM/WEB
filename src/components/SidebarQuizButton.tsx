import { useState } from "react";
import { gameService } from "../services/miniGameService";
import { useAuthStore } from "../store/useAuthStore";

export default function SidebarQuizButton() {
    const [quizText, setQuizText] = useState("마우스를 올려 퀴즈를 확인하세요!");
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [userAnswer, setUserAnswer] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [quizLoaded, setQuizLoaded] = useState(false);

    // 1. 퀴즈 텍스트 가져오기 (GET)
    const handleMouseEnter = async () => {
        if (quizLoaded) return;
        const token = useAuthStore.getState().access_token;
        if (!token || token === "null") {
            setQuizText("로그인이 필요합니다.");
            return;
        }
        try {
            const data = await gameService.getRandomQuiz(); 
            setQuizText(data); 
            setQuizLoaded(true); 
        } catch (error) {
            setQuizText("문제를 불러오지 못했습니다.");
        }
    };

    // 2. 정답 제출 및 서버 검증 (POST)
    const handleQuizSubmit = async () => {
        if (!userAnswer.trim() || isSubmitting) return;

        setIsSubmitting(true);

        try {
            // 💡 1. 서버 응답을 끝날 때까지 기다립니다 (await)
            const response = await gameService.checkAnswer(userAnswer, 1, "QUIZ");
            
            // 💡 2. 응답 데이터 추출 (Axios는 .data에 응답 본문이 담김)
            // 서비스 함수 설정에 따라 구조가 다를 수 있으므로 이중 방어
            const fullBody = response.data || response;
            
            // 보내주신 JSON 구조상 실제 데이터는 'data' 필드 안에 있음
            const resultData = fullBody.data;

            console.log("✅ 서버에서 받은 실제 데이터:", resultData);

            // 💡 3. 서버가 보낸 message("틀렸습니다... n회 시도") 추출
            const serverMessage = resultData?.message || fullBody?.message || "결과를 확인할 수 없습니다.";

            /**
             * 💡 4. 판정 및 알림 출력
             * result 필드가 "correct"인 경우만 성공으로 간주
             */
            if (resultData && resultData.result === "correct") {
                alert(`🎉 정답입니다!\n${serverMessage}`);
                setIsPopupOpen(false);
                setUserAnswer("");
                setQuizText("마우스를 올려 퀴즈를 확인하세요!"); 
                setQuizLoaded(false); 
            } else {
                // 💡 오답일 때 서버 메시지 그대로 출력
                // 예: "틀렸습니다. 다시 생각해보세요! (현재 1회 시도)"
                alert(`❌ ${serverMessage}`);
                setUserAnswer(""); 
            }

        } catch (error: any) {
            console.error("❌ Submit Error:", error);
            // 에러 시에도 서버가 보낸 에러 메시지 추출 시도
            const errorMsg = error.response?.data?.data?.message || error.response?.data?.message || "서버 통신 중 오류가 발생했습니다.";
            alert(`⚠️ ${errorMsg}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {/* 사이드바 버튼 영역 */}
            <div className="p-4 bg-base-100 flex items-center gap-3 mt-auto">
                <div 
                    className="tooltip tooltip-right before:whitespace-pre-wrap before:max-w-[200px]" 
                    data-tip={quizText}
                    onMouseEnter={handleMouseEnter}
                >
                    <button
                        className="btn btn-circle bg-base-300 hover:bg-primary text-white border-none shadow-lg hover:scale-110 transition-all flex items-center justify-center text-lg font-black"
                        onClick={() => setIsPopupOpen(true)}
                    > ?
                    </button>
                </div>
            </div>

            {/* 정답 입력 팝업 */}
            {isPopupOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-base-100 p-8 rounded-3xl border border-base-200 w-96 shadow-2xl animate-in fade-in zoom-in duration-300">
                        <h3 className="text-base-content font-extrabold text-xl mb-4 flex items-center gap-2">
                            <span className="text-2xl">💡</span> 도감 퀴즈
                        </h3>

                        <div className="bg-base-200 p-5 rounded-2xl mb-6 text-sm text-base-content/90 leading-relaxed border border-base-200 min-h-[80px] italic">
                            "{quizText}"
                        </div>

                        <input 
                            type="text"
                            className="input input-bordered w-full bg-base-100 border-base-300 text-base-content focus:border-primary h-12 rounded-xl mb-6 transition-all outline-none font-bold text-center"
                            placeholder="정답을 입력하세요..."
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleQuizSubmit()}
                            disabled={isSubmitting}
                            autoFocus
                        />

                        <div className="flex gap-3">
                            <button 
                                className={`flex-1 h-12 text-white font-black rounded-xl shadow-lg active:scale-95 transition-all ${
                                    isSubmitting ? 'bg-base-300' : 'bg-primary hover:bg-primary-focus'
                                }`}
                                onClick={handleQuizSubmit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "확인 중..." : "제출하기"}
                            </button>
                            <button 
                                className="px-6 h-12 bg-base-200 hover:bg-base-300 text-base-content/80 rounded-xl transition-all font-bold" 
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