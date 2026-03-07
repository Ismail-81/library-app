// src/components/common/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PageLoader } from './index';

export const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, profile, loading } = useAuth();

  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && profile?.role !== requiredRole) {
    return <Navigate to={profile?.role === 'admin' ? '/admin' : '/student'} replace />;
  }
  return children;
};
