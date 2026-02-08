import { useCallback } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { gameService } from "../services/miniGameService";
import { useChatStream } from "./useChatStream";
import { useMiniGame } from "./useMiniGame";
import { useUserStore } from "../store/useUserStore";

export function useGameChat() {
    const { addMessage, updateMessageContent, setGmthinking } = useChatStore();
    const { processStream } = useChatStream();
    const { initializeGame } = useUserStore();
    const miniGame = useMiniGame(processStream);

    const handleSendMessage = useCallback(async (text: string, username: string) => {
        if (!text.trim()) return;

        const token = useAuthStore.getState().access_token ?? "";
        let session_id = useUserStore.getState().userProfile.session_id;
        
        if (!session_id) {
            console.log("세션 id가 없어 초기화를 시작합니다...");
            const freshSessionId = await initializeGame(); 

            if(!freshSessionId) {
                addMessage('System', '게임 세션을 시작할 수 없습니다.');
                return;
            }
        // 중요: 스토어에서 다시 꺼내지 말고, 방금 받은 값을 변수에 넣습니다.
            session_id = freshSessionId;
        }

        setGmthinking(true);
        if (username !== "System" && !text.includes("오프닝")) {
            addMessage(username, text);
        }

        try {
            const response = await gameService.generateChat(text, token, session_id);
            if (!response.ok) throw new Error();

            // 1. 먼저 빈 메시지 생성 후 ID 확보
            const msgId = addMessage('GM', '');
            
            // 2. 스트림 처리하며 해당 메시지 내용 업데이트
            await processStream(response, (accumulated: string) => {
                updateMessageContent(msgId, accumulated);
            });
        } catch (error) {
            setGmthinking(false);
            addMessage('GM', '연결에 실패했습니다.');
        } finally {
            setGmthinking(false);
        }
    }, [addMessage, updateMessageContent,setGmthinking, processStream]);

    return {
        handleSendMessage,
        ...miniGame
    };
}