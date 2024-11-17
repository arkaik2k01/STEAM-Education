// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Imports for emulators
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Emulators
const auth = Auth(app);
const firestore = Firestore(app);
const functions = Function(app);

if(window.location.hostname === 'localhost') {
  console.log("Using Emulators...");
  auth.useEmulator("localhost", 9099);
  firestore.useEmulator("localhost", 8080);
  functions.useEmulator("localhost", 5001);
}

export default app;