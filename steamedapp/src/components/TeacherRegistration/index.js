import React, { useState } from 'react';
import { registerWithEmail } from '../../firebase/auth';
import { firestore } from '../../firebase/firestore';
import { useNavigate } from 'react-router-dom';

function TeacherRegistration() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await registerWithEmail(email, password);
      const user = userCredential.user;

      await firestore.collection('users').doc(user.uid).set({
        email: user.email,
        role: 'teacher',
      });

      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Teacher Registration</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Register</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}

export default TeacherRegistration; 