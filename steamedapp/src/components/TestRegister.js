import React, { useState } from 'react';
import { authService } from '../firebase/auth';
import db from '../firebase/firestore';
import firebase from 'firebase/app';

const TestRegister = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  // Handle user registration
  const handleRegister = async () => {
    try {
      // Register user with email and password
      const userCredential = await authService.registerWithEmail(email, password);
      
      // Add user details to Firestore
      await db.collection('users').add({
        name,
        email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      
      setMessage(`User registered: ${userCredential.user.email}`);
    } catch (error) {
      console.error('Error adding document: ', error);
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Test User Registration</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>
      <p>{message}</p>
    </div>
  );
};

export default TestRegister; 