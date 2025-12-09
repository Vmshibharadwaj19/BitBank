import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './common/LoadingSpinner';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, isAdmin, loading, user } = useAuth();

  // Debug logging
  useEffect(() => {
    if (user) {
      console.log('ProtectedRoute - User:', user);
      console.log('ProtectedRoute - User role:', user.role);
      console.log('ProtectedRoute - isAdmin:', isAdmin);
      console.log('ProtectedRoute - requiredRole:', requiredRole);
    }
  }, [user, isAdmin, requiredRole]);

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading..." fullScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole === 'ADMIN' && !isAdmin) {
    console.log('ProtectedRoute - Admin required but user is not admin, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
