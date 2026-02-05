export interface UserProfile {
  name: string;
  inventory: InventoryItem[];
  hp: number;
  gold: number;
  scenario_id: string | null;
  player_id: string;
  session_id: string;
  location: string,
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

export interface NpcRelation {
    npc_id: string;
    npc_name: string;
    affinity_score: number;
}