import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/images/background.jpg';
import { createTeacherAccount, sendEmailVerification } from '../firebase/services/auth';
import { FirebaseError } from 'firebase/app';
import { handleFirebaseError } from '../firebase/types';

const TeacherRegisterPage = () => {
  const navigate = useNavigate();

  // Teacher account form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    school: '',
    subject: '',
  });

  // Util states
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Update form data on input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  // Trigger registration process
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset error and success
    setError('');
    setSuccess('');
    setLoading(true);
    
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    // Password must match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Improper email
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }
    
    try {
      // Create teacher data object
      const teacherData = {
        name: `${formData.firstName} ${formData.lastName}`,
        firstName: formData.firstName,
        lastName: formData.lastName,
        school: formData.school || '',
        subject: formData.subject || '',
        createdAt: new Date(),
        classes: [], // Initialize with empty array
      };
      
      // Call the createTeacherAccount function
      const user = await createTeacherAccount(formData.email, formData.password, teacherData);
      
      // Send verification email
      await sendEmailVerification(user);
      
      // Show success message
      setSuccess('Account created! Please check your email to verify your account.');
      
      // Redirect to verification page immediately
      navigate('/verify-email');
    } catch (error) {
      console.error('Registration error:', error);
      if (error instanceof FirebaseError) {
        setError(handleFirebaseError(error));
      } else {
        setError('Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/register');
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
        className="flex-grow flex flex-col items-center justify-center relative py-8"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        
        {/* Registration form */}
        <div className="z-10 w-full max-w-2xl p-6 bg-black bg-opacity-70 rounded-lg mx-4">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Teacher Registration</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-900 bg-opacity-20 text-red-200 border border-red-500 rounded">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-900 bg-opacity-20 text-green-200 border border-green-500 rounded">
              {success}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label htmlFor="firstName" className="block text-gray-300 mb-2">First Name *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="First name"
                  required
                  disabled={loading}
                />
              </div>
              
              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="block text-gray-300 mb-2">Last Name *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Last name"
                  required
                  disabled={loading}
                />
              </div>
              
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-gray-300 mb-2">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your@email.com"
                  required
                  disabled={loading}
                />
              </div>
              
              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-gray-300 mb-2">Password *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
              </div>
              
              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-gray-300 mb-2">Confirm Password *</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
              </div>
              
              {/* School */}
              <div>
                <label htmlFor="school" className="block text-gray-300 mb-2">School/Institution</label>
                <input
                  type="text"
                  id="school"
                  name="school"
                  value={formData.school}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="UCF"
                  disabled={loading}
                />
              </div>
              
              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-gray-300 mb-2">Subject Area</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Computer Science"
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="pt-4">
              <button
                type="submit"
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-lg font-medium disabled:bg-blue-400 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register as Teacher'}
              </button>
            </div>
          </form>
          
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleBack}
              className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={loading}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherRegisterPage;