export interface UserProfile {
  name: string;
}

export interface AuthInfo {
    accessToken: string | null;
    refreshToken: string | null;
}

export interface Message {
  role: string;
  name: string;
  content: string;
  time: string;
  color: string;
}