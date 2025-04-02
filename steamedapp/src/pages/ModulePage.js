import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { fetchModuleById } from '../firebase/services/moduleServer';
import { MCQuestion } from '../components/ModulePage/MCQuestion/MCQuestion';
import { MonPyEditor } from '../components/ModulePage/PyCodeEditor/MonPyEditor';
import { FillInTheBlank } from '../components/ModulePage/FillInTheBlank/FillInTheBlank';
import { GzWebFrame } from '../components/ModulePage/GzWebFrame';
import MarkdownText from '../components/MarkdownText';
import { deployModuleInfrastructure, destroyModuleInfrastructure, requestModuleSimulation } from '../firebase/services/infrastructureService';
import PageHeader from '../components/PageHeader';
import { auth } from '../firebase/services/auth';
import { requiresInfrastructure } from '../utils/moduleInfoFile';
import { completeLesson, getStudentProgress } from '../firebase/services/progressTracking';

const ModulePage = (props) => {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  // Component vars
  const moduleId = props.moduleId || (params ? params.moduleId : null);
  const contentContainerRef = useRef(null);
  const simulationContainerRef = useRef(null);

  // UI states
  const [moduleData, setModuleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState({});
  const [currentLesson, setCurrentLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [simulationEndpoint, setSimulationEndpoint] = useState(null);
  const [compilerEndpoint, setCompilerEndpoint] = useState(null);
  const [contentHeight, setContentHeight] = useState("calc(100vh - 8rem)");
  const [infrastructureDeployed, setInfrastructureDeployed] = useState(false);
  
  // Check if this module needs infrastructure
  const needsInfrastructure = moduleId ? requiresInfrastructure(moduleId) : false;

  // Fetch module data and progress when component mounts
  useEffect(() => {
    const loadModule = async () => {
      try {
        setLoading(true);
        console.log(`Fetching module with Firestore ID: ${moduleId}`);

        const module = await fetchModuleById(moduleId);
        setModuleData(module);
        
        // Log whether this module requires infrastructure
        console.log(`Module ${moduleId} requires infrastructure: ${needsInfrastructure}`);

        // Get current user
        const user = auth.currentUser;
        if (!user) {
          throw new Error('No user logged in');
        }

        // Load saved progress from Firestore
        const savedProgress = await getStudentProgress(user.uid);
        console.log('Loaded progress:', savedProgress); // Debug log
        
        if (savedProgress?.moduleProgress?.modules[moduleId]) {
          const moduleProgress = savedProgress.moduleProgress.modules[moduleId];
          console.log('Module progress:', moduleProgress); // Debug log
          
          // Set completed lessons
          setCompletedLessons(moduleProgress.completedLessons || []);
          
          // Set current lesson
          setCurrentLesson(moduleProgress.currentLesson);
          
          // Set individual question/exercise progress
          const progressState = {};
          
          // Add pre-assessment progress
          if (moduleProgress.completedLessons.includes('Pre-Assessment')) {
            module.preAssessment?.questions?.forEach((_, index) => {
              progressState[`preassess-${index}`] = true;
            });
          }
          
          // Add other lesson progress
          moduleProgress.completedLessons.forEach(lesson => {
            module.sections.forEach(section => {
              section.exercises?.forEach(exercise => {
                if (exercise.title === lesson || exercise.id === lesson) {
                  progressState[exercise.id] = true;
                }
              });
            });
          });

          // Add completed exercises from completedExercises object
          if (moduleProgress.completedExercises) {
            Object.keys(moduleProgress.completedExercises).forEach(exerciseId => {
              progressState[exerciseId] = true;
            });
          }
          
          setProgress(progressState);
          console.log('Set progress state:', progressState); // Debug log
        }

        // Request simulation infrastructure
        try {
          const endpoints = await requestModuleSimulation(moduleId, user.uid);
          setSimulationEndpoint(endpoints.simulationEndpoint);
          setCompilerEndpoint(endpoints.compilerEndpoint);
        } catch (simError) {
          console.error('Failed to set up simulation:', simError);
        }
      } catch (err) {
        console.error('Failed to fetch module:', err);
        setError('Failed to load module content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (moduleId) {
      loadModule();
    }
  }, [moduleId, needsInfrastructure]);

  // Deploy infrastructure when component mounts - skip for modules that don't need it
  useEffect(() => {
    const deployInfrastructure = async () => {
      // Don't deploy if module data is still loading or module ID is missing
      if (!moduleId || loading || !moduleData) {
        console.log('Skipping infrastructure deployment - data not ready');
        return;
      }
      
      // Skip deployment if this module doesn't need infrastructure
      if (!needsInfrastructure) {
        console.log(`Module ${moduleId} does not require infrastructure - skipping deployment`);
        return;
      }
      
      const userId = auth.currentUser ? auth.currentUser.uid : null;
      if (!userId) {
        console.error('No authenticated user');
        setError('Authentication required. Please log in again.');
        return;
      }

      // Only deploy if not already deployed
      if (!infrastructureDeployed) {
        try {
          console.log('Deploying infrastructure for module:', moduleId);
          await deployModuleInfrastructure(moduleId, userId);
          setInfrastructureDeployed(true);
        } catch (err) {
          console.error('Failed to deploy infrastructure:', err);
          setError('Failed to connect to simulation. Please refresh the page. If the problem persists, contact an administrator.');
        }
      }
    };

    deployInfrastructure();

    // Destroy infrastructure when component unmounts - skip for modules that don't need it
    return () => {
      const destroyInfrastructure = async () => {
        // Only destroy if we actually deployed infrastructure
        const userId = auth.currentUser ? auth.currentUser.uid : null;
        if (userId && infrastructureDeployed && needsInfrastructure) {
          console.log('Destroying infrastructure for module:', moduleId);
          await destroyModuleInfrastructure(userId);
        }
      };

      destroyInfrastructure();
    };
  }, [moduleId, infrastructureDeployed, loading, moduleData, needsInfrastructure]);

  // Add a beforeunload event handler to destroy infrastructure on page refresh/close 
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Skip if infrastructure wasn't deployed or module doesn't need it
      if (!moduleData || !infrastructureDeployed || !needsInfrastructure) return;
      
      const userId = auth.currentUser ? auth.currentUser.uid : null;
      if (userId) {
        console.log('Sending beacon to destroy infrastructure for module:', moduleId);
        // Using navigator.sendBeacon for best chance of completing before page unloads
        navigator.sendBeacon(
          'https://steam-iac-pulumi-function-104577670307.us-central1.run.app/destroy',
          JSON.stringify({ user_id: userId })
        );
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [infrastructureDeployed, moduleData, moduleId, needsInfrastructure]);

  // Manage content and simulation container sizes
  useEffect(() => {
    const calculateHeights = () => {
      // Use a timeout to avoid ResizeObserver loops
      setTimeout(() => {
        // Calculate available viewport height
        const viewportHeight = window.innerHeight;
        const headerHeight = 64; // Approx header height
        const progressBarHeight = 2; // Progress bar height
        const padding = 32; // Total vertical padding

        // Calculate available height
        const availableHeight = viewportHeight - headerHeight - progressBarHeight - padding;

        // Set content height
        setContentHeight(`${availableHeight}px`);
      }, 0);
    };

    // Calculate on initial load
    calculateHeights();

    // Recalculate on window resize
    window.addEventListener('resize', calculateHeights);

    return () => {
      window.removeEventListener('resize', calculateHeights);
    };
  }, []);

  // Update progress when a section is completed
  const handleSectionComplete = useCallback(async (sectionId, lessonName) => {
    try {
      const user = auth.currentUser;
      if (!user || !moduleData) return;

      console.log('Completing section:', sectionId, 'lesson:', lessonName); // Debug log

      // Get all lessons in order
      const allLessons = ['Pre-Assessment'];
      moduleData.sections.forEach(section => {
        if (section.exercises) {
          section.exercises.forEach(exercise => {
            allLessons.push(exercise.title || exercise.id);
          });
        }
      });

      // For pre-assessment, check if all questions are completed
      if (lessonName === 'Pre-Assessment') {
        const preAssessmentQuestions = moduleData.preAssessment?.questions || [];
        const updatedProgress = {
          ...progress,
          [sectionId]: true
        };
        
        const allPreAssessmentCompleted = preAssessmentQuestions.every((_, index) => 
          updatedProgress[`preassess-${index}`]
        );

        // Update local state first
        setProgress(updatedProgress);
        
        console.log('Pre-assessment completion check:', allPreAssessmentCompleted); // Debug log

        // Only mark Pre-Assessment as complete if all questions are done
        if (allPreAssessmentCompleted) {
          await completeLesson(
            user.uid,
            moduleId,
            'Pre-Assessment',
            allLessons
          );
          
          const updatedCompletedLessons = [...completedLessons, 'Pre-Assessment'];
          setCompletedLessons(updatedCompletedLessons);
        }
      } else {
        // For regular lessons/exercises
        const updatedProgress = {
          ...progress,
          [sectionId]: true
        };
        
        // Update local state first
        setProgress(updatedProgress);

        // Save to Firestore
        await completeLesson(
          user.uid,
          moduleId,
          lessonName || sectionId,
          allLessons,
          sectionId // Pass the exercise ID separately
        );
        
        if (lessonName && !completedLessons.includes(lessonName)) {
          setCompletedLessons(prev => [...prev, lessonName]);
        }

        console.log('Exercise completed, updated state:', {
          progress: updatedProgress,
          completedLessons: [...completedLessons, lessonName]
        }); // Debug log
      }
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  }, [moduleData, completedLessons, progress, moduleId]);

  // Render different exercise types
  const renderExercise = useCallback((exercise) => {
    if (!exercise) {
      console.warn(`Invalid exercise data:`, exercise);
      return (
        <div className="bg-opacity-20 bg-yellow-800 rounded-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Exercise Data Error</h3>
          <p>There was a problem loading this exercise.</p>
        </div>
      );
    }

    // Check if exercise is completed (check both ID and title)
    const isCompleted = progress[exercise.id] || 
                       (exercise.title && completedLessons.includes(exercise.title));
                       
    if (isCompleted) {
      return (
        <div className="bg-opacity-20 bg-green-800 rounded-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">✓ Exercise Completed</h3>
          <p>You have successfully completed this exercise.</p>
        </div>
      );
    }

    switch (exercise.type) {
      case 'multipleChoice':
        return (
          <MCQuestion
            mcq_content={exercise}
            onComplete={() => handleSectionComplete(exercise.id, exercise.title)}
          />
        );
      case 'dragAndDrop':
      case 'multiBlankDragDrop':
        return (
          <FillInTheBlank
            fib_content={exercise}
            onComplete={() => handleSectionComplete(exercise.id, exercise.title)}
          />
        );
      case 'coding':
        return (
          <div className="exercise-container" style={{ height: '500px' }}>
            <MonPyEditor
              code_content={exercise}
              codeEndpoint={compilerEndpoint}
              onComplete={() => handleSectionComplete(exercise.id, exercise.title)}
            />
          </div>
        );
      default:
        return <p className="text-gray-400">Unsupported exercise type: {exercise.type}</p>;
    }
  }, [handleSectionComplete, compilerEndpoint, progress, completedLessons]);

  // Render pre-assessment section
  const renderPreAssessment = useCallback(() => {
    if (!moduleData?.preAssessment || !moduleData.preAssessment.questions) {
      return null;
    }

    // Check if pre-assessment is already completed
    if (completedLessons.includes('Pre-Assessment')) {
      return (
        <div className="bg-opacity-10 bg-white rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Pre-Assessment Completed</h2>
          <p className="text-white">You have completed the pre-assessment. You can proceed to the module content.</p>
        </div>
      );
    }

    return (
      <div className="bg-opacity-10 bg-white rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-white mb-4">Pre-Assessment</h2>
        {moduleData.preAssessment.questions.map((question, index) => {
          // Check if this specific question is completed
          const isCompleted = progress[`preassess-${index}`];
          
          return (
            <div key={`preassess-${index}`} className="mb-6">
              {isCompleted ? (
                <div className="text-green-400 mb-2">✓ Question {index + 1} completed</div>
              ) : (
                <MCQuestion
                  mcq_content={question}
                  onComplete={() => handleSectionComplete(`preassess-${index}`, 'Pre-Assessment')}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }, [moduleData, handleSectionComplete, progress, completedLessons]);

  // Calculate progress percentage
  const calculateProgress = () => {
    if (!moduleData || !moduleData.sections) return 0;

    let totalItems = 0;
    let completedItems = 0;

    // Count pre-assessment questions if they exist
    if (moduleData.preAssessment && moduleData.preAssessment.questions) {
      totalItems += moduleData.preAssessment.questions.length;
      moduleData.preAssessment.questions.forEach((_, index) => {
        if (progress[`preassess-${index}`]) {
          completedItems++;
        }
      });
    }

    // Count section exercises
    moduleData.sections.forEach(section => {
      if (section.exercises) {
        totalItems += section.exercises.length;
        section.exercises.forEach(exercise => {
          if (progress[exercise.id]) {
            completedItems++;
          }
        });
      }
    });

    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#201E1E' }}>
        <PageHeader title="Loading Module..." userRole="student" currentModuleId={moduleId} />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-white text-xl">Loading module content...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#201E1E' }}>
        <PageHeader title="Module Error" userRole="student" currentModuleId={moduleId} />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] gap-6">
          <div className="text-red-400 text-xl">{error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Refresh Page
          </button>
          <button 
            onClick={() => navigate('/student-dashboard')}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // A module with the given ID was not found
  if (!moduleData) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#201E1E' }}>
        <PageHeader title="Module Not Found" userRole="student" currentModuleId={moduleId} />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-white text-xl">Module not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#201E1E' }}>
      {/* Header with module title */}
      <PageHeader title={moduleData.title || "Module"} userRole="student" currentModuleId={moduleId} />

      {/* Progress bar */}
      <div className="w-full bg-gray-700 h-2">
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${calculateProgress()}%`,
            backgroundColor: '#0A3C91'
          }}
        />
      </div>

      {/* Main content */}
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left side: Scrollable educational content */}
          <div
            ref={contentContainerRef}
            className="overflow-y-auto pr-4 space-y-4"
            style={{ height: contentHeight }}
          >
            {/* Pre-assessment section */}
            {moduleData.preAssessment && renderPreAssessment()}

            {/* Module sections */}
            {moduleData.sections.map((section) => (
              <div key={section.id} className="relative">
                {/* Section content */}
                <div className="prose prose-invert max-w-none bg-opacity-10 bg-white rounded-lg p-6 mb-6">
                  <div className="text-xl font-semibold text-white mb-4">
                    <MarkdownText 
                      content={section.title}
                      size="text-xl"
                      color="text-white"
                    />
                  </div>

                  {section.content && (
                    <MarkdownText
                      content={section.content}
                      color="text-white"
                    />
                  )}
                </div>

                {/* Section exercises */}
                {section.exercises && section.exercises.length > 0 && (
                  <div className="space-y-6">
                    {section.exercises.map((exercise) => (
                      <div key={exercise.id} className="bg-opacity-10 bg-white rounded-lg p-6">
                        <div className="text-lg font-semibold text-white mb-2">
                          <MarkdownText 
                            content={exercise.title}
                            size="text-lg"
                            color="text-white"
                          />
                        </div>

                        {exercise.description && (
                          <MarkdownText
                            content={exercise.description}
                            color="text-gray-300"
                            className="mb-4"
                          />
                        )}

                        {renderExercise(exercise)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right side: Fixed GzWebFrame */}
          <div
            ref={simulationContainerRef}
            className="bg-opacity-10 bg-white rounded-lg overflow-hidden sticky top-24"
            style={{ height: contentHeight }}
          >
            {/* Pass whether this module requires infrastructure to GzWebFrame */}
            <GzWebFrame requiresInfrastructure={needsInfrastructure} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModulePage;