import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../firebase/services/auth';

/**
 * Page Header Component
 * @param {Object} props - Component props
 * @param {string} props.title - Page title to display
 * @param {string} props.userRole - User role (teacher/student)
 */
const PageHeader = ({ 
  title = "STEAM Education Platform", 
  userRole
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      alert('Failed to log out. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleHome = () => {
    // Redirect based on user role
    if (userRole === 'teacher') {
      navigate('/teacher-dashboard');
    } else if (userRole === 'student') {
      navigate('/student-dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <header className="w-full p-4 sticky top-0 z-10" style={{ backgroundColor: '#828282' }}>
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          {/* Page Title */}
          <h1 className="text-2xl font-bold text-white">{title}</h1>

          {/* Navigation buttons */}
          <div className="flex items-center space-x-4">
            {/* Home button */}
            <button
              onClick={handleHome}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                        transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
              disabled={loading}
            >
              Home
            </button>
            
            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 
                        transition-colors disabled:bg-red-400 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Logging out...' : 'Log Out'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
