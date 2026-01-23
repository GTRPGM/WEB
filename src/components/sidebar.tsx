import { useEffect, useState } from "react";
import { useENEMYStore, useNPCStore } from "../store/useNPCStore";
import { useItemStore } from "../store/useItemStore";

export default function Sidebar() {
    const { allEnemies, fetchEnemies } = useENEMYStore();
    const { allItems, fetchItems } = useItemStore();
    const { allNPCs, fetchNPCs } = useNPCStore();

    const [ searchTerm, setEnemySearchTerm ] = useState("");
    const [ itemSearchTerm, setItemSearchTerm ] = useState("");
    const [ npcSearchTerm, setNPCsearchTerm ] = useState("");

    useEffect(() => {
        fetchEnemies();
        fetchItems();
        fetchNPCs();
    }, []);

    const filteredEnemies = Array.isArray(allEnemies)
        ? allEnemies.filter((enemy) => {
            const search = searchTerm.toLowerCase();
            return (
                enemy.name?.toLowerCase().includes(search) ||
                enemy.description?.toLowerCase().includes(search)
            );
          })
        : [];

    const filteredItems = Array.isArray(allItems)
        ? allItems.filter((item) => {
            const search = itemSearchTerm.toLowerCase();
            return (
                item.name?.toLowerCase().includes(search) ||
                item.description?.toLowerCase().includes(search)
            );
        })
    : [];

    const filteredNPC = Array.isArray(allNPCs)
        ? allNPCs.filter((NPC) => {
            const search = npcSearchTerm.toLowerCase();
            return (
                NPC.name?.toLowerCase().includes(search) ||
                NPC.description?.toLowerCase().includes(search)
            )
        })
    : [];

    return (
        <div className="p-4 w-80 bg-base-200 h-full text-base-content overflow-y-auto">
            {/* --- 적 정보 섹션 --- */}
            <div className="collapse collapse-plus bg-white mb-4">
                <input type="checkbox" className="peer" />
                <div className="collapse-title text-xl font-bold flex items-center gap-2">적 정보</div>

                <div className="collapse-content bg-gray-50 pt-4">
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="적 이름 또는 키워드 검색..."
                            className="input input-bordered input-sm w-full bg-white"
                            value={searchTerm}
                            onChange={(e) => setEnemySearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2 mb-8">
                        {filteredEnemies.length > 0 ? (
                            filteredEnemies.map((enemy) => (
                                <div key={enemy.enemy_id} className="collapse collapse-arrow bg-white border border-gray-200 shadow-sm">
                                    <input type="checkbox" className="peer" />
                                    <div className="collapse-title text-sm font-bold flex justify-between items-center">
                                        <span>{enemy.name}</span>
                                        <span className="text-red-500 text-xs font-mono">난이도 {enemy.base_difficulty}</span>
                                    </div>
                                    <div className="collapse-content text-xs text-gray-600 border-t bg-white">
                                        <div className="py-2">
                                            <p className="text-[10px] text-gray-400">유형: {enemy.type}</p>
                                            <p className="mb-2 italic leading-relaxed">{enemy.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-xs text-gray-400 italic px-2 text-center py-4">
                                {searchTerm ? "검색 결과가 없습니다." : "데이터를 불러오는 중입니다..."}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* -- NPC 목록 섹션 --- */}
            <div className="collapse collapse-plus bg-white mb-4">
                <input type="checkbox" className="peer" />
                <div className="collapse-title text-xl font-bold flex items-center gap-2">등장인물 정보</div>

                <div className="collapse-content bg-gray-50 pt-4">
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="등장인물 이름 또는 키워드 검색..."
                            className="input input-bordered input-sm w-full bg-white"
                            value={npcSearchTerm}
                            onChange={(e) => setNPCsearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2 mb-8">
                        {filteredNPC.length > 0 ? (
                            filteredNPC.map((NPC) => (
                                <div key={NPC.npc_id} className="collapse collapse-arrow bg-white border border-gray-200 shadow-sm">
                                    <input type="checkbox" className="peer" />
                                    <div className="collapse-title text-sm font-bold flex justify-between items-center">
                                        <span>{NPC.name}</span>
                                        <span className="text-red-500 text-xs font-mono">{NPC.occupation}</span>
                                    </div>
                                    <div className="collapse-content text-xs text-gray-600 border-t bg-white">
                                        <div className="py-2">
                                            <p className="mb-2 italic leading-relaxed">{NPC.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-xs text-gray-400 italic px-2 text-center py-4">
                                {npcSearchTerm ? "검색 결과가 없습니다." : "데이터를 불러오는 중입니다..."}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* --- 아이템 목록 섹션 --- */}
            <div className="collapse collapse-plus bg-white mb-4">
                <input type="checkbox" className="peer" /> 
                <div className="collapse-title text-xl font-bold flex items-center gap-2">아이템 목록</div>

                <div className="collapse-content bg-gray-50 pt-4">
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="아이템 이름 또는 효과 검색..."
                            className="input input-bordered input-sm w-full bg-white"
                            value={itemSearchTerm}
                            onChange={(e) => setItemSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        {filteredItems.length > 0 ? (
                            filteredItems.map((item) => (
                                <div key={item.item_id} className="collapse collapse-arrow bg-white border border-gray-200 shadow-sm">
                                    <input type="checkbox" className="peer" />
                                    <div className="collapse-title text-sm font-bold">
                                        {item.name}
                                        <span className="text-red-500 text-xs font-mono">{item.grade}</span>
                                    </div>
                                    
                                    <div className="collapse-content text-xs text-gray-600 border-t bg-white">
                                        <div className="py-2">
                                            <p className="italic text-blue-600 mb-1 font-small">{item.base_price}</p>
                                            <p className="italic text-blue-600 mb-1">설명:</p>
                                            <p className="leading-relaxed text-gray-700 font-medium">{item.description}</p>
                                            <p className="leading-relaxed text-red-700 font-small">{item.effect_value}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-xs text-gray-400 italic text-center py-4">아이템이 없습니다.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>

    );
}