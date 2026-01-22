export interface UserProfile {
  name: string;
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