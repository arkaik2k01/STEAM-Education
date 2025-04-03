import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../firebase/services/auth';
import { destroyModuleInfrastructure } from '../firebase/services/infrastructureService';
import { auth } from '../firebase/services/auth';
import MarkdownText from './MarkdownText';
import { requiresInfrastructure } from '../utils/moduleInfoFile';

/*
 * Page Header Component
 */
const PageHeader = ({ 
  title = "STEAM Education Platform", 
  userRole,
  currentModuleId = null // Pass module ID when on a module page
}) => {
  const navigate = useNavigate();
  const [loadingHome, setLoadingHome] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);
  const [loading, setLoading] = useState(false);

  // Determine if current module requires infrastructure
  const needsInfrastructure = currentModuleId ? requiresInfrastructure(currentModuleId) : false;

  const handleLogout = async () => {
    try {
      setLoading(true);
      
      // If on a module page that requires infrastructure, destroy it first
      if (currentModuleId && needsInfrastructure) {
        console.log('PageHeader: Destroying infrastructure during logout for module:', currentModuleId);

        document.body.style.cursor = 'wait';
        setLoading(true);
        setLoadingLogout(true);

        const userId = auth.currentUser ? auth.currentUser.uid : null;
        if (userId) {
          await destroyModuleInfrastructure(userId);
        }
      } else if (currentModuleId) {
        console.log('PageHeader: Module doesn\'t require infrastructure - skipping destruction during logout');
      }
      
      await authService.logout();
      document.body.style.cursor = 'default';
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      alert('Failed to log out. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleHome = async () => {
    try {
      // If on a module page that requires infrastructure, destroy it before navigating
      if (currentModuleId && needsInfrastructure) {
        console.log('PageHeader: Destroying infrastructure during navigation home for module:', currentModuleId);

        document.body.style.cursor = 'wait';
        setLoadingHome(true);
        setLoading(true);

        const userId = auth.currentUser ? auth.currentUser.uid : null;
        if (userId) {
          await destroyModuleInfrastructure(userId);
        }
      } else if (currentModuleId) {
        console.log('PageHeader: Module doesn\'t require infrastructure - skipping destruction during navigation');
      }
      
      // Redirect based on user role
      if (userRole === 'teacher') {
        document.body.style.cursor = 'default';
        navigate('/teacher-dashboard');
      } else if (userRole === 'student') {
        document.body.style.cursor = 'default';
        navigate('/student-dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Navigation error:', error);
      // Still navigate even if infrastructure destruction fails
      if (userRole === 'teacher') {
        document.body.style.cursor = 'default';
        navigate('/teacher-dashboard');
      } else if (userRole === 'student') {
        document.body.style.cursor = 'default';
        navigate('/student-dashboard');
      } else {
        navigate('/');
      }
    }
  };

  return (
    <header className="w-full p-4 sticky top-0 z-10" style={{ backgroundColor: '#828282' }}>
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          {/* Page Title */}
          <h1 className="text-2xl font-bold text-white">
            <MarkdownText 
              content={title}
              size="text-2xl"
              color="text-white"
              preserveHeadings={true}
            />
          </h1>

          {/* Navigation buttons */}
          <div className="flex items-center space-x-4">
            {/* Home button */}
            <button
              onClick={handleHome}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                        transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loadingHome ? 'Loading...' : 'Home'}
            </button>
            
            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 
                        transition-colors disabled:bg-red-400 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loadingLogout ? 'Logging out...' : 'Log Out'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PageHeader;