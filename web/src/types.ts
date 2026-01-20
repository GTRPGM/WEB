export interface UserProfile {
  name: string;
}

export interface AuthInfo {
    accessToken: string | null;
    refreshToken: string | null;
}

export interface Message {
  id: string;
  sender: string;
  content: string;
  time: string;
  color: string;
}