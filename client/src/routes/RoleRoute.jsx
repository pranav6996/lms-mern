import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="skeleton" style={{ width: 40, height: 40, borderRadius: '50%' }} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes(user.role)) {
    // Redirect to their own dashboard
    const dashboardMap = { admin: '/admin', teacher: '/teacher', student: '/student' };
    return <Navigate to={dashboardMap[user.role] || '/'} replace />;
  }

  return children;
};

export default RoleRoute;
