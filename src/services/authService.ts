import { api } from '../apiinterceptor';

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

// 로그아웃 API 호출
export const logoutUser = async () => {
    try {
        const response = await api.post('/auth/logout');
        return response.data;
    } catch (error) {
        console.error('로그아웃 실패:', error);
        throw error;
    }
};
