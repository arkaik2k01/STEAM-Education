import { auth, db } from './config';
import { 
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

export const authService = {
  signupWithEmail: async (displayName, email, password) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName });
      return user;
    } catch (err) {
      console.error('Signup error:', err);
      throw err;
    }
  },

  updateUserProfile: async (displayName, email, password, photoURL) => {
    try {
      await updateProfile(auth.currentUser, {
        displayName,
        email,
        password,
        photoURL
      });
    } catch (err) {
      console.error('Update profile error:', err);
      throw err;
    }
  },

  googleSignIn: async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await setDoc(doc(db, "users", user.uid), {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      });
      return user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  loginWithEmail: async (email, password) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      console.log('Email: ', user.email);
      return user;
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
  },

  resetPassword: async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      console.log('Password reset sent to email: ', email);
    } catch (err) {
      console.error('Password reset error:', err);
      throw err;
    }
  },

  verifyEmail: async (user) => {
    try {
      await sendEmailVerification(user);
      console.log('Email verification sent to ', user.email);
    } catch (err) {
      console.error('Email verification error:', err);
      throw err;
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
      console.log("Successful signout!");
    } catch (err) {
      console.error('Signout error:', err);
      throw err;
    }
  }
};

// New functions for teacher/student accounts
export const createTeacherAccount = async (email, password, teacherData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, 'users', user.uid), {
      ...teacherData,
      email,
      role: 'teacher',
      createdAt: new Date(),
      classes: [],
      students: []
    });

    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createStudentAccount = async (email, password, studentData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, 'users', user.uid), {
      ...studentData,
      email,
      role: 'student',
      createdAt: new Date(),
      progress: {
        currentLevel: 1,
        completedAssignments: [],
        totalScore: 0
      }
    });

    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUserRole = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data().role;
    }
    return null;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getTeacherStudents = async (teacherId) => {
  try {
    const q = query(
      collection(db, 'users'),
      where('teacherId', '==', teacherId),
      where('role', '==', 'student')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateUserProfile = async (userId, userData) => {
  try {
    await setDoc(doc(db, 'users', userId), {
      ...userData,
      updatedAt: new Date()
    }, { merge: true });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Auth state observer
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
}; 