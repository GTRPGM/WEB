const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const gameService = {
    async generateChat(prompt: string, token: string) {
        return fetch(`${BASE_URL}/chat/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
            body: JSON.stringify({ prompt }),
        });
    },

    async getMiniGame(token: string) {
        return fetch(`${BASE_URL}/minigame/riddle`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
        });
    },

    async checkAnswer(guess: string, attempt: number, token: string, flag: string) {
        return fetch(`${BASE_URL}/minigame/answer`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization':`Bearer ${token}`},
            body: JSON.stringify({ user_guess: guess, current_attempt: Number(attempt), flag: flag }),
        });
    },

    async getRandomQuiz(token: string) {
        return fetch(`${BASE_URL}/minigame/quiz`, {
            method: 'GET',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });
    }
};