import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getScenarios, startSession } from "../services/gameService";
import { useChatStore } from "../store/useChatStore";

interface Scenario {
    scenario_id: string;
    title: string;
}

export default function SelectScenario() {
    const [scenarios, setScenarios] = useState<Scenario[]>([]);
    const [selectedScenarioId, setSelectedScenarioId] = useState<string>('');
    const [locationInput, setLocationInput] = useState<string>('어두운 밤, 낡은 여관 앞');
    const [isLoadingScenarios, setIsLoadingScenarios] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const setSessionId = useChatStore((state) => state.setSessionId);
    const setPlayerId = useChatStore((state) => state.setPlayerId);
    const setLoadingGameSession = useChatStore((state) => state.setLoadingGameSession);

    // 💡 배경 이미지 경로 고정
    const bgImageUrl = "/assets/background/login-bg.png";

    useEffect(() => {
        const fetchScenarios = async () => {
            setIsLoadingScenarios(true);
            setError(null);
            try {
                const fetchedScenarios = await getScenarios();
                setScenarios(fetchedScenarios);
                if (fetchedScenarios.length > 0) {
                    setSelectedScenarioId(fetchedScenarios[0].scenario_id);
                }
            } catch (err) {
                setError('시나리오를 불러오는 데 실패했습니다.');
                console.error(err);
            } finally {
                setIsLoadingScenarios(false);
            }
        };
        fetchScenarios();
    }, []);

    const handleStartGame = async () => {
        if (!selectedScenarioId) {
            setError('시나리오를 선택해주세요.');
            return;
        }
        if (!locationInput.trim()) {
            setError('시작 지점을 입력해주세요.');
            return;
        }

        setLoadingGameSession(true);
        setError(null);
        try {
            const sessionData = await startSession(selectedScenarioId, locationInput);
            setSessionId(sessionData.session_id);
            setPlayerId(sessionData.player_id);
            navigate('/gamemain');
        } catch (err) {
            setError('게임 세션을 시작하는 데 실패했습니다.');
            console.error(err);
            setLoadingGameSession(false);
        }
    };

    return (
        <div 
            className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat relative px-4"
            style={{ 
                backgroundImage: `url('${bgImageUrl}')`,
                backgroundColor: '#1a1a1a'
            }}
        >
            {/* 배경 오버레이 */}
            <div className="absolute inset-0 bg-base-100/70 backdrop-blur-[5px]"></div>

            {/* 카드 박스 */}
            <div className="relative z-10 card w-full max-w-md bg-base-100/90 backdrop-blur-md shadow-2xl border border-white/10 animate-in fade-in zoom-in duration-500">
                <div className="card-body p-8 sm:p-10">
                    
                    {/* 타이틀 섹션 */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-black text-primary mb-2 uppercase tracking-tighter drop-shadow-md">
                            Select Journey
                        </h2>
                        <div className="h-1 w-12 bg-primary mx-auto rounded-full opacity-50 mb-4"></div>
                        <p className="text-base-content/70 font-bold text-[10px] uppercase tracking-[0.2em] italic">
                            Choose your destiny
                        </p>
                    </div>

                    {isLoadingScenarios ? (
                        <div className="flex flex-col items-center py-10">
                            <span className="loading loading-spinner loading-lg text-primary"></span>
                            <p className="text-sm font-bold text-base-content/60 mt-4 animate-pulse">시나리오 탐색 중...</p>
                        </div>
                    ) : error ? (
                        <div className="alert alert-error bg-error/10 border-error/20 text-error text-xs font-bold mb-4 rounded-2xl p-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>{error}</span>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* 시나리오 선택 */}
                            <div className="form-control w-full">
                                <label className="label text-[10px] font-black uppercase text-base-content/40 tracking-widest px-1">
                                    Choose Scenario
                                </label>
                                <select
                                    className="select select-bordered w-full bg-base-200/50 focus:select-primary font-bold h-12 rounded-xl"
                                    value={selectedScenarioId}
                                    onChange={(e) => setSelectedScenarioId(e.target.value)}
                                >
                                    {scenarios.map((scenario) => (
                                        <option key={scenario.scenario_id} value={scenario.scenario_id}>
                                            {scenario.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* 시작 지점 입력 */}
                            <div className="form-control w-full">
                                <label className="label text-[10px] font-black uppercase text-base-content/40 tracking-widest px-1">
                                    Starting Point
                                </label>
                                <input
                                    type="text"
                                    placeholder="예: 안개 자욱한 숲속 입구"
                                    className="input input-bordered w-full bg-base-200/50 focus:input-primary font-medium h-12 rounded-xl"
                                    value={locationInput}
                                    onChange={(e) => setLocationInput(e.target.value)}
                                />
                                <label className="label">
                                    <span className="label-text-alt text-base-content/40 text-[9px] italic">모험이 시작될 구체적인 장소를 입력하세요.</span>
                                </label>
                            </div>

                            {/* 시작 버튼 */}
                            <div className="pt-4">
                                <button
                                    onClick={handleStartGame}
                                    disabled={!selectedScenarioId || !locationInput.trim()}
                                    className="btn btn-primary w-full h-14 text-lg font-black rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.01] transition-all disabled:opacity-50"
                                >
                                    모험 시작
                                </button>
                            </div>
                        </div>
                    )}

                    {!isLoadingScenarios && scenarios.length === 0 && !error && (
                        <p className="text-center text-xs font-bold text-base-content/30 py-10 uppercase tracking-widest">
                            No scenarios found.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}