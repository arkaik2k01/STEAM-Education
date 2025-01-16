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
        <div className='titleContainer'>
        <div className="title">STEAM Education</div>
        </div>
        <div style={{ display: 'flex'}}>
            <div style={{ flex: 1}}>
            <div className='container'>
            <div className="header">
                <div className="text">Log In</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
            <div className="input">
                <input type="email" placeholder="Email" 
                value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)}
                />
            </div>
            <div className="input">
                <input type="password" placeholder="Password" 
                value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} 
                />
            </div>
            <div 
                    className="forgot-password"
                    onClick={handleForgotPassword}
                > Forgot Password?
                    
                </div>
            </div>
            <div className="submit-container">
                <div className="submit" 
                onClick={handleLogin}
                >Log In</div>
            </div>
            <div className="or-text">Or</div>
            <div className="google-login-container">
                            <button className="google-login-button" onClick={handleGoogleLogin}>
                                Sign In with Google
                            </button>
                        </div>
        </div>
     </div>

     {/*Register */}
            <div style={{flex:1}}>
            <div className='container'>
            <div className="header">
                <div className="text">Register</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
            <div className="input">
                <input type="username" placeholder="Username"
                 value={registerUsername} onChange={(e) => setRegisterUsername(e.target.value)} 
                 />
            </div>
            <div className="input">
                <input type="email" placeholder="Email" 
                value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} 
                />
            </div>
            <div className="input">
                <input type="password" placeholder="Password" 
                value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} 
                />
            </div>
            <div className="input">
                <input type="password" placeholder="Confirm Password" 
                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                 />
            </div>
            <div className="dropdown">
                            <Select
                                name="form-field-name"
                                value={selectedRole} // default value (Student)
                                options={options}
                                onChange={handleRoleChange}
                                placeholder="Select Role"
                            />
                        </div>
            </div>
            <div className="submit-container">
                <div className="submit"
                 onClick = {handleRegister}
                 >Register</div>
            </div>
        </div>
            </div>
        </div>
        </div>
    )
}

export default LoginRegister