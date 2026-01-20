import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuthInfo } from "../types";

interface AuthState extends AuthInfo {
    setTokens: (access: string, refresh: string) => void;
    clearTokens: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            accessToken: null,
            refreshToken: null,
            setTokens: (access, refresh) => set({ accessToken: access, refreshToken: refresh }),
            clearTokens: () => set({ accessToken: null, refreshToken: null }),
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);