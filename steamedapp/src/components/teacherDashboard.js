import React, { useState } from 'react';

const TeacherDashboard = ({ teacherClasses, onStudentDelete, onClassCreate, onClassRename }) => {
  // UI state management
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [expandedClasses, setExpandedClasses] = useState({});
  const [copyFeedback, setCopyFeedback] = useState(''); // For copy feedback
  
  // Class management state
  const [newClassName, setNewClassName] = useState('');
  const [classToRename, setClassToRename] = useState(null);
  const [newClassNameInput, setNewClassNameInput] = useState('');
  const [showCreateClassForm, setShowCreateClassForm] = useState(false);

  // Toggle class expansion states
  const toggleClassExpansion = (classId) => {
    // If clicking the already selected class, toggle its expansion state
    if (selectedClass === classId) {
      setExpandedClasses(prev => ({
        ...prev,
        [classId]: !prev[classId]
      }));
      
      // If we're collapsing a class, also deselect it
      if (expandedClasses[classId]) {
        setSelectedClass(null);
      }
    } else {
      // Clicking a different class
      setExpandedClasses(prev => ({
        ...prev,
        [classId]: true  // Expand the clicked class
      }));
      
      // Set as the selected class
      setSelectedClass(classId);
    }
  };

  // Detects clicks outside class to update states properly
  const handleBackgroundClick = (e) => {
    // Only handle clicks directly on the container, not on its children
    if (e.target === e.currentTarget) {
      setSelectedClass(null);
    }
  };

  // Handle student selection, update selected student state
  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
  };

  // Calculate progress for a student
  const calculateProgress = (student) => {
    if (!student.progress?.modules) return 0;
    
    // Calculate overall progress across all modules
    let totalProgress = 0;
    let moduleCount = 0;
    
    Object.values(student.progress.modules).forEach(moduleProgress => {
      if (moduleProgress.progress !== undefined) {
        totalProgress += moduleProgress.progress;
        moduleCount++;
      }
    });
    
    return moduleCount > 0 ? Math.round(totalProgress / moduleCount) : 0;
  };

  // Get module progress details for a student
  const getModuleProgress = (student) => {
    if (!student.progress?.modules) return [];
    
    // Create a map to deduplicate modules by title
    const moduleMap = new Map();
    
    Object.entries(student.progress.modules).forEach(([moduleId, moduleProgress]) => {
      const moduleName = student.moduleNames?.[moduleId] || moduleId;
      
      // If we already have this module, merge the progress
      if (moduleMap.has(moduleName)) {
        const existing = moduleMap.get(moduleName);
        moduleMap.set(moduleName, {
          ...existing,
          progress: Math.max(existing.progress, moduleProgress.progress || 0),
          completedLessons: [...new Set([...existing.completedLessons, ...(moduleProgress.completedLessons || [])])],
          completedExercises: { ...existing.completedExercises, ...(moduleProgress.completedExercises || {}) },
          currentLesson: moduleProgress.currentLesson || existing.currentLesson,
          isCompleted: existing.isCompleted || student.progress.completedModules?.includes(moduleId) || moduleProgress.progress === 100
        });
      } else {
        // First time seeing this module
        moduleMap.set(moduleName, {
          id: moduleId,
          name: moduleName,
          progress: moduleProgress.progress || 0,
          currentLesson: moduleProgress.currentLesson,
          completedLessons: moduleProgress.completedLessons || [],
          completedExercises: moduleProgress.completedExercises || {},
          isCompleted: student.progress.completedModules?.includes(moduleId) || moduleProgress.progress === 100
        });
      }
    });
    
    // Convert map back to array and sort by module name
    return Array.from(moduleMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  };

  // Deletes a student from the class and database, shows confirmation message
  const handleDeleteStudent = (student, classId) => {
    if (window.confirm(`Are you sure you want to delete ${student.name} from this class? This will also remove their access to the platform.`)) {
      onStudentDelete(student.id, classId);
      
      // If the deleted student was selected, clear selection
      if (selectedStudent && selectedStudent.id === student.id) {
        setSelectedStudent(null);
      }
    }
  };

  // Create a new class with the entered name - delegated to parent component
  const handleCreateClass = () => {
    if (newClassName.trim()) {
      onClassCreate(newClassName.trim());
      setNewClassName('');
      setShowCreateClassForm(false);
    }
  };

  // Rename existing class
  const handleRenameClass = (classId) => {
    if (newClassNameInput.trim()) {
      onClassRename(classId, newClassNameInput.trim());
      setClassToRename(null);
      setNewClassNameInput('');
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#201E1E' }}>
      {/* Main content */}
      <div className="container mx-auto p-4" onClick={handleBackgroundClick}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left side: Classes and students list */}
          <div className="lg:col-span-2">
            <div className="bg-opacity-10 bg-white rounded-lg p-6">
              <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-2">
                <h2 className="text-xl font-semibold text-white">Your Classes</h2>
                <button 
                  onClick={() => setShowCreateClassForm(true)}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                >
                  New Class
                </button>
              </div>
              
              {showCreateClassForm && (
                <div className="mb-6 bg-opacity-20 bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-white mb-3">Create New Class</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newClassName}
                      onChange={(e) => setNewClassName(e.target.value)}
                      placeholder="Enter class name"
                      className="flex-1 px-3 py-2 bg-opacity-20 bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleCreateClass}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Create
                    </button>
                    <button
                      onClick={() => setShowCreateClassForm(false)}
                      className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                {teacherClasses.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    No classes yet. Create your first class to get started.
                  </div>
                ) : (
                  teacherClasses.map((classItem) => (
                    <div key={classItem.id} className="bg-opacity-20 bg-white rounded-lg">
                      {/* Class header */}
                      <div 
                        onClick={() => toggleClassExpansion(classItem.id)}
                        className={`p-4 cursor-pointer transition-all duration-200 hover:bg-opacity-30 
                                  rounded-lg flex justify-between items-center
                                  ${selectedClass === classItem.id ? 'border-l-4 border-blue-500' : ''}`}
                      >
                        <div className="flex items-center gap-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-white transition-transform duration-200 ${expandedClasses[classItem.id] ? 'rotate-90' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                          <h3 className="text-lg font-medium text-white">{classItem.name}</h3>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-gray-300 text-sm">{classItem.students ? classItem.students.length : 0} students</span>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setClassToRename(classItem.id);
                              setNewClassNameInput(classItem.name);
                            }}
                            className="p-1.5 text-gray-400 hover:text-white rounded-md hover:bg-opacity-20 hover:bg-white"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      {/* Rename class form */}
                      {classToRename === classItem.id && (
                        <div className="p-4 border-t border-gray-700 bg-opacity-20 bg-gray-800">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newClassNameInput}
                              onChange={(e) => setNewClassNameInput(e.target.value)}
                              placeholder="New class name"
                              className="flex-1 px-3 py-2 bg-opacity-20 bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                              onClick={() => handleRenameClass(classItem.id)}
                              className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setClassToRename(null)}
                              className="px-3 py-1.5 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Students list */}
                      {expandedClasses[classItem.id] && classItem.students && (
                        <div className="border-t border-gray-700 py-2">
                          {classItem.students.length === 0 ? (
                            <div className="p-4 text-center text-gray-400">
                              No students in this class yet.
                            </div>
                          ) : (
                            classItem.students.map((student) => (
                              <div 
                                key={student.id}
                                onClick={() => handleStudentSelect(student)}
                                className={`flex items-center justify-between px-6 py-3 cursor-pointer 
                                         hover:bg-opacity-20 hover:bg-gray-500 transition-colors
                                         ${selectedStudent?.id === student.id ? 'bg-opacity-20 bg-blue-800' : ''}`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-6 h-6 rounded-full bg-opacity-20 bg-blue-500 flex items-center justify-center">
                                    <span className="text-white text-xs">{calculateProgress(student)}%</span>
                                  </div>
                                  <span className="text-white">{student.name}</span>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                  <span className="text-gray-400 text-sm">{student.email}</span>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteStudent(student, classItem.id);
                                    }}
                                    className="p-1.5 text-gray-400 hover:text-red-400 rounded-md hover:bg-opacity-20 hover:bg-red-900"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
            
            {/* Class ID information panel */}
            {selectedClass && (
              <div className="bg-opacity-10 bg-white rounded-lg p-6 mt-6">
                <h2 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">
                  Class Information
                </h2>
                <div className="flex items-center justify-between bg-opacity-20 bg-gray-800 p-4 rounded-lg">
                  <div>
                    <span className="text-gray-400 block mb-1">Class Code (for student registration):</span>
                    <span className="text-white font-mono text-xl">{teacherClasses.find(c => c.id === selectedClass)?.classCode || 'No code available'}</span>
                  </div>
                  <button 
                    onClick={() => {
                      const classCode = teacherClasses.find(c => c.id === selectedClass)?.classCode;
                      if (classCode) {
                        navigator.clipboard.writeText(classCode);
                        setCopyFeedback('Code copied to clipboard!');
                        
                        // Clear the feedback message after 3 seconds
                        setTimeout(() => {
                          setCopyFeedback('');
                        }, 3000);
                      }
                    }}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Copy Code
                  </button>
                </div>
                
                {/* Feedback message */}
                {copyFeedback && (
                  <div className="mt-2 p-2 bg-green-900 bg-opacity-20 text-green-200 border border-green-500 rounded text-center animate-fade-in-out">
                    {copyFeedback}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right side: Selected student details */}
          <div className="lg:col-span-1">
            <div className="bg-opacity-10 bg-white rounded-lg p-6 sticky top-24">
              {selectedStudent ? (
                <>
                  <h2 className="text-xl font-semibold text-white mb-2">
                    {selectedStudent.name}
                  </h2>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-300">
                      {calculateProgress(selectedStudent)}% Complete
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
                    <div 
                      className="h-full rounded-full transition-all duration-300" 
                      style={{ 
                        width: `${calculateProgress(selectedStudent)}%`,
                        backgroundColor: '#0A3C91'
                      }}
                    />
                  </div>
                  
                  <div className="prose prose-invert max-w-none">
                    <div className="space-y-4">
                      {getModuleProgress(selectedStudent).map(module => (
                        <div key={module.id} className="bg-opacity-20 bg-gray-800 p-4 rounded-lg">
                          <h3 className="text-lg font-medium text-white mb-2">{module.name}</h3>
                          <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                            <div 
                              className="h-full rounded-full transition-all duration-300" 
                              style={{ 
                                width: `${module.progress}%`,
                                backgroundColor: module.isCompleted ? '#10B981' : '#0A3C91'
                              }}
                            />
                          </div>
                          <p className="text-gray-300 text-sm">
                            {module.isCompleted ? 'Completed' : 
                             module.currentLesson ? `Current Lesson: ${module.currentLesson}` :
                             `${module.progress}% Complete`}
                          </p>
                          {module.completedLessons && module.completedLessons.length > 0 && (
                            <p className="text-gray-400 text-xs mt-1">
                              {module.completedLessons.length} lesson{module.completedLessons.length !== 1 ? 's' : ''} completed
                            </p>
                          )}
                          {module.completedExercises && Object.keys(module.completedExercises).length > 0 && (
                            <p className="text-gray-400 text-xs mt-1">
                              {Object.keys(module.completedExercises).length} exercise{Object.keys(module.completedExercises).length !== 1 ? 's' : ''} completed
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-64">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <p className="text-gray-400 text-center">
                    Select a student to view details
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

export default TeacherDashboard;