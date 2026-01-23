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
}

export interface NPC {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  description: string;
}

export interface InventoryItem {
  id: 0;
  name: string;
  type: string;
  effect_value: 0;
  description: string;
  weight: 0;
  grade: string;
  base_price: 0;
  creator: string;
}