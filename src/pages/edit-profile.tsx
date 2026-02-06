import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserDetail } from '../services/authService';

interface UserData {
    username: string;
    email: string;
}

export default function EditProfile() {
    const navigate = useNavigate();
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await getUserDetail();
                setUser(response.data);
            } catch (err: any) {
                setError('회원 정보를 불러오는 데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleDeleteAccount = () => {
        if (window.confirm('정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
            // TODO: Add API call to delete account
            alert('회원 탈퇴 기능은 아직 구현되지 않았습니다.');
            // navigate('/login'); // 탈퇴 성공 시 로그인 페이지로 리다이렉트
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="card w-full max-w-md bg-white shadow-xl border border-gray-200">
                <div className="card-body">
                    <h2 className="card-title text-3xl font-black text-gray-800 mb-6 text-center w-full justify-center">
                        회원 정보 수정
                    </h2>
                    
                    {loading && <p className="text-center">회원 정보를 불러오는 중...</p>}
                    {error && <p className="text-center text-error">{error}</p>}

                    {user && !loading && !error && (
                        <div className="menu bg-base-100 w-full p-0">
                            <ul className='space-y-2'>
                                <li>
                                    <Link 
                                        to="/edit-profile/username" 
                                        state={{ currentEmail: user.email }}
                                        className="btn btn-outline w-full justify-start"
                                    >
                                        아이디 변경
                                    </Link>
                                </li>
                                <li>
                                    <Link 
                                        to="/edit-profile/email" 
                                        state={{ currentUsername: user.username }}
                                        className="btn btn-outline w-full justify-start"
                                    >
                                        이메일 변경
                                    </Link>
                                </li>
                                <li>
                                    <Link 
                                        to="/edit-profile/password"
                                        className="btn btn-outline w-full justify-start"
                                    >
                                        비밀번호 변경
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    )}
                    <div className="flex justify-center w-full mt-6 text-xs text-gray-400">
                        <Link to="/gamemain" className="hover:underline cursor-pointer">게임으로 돌아가기</Link>
                    </div>

                    <div className="flex justify-center w-full mt-2">
                        <span
                            onClick={handleDeleteAccount}
                            className="bg-error text-white text-xs cursor-pointer border border-error px-1 py-0.5 rounded"
                        >
                            회원 탈퇴
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
