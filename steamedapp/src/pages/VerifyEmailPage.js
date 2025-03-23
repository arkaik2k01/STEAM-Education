import React, { useState, useEffect } from 'react';
import backgroundImage from '../assets/images/background.jpg';
import { auth, authService } from '../firebase/services/auth';
import { useAuth } from '../contexts/AuthContext';

const VerifyEmailPage = () => {
  const { currentUser, refreshUserAndRole } = useAuth();
  const [email, setEmail] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);

  // Set email from current user on mount
  useEffect(() => {
    if (currentUser) {
      setEmail(currentUser.email);
    }
  }, [currentUser]);

  // Countdown timer for resending verification email
  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  // Handle refresh verification status
  const handleRefreshStatus = async () => {
    if (loading) return;
    
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      await refreshUserAndRole();
      
      if (auth.currentUser?.emailVerified) {
        setMessage('Email verified successfully! You will be redirected shortly.');
      } else {
        setMessage('Email not verified yet. Please check your inbox and verify your email.');
      }
    } catch (error) {
      console.error('Error refreshing verification status:', error);
      setError('Unable to refresh verification status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle resend verification email
  const handleResendVerification = async () => {
    if (loading || !canResend) return;
    
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      if (!currentUser) {
        throw new Error('No user logged in');
      }
      
      await authService.resendVerificationEmail(currentUser);
      
      // Reset countdown
      setCountdown(60);
      setCanResend(false);
      
      setMessage('Verification email sent! Please check your inbox and spam folder.');
    } catch (error) {
      console.error('Error resending verification email:', error);
      setError('Failed to send verification email. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      // No need to navigate - AuthContext will handle redirects
    } catch (error) {
      console.error('Error logging out:', error);
      setError('Failed to log out. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#201E1E' }}>
      {/* Header */}
      <header className="w-full p-4 sticky top-0 z-10" style={{ backgroundColor: '#828282' }}>
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-white">STEAM Education Platform</h1>
        </div>
      </header>

      {/* Main content */}
      <div 
        className="flex-grow flex flex-col items-center justify-center relative"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        
        {/* Verification content */}
        <div className="z-10 w-full max-w-md p-6 bg-black bg-opacity-70 rounded-lg mx-4">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Verify Your Email</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-900 bg-opacity-20 text-red-200 border border-red-500 rounded">
              {error}
            </div>
          )}
          
          {message && (
            <div className="mb-4 p-3 bg-green-900 bg-opacity-20 text-green-200 border border-green-500 rounded">
              {message}
            </div>
          )}
          
          <div className="text-white text-center mb-6">
            <p className="mb-4">
              We've sent a verification email to:
            </p>
            <p className="font-bold text-lg mb-4">
              {email}
            </p>
            <p className="mb-4">
              Please check your email inbox and click the verification link to activate your account.
            </p>
            <p className="text-sm text-gray-300">
              If you don't see the email, check your spam folder.
            </p>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={handleRefreshStatus}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-lg font-medium disabled:bg-blue-400 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Checking...' : 'I\'ve Verified My Email'}
            </button>
            
            <button
              onClick={handleResendVerification}
              className="w-full px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-lg font-medium disabled:bg-green-400 disabled:cursor-not-allowed"
              disabled={loading || !canResend}
            >
              {!canResend 
                ? `Resend Verification (${countdown}s)` 
                : loading ? 'Sending...' : 'Resend Verification Email'}
            </button>
            
            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-lg font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Please wait...' : 'Log Out'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;