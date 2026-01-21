import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useUserStore } from '../store/useUserStore';

const withAuth = (Component: React.ComponentType) => {
    return (props: any) => {
        const access_token = useAuthStore((state) => state.access_token);
        const isLoggedIn = useUserStore((state) => state.isLoggedIn);
        const hasCharacter = useUserStore((state) => state.hasCharacter);
        const location = useLocation();

        if (!access_token || !isLoggedIn) return <Navigate to="/login" replace />;

        if (!hasCharacter) { if (location.pathname !== '/create-char') return <Navigate to="/create-char" replace />;}

        if (hasCharacter && location.pathname === '/create-char') return <Navigate to="/game" replace />;

        return <Component {...props} />;
    };
};

export default withAuth;