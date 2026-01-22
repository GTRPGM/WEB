import { useEffect } from "react";
import { useNPCStore } from "../store/useNPCStore";

export default function EnemySidebar() {
    const { enemies, fetchEnemies } = useNPCStore();

    useEffect(() => {
        fetchEnemies();
    }, []);

    return (
        <div className="p-4 w-80 bg-base-200 h-full text-base-content">
            <h2 className="text-xl font-bold mb-4">적 정보</h2>

            {enemies.map((npc) => (
                <div key={npc.id} className="collapse collapse-arrow bg-white border border-gray-200 mb-2 shadow-sm">

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
            ))}
        </div>
    );
}