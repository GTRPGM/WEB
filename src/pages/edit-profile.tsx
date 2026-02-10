import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserDetail } from '../services/authService';
import { api } from '../apiinterceptor';
import { useAuthStore } from "../store/useAuthStore";
import { useUserStore } from "../store/useUserStore";
import { useChatStore } from "../store/useChatStore";

interface UserData {
    username: string;
    email: string;
}

export default function EditProfile() {
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // 💡 기존 배경화면 경로 유지
    const bgImageUrl = "/assets/background/bg.jpg";

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await getUserDetail();
                setUser(response.data);
            } catch {
                setError('회원 정보를 불러오는 데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    /**
     * 💡 회원 탈퇴 핸들러
     * 서버 통신 후 로컬 데이터를 완전히 삭제하고 물리적 새로고침을 수행합니다.
     */
    const handleDeleteAccount = async () => {
        if (!window.confirm('정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없으며 모든 게임 데이터가 삭제됩니다.')) {
            return;
        }

        try {
            await api.delete('/user/delete'); 
            alert('계정이 안전하게 삭제되었습니다.');
        } catch (err) {
            console.error('회원 탈퇴 실패:', err);
            alert('탈퇴 처리 중 오류가 발생했습니다.');
        } finally {
            // 모든 스토어 초기화
            useAuthStore.getState().clearTokens();
            if (useUserStore.getState().logout) useUserStore.getState().logout();
            if (useChatStore.getState().resetAll) useChatStore.getState().resetAll();

            // 물리적 새로고침으로 세션 찌꺼기 완벽 제거
            window.location.href = '/login';
        }
    };

    return (
        <div 
            className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat relative px-4"
            style={{ backgroundImage: `url('${bgImageUrl}')` }}
        >
        

            <div className="relative z-10 card w-full max-w-md bg-base-100/90 backdrop-blur-md shadow-2xl border border-white/10 animate-in fade-in zoom-in duration-300">
                <div className="card-body p-8 sm:p-10">
                    <h2 className="text-3xl font-black text-primary mb-8 text-center uppercase tracking-tighter drop-shadow-sm">
                        Edit Profile
                    </h2>
                    
                    {loading && (
                        <div className="flex flex-col items-center py-10">
                            <span className="loading loading-spinner loading-md text-primary"></span>
                            <p className="text-xs font-bold text-base-content/50 mt-4 uppercase">Loading...</p>
                        </div>
                    )}

                    {error && (
                        <div className="alert alert-error bg-error/10 border-none text-error text-xs font-bold mb-6 justify-center">
                            <span>{error}</span>
                        </div>
                    )}

                    {user && !loading && !error && (
                        <div className="space-y-3">
                            <Link 
                                to="/edit-profile/username" 
                                state={{ currentEmail: user.email }}
                                className="btn btn-outline w-full justify-between h-14 rounded-xl border-base-300 hover:bg-base-200 hover:text-base-content transition-all group"
                            >
                                <span className="font-bold">아이디 변경</span>
                                <span className="opacity-30 group-hover:translate-x-1 transition-transform">→</span>
                            </Link>
                            
                            <Link 
                                to="/edit-profile/email" 
                                state={{ currentUsername: user.username }}
                                className="btn btn-outline w-full justify-between h-14 rounded-xl border-base-300 hover:bg-base-200 hover:text-base-content transition-all group"
                            >
                                <span className="font-bold">이메일 변경</span>
                                <span className="opacity-30 group-hover:translate-x-1 transition-transform">→</span>
                            </Link>
                            
                            <Link 
                                to="/edit-profile/password"
                                className="btn btn-outline w-full justify-between h-14 rounded-xl border-base-300 hover:bg-base-200 hover:text-base-content transition-all group"
                            >
                                <span className="font-bold">비밀번호 변경</span>
                                <span className="opacity-30 group-hover:translate-x-1 transition-transform">→</span>
                            </Link>
                        </div>
                    )}

                    <div className="divider opacity-10 my-6"></div>

                    <div className="flex flex-col items-center gap-4 text-center">
                        <Link to="/gamemain" className="text-xs font-bold text-base-content/50 hover:text-primary transition-colors uppercase tracking-widest">
                            Back to Adventure
                        </Link>

                        <button
                            onClick={handleDeleteAccount}
                            className="text-[10px] font-bold text-error/40 hover:text-error transition-colors uppercase tracking-tighter underline underline-offset-4 decoration-1"
                        >
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}