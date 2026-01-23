import { useEffect, useState } from "react";
import { useNPCStore } from "../store/useNPCStore";
import { useUserStore } from "../store/useUserStore";

export default function EnemySidebar() {
    const { allEnemies, fetchEnemies } = useNPCStore();
    const { userProfile } = useUserStore();

    const [ searchTerm, setSearchTerm ] = useState("");

    useEffect(() => {
        fetchEnemies();
    }, []);

    const filteredEnemies = Array.isArray(allEnemies)
        ? allEnemies.filter((npc) => {
            const search = searchTerm.toLowerCase();
            return (
                npc.name?.toLowerCase().includes(search) ||
                npc.description?.toLowerCase().includes(search)
            );
          })
        : [];

    return (
        <div className="p-4 w-80 bg-base-200 h-full text-base-content">
            <div className="collapse collapse-plus bg-white border border-gray-300 shadow-md mb-4">
                {/* 이 체크박스가 전체 목록을 여닫는 스위치입니다 */}
                <input type="checkbox" className="peer" />
                <div className="collapse-title text-xl font-bold flex items-center gap-2">적 정보</div>
            

                <div className="collapse-content bg-gray-50 pt-4">
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="적 이름 또는 키워드 검색..."
                            className="input input-bordered input-sm w-full bg-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2 mb-8">
                        {filteredEnemies.length > 0 ? (
                            filteredEnemies.map((npc) => (
                                <div key={npc.id} className="collapse collapse-arrow bg-white border border-gray-200 shadow-sm">
                                    <input type="checkbox" className="peer" />
                                    <div className="collapse-title text-sm font-bold flex justify-between items-center">
                                        <span>{npc.name}</span>
                                        <span className="text-red-500 text-xs">HP {npc.hp}/{npc.maxHp}</span>
                                    </div>
                                    <div className="collapse-content text-xs text-gray-600 border-t">
                                        <div className="py-2">
                                            <p className="mb-2">{npc.description}</p>
                                            <progress
                                                className="progress progress-error w-full h-2"
                                                value={npc.hp}
                                                max={npc.maxHp}
                                            ></progress>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-xs text-gray-400 italic px-2">
                                {searchTerm ? "검색 결과가 없습니다." : "데이터를 불러오는 중입니다..."}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>

    );
}