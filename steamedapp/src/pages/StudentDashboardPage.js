import React, { useState, useEffect } from 'react';
import StudentDashboard from '../components/studentDashboard';
import { useNavigate } from 'react-router-dom';
import { modulesData } from '../utils/modulesData';
import { fetchAllModules } from '../firebase/services/moduleServer';

const StudentDashboardPage = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false); // Change to true once firestore is implemented
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    //Load modules from database here
    const loadModules = async () => {
      try {
        const fetchedModules = await fetchAllModules(); // Await the Promise
        setModules(fetchedModules);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch modules:', err);
        setError('Failed to load modules. Please try again later.');
        setLoading(false);
      }
    };

    loadModules();
  }, []);

  const handleModuleSelect = (moduleId) => {
    // The moduleId here is already the Firestore document ID
    console.log(`Navigating to module with Firestore ID: ${moduleId}`);
    navigate(`/module/${moduleId}`);
  };

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
    <StudentDashboard 
      studentModules={modules} 
      onModuleSelect={handleModuleSelect}
    />
  );
};

export default StudentDashboardPage;