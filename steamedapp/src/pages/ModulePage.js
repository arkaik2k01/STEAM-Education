import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { fetchModuleById } from '../firebase/services/moduleServer';
import { MCQuestion } from '../components/ModulePage/MCQuestion/MCQuestion';
import { MonPyEditor } from '../components/ModulePage/MonPyEditor';
import { FillInTheBlank } from '../components/ModulePage/FillInTheBlank/FillInTheBlank';
import { GzWebFrame } from '../components/ModulePage/GzWebFrame';
import { requestModuleSimulation } from '../firebase/services/infrastructureService';
import PageHeader from '../components/PageHeader';
import { auth } from '../firebase/services/auth';

const ModulePage = (props) => {
  const params = useParams();
  const moduleId = props.moduleId || (params ? params.moduleId : null);

  const [moduleData, setModuleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState({});
  const [simulationEndpoint, setSimulationEndpoint] = useState(null);
  const [compilerEndpoint, setCompilerEndpoint] = useState(null);

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
      case 'codeExercise':
        return (
          <MonPyEditor
            code_content={exercise}
            codeEndpoint={compilerEndpoint}
            onComplete={() => handleSectionComplete(exercise.id)}
          />
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
          <div className="max-h-[calc(100vh-8rem)] overflow-y-auto pr-4 space-y-4">
            {/* Pre-assessment section */}
            {moduleData.preAssessment && renderPreAssessment()}

            {/* Module sections */}
            {moduleData.sections.map((section) => (
              <div key={section.id} className="relative">
                {/* Section content */}
                <div className="prose prose-invert max-w-none bg-opacity-10 bg-white rounded-lg p-6 mb-6">
                  <h2 className="text-xl font-semibold text-white mb-4">{section.title}</h2>
                  <div className="text-white">{section.content}</div>
                </div>

                {/* Section exercises */}
                {section.exercises && section.exercises.length > 0 && (
                  <div className="space-y-6">
                    {section.exercises.map((exercise) => (
                      <div key={exercise.id} className="bg-opacity-10 bg-white rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-2">{exercise.title}</h3>
                        {exercise.description && (
                          <p className="text-gray-300 mb-4">{exercise.description}</p>
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
          <div className="bg-opacity-10 bg-white rounded-lg overflow-hidden sticky top-24 h-[calc(100vh-8rem)]">
            <GzWebFrame endpoint={simulationEndpoint} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModulePage;