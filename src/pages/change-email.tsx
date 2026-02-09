import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { updateUserInfo } from '../services/authService';
import axios from 'axios'; // axios 임포트

export default function ChangeEmail() {
    const navigate = useNavigate();
    const location = useLocation();

    // 이전 페이지에서 전달된 state가 없는 경우를 대비
    const currentUsername = location.state?.currentUsername;
    
    const [newEmail, setNewEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!currentUsername) {
            setError('필수 정보가 없습니다. 이전 페이지로 돌아가 다시 시도해주세요.');
            return;
        }

        if (!newEmail) {
            setError('새 이메일을 입력해주세요.');
            return;
        }

        try {
            await updateUserInfo({ username: currentUsername, email: newEmail });
            setSuccess('이메일이 성공적으로 변경되었습니다.');
            setTimeout(() => {
                navigate('/edit-profile'); // 성공 시 메뉴 페이지로 이동
            }, 2000);
        } catch (err: unknown) { // any를 unknown으로 변경
            if (axios.isAxiosError(err)) { // axios 에러인지 확인
                setError(err.response?.data?.message || '이메일 변경에 실패했습니다.');
            } else {
                setError('알 수 없는 오류로 이메일 변경에 실패했습니다.');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="card w-full max-w-md bg-white shadow-xl border border-gray-200">
                <div className="card-body items-center text-center">
                    <form onSubmit={handleSubmit} className="w-full">
                        <h2 className="card-title text-3xl font-black text-gray-800 mb-6 text-center w-full justify-center">
                            이메일 변경
                        </h2>
                        <div className="form-control w-full gap-4">
                            <input
                                type="email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                placeholder="새 이메일 주소"
                                className="input input-bordered w-full focus:input-primary"
                                required
                            />
                            {error && <div className="text-error text-sm mt-2">{error}</div>}
                            {success && <div className="text-success text-sm mt-2">{success}</div>}
                            <button
                                type="submit"
                                className="btn btn-primary w-full mt-4 text-white font-bold"
                            >
                                이메일 변경
                            </button>
                        </div>
                        <div className="flex justify-center w-full mt-6 text-xs text-gray-400">
                            <Link to="/edit-profile" className="hover:underline cursor-pointer">뒤로 가기</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
