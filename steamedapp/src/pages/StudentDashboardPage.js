import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentDashboard from '../components/studentDashboard';
import PageHeader from '../components/PageHeader';
import { auth } from '../firebase/services/auth';
import { fetchAllModules } from '../firebase/services/moduleServer';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { modulesData } from '../utils/modulesData'; // Fallback data for testing

const StudentDashboardPage = () => {
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get current user
  const user = auth.currentUser;

  useEffect(() => {
    const loadModules = async () => {
      try {
        setLoading(true);
        
        // Fetch real module data
        const modulesList = await fetchAllModules();
        
        if (user) {
          // Try to get student progress from Firestore
          try {
            const studentRef = doc(db, 'users', 'students', 'accounts', user.uid);
            const studentDoc = await getDoc(studentRef);
            
            if (studentDoc.exists()) {
              const studentData = studentDoc.data();
              const progress = studentData.progress || {};
              
              // Mark completed modules based on student progress
              const modulesWithProgress = modulesList.map(module => {
                const moduleProgress = progress[module.id];
                return {
                  ...module,
                  isCompleted: moduleProgress?.isCompleted || false,
                  sections: module.sections.map(section => {
                    const sectionProgress = moduleProgress?.sections?.[section.id];
                    return {
                      ...section,
                      isCompleted: sectionProgress?.isCompleted || false
                    };
                  })
                };
              });
              
              setModules(modulesWithProgress);
            } else {
              // Student document not found, use modules as-is
              setModules(modulesList);
            }
          } catch (progressError) {
            console.error('Error fetching student progress:', progressError);
            // Use modules without progress data
            setModules(modulesList);
          }
        } else {
          // No user logged in, use modules as-is
          setModules(modulesList);
        }
      } catch (err) {
        console.error('Error loading modules:', err);
        setError('Failed to load modules. Using fallback data.');
        
        // Use fallback data for development/testing
        setModules(modulesData);
      } finally {
        setLoading(false);
      }
    };

    loadModules();
  }, [user]);

  const handleModuleSelect = (moduleId) => {
    // Navigate to module page
    navigate(`/module/${moduleId}`);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#201E1E' }}>
      <PageHeader title="Student Dashboard" userRole="student" />
      
      {loading ? (
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-white text-xl">Loading modules...</div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-red-400 text-xl">{error}</div>
        </div>
      ) : (
        <StudentDashboard 
          studentModules={modules} 
          onModuleSelect={handleModuleSelect} 
        />
      )}
    </div>
  );
};

export default StudentDashboardPage;