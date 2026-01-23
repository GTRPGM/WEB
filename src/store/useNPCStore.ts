import { create } from "zustand";
import { api } from "../apiinterceptor";
import type { ENEMY } from "../types";
import type { NPC } from "../types";

interface ENEMYState {
    allEnemies: ENEMY[];
    fetchEnemies: () => Promise<void>;
}

interface NPCState {
    allNPCs: NPC[];
    fetchNPCs: () => Promise<void>;
}

export const useNPCStore = create<NPCState>((set) => ({
    allNPCs: [],
    fetchNPCs: async () => {
        try {
            const res = await api.post('/info/npcs', {});
            const npcList = res.data?.data?.npcs;

            const result = Array.isArray(npcList) ? npcList: [];

            set({ allNPCs: result });
        } catch (error) {
            console.error("데이터 로드 실패:", error);
            set({ allNPCs: [] });
        }
    }
}))

export const useENEMYStore = create<ENEMYState>((set) => ({
    allEnemies: [],
    fetchEnemies: async () => {
        try {
            const res = await api.post('/info/enemies', {});
            const enemyList = res.data?.data?.enemies;


            const result = Array.isArray(enemyList) ? enemyList : [];

            set({ allEnemies: result });
        } catch (error) {
            console.error("데이터 로드 실패:", error);
            set({ allEnemies: [] });
        }
    }
}));