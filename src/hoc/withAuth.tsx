import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useUserStore } from '../store/useUserStore';

const withAuth = (Component: React.ComponentType) => {
    return (props: any) => {
        const access_token = useAuthStore((state) => state.access_token);
        const isLoggedIn = useUserStore((state) => state.isLoggedIn);

        if (!access_token || !isLoggedIn) {return <Navigate to="/login" replace />;}

        return <Component {...props} />;
    };
};

export default withAuth;