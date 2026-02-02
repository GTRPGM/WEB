import api from "../apiinterceptor";

export const typingService = {
  fetchTypingTexts: async () => {
    const response = await api.get("/minigame/typing-texts");
    return response.data.sentences; 
  },
  
  saveTypingResult: async (stats: { correctCount: number, avgWpm: number }) => {
    return await api.post("/minigame/typing-result", stats);
  }
};