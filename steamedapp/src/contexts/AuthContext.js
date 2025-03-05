import React, { useContext, useState, useEffect } from 'react';
import { authService } from '../firebase/auth';

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange(user => {
      setCurrentUser(user);
      if (user) {
        authService.getUserRole(user.uid).then(role => setUserRole(role));
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
} 