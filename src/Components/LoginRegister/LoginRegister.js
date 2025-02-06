import React, { useState } from 'react';
import './LoginRegister.css';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import {
    createStudentAccount,
    createTeacherAccount
} from '../DatabaseFunctions/auth.js';
import {authService} from '../DatabaseFunctions/auth.js';

const options = [
    { value: 'Student', label: 'Student' },
    { value: 'Teacher', label: 'Teacher' }
];

const LoginRegister = () => {
    const [selectedRole, setSelectedRole] = useState(options[0]);
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [registerUsername, setRegisterUsername] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);

    const { googleSignIn } = authService;
    const {resetPassword} = authService;
    const {signupWithEmail} = authService;
    const {verifyEmail} = authService;
    const {loginWithEmail} = authService;

    const navigate = useNavigate();

    const handleToggle = () => {
        setIsLogin(!isLogin);
    };

    const handleLogin = async () => {
        try {
            const user = await loginWithEmail(loginEmail, loginPassword);
            if (user) {
                navigate('/Dashboard');
            }
        } catch (err) {
            console.error('Login failed: ', err);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const user = await googleSignIn();
            if (user) {
                navigate('/Dashboard');
            }
        } catch (err) {
            console.error('Google login failed:', err);
        }
    };

    const handleForgotPassword = async () => {
        if (!loginEmail) {
            alert('Please enter your email address if you would like to reset your password');
            return;
        }
        try {
            await resetPassword(loginEmail);
        } catch (err) {
            console.error('Error sending password reset email');
        }
    };

    const handleRegister = async () => {
        if (registerPassword !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
    
        try {
            let user;
            if (selectedRole.value === 'Student') {
                user = await createStudentAccount(registerEmail, registerPassword, {
                    username: registerUsername
                });
            } else if (selectedRole.value === 'Teacher') {
                user = await createTeacherAccount(registerEmail, registerPassword, {
                    username: registerUsername
                });
             } 
             //else {
            //     user = await signupWithEmail(registerUsername, registerEmail, registerPassword);
            // }
    
            if (user) {
                await verifyEmail(user);
                alert("Registration successful! Verification email sent");
                navigate('/Dashboard');
            }
        } catch (err) {
            console.error('Registration failed: ', err);
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 p-10">
            <h1 className="text-4xl font-bold mb-6">STEAM Education</h1>
            <div className="bg-white shadow-lg rounded-lg p-8 w-96 flex flex-col items-center">
                <div className="flex justify-between w-full mb-4">
                    <button 
                        className={`flex-1 py-2 text-lg font-semibold border-b-2 ${isLogin ? 'border-blue-600 text-blue-600' : 'border-gray-300 text-gray-500'}`} 
                        onClick={() => setIsLogin(true)}
                    >
                        Log In
                    </button>
                    <button 
                        className={`flex-1 py-2 text-lg font-semibold border-b-2 ${!isLogin ? 'border-blue-600 text-blue-600' : 'border-gray-300 text-gray-500'}`} 
                        onClick={() => setIsLogin(false)}
                    >
                        Register
                    </button>
                </div>

                {isLogin ? (
                    <>
                        <input type="email" placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="w-full mb-3 p-2 border rounded" />
                        <input type="password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="w-full mb-3 p-2 border rounded" />
                        <button onClick={handleLogin} className="w-full bg-blue-600 text-white py-2 rounded">Log In</button>
                        <p className="text-sm text-blue-500 mt-2 cursor-pointer" onClick={handleForgotPassword}>Forgot Password?</p>
                        <p className="text-sm mt-3">Or</p>
                        <button onClick={handleGoogleLogin} className="w-full bg-red-500 text-white py-2 rounded mt-2">Sign In with Google</button>
                    </>
                ) : (
                    <>
                        <input type="text" placeholder="Username" value={registerUsername} onChange={(e) => setRegisterUsername(e.target.value)} className="w-full mb-3 p-2 border rounded" />
                        <input type="email" placeholder="Email" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} className="w-full mb-3 p-2 border rounded" />
                        <input type="password" placeholder="Password" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} className="w-full mb-3 p-2 border rounded" />
                        <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full mb-3 p-2 border rounded" />
                        <Select options={options} value={selectedRole} onChange={setSelectedRole} className="w-full mb-3" />
                        <button onClick={handleRegister} className="w-full bg-blue-600 text-white py-2 rounded">Register</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default LoginRegister;
