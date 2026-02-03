import axios from 'axios';
import { useAuthStore } from './store/useAuthStore';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
    baseURL: BASE_URL, /* 수정 필요 */
    withCredentials: true,
    headers: {
        'content-type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().access_token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const { refresh_token } = useAuthStore.getState();

                const res = await api.post('/auth/refresh', { refresh_token });
                const { access_token, refresh_token: newRefreshToken } = res.data;

                useAuthStore.getState().setTokens(access_token, newRefreshToken);
                originalRequest.headers.Authorization = `Bearer ${access_token}`;
                return api(originalRequest);
            } catch (refreshError) {
                useAuthStore.getState().clearTokens();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;