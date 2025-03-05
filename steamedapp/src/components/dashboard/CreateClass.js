import React, { useState } from 'react';
import { firestoreService } from '../../firebase/firestore';

const CreateClass = () => {
  const [className, setClassName] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await firestoreService.addClass(className, []);
      alert('Class created successfully!');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Create a New Class</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          placeholder="Class Name"
          required
        />
        <button type="submit">Create</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default CreateClass; 