import { 
  doc, 
  updateDoc, 
  getDoc,
  arrayUnion,
  increment,
  setDoc
} from 'firebase/firestore';
import { db } from '../config';

// Calculate module progress percentage based on completed lessons
const calculateModuleProgress = (completedLessons, totalLessons) => {
  return Math.round((completedLessons.length / totalLessons) * 100);
};

// Get the next lesson in a module
const getNextLesson = (currentLesson, moduleContent) => {
  const lessonIndex = moduleContent.indexOf(currentLesson);
  if (lessonIndex < moduleContent.length - 1) {
    return moduleContent[lessonIndex + 1];
  }
  return null;
};

// Initialize progress structure if it doesn't exist
const initializeProgressStructure = async (userId, moduleId) => {
  const studentRef = doc(db, 'users', 'students', 'accounts', userId);
  const studentDoc = await getDoc(studentRef);
  
  if (!studentDoc.exists()) {
    throw new Error('Student not found');
  }

  const studentData = studentDoc.data();
  if (!studentData.progress?.moduleProgress?.modules?.[moduleId]) {
    // Create initial progress structure for this module
    const moduleProgress = {
      [`progress.moduleProgress.modules.${moduleId}`]: {
        progress: 0,
        currentLesson: 'Pre-Assessment',
        completedLessons: [],
        completedExercises: {}
      }
    };

    if (!studentData.progress?.moduleProgress) {
      // Initialize the entire progress structure if it doesn't exist
      moduleProgress['progress.moduleProgress'] = {
        currentModule: moduleId,
        completedModules: []
      };
    }

    await updateDoc(studentRef, moduleProgress);
  }
};

// Update progress when a lesson is completed
export const completeLesson = async (userId, moduleId, lessonName, moduleContent, exerciseId = null) => {
  try {
    // Initialize progress structure if needed
    await initializeProgressStructure(userId, moduleId);

    const studentRef = doc(db, 'users', 'students', 'accounts', userId);
    const studentDoc = await getDoc(studentRef);
    
    if (!studentDoc.exists()) {
      throw new Error('Student not found');
    }

    const studentData = studentDoc.data();
    const moduleProgress = studentData.progress?.moduleProgress?.modules?.[moduleId] || {
      progress: 0,
      currentLesson: null,
      completedLessons: [],
      completedExercises: {}
    };

    // Add lesson to completed lessons if not already there
    if (!moduleProgress.completedLessons.includes(lessonName)) {
      const nextLesson = getNextLesson(lessonName, moduleContent);
      
      // Prepare all updates in a single object
      const updates = {
        [`progress.moduleProgress.modules.${moduleId}.completedLessons`]: arrayUnion(lessonName),
        [`progress.moduleProgress.modules.${moduleId}.currentLesson`]: nextLesson,
        [`progress.moduleProgress.modules.${moduleId}.progress`]: calculateModuleProgress(
          [...moduleProgress.completedLessons, lessonName],
          moduleContent.length
        ),
        'progress.moduleProgress.currentLesson': nextLesson || lessonName
      };

      // If we have an exercise ID, mark it as completed
      if (exerciseId) {
        updates[`progress.moduleProgress.modules.${moduleId}.completedExercises.${exerciseId}`] = true;
      }

      // If this was the last lesson, mark module as completed
      if (!nextLesson) {
        updates['progress.moduleProgress.completedModules'] = arrayUnion(moduleId);
      }

      // Perform all updates in a single atomic operation
      await updateDoc(studentRef, updates);

      console.log('Updated progress in Firestore:', updates); // Debug log
    } else if (exerciseId && !moduleProgress.completedExercises?.[exerciseId]) {
      // If the lesson is already completed but this specific exercise isn't
      const updates = {
        [`progress.moduleProgress.modules.${moduleId}.completedExercises.${exerciseId}`]: true
      };
      
      await updateDoc(studentRef, updates);
      console.log('Updated exercise completion in Firestore:', updates); // Debug log
    }

    return true;
  } catch (error) {
    console.error('Error updating lesson progress:', error);
    throw error;
  }
};

// Get current progress for a student
export const getStudentProgress = async (userId) => {
  try {
    const studentRef = doc(db, 'users', 'students', 'accounts', userId);
    const studentDoc = await getDoc(studentRef);
    
    if (!studentDoc.exists()) {
      throw new Error('Student not found');
    }

    const progress = studentDoc.data().progress || {
      moduleProgress: {
        currentModule: null,
        currentLesson: null,
        completedModules: [],
        modules: {}
      },
      totalScore: 0
    };

    console.log('Retrieved progress from Firestore:', progress); // Debug log
    return progress;
  } catch (error) {
    console.error('Error getting student progress:', error);
    throw error;
  }
};

// Reset progress for a specific module
export const resetModuleProgress = async (userId, moduleId, moduleContent) => {
  try {
    const studentRef = doc(db, 'users', 'students', 'accounts', userId);
    
    const updates = {
      [`progress.moduleProgress.modules.${moduleId}`]: {
        progress: 0,
        currentLesson: moduleContent[0],
        completedLessons: []
      }
    };

    // Remove from completed modules if it was there
    const studentDoc = await getDoc(studentRef);
    if (studentDoc.exists()) {
      const completedModules = studentDoc.data().progress?.moduleProgress?.completedModules || [];
      updates['progress.moduleProgress.completedModules'] = completedModules.filter(id => id !== moduleId);
    }

    await updateDoc(studentRef, updates);
    return true;
  } catch (error) {
    console.error('Error resetting module progress:', error);
    throw error;
  }
};

// Update total score
export const updateTotalScore = async (userId, scoreIncrement) => {
  try {
    const studentRef = doc(db, 'users', 'students', 'accounts', userId);
    
    await updateDoc(studentRef, {
      'progress.totalScore': increment(scoreIncrement)
    });

    return true;
  } catch (error) {
    console.error('Error updating total score:', error);
    throw error;
  }
};

// Add a new function to initialize module progress if it doesn't exist
export const initializeModuleProgress = async (userId) => {
  try {
    const studentRef = doc(db, 'users', 'students', 'accounts', userId);
    const studentDoc = await getDoc(studentRef);
    
    if (!studentDoc.exists()) {
      throw new Error('Student not found');
    }

    const studentData = studentDoc.data();
    
    // Check if progress structure exists
    if (!studentData.progress?.moduleProgress?.modules) {
      const initialProgress = {
        progress: {
          moduleProgress: {
            currentModule: "Basic Python",
            currentLesson: "Pre-Assessment",
            completedModules: [],
            modules: {
              "Basic Python": {
                progress: 0,
                currentLesson: "Pre-Assessment",
                completedLessons: []
              },
              "Introduction to ROS 2": {
                progress: 0,
                currentLesson: null,
                completedLessons: []
              },
              "Controlling Robot Arms with Joint Trajectories": {
                progress: 0,
                currentLesson: null,
                completedLessons: []
              },
              "Tugbot": {
                progress: 0,
                currentLesson: null,
                completedLessons: []
              },
              "X3 and X4 Drones": {
                progress: 0,
                currentLesson: null,
                completedLessons: []
              }
            }
          },
          totalScore: 0
        }
      };
      
      await updateDoc(studentRef, initialProgress);
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing module progress:', error);
    throw error;
  }
}; 