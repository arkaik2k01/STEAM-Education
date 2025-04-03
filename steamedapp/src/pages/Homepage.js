import React from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/images/background.jpg';

const HomePage = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login');
    };

    const handleRegister = () => {
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
                <div className="z-10 text-center px-4 py-8 bg-black bg-opacity-70 rounded-lg max-w-2xl mx-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Welcome to STEAM Education
                    </h2>
                    <p className="text-lg text-gray-300 mb-8">
                        A educational platform from the Florida Space Institute and UCF
                    </p>

                    {/* Buttons container */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={handleLogin}
                            className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                        transition-colors text-lg font-medium min-w-[160px]"
                        >
                            Log In
                        </button>
                        <button
                            onClick={handleRegister}
                            className="px-8 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 
                        transition-colors text-lg font-medium min-w-[160px]"
                        >
                            Register
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;