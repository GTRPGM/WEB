import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getScenarios, startSession } from "../services/gameService";
import { useChatStore } from "../store/useChatStore";
// import GameLoader from "../components/GameLoader"; // GameLoader 임포트 제거

interface Scenario {
    scenario_id: string;
    title: string;
}

export default function SelectScenario() {
    const [scenarios, setScenarios] = useState<Scenario[]>([]);
    const [selectedScenarioId, setSelectedScenarioId] = useState<string>('');
    const [locationInput, setLocationInput] = useState<string>('시작 지점');
    const [isLoadingScenarios, setIsLoadingScenarios] = useState<boolean>(false); // 시나리오 로딩을 위한 로컬 상태
    // const [isLoading, setIsLoading] = useState<boolean>(false); // 제거
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const setSessionId = useChatStore((state) => state.setSessionId);
    const setPlayerId = useChatStore((state) => state.setPlayerId); // Add setPlayerId
    const setLoadingGameSession = useChatStore((state) => state.setLoadingGameSession); // setLoadingGameSession 가져오기

    // GameLoader 완료 핸들러 제거
    // const handleGameLoaderComplete = useCallback(() => {
    //     setIsLoading(false);
    //     navigate('/gamemain');
    // }, [navigate]);

    useEffect(() => {
        const fetchScenarios = async () => {
            setIsLoadingScenarios(true); // 시나리오 불러올 때 로딩 표시
            setError(null); // 새로운 fetch 시도 전에 에러 초기화
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
                setIsLoadingScenarios(false); // fetch가 성공하든 실패하든 로딩 종료
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

        setLoadingGameSession(true); // 전역 게임 세션 로딩 시작
        setError(null);
        try {
            const sessionData = await startSession(selectedScenarioId, locationInput);
            setSessionId(sessionData.session_id);
            setPlayerId(sessionData.player_id); // Store player_id
            navigate('/gamemain'); // 게임 메인으로 이동 (로딩 화면은 App.tsx에서 전역적으로 관리)
        } catch (err) {
            setError('게임 세션을 시작하는 데 실패했습니다.');
            console.error(err);
            setLoadingGameSession(false); // 오류 발생 시 전역 로딩 종료
        }
    };

    return (
        <>
            {/* GameLoader는 App.tsx에서 전역적으로 관리하므로 여기서 렌더링 제거 */}
            {/* {isLoading && <GameLoader onLoadingComplete={handleGameLoaderComplete} />} */}

            {/* 시나리오 선택 UI는 시나리오 로딩 중이 아니고 전역 게임 세션 로딩 중이 아닐 때만 렌더링 */}
            {/* !isLoading && ( */}
            <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
                <div className="card w-full max-w-md bg-white shadow-xl border border-gray-200 p-6">
                    <h2 className="card-title text-3xl font-black text-gray-800 mb-6 uppercase tracking-widest text-center w-full justify-center">
                        시나리오 선택
                    </h2>

                    {isLoadingScenarios && ( // 시나리오 로딩 스피너
                        <div className="text-center my-4">
                            <span className="loading loading-spinner loading-lg text-primary"></span>
                            <p className="text-gray-600 mt-2">시나리오 불러오는 중...</p>
                        </div>
                    )}

                    {error && (
                        <div role="alert" className="alert alert-error mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>{error}</span>
                        </div>
                    )}

                    {!isLoadingScenarios && scenarios.length > 0 ? ( // 시나리오 로딩이 끝나고 시나리오가 있을 때만 렌더링
                        <>
                            <div className="form-control w-full mb-4">
                                <label className="label">
                                    <span className="label-text">시나리오를 선택하세요</span>
                                </label>
                                <select
                                    className="select select-bordered w-full"
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

                            <div className="form-control w-full mb-6">
                                <label className="label">
                                    <span className="label-text">시작 지점을 입력하세요</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="예: 어두운 숲 속 동굴 입구"
                                    className="input input-bordered w-full"
                                    value={locationInput}
                                    onChange={(e) => setLocationInput(e.target.value)}
                                />
                            </div>

                            <button
                                onClick={handleStartGame}
                                className="btn btn-primary w-full mt-4 text-white font-bold"
                                disabled={!selectedScenarioId || !locationInput.trim()}
                            >
                                게임 시작
                            </button>
                        </>
                    ) : (
                        // 시나리오 로딩 중이 아니고 시나리오가 없을 때 메시지
                        !isLoadingScenarios && !error && <p className="text-center text-gray-500">불러올 시나리오가 없습니다.</p>
                    )}
                </div>
            </div>
            {/* ) */}
        </>
    );
}
