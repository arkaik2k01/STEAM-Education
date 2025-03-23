import React, { createContext, useState, useEffect, useContext } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth } from '../firebase/services/auth';
import { db } from '../firebase/config';

// Create context
const AuthContext = createContext(null);

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [emailVerified, setEmailVerified] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Function to check user role from Firestore
  const checkUserRole = async (uid) => {
    try {
      // Check for teacher role
      const teacherDoc = await getDoc(doc(db, 'users', 'teachers', 'accounts', uid));
      if (teacherDoc.exists()) {
        return { role: 'teacher', error: null };
      }
      
      // Check for student role
      const studentDoc = await getDoc(doc(db, 'users', 'students', 'accounts', uid));
      if (studentDoc.exists()) {
        const studentData = studentDoc.data();
        
        // Check if the student account is disabled
        if (studentData.isDisabled) {
          // Return disabled error
          return { 
            role: null, 
            error: 'Your account has been disabled by your teacher. Please contact them for assistance.' 
          };
        }
        
        return { role: 'student', error: null };
      }
      
      return { role: null, error: 'No valid role found for this account.' };
    } catch (error) {
      console.error('Error checking user role:', error);
      return { role: null, error: 'Error checking account type.' };
    }
  };

  // Effect to handle auth state changes
  useEffect(() => {
    let mounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!mounted) return;

      setLoading(true);
      setAuthError(null);
      
      if (user) {
        setCurrentUser(user);
        setEmailVerified(user.emailVerified);
        
        if (user.emailVerified) {
          // Get user role and check for disabled account
          const { role, error } = await checkUserRole(user.uid);
          
          if (mounted) {
            if (error && error.includes('disabled')) {
              // If account is disabled, sign the user out
              setAuthError(error);
              await signOut(auth);
              setCurrentUser(null);
              setEmailVerified(false);
              setUserRole(null);
            } else {
              // Set the role if no error or error is not about disabled account
              setUserRole(role);
              if (error && !role) {
                setAuthError(error);
              }
            }
          }
        } else {
          if (mounted) {
            setUserRole(null);
          }
        }
      } else {
        if (mounted) {
          setCurrentUser(null);
          setEmailVerified(false);
          setUserRole(null);
        }
      }
      
      if (mounted) {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  // Force refresh user and role - used after email verification
  const refreshUserAndRole = async () => {
    if (!auth.currentUser) return;
    
    setLoading(true);
    setAuthError(null);
    
    try {
      // Reload the user to get latest status
      await auth.currentUser.reload();
      
      // Update our state
      setCurrentUser(auth.currentUser);
      setEmailVerified(auth.currentUser.emailVerified);
      
      if (auth.currentUser.emailVerified) {
        // Get user role and check for disabled account
        const { role, error } = await checkUserRole(auth.currentUser.uid);
        
        if (error && error.includes('disabled')) {
          // If account is disabled, sign the user out
          setAuthError(error);
          await signOut(auth);
          setCurrentUser(null);
          setEmailVerified(false);
          setUserRole(null);
        } else {
          // Set the role if no error or error is not about disabled account
          setUserRole(role);
          if (error && !role) {
            setAuthError(error);
          }
        }
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
      setAuthError('Failed to refresh user information.');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    emailVerified,
    userRole,
    loading,
    authError,
    refreshUserAndRole,
    setAuthError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};