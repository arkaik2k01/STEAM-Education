import React from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/images/background.jpg';

const RegisterPage = () => {
  const navigate = useNavigate();

  const handleTeacherRegister = () => {
    navigate('/register/teacher');
  };

  const handleStudentRegister = () => {
    navigate('/register/student');
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#201E1E' }}>
      {/* Header */}
      <header className="w-full p-4 sticky top-0 z-10" style={{ backgroundColor: '#828282' }}>
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-white">STEAM Education Platform</h1>
        </div>
      </header>

      {/* Main content with background image */}
      <div 
        className="flex-grow flex flex-col items-center justify-center relative"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Dark overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        
        {/* Content */}
        <div className="z-10 text-center px-6 py-8 bg-black bg-opacity-70 rounded-lg max-w-2xl mx-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Register
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Choose your account type to get started
          </p>
          
          {/* Registration options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Teacher option */}
            <div 
              onClick={handleTeacherRegister} 
              className="bg-opacity-20 bg-white rounded-lg p-6 cursor-pointer 
                      transition-all duration-200 hover:bg-opacity-30 border border-gray-600 hover:border-blue-500"
            >
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-blue-600 bg-opacity-70 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-white mb-2">Teacher</h3>
                <p className="text-gray-300 text-sm text-center">
                  Create and manage classes, track student progress
                </p>
              </div>
            </div>

            {/* Student option */}
            <div 
              onClick={handleStudentRegister} 
              className="bg-opacity-20 bg-white rounded-lg p-6 cursor-pointer 
                      transition-all duration-200 hover:bg-opacity-30 border border-gray-600 hover:border-green-500"
            >
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-green-600 bg-opacity-70 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-white mb-2">Student</h3>
                <p className="text-gray-300 text-sm text-center">
                  Access learning modules, complete assignments, track your progress
                </p>
              </div>
            </div>
          </div>
          
          {/* Back button */}
          <button
            onClick={handleBack}
            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 
                    transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;