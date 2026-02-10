import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile } from '../types';

export interface UserState {
    userProfile: UserProfile;
    hasCharacter: boolean;
    isLoggedIn: boolean;

    setAuthSuccess: () => void;
    setCharacterName: (name: string) => void;
    logout: () => void;
}



export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            userProfile: {
                name: '',
                inventory: []
            },
            hasCharacter: false,
            isLoggedIn: false,


            setAuthSuccess: () => set({ isLoggedIn: true }),
            setCharacterName: (name) => set((state) => ({ userProfile: { ...state.userProfile, name }, hasCharacter: true })),
            logout: () => {
                set({ isLoggedIn: false, hasCharacter: false, userProfile: { name: '', inventory: [] }
                });
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
            }
         }
    )
);