import api from "../apiinterceptor";

export interface TypingResult {
  correctCount: number;
  avgWpm: number;
  timestamp: string;
}

export const typingService = {
  fetchTypingTexts: async (): Promise<string[]> => {
    try {
      const response = await api.get("/minigame/tip-sentence");
      
      // 콘솔에서 실제 데이터 구조를 한 번 더 확인합니다.
      console.log("서버 응답 데이터:", response.data);

      // 서버 응답 구조인 response.data.data.sentence가 존재하는지 확인
      if (response.data?.status === "success" && response.data?.data?.sentence) {
        // 훅(Hook)은 문장 '목록(배열)'을 기대하므로 [문장] 형태로 감싸서 반환합니다.
        return [response.data.data.sentence];
      }

      // 만약 나중에 서버가 배열 형태로 바꿀 경우를 대비한 방어 코드
      if (Array.isArray(response.data?.data)) {
        return response.data.data;
      }

      console.warn("예상치 못한 데이터 구조입니다:", response.data);
      return []; 
    } catch (error) {
      console.error("Error fetching typing texts:", error);
      return [];
    }
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