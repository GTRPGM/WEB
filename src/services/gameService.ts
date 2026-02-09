import api from '../apiinterceptor';
import type { PlayerStatusResponse, Message } from '../types';

// startSession의 반환 데이터 타입을 위한 인터페이스
export interface SessionData {
  session_id: string;
  scenario_id: string;
  user_id: number;
  player_id: string;
  current_act: number;
  current_sequence: number;
  current_act_id: string;
  current_sequence_id: string;
  current_phase: string;
  current_turn: number;
  location: string;
  status: string;
  started_at: string;
  ended_at: string;
  created_at: string;
  updated_at: string;
}

// /gm/turn 응답 데이터 타입을 위한 인터페이스 정의
export interface Transition {
  from_act_id: string;
  from_sequence_id: string;
  to_act_id: string;
  to_sequence_id: string;
  from_status: string;
  to_status: string;
  changed: boolean;
}

export interface Segment {
  type?: Message['type']; // Change type to Message['type']
  role: string;
  content: string;
}

export interface NpcTurnData {
  turn_id: string;
  commit_id: string;
  active_entity_id: string;
  active_entity_name: string;
  is_npc_turn: boolean;
  current_act_id: string;
  current_sequence_id: string;
  session_status: string;
  is_session_ended: boolean;
  segments: Segment[]; // narrative 대신 segments 사용
  transition: Transition;
  npc_turn: NpcTurnData | null; // 재귀적으로 자신을 참조하거나 null
}

export interface TurnResponseData {
  turn_id: string;
  commit_id: string;
  active_entity_id: string;
  active_entity_name: string;
  is_npc_turn: boolean;
  current_act_id: string;
  current_sequence_id: string;
  session_status: string;
  is_session_ended: boolean;
  segments: Segment[]; // narrative 대신 segments 사용
  transition: Transition;
  npc_turn: NpcTurnData | null;
}

export interface GmTurnResponse {
  status: string;
  data: TurnResponseData;
}

export async function sendTurn(userInput: string, sessionId: string): Promise<GmTurnResponse> { // any를 unknown으로 변경
    try {
        const response = await api.post('/gm/turn', {
            content: userInput, // Renamed user_input to content
            session_id: sessionId,
        });
        return response.data;
    } catch (error) {
        console.error('Error sending turn:', error);
        throw error;
    }
}

export async function getScenarios(): Promise<{ scenario_id: string; title: string }[]> {
    try {
        const response = await api.get('/state/scenarios');
        console.log('Scenarios API Response:', response.data); // 응답 데이터 로깅 추가
        // API 응답 구조에 따라 조정
        // 예시: response.data.data 또는 response.data
        return response.data.data || response.data; // 더 유연하게 데이터 반환 시도
    } catch (error) {
        console.error('Error fetching scenarios:', error);
        throw error;
    }
}

export async function startSession(scenarioId: string, location: string): Promise<SessionData> { // any를 SessionData로 변경
    try {
        const response = await api.post('/state/session/start', {
            scenario_id: scenarioId,
            location: location,
        });
        return response.data.data; // API 응답 구조에 따라 조정
    } catch (error) {
        console.error('Error starting session:', error);
        throw error;
    }
}

export async function getOpeningSummary(sessionId: string): Promise<string> { // string 반환
    try {
        const response = await api.post(`/gm/summary`, {
            session_id: sessionId, // session_id를 요청 본문에 포함
        });
        // API 응답 구조에 따라 오프닝 메시지를 반환하도록 조정
        return response.data.data.summary || ''; // summary 문자열 반환
    } catch (error) {
        console.error('Error fetching opening summary:', error);
        throw error;
    }
}

export async function getPlayerStatus(playerId: string): Promise<PlayerStatusResponse> {
    try {
        const response = await api.get(`/state/player/${playerId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching player status:', error);
        throw error;
    }
}

