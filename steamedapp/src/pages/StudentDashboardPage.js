import React, { useState, useEffect } from 'react';
import StudentDashboard from '../components/studentDashboard';
import { modulesData } from '../components/util/modulesData';

const StudentDashboardPage = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false); // Change to true once firestore is implemented
  const [error, setError] = useState(null);

  useEffect(() => {
    //Load modules from database here

    // ************ Replace this with firestore implementation ************

    setModules(modulesData);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#201E1E' }}>
        <div className="text-white text-xl">Loading modules...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#201E1E' }}>
        <div className="text-red-400 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <StudentDashboard studentModules={modules} />
  );
};

export default StudentDashboardPage;