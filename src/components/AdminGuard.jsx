import { Navigate } from 'react-router-dom';
import { useAdminSession } from '../hooks/useAdminSession';

export default function AdminGuard({ children }) {
    const { status } = useAdminSession();

    if (status === 'checking') return null;
    if (status === 'unauthenticated') return <Navigate to="/login" replace />;
    return children;
}
