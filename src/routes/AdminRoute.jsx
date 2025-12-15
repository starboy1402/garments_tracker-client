import { Navigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';

const AdminRoute = ({ children }) => {
    const { user, userRole, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="loader"></div>
            </div>
        );
    }

    if (user && userRole?.role === 'admin') {
        return children;
    }

    return <Navigate to="/dashboard" replace />;
};

export default AdminRoute;
