import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";
import { useAuthStore } from "../store/useAuthStore";
import { api } from "../apiinterceptor";
import axios from "axios";

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const hasAlerted = useRef(false);
    const setTokens = useAuthStore((state) => state.setTokens);
    const setAuthSuccess = useUserStore((state) => state.setAuthSuccess);

    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    const [error, setError] = useState('');

    // 💡 public/assets/background/bg.jpg 경로 고정
    const bgImageUrl = "/assets/background/login-bg.png"; 

    const handleStartSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const res = await api.post('/auth/login', { username: id, password: pw });
            const { access_token, refresh_token } = res.data.data;

            setTokens(access_token, refresh_token);
            setAuthSuccess();
            
            setTimeout(() => { navigate('/create-char'); }, 200);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.detail || '로그인 중 오류가 발생했습니다.');
            } else {
                setError('로그인 중 알 수 없는 오류가 발생했습니다.');
            }
        }
    };

    useEffect(() => {
        if (location.state?.needLogin && !hasAlerted.current) {
            alert("로그인이 필요합니다.");
            hasAlerted.current = true;
            navigate('/login', { replace: true, state: {} });
        }
    }, [location, navigate]);

    return (
        <div 
            className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat relative px-4"
            style={{ 
                backgroundImage: `url('${bgImageUrl}')`,
                backgroundColor: '#1a1a1a'
            }}
        >
            {/* 어두운 오버레이 레이어 */}
            <div className="absolute inset-0"></div>

            <div className="relative z-10 card w-full max-w-md bg-base-100/90 backdrop-blur-md shadow-2xl border border-white/10 animate-in fade-in zoom-in duration-500">
                <div className="card-body items-center text-center p-10">
                    <form onSubmit={handleStartSubmit} className="w-full">
                        <h2 className="card-title text-4xl font-black text-primary mb-2 uppercase tracking-tighter w-full justify-center drop-shadow-md">
                            TRPG Online
                        </h2>
                        <p className="text-base-content/70 mb-8 font-bold text-xs uppercase tracking-widest italic">
                            Enter the Adventure
                        </p>

                        <div className="form-control w-full gap-4">
                            <input
                                type="text"
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                                placeholder="Username"
                                className="input input-bordered w-full bg-base-200/50 focus:input-primary font-medium"
                            />
                            <input
                                type="password"
                                value={pw}
                                onChange={(e) => setPw(e.target.value)}
                                placeholder="Password"
                                className="input input-bordered w-full bg-base-200/50 focus:input-primary font-medium"
                            />
                            
                            {error && (
                                <div className="text-error text-[11px] font-bold mt-1 bg-error/10 py-2 rounded-lg">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="btn btn-primary w-full mt-4 text-primary-content font-black text-lg h-14 rounded-2xl shadow-lg hover:scale-[1.01] transition-transform"
                            >
                                Start
                            </button>
                        </div>

                        <div className="flex justify-center w-full mt-8 text-xs font-bold">
                            <Link to="/signup" className="text-base-content/50 hover:text-primary transition-colors uppercase tracking-widest">
                                Create Account
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}