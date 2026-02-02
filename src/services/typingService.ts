import api from "../apiinterceptor";

export interface TypingResult {
  correctCount: number;
  avgWpm: number;
  timestamp: string;
}

export const typingService = {
  fetchTypingTexts: async () => {
    const response = await api.get("/minigame/typing-texts");
    return response.data.sentences; 
  },
  
  saveTypingResult: (stats: { correctCount: number, avgWpm: number }) => {
    try {
      const resultData: TypingResult = {
        ...stats,
        timestamp: new Date().toISOString()
      };
      
      sessionStorage.setItem("typing_latest_result", JSON.stringify(resultData));
      return true;
    } catch (error) {
      console.error("세션 스토리지 저장 실패:", error);
      return false;
    }
  }
};