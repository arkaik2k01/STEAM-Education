import { auth, googleProv } from './config';
import { 
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  updateProfile 
} from 'firebase/auth';

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
    try {
      const { user } = await signInWithPopup(auth, googleProv);
      console.log('Email: ', user.email);
      return user;
    } catch (err) {
      console.error('Google sign-in error:', err);
      throw err;
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