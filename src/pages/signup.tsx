import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';
import axios from 'axios'; // axios 임포트

export default function Signup() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            await registerUser({ username, email, password });
            setSuccess('회원가입이 성공적으로 완료되었습니다. 로그인 해주세요.');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err: unknown) { // any를 unknown으로 변경
            if (axios.isAxiosError(err)) { // axios 에러인지 확인
                setError(err.response?.data?.message || '회원가입에 실패했습니다.');
            } else {
                setError('알 수 없는 오류로 회원가입에 실패했습니다.');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="card w-full max-w-md bg-white shadow-xl border border-gray-200">
                <div className="card-body items-center text-center">
                    <form onSubmit={handleSubmit} className="w-full">
                        <h2 className="card-title text-3xl font-black text-gray-800 mb-2 uppercase tracking-widest text-center w-full justify-center">
                            회원가입
                        </h2>
                        <p className="text-gray-500 mb-6 font-medium">새 계정을 생성하세요.</p>
                        <div className="form-control w-full gap-4">
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="사용자 이름"
                                className="input input-bordered w-full focus:input-primary"
                                required
                            />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="이메일"
                                className="input input-bordered w-full focus:input-primary"
                                required
                            />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="비밀번호"
                                className="input input-bordered w-full focus:input-primary"
                                required
                            />
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="비밀번호 확인"
                                className="input input-bordered w-full focus:input-primary"
                                required
                            />
                            {error && <div className="text-error text-sm mt-2">{error}</div>}
                            {success && <div className="text-success text-sm mt-2">{success}</div>}
                            <button
                                type="submit"
                                className="btn btn-primary w-full mt-4 text-white font-bold"
                            >
                                회원가입
                            </button>
                        </div>
                        <div className="flex justify-center w-full mt-6 text-xs text-gray-400">
                            <Link to="/login" className="hover:underline cursor-pointer">이미 계정이 있으신가요? 로그인</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
