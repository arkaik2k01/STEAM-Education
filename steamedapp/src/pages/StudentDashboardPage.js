import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentDashboard from '../components/studentDashboard';
import PageHeader from '../components/PageHeader';
import { auth } from '../firebase/services/auth';
import { fetchAllModules } from '../firebase/services/moduleServer';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { modulesData } from '../utils/modulesData';
import { initializeModuleProgress, getStudentProgress } from '../firebase/services/progressTracking';

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
          try {
            // Initialize progress if needed
            await initializeModuleProgress(user.uid);
            
            // Get student progress
            const progress = await getStudentProgress(user.uid);
            
            if (progress && progress.moduleProgress) {
              // Map the progress data to modules
              const modulesWithProgress = modulesList.map(module => {
                const moduleProgress = progress.moduleProgress.modules[module.id] || {
                  progress: 0,
                  currentLesson: null,
                  completedLessons: [],
                  completedExercises: {}
                };
                
                // Calculate total progress based on completed lessons and exercises
                const totalLessons = module.sections?.length || 0;
                const completedLessonsCount = moduleProgress.completedLessons?.length || 0;
                const totalExercises = module.sections?.reduce((total, section) => 
                  total + (section.exercises?.length || 0), 0) || 0;
                const completedExercisesCount = Object.keys(moduleProgress.completedExercises || {}).length;
                
                // Calculate overall progress as a weighted average of lessons and exercises
                const lessonProgress = totalLessons > 0 ? (completedLessonsCount / totalLessons) * 100 : 0;
                const exerciseProgress = totalExercises > 0 ? (completedExercisesCount / totalExercises) * 100 : 0;
                const calculatedProgress = Math.round((lessonProgress + exerciseProgress) / 2);
                
                return {
                  ...module,
                  progress: calculatedProgress,
                  currentLesson: moduleProgress.currentLesson,
                  completedLessons: moduleProgress.completedLessons || [],
                  completedExercises: moduleProgress.completedExercises || {},
                  isCompleted: progress.moduleProgress.completedModules?.includes(module.id) || calculatedProgress === 100
                };
              });
              
              setModules(modulesWithProgress);
            } else {
              setModules(modulesList);
            }
          } catch (progressError) {
            console.error('Error fetching student progress:', progressError);
            setModules(modulesList);
          }
        } else {
          setModules(modulesList);
        }
      } catch (err) {
        console.error('Error loading modules:', err);
        setError('Failed to load modules. Using fallback data.');
        setModules(modulesData);
      } finally {
        setLoading(false);
      }
    };

    loadModules();
  }, [user]);

  const handleModuleSelect = (moduleId) => {
    // Navigate to module page with current progress
    const selectedModule = modules.find(m => m.id === moduleId);
    if (selectedModule) {
      navigate(`/module/${moduleId}`, {
        state: {
          progress: selectedModule.progress,
          currentLesson: selectedModule.currentLesson,
          completedLessons: selectedModule.completedLessons,
          completedExercises: selectedModule.completedExercises
        }
      });
    }
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