import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";
import { useAuthStore } from "../store/useAuthStore";
import { api } from "../apiinterceptor";

export default function Login() {
    const navigate = useNavigate();
    const setTokens = useAuthStore((state) => state.setTokens);
    const setAuthSuccess = useUserStore((state) => state.setAuthSuccess);

    const [id, setId] = useState('');
    const [pw, setPw] = useState('');

    const handleStartSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await api.post('/auth/login', { username: id, password: pw });

            const { access_token, refresh_token, hasCharacter } = res.data;

            setTokens(access_token, refresh_token);
            setAuthSuccess();

            if (hasCharacter) {
                navigate('/game');
            } else {
                navigate('/create-char');
            }
        } catch (error) {
            alert("아이디 또는 비밀번호가 틀렸습니다.");
        }
    };

    return(
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="card w-full max-w-md bg-white shadow-xl border border-gray-200">
                <div className="card-body items-center text-center">
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
                </div>
            </div>
        </div>
    );
}