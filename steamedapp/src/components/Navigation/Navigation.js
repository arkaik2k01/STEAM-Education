import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../firebase/auth';

export function Navigation() {
  const { currentUser, isTeacher, isStudent } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!currentUser) return null;

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          SteamedApp
        </Link>
        
        <div className="flex space-x-4">
          {isTeacher && (
            <>
              <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
              <Link to="/create-class" className="hover:text-gray-300">Create Class</Link>
              <Link to="/manage-students" className="hover:text-gray-300">Manage Students</Link>
            </>
          )}
          
          {isStudent && (
            <>
              <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
              <Link to="/join-class" className="hover:text-gray-300">Join Class</Link>
              <Link to="/my-progress" className="hover:text-gray-300">My Progress</Link>
            </>
          )}
          
          <Link to="/profile" className="hover:text-gray-300">Profile</Link>
          <button 
            onClick={handleLogout}
            className="hover:text-gray-300"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
} 