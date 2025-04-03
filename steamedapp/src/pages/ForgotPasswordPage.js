import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/images/background.jpg';
import { authService } from '../firebase/services/auth';
import { handleFirebaseError } from '../firebase/types';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset states
    setError('');
    setMessage('');
    
    // Basic validation
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    setLoading(true);
    try {
      // Send password reset email
      await authService.resetPassword(email);
      
      // Show success message
      setMessage('Password reset email sent! Please check your inbox.');
    } catch (error) {
      console.error('Password reset error:', error);
      setError(handleFirebaseError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/login');
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
        
        {/* Forgot password form */}
        <div className="z-10 w-full max-w-md p-6 bg-black bg-opacity-70 rounded-lg mx-4">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Reset Password</h2>
          
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
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-gray-300 mb-2">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your@email.com"
                disabled={loading}
              />
              <p className="text-gray-400 text-sm mt-1">
                Enter the email address associated with your account and we'll send you a link to reset your password.
              </p>
            </div>
            
            <button
              type="submit"
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-lg font-medium disabled:bg-blue-400 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
          
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleBack}
              className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              disabled={loading}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;