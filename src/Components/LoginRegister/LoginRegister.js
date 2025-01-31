import React from 'react'
import './LoginRegister.css'
import Select from 'react-select';
import { useState } from 'react';
import {useNavigate} from 'react-router-dom';

import {
    signupWithEmail,
    loginWithEmail,
    googleSignIn,
    verifyEmail,
    resetPassword,
} from '../DatabaseFunctions/firebase.js';

const options = [
    {value: 'Student', label: 'Student'},
    {value: 'Teacher', label: 'Teacher'}
];

const LoginRegister = () => {
    const [selectedRole, setSelectedRole] = useState(options[0]);
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [registerUsername, setRegisterUsername] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const navigate = useNavigate();

    const handleRoleChange = (selectedRole) => {
        setSelectedRole(selectedRole);
    };

    const handleLogin = async () => {
        try {
            const user = await loginWithEmail(loginEmail, loginPassword);
            if (user) {
                console.log('Logged in user:', user);
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
                console.log('Google login successful for user:', user);
                navigate('/Dashboard');
            }
        } catch (err) {
            console.error('Google login failed:', err);
        }
    };

    const handleRegister = async () => {
        if (registerPassword !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        try {
            console.log("starting registration...");
            const user = await signupWithEmail(registerUsername, registerEmail, registerPassword);
            console.log('Registered user: ', user);

            if (user) {
                await verifyEmail(user);
                alert("registration successful! Verification email sent");
                navigate('/Dashboard');
            }
            else {
                console.error("User object is undefined!");
            }
        } catch (err) {
            console.error('Registration failed: ', err)
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

    return (
    /* Login */
    <div>
        <div className='bg-gray-100 shadow=lg flex flex-row justify-center'>
        <div className="text-6xl font-extrabold text-black p-[30px] mb-[-100px]">STEAM Education</div>
        </div>
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-10 gap-20">
            {/* Login Container */}
            <div className="bg-white shadow-lg rounded-lg p-8 w-96 flex flex-col items-center">
                <h2 className="text-3xl font-bold mb-4">Log In</h2>
                <input type="email" placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="w-full mb-3 p-2 border rounded" />
                <input type="password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="w-full mb-3 p-2 border rounded" />
                <button onClick={handleLogin} className="w-full bg-blue-600 text-white py-2 rounded">Log In</button>
                <p className="text-sm text-blue-500 mt-2 cursor-pointer" onClick={handleForgotPassword}>Forgot Password?</p>
                <p className="text-sm mt-3">Or</p>
                <button onClick={handleGoogleLogin} className="w-full bg-red-500 text-white py-2 rounded mt-2">Sign In with Google</button>
            </div>

            {/* Register Container */}
            <div className="bg-white shadow-lg rounded-lg p-8 w-96 flex flex-col items-center">
                <h2 className="text-3xl font-bold mb-4">Register</h2>
                <input type="text" placeholder="Username" value={registerUsername} onChange={(e) => setRegisterUsername(e.target.value)} className="w-full mb-3 p-2 border rounded" />
                <input type="email" placeholder="Email" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} className="w-full mb-3 p-2 border rounded" />
                <input type="password" placeholder="Password" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} className="w-full mb-3 p-2 border rounded" />
                <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full mb-3 p-2 border rounded" />
                <Select options={options} value={selectedRole} onChange={handleRoleChange} className="w-full mb-3" />
                <button onClick={handleRegister} className="w-full bg-blue-600 text-white py-2 rounded">Register</button>
            </div>
        </div>
        </div>
    )
}

export default LoginRegister