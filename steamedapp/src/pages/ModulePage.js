import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { fetchModuleById } from '../firebase/services/moduleServer';
import { MCQuestion } from '../components/ModulePage/MCQuestion/MCQuestion';
import { MonPyEditor } from '../components/ModulePage/PyCodeEditor/MonPyEditor';
import { FillInTheBlank } from '../components/ModulePage/FillInTheBlank/FillInTheBlank';
import { GzWebFrame } from '../components/ModulePage/GzWebFrame';
import SimpleMarkdown from '../components/SimpleMarkdown';
import { requestModuleSimulation } from '../firebase/services/infrastructureService';
import PageHeader from '../components/PageHeader';
import { auth } from '../firebase/services/auth';

const ModulePage = (props) => {
  const params = useParams();
  const moduleId = props.moduleId || (params ? params.moduleId : null);
  const contentContainerRef = useRef(null);
  const simulationContainerRef = useRef(null);

  const [moduleData, setModuleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState({});
  const [simulationEndpoint, setSimulationEndpoint] = useState(null);
  const [compilerEndpoint, setCompilerEndpoint] = useState(null);
  const [contentHeight, setContentHeight] = useState("calc(100vh - 8rem)");

  // Fetch module data when component mounts
  useEffect(() => {
    const loadModule = async () => {
      try {
        setLoading(true);
        console.log(`Fetching module with Firestore ID: ${moduleId}`);

        const module = await fetchModuleById(moduleId);
        setModuleData(module);

        // Mock user ID - Replace with actual user ID from auth
        const userId = auth.currentUser ? auth.currentUser.uid : "test-user";

        // Request simulation infrastructure
        try {
          const endpoints = await requestModuleSimulation(moduleId, userId);
          setSimulationEndpoint(endpoints.simulationEndpoint);
          setCompilerEndpoint(endpoints.compilerEndpoint);
        } catch (simError) {
          console.error('Failed to set up simulation:', simError);
          // Continue with module load even if simulation setup fails
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
  }, [moduleId]);

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
  const handleSectionComplete = useCallback((sectionId) => {
    console.log(`Section completed: ${sectionId}`);
    setProgress(prev => ({
      ...prev,
      [sectionId]: true
    }));
  }, []);

  // Render different exercise types
  const renderExercise = useCallback((exercise) => {
    console.log(`Rendering exercise of type: ${exercise.type}`);

    // Add validation to check if the exercise data is valid
    if (!exercise) {
      console.warn(`Invalid exercise data:`, exercise);
      return (
        <div className="bg-opacity-20 bg-yellow-800 rounded-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Exercise Data Error</h3>
          <p>There was a problem loading this exercise.</p>
        </div>
      );
    }

    switch (exercise.type) {
      case 'multipleChoice':
        return (
          <MCQuestion
            mcq_content={exercise}
            onComplete={() => handleSectionComplete(exercise.id)}
          />
        );
      case 'dragAndDrop':
      case 'multiBlankDragDrop':
        return (
          <FillInTheBlank
            fib_content={exercise}
            onComplete={() => handleSectionComplete(exercise.id)}
          />
        );
      case 'coding':
        return (
          <div className="exercise-container" style={{ height: '500px' }}>
            <MonPyEditor
              code_content={exercise}
              codeEndpoint={compilerEndpoint}
              onComplete={() => handleSectionComplete(exercise.id)}
            />
          </div>
        );
      default:
        return <p className="text-gray-400">Unsupported exercise type: {exercise.type}</p>;
    }
  }, [handleSectionComplete, compilerEndpoint]);

  // Render pre-assessment section
  const renderPreAssessment = useCallback(() => {
    if (!moduleData?.preAssessment || !moduleData.preAssessment.questions) {
      return null;
    }

    return (
      <div className="bg-opacity-10 bg-white rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-white mb-4">Pre-Assessment</h2>
        {moduleData.preAssessment.questions.map((question, index) => {
          return (
            <div key={`preassess-${index}`} className="mb-6">
              <MCQuestion
                mcq_content={question}
                onComplete={() => handleSectionComplete(`preassess-${index}`)}
              />
            </div>
          );
        })}
      </div>
    );
  }, [moduleData, handleSectionComplete]);

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
        <PageHeader title="Loading Module..." userRole="student" />
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
        <PageHeader title="Module Error" userRole="student" />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-red-400 text-xl">{error}</div>
        </div>
      </div>
    );
  }

  // A module with the given ID was not found
  if (!moduleData) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#201E1E' }}>
        <PageHeader title="Module Not Found" userRole="student" />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-white text-xl">Module not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#201E1E' }}>
      {/* Header with module title */}
      <PageHeader title={moduleData.title || "Module"} userRole="student" />

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
                    <SimpleMarkdown content={section.title} />
                  </div>

                  {section.content && (<SimpleMarkdown
                    content={section.content}
                    className="text-white"
                  />
                  )}
                </div>

                {/* Section exercises */}
                {section.exercises && section.exercises.length > 0 && (
                  <div className="space-y-6">
                    {section.exercises.map((exercise) => (
                      <div key={exercise.id} className="bg-opacity-10 bg-white rounded-lg p-6">
                        <div className="text-lg font-semibold text-white mb-2">
                          <SimpleMarkdown content={exercise.title} />
                        </div>

                        {exercise.description && (
                          <SimpleMarkdown
                            content={exercise.description}
                            className="text-gray-300 mb-4"
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
            {/* The position sticky will keep this fixed while scrolling */}
            <GzWebFrame endpoint={simulationEndpoint} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModulePage;