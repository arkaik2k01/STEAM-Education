import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

// Firebase configuration object containing keys and identifiers for your app
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD4JfnpMGf6YWFz3CltBhhYzyI4fRDTbuM",
  authDomain: "steameducation-b1b03.firebaseapp.com",
  projectId: "steameducation-b1b03",
  storageBucket: "steameducation-b1b03.firebasestorage.app",
  messagingSenderId: "104577670307",
  appId: "1:104577670307:web:5b82417067bb5b9ae63316",
  measurementId: "G-200FHB1HCH"
};

// Initialize Firebase app with the configuration
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app); // Authentication service
const db = getFirestore(app); // Firestore database service
const func = getFunctions(app); // Cloud Functions service
const googleProv = new GoogleAuthProvider(); // Google Auth provider for OAuth

export {
  app,
  auth,
  db,
  func,
  googleProv,
  firebaseConfig
}; 