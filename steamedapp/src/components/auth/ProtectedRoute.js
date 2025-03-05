import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function ProtectedRoute({ children, role, ...rest }) {
  const { currentUser, userRole } = useAuth();

  return (
    <Route
      {...rest}
      render={({ location }) =>
        currentUser && (!role || userRole === role) ? (
          children
        ) : (
          <Navigate to="/signin" state={{ from: location }} />
        )
      }
    />
  );
}

export default ProtectedRoute; 