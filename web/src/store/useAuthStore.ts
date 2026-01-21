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
            access_token: null,
            refresh_token: null,
            setTokens: (access, refresh) => set({ access_token: access, refresh_token: refresh }),
            clearTokens: () => set({ access_token: null, refresh_token: null }),
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);