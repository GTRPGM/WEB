import { create } from "zustand";
import { api } from "../apiinterceptor";
import type { NPC } from "../types";

interface NPCState {
    allEnemies: NPC[];
    fetchEnemies: () => Promise<void>;
}

export const useNPCStore = create<NPCState>((set) => ({
    allEnemies: [],
    fetchEnemies: async () => {
        try {
            const res = await api.post('/info/enemies', {});
            set({ allEnemies: res.data.data });
        } catch (error) {
            console.error("적 정보 불러오기 실패:", error);
        }
    }
}));