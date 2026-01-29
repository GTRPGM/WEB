const BASE_URL =  import.meta.env.VITE_API_BASE_URL;

export const loaderService = {
    async getLoadingMessages(token: string) {
        const response = await fetch(`${BASE_URL}/info/loading-messages`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) {
            return {
                phrases: ["심해의 수신호를 동기화 중...", "해류 데이터를 계산 중..."],
                tips: ["네트워크 상태가 원활하지 않아 기본 팁이 표시됩니다."]
            };
        }
        
        return response.json();
    }
};