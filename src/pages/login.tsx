import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";
import { useAuthStore } from "../store/useAuthStore";
import { api } from "../apiinterceptor";

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const hasAlerted = useRef(false);
    const setTokens = useAuthStore((state) => state.setTokens);
    const setAuthSuccess = useUserStore((state) => state.setAuthSuccess);

    const [id, setId] = useState('');
    const [pw, setPw] = useState('');

    const handleStartSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await api.post('/auth/login', { username: id, password: pw });

            const { access_token, refresh_token } = res.data.data;

            setTokens(access_token, refresh_token);
            setAuthSuccess();

            console.log("로그인 상태 확인: ", useUserStore.getState().isLoggedIn);
            
            setTimeout(() => {navigate('/create-char');}, 200);

        } catch (error) {
            alert("아이디 또는 비밀번호가 틀렸습니다.");
        }
    };

    useEffect(() => {
        if (location.state?.needLogin && !hasAlerted.current) {
            alert("로그인이 필요합니다.");

            hasAlerted.current = true;

            navigate('/login', { replace: true, state: {} });
        }
    }, [location, navigate]);

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