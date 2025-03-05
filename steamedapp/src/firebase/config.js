/**
 * Firebase Configuration Module
 * 
 * This file initializes the Firebase application and exports the Firestore database instance.
 * We're using this centralized config approach to ensure we only initialize Firebase once
 * and can import the same database instance throughout the application.
 */

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyD4JfnpMGf6YWFz3CltBhhYzyI4fRDTbuM",
    authDomain: "steameducation-b1b03.firebaseapp.com",
    projectId: "steameducation-b1b03",
    storageBucket: "steameducation-b1b03.firebasestorage.app",
    messagingSenderId: "104577670307",
    appId: "1:104577670307:web:5b82417067bb5b9ae63316",
    measurementId: "G-200FHB1HCH"
  };

// Initialize Firebase application
const app = initializeApp(firebaseConfig);

// Initialize and export Firestore database
// We export this to use in other parts of the application
const db = getFirestore(app);

export { db };