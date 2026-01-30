import api from "../apiinterceptor";

export const typingService = {
  // 여러 개의 랜덤 문장을 리스트로 가져옵니다.
  fetchTypingTexts: async () => {
    // 백엔드 엔드포인트에서 배열 형태의 데이터를 준다고 가정합니다.
    // 예: { sentences: ["문장1", "문장2", "문장3"...] }
    const response = await api.get("/minigame/typing-texts");
    return response.data.sentences; 
  },
  
  // 최종 점수(성공한 문장 수, 평균 WPM 등) 저장
  saveTypingResult: async (stats: { correctCount: number, avgWpm: number }) => {
    return await api.post("/minigame/typing-result", stats);
  }
};