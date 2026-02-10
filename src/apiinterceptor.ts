import axios from 'axios';
import { useAuthStore } from './store/useAuthStore';
import { useUserStore } from './store/useUserStore';
import { refreshToken } from './services/authService';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        'content-type': 'application/json',
    },
});

let navigate: (path: string, options?: { replace: boolean }) => void;

export const setNavigator = (navigator: typeof navigate) => {
    navigate = navigator;
};

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().access_token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // 422 에러 및 특정 에러 메시지를 확인하여 access_token 만료를 감지
        if (error.response?.status === 422 && error.response?.data?.detail?.includes("token") && !originalRequest._retry) {
            originalRequest._retry = true; // 무한 재시도 방지
            try {
                // 토큰 재발급 시도
                const newAccessToken = await refreshToken();
                
                // 스토어에 새 토큰 저장
                const { refresh_token } = useAuthStore.getState();
                useAuthStore.getState().setTokens(newAccessToken, refresh_token as string);
                
                // 원래 요청 헤더에 새 토큰 설정
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                
                // 원래 요청 재시도
                return api(originalRequest);
            } catch (refreshError) {
                // refreshToken 실패 (refresh_token도 만료됨)
                alert('세션이 만료되었습니다. 다시 로그인해주세요.');

                // 모든 클라이언트 측 인증 정보 초기화
                useAuthStore.getState().clearTokens();
                useUserStore.getState().logout();

                // 로그인 페이지로 리디렉션
                if (navigate) {
                    navigate('/login', { replace: true });
                } else {
                    window.location.href = '/login';
                }
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;