import { useState } from "react";

interface LoginProps {
    onLoginSuccess: (userName: string) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
    const [step, setStep] = useState<'start' | 'name'>('start');
    const [inputName, setInputName] = useState('');
    const [id, setId] = useState('');
    const [pw, setPw] = useState('');

    const handleStartSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const MOCK_ID = "GTRPG";
        const MOCK_PW = "1234"; {/* API 연결 후 수정 필요 */}

        if (id === MOCK_ID && pw === MOCK_PW) {
            setStep('name');
        } else {
            alert("아이디 또는 비밀번호가 틀렸습니다.");
        }
    }

    const handleJoinWorld = () => {
        if (inputName.trim()) {
            onLoginSuccess(inputName);
        }
    };

    return(
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="card w-full max-w-md bg-white shadow-xl border border-gray-200">
                <div className="card-body items-center text-center">

                    {step === 'start' && (
                        <>
                        <form onSubmit={handleStartSubmit} className="w-full">
                            <h2 className="card-title text-3xl font-black text-gray-800 mb-2 uppercase tracking-widest text-center w-full justify-center">
                                TRPG Online
                            </h2>
                            <p className="text-gray-500 mb-6 font-medium">로그인하세요.</p>
                            <div className="form-control w-full gap-4">
                                <input
                                    type="text"
                                    value={id}
                                    onChange={(e) => setId(e.target.value)}
                                    placeholder="Username"
                                    className="input input-bordered w-full focus:input-primary"
                                />
                                <input
                                    type="password"
                                    value={pw}
                                    onChange={(e) => setPw(e.target.value)}
                                    placeholder="Password"
                                    className="input input-bordered w-full focus:input-primary"
                                />
                                <button
                                    type="submit"
                                    onClick={handleStartSubmit}
                                    className="btn btn-primary w-full mt-4 text-white font-bold"
                                >
                                Start
                                </button>
                            </div>
                            <div className="flex justify-between w-full mt-6 text-xs text-gray-400">
                                <span className="hover:underline cursor-pointer">회원가입</span>
                                <span className="hover:underline cursor-pointer">비밀번호 찾기</span>
                            </div>
                        </form>
                        </>
                    )}

                    {step === 'name' && (
                        <>
                        <h2 className="card-title text-3xl font-black text-gray-800 mb-2 uppercase tracking-widest">
                            TRPG Online
                        </h2>
                        <p className="text-gray-500 mb-6 font-medium">이름을 입력하세요.</p>
                        
                        <input
                            type="text"
                            placeholder="이름"
                            className="input input-border w-full focus:input primary text-center text-lg"
                            value={inputName}
                            onChange={(e) => setInputName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleJoinWorld()}
                        />

                        <button
                            onClick={handleJoinWorld}
                            disabled={!inputName.trim()}
                            className="btn btn-primary w-full mt-4 text-white font-bold"
                        >
                            시작하기
                        </button>
                        <button
                            onClick={() => setStep('start')}
                            className="btn btn-ghost btn-sm mt-2 text-gray-400"
                        >
                            뒤로가기
                        </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}