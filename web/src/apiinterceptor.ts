import axios from 'axios';
import { useAuthStore } from './store/useAuthStore';

export const api = axios.create({
    baseURL: 'http://35.216.98.244:8010', /* 수정 필요 */
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

                const res = await axios.post('/auth/refresh', { refresh_token });
                const { access_token, newRefreshToken } = res.data;

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