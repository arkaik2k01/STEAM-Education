import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/images/background.jpg';
import { createStudentAccount, sendEmailVerification } from '../firebase/services/auth';
import { handleFirebaseError } from '../firebase/types';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

const StudentRegisterPage = () => {
    const navigate = useNavigate();

    // Student registration form data
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        classCode: '',
        grade: ''
    });

    // Util states
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    // Listen to input form changes
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset error and success
        setError('');
        setSuccess('');
        setLoading(true);

        // Basic validation
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword || !formData.classCode) {
            setError('Please fill in all required fields');
            setLoading(false);
            return;
        }

        // Passwords must match    
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
            // Class code checking
            if (!formData.classCode || !formData.classCode.trim()) {
                setError('Class code is required for registration');
                setLoading(false);
                return;
            }

            // Get the class information before creating the student account
            const classQuery = query(collection(db, 'class'), where('classCode', '==', formData.classCode));
            const classSnapshot = await getDocs(classQuery);

            // If class not found, show error
            if (classSnapshot.empty) {
                setError('Invalid class code. Please check the code and try again.');
                setLoading(false);
                return;
            }

            const classDoc = classSnapshot.docs[0];
            const classId = classDoc.id;
            const classData = classDoc.data();

            // Create student data object
            const studentData = {
                name: `${formData.firstName} ${formData.lastName}`,
                firstName: formData.firstName,
                lastName: formData.lastName,
                grade: formData.grade || '',
                createdAt: new Date(),
                classCode: formData.classCode,
                classID: classId,
                teacherId: classData.teacherId,
                enrolledClassId: classId
            };

            // Create the student account
            const user = await createStudentAccount(formData.email, formData.password, studentData);

            // Send verification email
            await sendEmailVerification(user);
            
            // Show success message
            setSuccess('Account created! Please check your email to verify your account.');
            
            // Redirect to homepage after 3 seconds
            setTimeout(() => {
                navigate('/');
            }, 3000);
        } catch (error) {
            console.error('Registration error:', error);
            setError(handleFirebaseError(error));
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

            {/* Main content*/}
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
                    <h2 className="text-3xl font-bold text-white mb-6 text-center">Student Registration</h2>

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

                            {/* Class Code */}
                            <div>
                                <label htmlFor="classCode" className="block text-gray-300 mb-2">Class Code *</label>
                                <input
                                    type="text"
                                    id="classCode"
                                    name="classCode"
                                    value={formData.classCode}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter your class code"
                                    required
                                    disabled={loading}
                                />
                                <p className="text-gray-400 text-xs mt-1">Required - Enter the class code provided by your teacher</p>
                            </div>

                            {/* Grade Level */}
                            <div>
                                <label htmlFor="grade" className="block text-gray-300 mb-2">Grade Level</label>
                                <select
                                    id="grade"
                                    name="grade"
                                    value={formData.grade}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={loading}
                                >
                                    <option value="">Select Grade Level</option>
                                    <option value="9">9th Grade</option>
                                    <option value="10">10th Grade</option>
                                    <option value="11">11th Grade</option>
                                    <option value="12">12th Grade</option>
                                    <option value="college">College</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-lg font-medium disabled:bg-green-400 disabled:cursor-not-allowed"
                                disabled={loading}
                            >
                                {loading ? 'Registering...' : 'Register as Student'}
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

export default StudentRegisterPage;