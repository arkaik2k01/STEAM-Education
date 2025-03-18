import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function ProtectedRoute({ children, role }) {
  const { currentUser, userRole } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (role && userRole !== role) {
    return <Navigate to="/dashboard" replace />;
  }

  if (typeof children === 'function') {
    return children({ userRole });
  }

  return children;
}

export default ProtectedRoute; 