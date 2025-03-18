import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../firebase/auth';

const Profile = () => {
  const { currentUser } = useAuth();
  const [name, setName] = useState(currentUser?.displayName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.displayName);
      setEmail(currentUser.email);
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.updateUserProfile(currentUser.uid, { displayName: name, email });
      alert('Profile updated successfully!');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>User Profile</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <button type="submit">Update Profile</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Profile; 