import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { changePassword } from '../services/authService';
import axios from 'axios'; // axios 임포트

export default function ChangePassword() {
    const navigate = useNavigate();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword !== confirmNewPassword) {
            setError('새 비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            await changePassword({ old_pw: oldPassword, new_pw: newPassword });
            setSuccess('비밀번호가 성공적으로 변경되었습니다.');
            setTimeout(() => {
                navigate('/edit-profile'); // 성공 시 메뉴 페이지로 이동
            }, 2000);
        } catch (err: unknown) { // any를 unknown으로 변경
            if (axios.isAxiosError(err)) { // axios 에러인지 확인
                setError(err.response?.data?.message || '비밀번호 변경에 실패했습니다.');
            } else {
                setError('알 수 없는 오류로 비밀번호 변경에 실패했습니다.');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="card w-full max-w-md bg-white shadow-xl border border-gray-200">
                <div className="card-body items-center text-center">
                    <form onSubmit={handleSubmit} className="w-full">
                        <h2 className="card-title text-3xl font-black text-gray-800 mb-6 text-center w-full justify-center">
                            비밀번호 변경
                        </h2>
                        <div className="form-control w-full gap-4">
                            <input
                                type="password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                placeholder="현재 비밀번호"
                                className="input input-bordered w-full focus:input-primary"
                                required
                            />
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="새 비밀번호"
                                className="input input-bordered w-full focus:input-primary"
                                required
                            />
                            <input
                                type="password"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                placeholder="새 비밀번호 확인"
                                className="input input-bordered w-full focus:input-primary"
                                required
                            />
                            {error && <div className="text-error text-sm mt-2">{error}</div>}
                            {success && <div className="text-success text-sm mt-2">{success}</div>}
                            <button
                                type="submit"
                                className="btn btn-primary w-full mt-4 text-white font-bold"
                            >
                                비밀번호 변경
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
