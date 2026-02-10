import { api } from '../apiinterceptor';
import { useAuthStore } from '../store/useAuthStore';

// 회원가입 요청 데이터 타입
interface RegisterData {
    username: string;
    email: string;
    password: string;
}

// 회원정보 수정 요청 데이터 타입
interface UserInfoData {
    username: string;
    email: string;
}

// 비밀번호 변경 요청 데이터 타입
interface PasswordChangeData {
    old_pw: string;
    new_pw: string;
}

// 회원가입 API 호출
export const registerUser = async (userData: RegisterData) => {
    try {
        const response = await api.post('/user/create', userData);
        return response.data;
    } catch (error) {
        console.error('회원가입 실패:', error);
        throw error;
    }
};

// 회원정보 조회 API 호출
export const getUserDetail = async () => {
    try {
        const response = await api.get('/user/detail');
        return response.data;
    } catch (error) {
        console.error('회원정보 조회 실패:', error);
        throw error;
    }
}

// 회원정보 수정 API 호출
export const updateUserInfo = async (userInfoData: UserInfoData) => {
    try {
        const response = await api.put('/user/update', userInfoData);
        return response.data;
    } catch (error) {
        console.error('회원정보 수정 실패:', error);
        throw error;
    }
}

// 비밀번호 변경 API 호출
export const changePassword = async (passwordData: PasswordChangeData) => {
    try {
        const response = await api.patch('/user/password', passwordData);
        return response.data;
    } catch (error) {
        console.error('비밀번호 변경 실패:', error);
        throw error;
    }
};

/**
 * 💡 로그아웃 API 호출 및 로컬 상태 정리
 * 서버 응답이 401(Unauthorized)인 경우 이미 토큰이 만료된 것이므로 
 * 에러를 무시하고 로컬 데이터를 삭제합니다.
 */
export const logoutUser = async () => {
    try {
        const response = await api.post('/auth/logout');
        return response.data;
    } catch (error) {
        // 이미 토큰이 만료된 경우 401 에러가 발생할 수 있습니다.
        // 이 경우 서버에서의 세션은 이미 끝난 것이므로 경고만 띄우고 계속 진행합니다.
        console.warn('서버 로그아웃 처리 중 오류 발생 (이미 만료되었을 수 있음):', error);
    } finally {
        // 💡 중요: 서버 응답 성공 여부와 상관없이 로컬 토큰 정보를 삭제합니다.
        // useAuthStore에 clearTokens 또는 setTokens(null, null) 기능이 있다고 가정합니다.
        const { setTokens } = useAuthStore.getState();
        setTokens('', ''); 
        
        // 필요한 경우 sessionStorage나 localStorage도 직접 비워줍니다.
        sessionStorage.clear();
        localStorage.removeItem('auth-storage'); // Zustand persist 사용 시 해당 키 삭제
    }
};

// 토큰 재발급 API 호출
export const refreshToken = async () => {
    const { refresh_token } = useAuthStore.getState();
    if (!refresh_token) throw new Error("Refresh token is missing");
    
    const response = await api.post('/auth/refresh', { refresh_token });
    return response.data.access_token;
};