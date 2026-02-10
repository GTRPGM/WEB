import { useCallback } from "react";
import { useChatStore } from "../store/useChatStore";
import { sendTurn, type GmTurnResponse, getOpeningSummary } from "../services/gameService";
import { useChatStream } from "./useChatStream";
import { useMiniGame } from "./useMiniGame";
import { useUserStore } from "../store/useUserStore";

export function useGameChat() {
    const { 
        addMessage, 
        updateMessageContent, 
        setGmthinking, 
        sessionId,
        currentActId, // currentActId 가져오기
        currentSequenceId, // currentSequenceId 가져오기
        setCurrentActAndSequenceId, // setCurrentActAndSequenceId 가져오기
        addSummaryMessage // addSummaryMessage 가져오기
    } = useChatStore();
    const { processStream } = useChatStream();
    const miniGame = useMiniGame();
    const myName = useUserStore((state) => state.userProfile.name);

    const handleSendMessage = useCallback(async (text: string) => {
        if (!text.trim()) return;
        if (!sessionId) {
            console.error("Session ID is not available. Cannot send turn.");
            addMessage('System', '게임 세션이 시작되지 않았습니다. 게임을 다시 시작해주세요.', myName, 'system');
            return;
        }
        
        setGmthinking(true);
        addMessage(myName, text, myName, 'user');

        try {
            const gmTurnResponse: GmTurnResponse = await sendTurn(text, sessionId);

            // 1. 플레이어 턴의 Segments를 개별 메시지로 처리
            for (const segment of gmTurnResponse.data.segments) {
                if (segment.role === 'player' && segment.type === 'action') {
                    continue;
                }
                if (segment.content) {
                    const msgId = addMessage(segment.role === 'narrator' ? 'GM' : segment.role, '', myName, segment.type);
                    await processStream(segment.content, (accumulated: string) => {
                        updateMessageContent(msgId, accumulated);
                    });
                }
            }

            // 2. NPC 턴의 Segments를 개별 메시지로 처리 (있는 경우)
            if (gmTurnResponse.data.npc_turn && gmTurnResponse.data.npc_turn.segments.length > 0) {
                const npcName = gmTurnResponse.data.npc_turn.active_entity_name || 'GM';

                for (const segment of gmTurnResponse.data.npc_turn.segments) {
                    if (segment.content) {
                        const msgId = addMessage(npcName, '', myName, segment.type);
                        await processStream(segment.content, (accumulated: string) => {
                            updateMessageContent(msgId, accumulated);
                        });
                    }
                }
            }

            // 3. Act ID 또는 Sequence ID 변경 감지 및 요약 불러오기
            const newActId = gmTurnResponse.data.transition.to_act_id;
            const newSequenceId = gmTurnResponse.data.transition.to_sequence_id;

            if (newActId !== currentActId || newSequenceId !== currentSequenceId) {
                setCurrentActAndSequenceId(newActId, newSequenceId); // 스토어 업데이트

                // 변경된 Act/Sequence에 대한 요약 불러오기
                const summaryContent = await getOpeningSummary(sessionId);
                if (summaryContent) {
                    addSummaryMessage(summaryContent, myName); // 요약을 메시지로 추가
                }
            }

        } catch (error) {
            addMessage('GM', '턴 전송에 실패했습니다.', myName, 'system');
            console.error("Failed to send turn:", error);
        } finally {
            setGmthinking(false);
        }
    }, [
        addMessage, 
        updateMessageContent, 
        setGmthinking, 
        processStream, 
        sessionId, 
        myName,
        currentActId, // 종속성 추가
        currentSequenceId, // 종속성 추가
        setCurrentActAndSequenceId, // 종속성 추가
        addSummaryMessage // 종속성 추가
    ]);

    const fetchCurrentSummary = useCallback(async () => {
        if (!sessionId) {
            console.error("Session ID is not available. Cannot fetch summary.");
            addMessage('System', '게임 세션이 시작되지 않았습니다. 요약을 불러올 수 없습니다.', myName, 'system');
            return;
        }

        setGmthinking(true);
        try {
            const summaryContent = await getOpeningSummary(sessionId);
            if (summaryContent) {
                addSummaryMessage(summaryContent, myName);
            }
        } catch (error) {
            console.error("Failed to fetch current summary:", error);
            addMessage('GM', '현재 요약을 불러오는 데 실패했습니다.', myName, 'system');
        } finally {
            setGmthinking(false);
        }
    }, [sessionId, addSummaryMessage, addMessage, setGmthinking, myName]);

    return {
        handleSendMessage,
        fetchCurrentSummary, // fetchCurrentSummary 추가
        ...miniGame
    };
}