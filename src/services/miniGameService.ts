import api from '../apiinterceptor';

export const gameService = {
    async getMiniGame() { // token 파라미터 제거
        const response = await api.get('/minigame/riddle');
        return response.data;
    },

    async checkAnswer(guess: string, attempt: number, flag: string) { // token 파라미터 제거
        const response = await api.post('/minigame/answer', { 
            user_guess: guess, 
            current_attempt: Number(attempt), 
            flag: flag 
        });
        return response.data;
    },

    async getRandomQuiz() { // token 파라미터 제거
        const response = await api.get('/minigame/quiz');
        return response.data;
    }
};