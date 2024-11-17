// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Imports for emulators
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { Function } from 'firebase/functions';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD4JfnpMGf6YWFz3CltBhhYzyI4fRDTbuM",
  authDomain: "steameducation-b1b03.firebaseapp.com",
  projectId: "steameducation-b1b03",
  storageBucket: "steameducation-b1b03.firebasestorage.app",
  messagingSenderId: "104577670307",
  appId: "1:104577670307:web:5b82417067bb5b9ae63316",
  measurementId: "G-200FHB1HCH"
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