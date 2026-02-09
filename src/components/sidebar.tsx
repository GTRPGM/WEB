import { useEffect, useState } from "react";
import { useENEMYStore, useNPCStore } from "../store/useNPCStore";
import { useItemStore } from "../store/useItemStore";
import SidebarQuizButton from "./SidebarQuizButton"; // 분리한 퀴즈 컴포넌트 임포트

export default function Sidebar() {
    // 1. Store에서 데이터 및 가져오기 함수 추출
    const { allEnemies, fetchEnemies } = useENEMYStore();
    const { allItems, fetchItems } = useItemStore();
    const { allNPCs, fetchNPCs } = useNPCStore();

    // 2. 검색어 상태 관리
    const [searchTerm, setSearchTerm] = useState("");
    const [itemSearchTerm, setItemSearchTerm] = useState("");
    const [npcSearchTerm, setNPCsearchTerm] = useState("");

    // 3. 컴포넌트 마운트 시 데이터 로드
    useEffect(() => {
        fetchEnemies();
        fetchItems();
        fetchNPCs();
    }, [fetchEnemies, fetchItems, fetchNPCs]);

    // 4. 필터링 로직 (데이터가 배열인지 확인 후 필터링)
    const filteredEnemies = Array.isArray(allEnemies)
        ? allEnemies.filter((enemy) =>
            enemy.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enemy.description?.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : [];

    const filteredItems = Array.isArray(allItems)
        ? allItems.filter((item) =>
            item.name?.toLowerCase().includes(itemSearchTerm.toLowerCase()) ||
            item.description?.toLowerCase().includes(itemSearchTerm.toLowerCase())
          )
        : [];

    const filteredNPC = Array.isArray(allNPCs)
        ? allNPCs.filter((npc) =>
            npc.name?.toLowerCase().includes(npcSearchTerm.toLowerCase()) ||
            npc.description?.toLowerCase().includes(npcSearchTerm.toLowerCase())
          )
        : [];

    return (
        <div className="w-80 bg-base-200 h-full text-base-content flex flex-col shadow-inner">
            {/* 상단: 도감 목록 영역 (스크롤 가능) */}
            <div className="p-4 flex-1 overflow-y-auto space-y-4">
                
                {/* --- 적 정보 섹션 --- */}
                <div className="collapse collapse-plus bg-white shadow-sm rounded-xl">
                    <input type="checkbox" className="peer" />
                    <div className="collapse-title text-xl font-bold flex items-center gap-2">적 정보</div>
                    <div className="collapse-content bg-gray-50 pt-4">
                        <input
                            type="text"
                            placeholder="적 이름 또는 키워드 검색..."
                            className="input input-bordered input-sm w-full bg-white mb-4"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="space-y-2">
                            {filteredEnemies.map((enemy) => (
                                <div key={enemy.enemy_id} className="collapse collapse-arrow bg-white border border-gray-200 shadow-sm rounded-lg">
                                    <input type="checkbox" className="peer" />
                                    <div className="collapse-title text-sm font-bold flex justify-between items-center">
                                        <span>{enemy.name}</span>
                                        <span className="text-red-500 text-xs">난이도 {enemy.base_difficulty}</span>
                                    </div>
                                    <div className="collapse-content text-xs text-gray-600 border-t bg-white">
                                        <p className="py-2 italic leading-relaxed">{enemy.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- 등장인물 정보 섹션 --- */}
                <div className="collapse collapse-plus bg-white shadow-sm rounded-xl">
                    <input type="checkbox" className="peer" />
                    <div className="collapse-title text-xl font-bold">등장인물 정보</div>
                    <div className="collapse-content bg-gray-50 pt-4">
                        <input
                            type="text"
                            placeholder="이름 또는 키워드 검색..."
                            className="input input-bordered input-sm w-full bg-white mb-4"
                            value={npcSearchTerm}
                            onChange={(e) => setNPCsearchTerm(e.target.value)}
                        />
                        <div className="space-y-2">
                            {filteredNPC.map((npc) => (
                                <div key={npc.npc_id} className="collapse collapse-arrow bg-white border border-gray-200 shadow-sm rounded-lg">
                                    <input type="checkbox" className="peer" />
                                    <div className="collapse-title text-sm font-bold flex justify-between items-center">
                                        <span>{npc.name}</span>
                                        <span className="text-blue-500 text-xs">{npc.occupation}</span>
                                    </div>
                                    <div className="collapse-content text-xs text-gray-600 border-t bg-white">
                                        <p className="py-2 italic leading-relaxed">{npc.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- 아이템 목록 섹션 --- */}
                <div className="collapse collapse-plus bg-white shadow-sm rounded-xl">
                    <input type="checkbox" className="peer" />
                    <div className="collapse-title text-xl font-bold">아이템 목록</div>
                    <div className="collapse-content bg-gray-50 pt-4">
                        <input
                            type="text"
                            placeholder="효과 또는 이름 검색..."
                            className="input input-bordered input-sm w-full bg-white mb-4"
                            value={itemSearchTerm}
                            onChange={(e) => setItemSearchTerm(e.target.value)}
                        />
                        <div className="space-y-2">
                            {filteredItems.map((item) => (
                                <div key={item.item_id} className="collapse collapse-arrow bg-white border border-gray-200 shadow-sm rounded-lg">
                                    <input type="checkbox" className="peer" />
                                    <div className="collapse-title text-sm font-bold flex justify-between items-center">
                                        <span>{item.name}</span>
                                        <span className="text-amber-500 text-xs">{item.grade}</span>
                                    </div>
                                    <div className="collapse-content text-xs text-gray-600 border-t bg-white">
                                        <div className="py-2">
                                            <p className="text-blue-600 font-bold mb-1">{item.base_price} Gold</p>
                                            <p className="leading-relaxed">{item.description}</p>
                                            {item.effect_value && <p className="text-red-500 mt-1">{item.effect_value}</p>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 하단 고정: 퀴즈 버튼 컴포넌트 */}
            <SidebarQuizButton />
        </div>
    );
}