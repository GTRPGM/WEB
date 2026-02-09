import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { InventoryItem, UserProfile, NpcRelation } from '../types';
import { scenarioService } from '../services/scenarioService';

export interface UserState {
    userProfile: UserProfile;
    npcRelations: NpcRelation[];
    hasCharacter: boolean;
    isLoggedIn: boolean;

    setAuthSuccess: () => void;
    setCharacterName: (name: string) => void;
    logout: () => void;
    fetchScenarioId: () => Promise<void>;
    initializeGame: () => Promise<string | null>; // 반환 타입 수정
}

interface PersistedState {
    userProfile: UserProfile;
    hasCharacter: boolean;
    isLoggedIn: boolean;
}

export const useUserStore = create<UserState>()(
    persist<UserState, [], [], PersistedState>(
        (set) => ({
            userProfile: {
                name: '',
                inventory: [] as InventoryItem[],
                hp: 100,
                gold: 0,
                scenario_id: '',
                player_id: '',
                session_id: '',
                location: '',
            },
            npcRelations: [] as NpcRelation[],
            hasCharacter: false,
            isLoggedIn: false,

            // 1. 모든 set 호출 시 ...state를 유지하세요.
            setAuthSuccess: () => set((state) => ({ ...state, isLoggedIn: true })),
            
            setCharacterName: (name) => set((state) => ({ 
                ...state,
                userProfile: { ...state.userProfile, name }, 
                hasCharacter: true 
            })),

            fetchScenarioId: async() => {
                const scenarioData = await scenarioService.getCurrentScenarioId();
                set((state) => ({
                    ...state,
                    userProfile: { ...state.userProfile, scenario_id: scenarioData?.scenario_id || '' }
                }));
            },

            initializeGame: async () => {
                try {
                    const scenario = await scenarioService.getCurrentScenarioId();
                    if (!scenario) return null;

                    const sessionData = await scenarioService.startSession(scenario.scenario_id);
                    const { session_id, player_id } = sessionData;

                    const responseData = await scenarioService.getPlayerStatus(player_id);
                    const { player, player_npc_relations } = responseData;

                    set((state) => ({
                        ...state,
                        userProfile: {
                            ...state.userProfile,
                            hp: player.hp,
                            gold: player.gold,
                            inventory: player.items as InventoryItem[],
                            scenario_id: scenario.scenario_id,
                            player_id: player_id,
                            session_id: session_id,
                            location: scenario.description || '알 수 없는 곳'
                        },
                        npcRelations: player_npc_relations,
                    }));
                    
                    return session_id;
                } catch (error) {
                    console.error("게임 초기화 실패", error);
                    return null;
                }
            },
            
            logout: () => {
                set((state) => ({
                    ...state,
                    isLoggedIn: false,
                    hasCharacter: false,
                    userProfile: { 
                        name: '', 
                        inventory: [] as InventoryItem[], 
                        hp: 100, 
                        gold: 0, 
                        scenario_id: '', 
                        player_id: '', 
                        session_id: '', 
                        location: '' 
                    },
                    npcRelations: [],
                }));
                sessionStorage.clear();
            },
            
        }),
        {
            name: 'user-storage',
            storage: {
                getItem: (name) => {
                    const value = sessionStorage.getItem(name);
                    return value ? JSON.parse(value) : null;
                },
                setItem: (name, value) => sessionStorage.setItem(name, JSON.stringify(value)),
                removeItem: (name) => sessionStorage.removeItem(name),
            },
            partialize: (state) => ({
                userProfile: state.userProfile,
                hasCharacter: state.hasCharacter,
                isLoggedIn: state.isLoggedIn,
            }),
         }
    )
);