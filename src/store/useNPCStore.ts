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

            const result = Array.isArray(res.data)

                ? res.data

                : (res.data.data || []);

               

            set({ allEnemies: result });
        } catch (error) {
            console.error("데이터 로드 실패:", error);
            set({ allEnemies: [] });
        }
    }
}));