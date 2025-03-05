import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/signin">Sign In</Link></li>
        <li><Link to="/register/teacher">Register as Teacher</Link></li>
        <li><Link to="/register/student">Register as Student</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        {/* Add more links as needed */}
      </ul>
    </nav>
  );
};

export default Navigation; 