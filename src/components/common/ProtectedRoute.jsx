// src/components/common/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PageLoader } from './index';

export const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, profile, loading } = useAuth();

  console.log('[ProtectedRoute]', { user: !!user, profile, requiredRole, loading });

  if (loading) return <PageLoader />;
  if (!user) {
    console.log('[ProtectedRoute] No user, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  // Check if user has required role
  if (requiredRole) {
    const userRole = profile?.role || 'student';
    console.log('[ProtectedRoute] Checking role:', { userRole, requiredRole, match: userRole === requiredRole });
    
    if (userRole !== requiredRole) {
      console.log('[ProtectedRoute] Role mismatch, redirecting to appropriate dashboard');
      const destination = userRole === 'admin' ? '/admin' : '/student';
      return <Navigate to={destination} replace />;
    }
  }
  
  return children;
};
