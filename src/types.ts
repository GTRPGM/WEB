export interface UserProfile {
  name: string;
  inventory: InventoryItem[];
}

export interface AuthInfo {
    access_token: string | null;
    refresh_token: string | null;
}

export interface Message {
  id: string;
  sender: string;
  content: string;
  time: string;
  color: string;
  isGM?: boolean; // GM 메시지 여부를 나타내는 속성 추가
  isUserMessage?: boolean; // 사용자 메시지 여부를 나타내는 속성 추가
  type?: 'action' | 'narration' | 'dialogue' | 'user' | 'system'; // 메시지 타입 추가 (action, narration, dialogue 등)
}

export interface ENEMY {
  enemy_id: string;
  name: string;
  base_difficulty: string;
  description: string;
  type: string;
}

export interface NPC {
  npc_id: string;
  name: string;
  disposition: string;
  occupation: string;
  description: string;
  combat_description: string;
}

export interface InventoryItem {
  item_id: string;
  name: string;
  type: string;
  effect_value: string;
  description: string;
  weight: string;
  grade: string;
  base_price: string;
  creator: string;
}

export interface RankingItem {
  score: number;
  name: string;
  date: string;
}

// Define a more specific type for player_npc_relations
export interface PlayerNPCRelation {
  npc_id: string;
  relation_status: string; // e.g., 'friendly', 'neutral', 'hostile'
}

export interface PlayerStatusResponse {
  status: string;
  data: {
    player: {
      hp: number;
      gold: number;
      items: {
        item_id: string;
        name: string;
        description: string;
        item_type: string;
        meta: {
          starter: boolean;
        };
        is_stackable: boolean;
      }[];
    };
    player_npc_relations: PlayerNPCRelation[]; // assuming array of any for now
  };
  message: string | null;
}

export interface MiniGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
  onAnswer: (ans: string) => void;
  onNext: () => void;
  onFinish: () => void;
  isActive: boolean;
  isCorrect: boolean;
  riddleText: string;
  gameFeedback: string;
  score: number;
  solvedCount: number;
  rankings: RankingItem[];
}