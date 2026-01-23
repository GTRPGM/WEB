import { create } from "zustand";
import { api } from "../apiinterceptor";

interface Item {
    item_id: 0,
    name: string,
    type: string,
    effect_value: 0,
    description: string,
    weight: 0,
    grade: string,
    base_price: 0,
    creator: string,
    created_at: "2026-01-23T03:17:24.435Z"
}

interface ItemState {
    allItems: Item[];
    fetchItems: () => Promise<void>;
}

export const useItemStore = create<ItemState>((set) => ({
    allItems: [],
    fetchItems: async () => {
        try {
            const res = await api.post('/info/items', {}); 
            
            const itemList = res.data?.data?.items;
                
            set({ allItems: Array.isArray(itemList) ? itemList : [] });
        } catch (error) {
            console.error("아이템 목록 로드 실패:", error);
            set({ allItems: [] });
        }
    }
}));