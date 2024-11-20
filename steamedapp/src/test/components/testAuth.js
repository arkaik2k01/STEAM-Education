import React from "react";

// Import your firebase auth and functions here !!!
import { signupWithEmail, loginWithEmail } from '../../firebase.js';

export const TestAuth = () => {
  const handleRegister = async () => {
    try {
      const displayName = 'Test User';
      const email = "testuser@example.com";
      const password = "password123";
      const userCredential = await signupWithEmail(displayName, email, password);
      console.log("Registered User:", userCredential.displayName);
      alert("Registration successful!");
    } catch (error) {
      console.error("Registration Error:", error.message);
      alert("Could not register user!");
    }
  };

  const handleLogin = async () => {
    try {
      const email = "testuser@example.com";
      const password = "password123";
      const userCredential = await loginWithEmail(email, password);
      console.log("Logged In User:", userCredential.displayName);
      alert("Login successful!");
    } catch (error) {
      console.error("Login Error:", error.message);
      alert("Could not login!");
    }
  };

  return (
    <div>
      <button onClick={handleRegister} style={{ padding: "10px 20px", margin: "10px" }}>
        Register
      </button>
      <button onClick={handleLogin} style={{ padding: "10px 20px", margin: "10px" }}>
        Login
      </button>
    </div>
  );
};