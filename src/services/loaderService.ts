// loaderService.ts
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const loaderService = {
    /**
     * 로딩 화면에 필요한 메시지와 타자 연습용 팁 데이터를 통합하여 가져옵니다.
     */
    async getLoadingData(token: string) {
        try {
            // 1. 로딩 메시지(기존)와 2. 타자 팁(신규)을 동시에 요청
            const [msgRes, tipRes] = await Promise.all([
                fetch(`${BASE_URL}/info/loading-messages`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`${BASE_URL}/minigame/tip-sentence`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);

            const msgData = msgRes.ok ? await msgRes.json() : null;
            const tipData = tipRes.ok ? await tipRes.json() : null;

            return {
                // phrases가 없으면 기본값 사용
                phrases: msgData?.phrases || ["심해의 수신호를 동기화 중...", "해류 데이터를 계산 중..."],
                // 기존 팁과 서버에서 가져온 타자 문장(sentence)을 합침
                tips: [
                    ...(msgData?.tips || []),
                    ...(tipData?.data?.sentence ? [tipData.data.sentence] : [])
                ]
            };
        } catch (error) {
            // 네트워크 에러 시 폴백 데이터
            return {
                phrases: ["시스템 데이터를 재구성 중..."],
                tips: ["네트워크 연결 상태가 불안정하여 기본 데이터를 불러옵니다."]
            };
        }
    }
};