import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const withAuth = <P extends object>(Component: React.ComponentType<P>) => {
    return (props: P) => {
        const access_token = useAuthStore((state) => state.access_token) || JSON.parse(sessionStorage.getItem('auth-storage') || '{}')?.state?.access_token;

        if (!access_token) {
            return <Navigate to ="/login" state={{ needLogin: true }} replace />;
        }

        return <Component {...props} />;
    };
};

export default withAuth;