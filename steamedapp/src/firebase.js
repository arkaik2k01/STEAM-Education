// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Imports for emulators and built-in functions
import { getAuth, Auth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, signOut, updateProfile } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { Function } from 'firebase/functions';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase, Firestore, and Authentication
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const googleProv = GoogleAuthProvider();

// Initialize Emulators
const authem = Auth(app);
const firestore = Firestore(app);
const functions = Function(app);

if(window.location.hostname === 'localhost') {
  console.log("Using Emulators...");
  authem.useEmulator("localhost", 9099);
  firestore.useEmulator("localhost", 8080);
  functions.useEmulator("localhost", 5001);
}

// Sign up with email and password
const signupWithEmail = async (displayName, email, password) => {
  try{
    const wait = await createUserWithEmailAndPassword(auth, email, password);
    const user = wait.user;

    await updateProfile(user, {displayName: displayName});
  }
  catch(err){
    console.log(err);
    alert("Could not create an account with email and password!");
  }
}

// Sign in with Google account
const googleSignIn = async () => {
  try{
    const wait = await signInWithPopup(auth, googleProv);
    const user = wait.user;
    console.log('Email: ', user.email);
  }
  catch(err){
    console.log(err);
    alert("Could not sign in with Google account!");
  }
}

// Login with email and password
const loginWithEmail = async (email, password) => {
  try{
    const wait = await signInWithEmailAndPassword(auth, email, password);
    const user = wait.user;
    console.log('Email: ', user.email);
  }
  catch(err){
    console.log(err);
    alert("Could not login with email and password!");
  }
}

// Send password reset to email
const resetPassword = async (email) => {
  try{
    await sendPasswordResetEmail(auth, email);
    console.log('Password reset sent to email: ', email);
    alert("Password reset sent to email!");
  }
  catch(err){
    console.log(err);
    alert("Could not send password reset to email!");
  }
}

// Send email verification 
const verifyEmail = async (user) => {
  try{
    await sendEmailVerification(user);
    console.log('Email verification sent to ', user.email);
    alert('Email verification sent!');
  }
  catch(err){
    console.log('Could not send email verification to ', user.email);
    alert("Could not send email verification!");
  }
}

// Logout
const logout = async () => {
  try{
    signOut(auth);
    console.log("Successful signout!");
  }
  catch(err){
    console.log('Could not sign out!');
    alert('Could not sign out!');
  }
}

export {
  auth,
  db,
  signupWithEmail,
  googleSignIn,
  loginWithEmail,
  resetPassword,
  verifyEmail,
  logout
};
export default app;