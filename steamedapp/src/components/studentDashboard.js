import React, { useState } from 'react';

const StudentDashboard = ({ studentModules, onModuleSelect }) => {
  const [selectedModule, setSelectedModule] = useState(null);

  // Helper function to calculate module progress
  const calculateProgress = (module) => {
    if (!module.sections) return 0;
    
    const totalSections = module.sections.length;
    const completedSections = module.sections.filter(section => 
      section.isCompleted).length;
    
    return Math.round((completedSections / totalSections) * 100);
  };

  // When a module is selected, load the module details
  const handleModuleSelect = (module) => {
    setSelectedModule(module);
  };

  // On click of continue button, navigate to the module page
  const handleContinue = () => {
    if (selectedModule && onModuleSelect) {
      // Use the Firestore document ID directly
      onModuleSelect(selectedModule.id);
    }
  };


  return (
    <div className="min-h-screen" style={{ backgroundColor: '#201E1E' }}>
      {/* Header */}
      <header className="w-full p-4 sticky top-0 z-10" style={{ backgroundColor: '#828282' }}>
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-white">Student Dashboard</h1>
        </div>
      </header>

      {/* Main content */}
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left side: Module list */}
          <div className="lg:col-span-2">
            <div className="bg-opacity-10 bg-white rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-6 border-b border-gray-700 pb-2">
                Your Modules
              </h2>
              
              <div className="space-y-4">
                {studentModules.map((module, index) => {
                  const progress = calculateProgress(module);
                  
                  return (
                    <div 
                      key={module.id || index}
                      onClick={() => handleModuleSelect(module)}
                      className={`bg-opacity-20 bg-white rounded-lg p-4 cursor-pointer 
                                transition-all duration-200 hover:bg-opacity-30
                                ${selectedModule?.id === module.id ? 'border-2 border-blue-500' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-white">{module.title}</h3>
                          <p className="text-gray-300 text-sm mt-1">
                            {progress === 100 ? 'Completed' : `${progress}% Complete`}
                          </p>
                        </div>
                        
                        {/* Module status icon */}
                        <div className="flex items-center">
                          {progress === 100 ? (
                            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-opacity-20 bg-blue-500 flex items-center justify-center">
                              <span className="text-white text-sm font-medium">{progress}%</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Progress bar */}
                      <div className="w-full bg-gray-700 rounded-full h-2 mt-4">
                        <div 
                          className="h-full rounded-full transition-all duration-300" 
                          style={{ 
                            width: `${progress}%`,
                            backgroundColor: '#0A3C91'
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right side: Selected module details */}
          <div className="lg:col-span-1">
            <div className="bg-opacity-10 bg-white rounded-lg p-6 sticky top-24">
              {selectedModule ? (
                <>
                  <h2 className="text-xl font-semibold text-white mb-2">
                    {selectedModule.title}
                  </h2>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-300">
                      {calculateProgress(selectedModule)}% Complete
                    </span>
                    
                    <button
                      onClick={handleContinue} 
                      className="px-4 py-2 bg-blue-600 text-white rounded-md 
                                hover:bg-blue-700 transition-colors"
                    >
                      Continue
                    </button>
                  </div>
                  
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
                    <div 
                      className="h-full rounded-full transition-all duration-300" 
                      style={{ 
                        width: `${calculateProgress(selectedModule)}%`,
                        backgroundColor: '#0A3C91'
                      }}
                    />
                  </div>
                  
                  <div className="prose prose-invert max-w-none">
                    <p className="text-white">
                      {selectedModule.description || 'No description available.'}
                    </p>
                    
                    {selectedModule.sections && selectedModule.sections.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-lg font-medium text-white mb-2">Module Content</h3>
                        <ul className="space-y-2">
                          {selectedModule.sections.map((section, index) => (
                            <li 
                              key={index} 
                              className="flex items-center space-x-2 text-gray-300"
                            >
                              {section.isCompleted ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 10-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                                </svg>
                              )}
                              <span>{section.title || `Section ${index + 1}`}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-64">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <p className="text-gray-400 text-center">
                    Select a module to view details
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;