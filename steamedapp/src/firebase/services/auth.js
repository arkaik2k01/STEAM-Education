import { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification as firebaseSendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';

import { 
  doc,
  addDoc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  serverTimestamp,
  updateDoc,
  arrayUnion
} from 'firebase/firestore';

import { db } from '../config';
import { FirebaseError } from 'firebase/app';
import { classManagementService } from './firestore';
import { ErrorCodes } from '../types';

// Initialize Firebase Auth
const auth = getAuth();

export { auth };

// Create teacher account
export const createTeacherAccount = async (email, password, teacherData) => {
  try {
    // First check if email is already in use
    const teachersQuery = query(
      collection(db, 'users', 'teachers', 'accounts'), 
      where('email', '==', email)
    );
    const teacherSnapshot = await getDocs(teachersQuery);

    if (!teacherSnapshot.empty) {
      throw new FirebaseError('auth/email-already-in-use', 'This email is already in use');
    }

    // Create the user with Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update user profile with display name
    await updateProfile(user, { displayName: teacherData.name });

    // Send verification email
    await firebaseSendEmailVerification(user);

    // Initialize with empty classes array
    const userData = {
      ...teacherData,
      email,
      uid: user.uid,
      role: 'teacher',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      classes: [] // Initialize empty array
    };
    
    // First create the teacher document
    await setDoc(doc(db, 'users', 'teachers', 'accounts', user.uid), userData);
    
    // Now create a default class
    try {
      const defaultClassName = `${teacherData.firstName}'s Class`;
      const classData = await addDoc(collection(db, 'class'), {
        teacherId: user.uid,
        className: defaultClassName,
        classCode: Math.floor(100000 + Math.random() * 900000).toString(), // 6-digit code
        students: [],
        createdAt: serverTimestamp()
      });
      
      // Update the teacher document to include the class ID
      await updateDoc(doc(db, 'users', 'teachers', 'accounts', user.uid), {
        classes: arrayUnion(classData.id)
      });
    } catch (classError) {
      console.error('Error creating default class:', classError);
      // Continue even if class creation fails - at least the teacher account exists
    }

    // Return the user object
    return user;
  } catch (error) {
    console.error('Error creating teacher account:', error);
    throw error;
  }
};

// Create student account - store only in subcollection
export const createStudentAccount = async (email, password, studentData) => {
  try {
    // First check if email is already in use
    const studentsQuery = query(
      collection(db, 'users', 'students', 'accounts'), 
      where('email', '==', email)
    );
    const studentSnapshot = await getDocs(studentsQuery);
    
    if (!studentSnapshot.empty) {
      throw new FirebaseError('auth/email-already-in-use', 'This email is already in use');
    }

    // Create the user with Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update user profile with display name
    await updateProfile(user, { displayName: studentData.name });

    // Send verification email
    await firebaseSendEmailVerification(user);

    // Prepare the student data for Firestore
    const userData = {
      ...studentData,
      email,
      uid: user.uid,
      role: 'student',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      progress: {
        currentLevel: 1,
        completedAssignments: [],
        totalScore: 0,
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
        }
      }
    };
    
    // Only store in students subcollection
    await setDoc(doc(db, 'users', 'students', 'accounts', user.uid), userData);
    
    // Add the student to the class
    if (studentData.enrolledClassId) {
      const classRef = doc(db, 'class', studentData.enrolledClassId);
      await updateDoc(classRef, {
        students: arrayUnion(user.uid)
      });
    }

    // Return the user object
    return user;
  } catch (error) {
    console.error('Error creating student account:', error);
    throw error;
  }
};

export const loginUser = async (email, password, navigate) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Check if email is verified
    if (!user.emailVerified) {
      // Send a new verification email
      await firebaseSendEmailVerification(user);
      
      // Sign out the user
      await signOut(auth);
      
      // If navigate function is provided, use it
      if (navigate) {
        navigate('/verify-email');
        return null;
      }
      
      // Throw a custom error if no navigation function
      throw new FirebaseError('auth/email-not-verified', 'Email not verified. A new verification email has been sent.');
    }
    
    // Try to find user in teachers subcollection
    const teacherDoc = await getDoc(doc(db, 'users', 'teachers', 'accounts', user.uid));
    if (teacherDoc.exists()) {
      return { user, role: 'teacher' };
    }
    
    // If not a teacher, check students subcollection
    const studentDoc = await getDoc(doc(db, 'users', 'students', 'accounts', user.uid));
    if (studentDoc.exists()) {
      const studentData = studentDoc.data();
      
      // Check if the student account is disabled
      if (studentData.isDisabled) {
        // Sign out the user immediately since they shouldn't be logged in
        await signOut(auth);
        
        // Navigate with error parameter instead of throwing an error
        if (navigate) {
          navigate('/login?error=account-disabled');
          return null;
        }
        
        // If no navigate function provided, throw error as before
        const disabledError = new Error('Your account has been disabled by your teacher.');
        disabledError.code = 'auth/account-disabled';
        throw disabledError;
      }
      
      return { user, role: 'student' };
    }
    
    // If user exists in Auth but not in Firestore, we have a problem
    console.error('User exists in Auth but not in Firestore:', user.uid);
    await signOut(auth);
    throw new Error('Account configuration error. Please contact an administrator.');
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Send verification email
export const sendEmailVerification = async (user) => {
  try {
    return await firebaseSendEmailVerification(user);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

export const authService = {
  // Send a password reset email
  resetPassword: async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      console.log('Password reset sent to email: ', email);
    } catch (err) {
      console.error('Password reset error:', err);
      throw err;
    }
  },

  // Send an email verification
  verifyEmail: async (user) => {
    try {
      await firebaseSendEmailVerification(user);
      console.log('Email verification sent to ', user.email);
    } catch (err) {
      console.error('Email verification error:', err);
      throw err;
    }
  },

  // Log out the current user
  logout: async () => {
    try {
      await signOut(auth);
      console.log("Successful signout!");
    } catch (err) {
      console.error('Signout error:', err);
      throw err;
    }
  },

  // Auth state observer
  onAuthStateChange: (callback) => {
    return onAuthStateChanged(auth, callback);
  },
  
  // Get user role
  getUserRole: async (userId) => {
    try {
      // First check teachers subcollection
      const teacherDoc = await getDoc(doc(db, 'users', 'teachers', 'accounts', userId));
      if (teacherDoc.exists()) {
        return 'teacher';
      }
      
      // Then check students subcollection
      const studentDoc = await getDoc(doc(db, 'users', 'students', 'accounts', userId));
      if (studentDoc.exists() && !studentDoc.data().isDisabled) {
        return 'student';
      }
      
      return null;
    } catch (error) {
      console.error('Error getting user role:', error);
      throw error;
    }
  },
  
  // Check email verification status
  checkEmailVerified: (user) => {
    return user && user.emailVerified;
  },
  
  // Resend verification email
  resendVerificationEmail: async (user) => {
    if (!user) {
      throw new Error('No user logged in');
    }
    
    try {
      await firebaseSendEmailVerification(user);
      return true;
    } catch (error) {
      console.error('Error resending verification email:', error);
      throw error;
    }
  }
};