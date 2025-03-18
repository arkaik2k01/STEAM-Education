import React, { useState } from 'react';
import { classManagementService } from '../../firebase/firestore';

const JoinClass = () => {
  const [classCode, setClassCode] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await classManagementService.joinClass(classCode, 'studentId'); // Replace 'studentId' with actual student ID
      alert('Joined class successfully!');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Join a Class</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={classCode}
          onChange={(e) => setClassCode(e.target.value)}
          placeholder="Class Code"
          required
        />
        <button type="submit">Join</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default JoinClass; 