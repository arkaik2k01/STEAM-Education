// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Imports for emulators and built-in functions
import { getAuth, connectAuthEmulator, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, signOut, updateProfile } from 'firebase/auth';
import { addDoc, deleteDoc, setDoc, doc, collection, connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';

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

// Initialize Firebase, Firestore, Authentication, and Functions
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const func = getFunctions(app);

const googleProv = new GoogleAuthProvider();
const classCollect = collection(db, 'class');

// Use emulators if using localhost
try{
  if(window.location.hostname === 'localhost') {
    console.log("Using Emulators...");
    connectAuthEmulator(auth, "http://localhost:9099");
    connectFirestoreEmulator(db, "localhost", 8080);
    connectFunctionsEmulator(func, "localhost", 5001);
  }
}
catch(err){
  console.log("Error connecting to emulators: ", err);
}

// SEPARATE LOGIN/SIGNUP FUNCTIONS INTO A DIFFERENT FILE: AUTH.JS?

// Sign up with email and password
const signupWithEmail = async (displayName, email, password) => {
  try{
    const wait = await createUserWithEmailAndPassword(auth, email, password);
    const user = wait.user;

    await updateProfile(user, {displayName: displayName});
    return user;
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
    return user;
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
    return user;
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

// SEPARATE CRUD FUNCTIONS INTO A DIFFERENT FILE: FIRESTORE.JS?

// Randomized 6 digit class code
function createClassCode() {
  const min = 0;
  const max = 999999;
  const random = Math.random() * ((max-min) + 1);
  return Math.floor(random);
}

// Add a class
const addClass = async (name, studentlist) => {
  const code = createClassCode();
  try{
    const newClass = await addDoc(classCollect, {
      classCode: code,
      className: name,
      students: studentlist
    })
    console.log(newClass);
    return name;
  }
  catch(err){
    console.error(err);
  }
}

// Delete a class by id
const deleteClass = async (id) => {
  try{
    await deleteDoc(doc(db, 'class', id));
  }
  catch(err){
    console.error(err);
  }
}

// Add student to class list using student name
const addStudent = async (name, students, id) => {
  try{
    students.push(name);
    await setDoc(doc(db, 'class', id), {
      students: students
    })
  }
  catch(err){
    console.error(err);
  }
}

// Delete student from class list using student name
const deleteStudent = async (name, students, id) => {
  students.forEach((element, index) => {
    if(element === name){
      students.splice(index, 1);
    }
  })

  try{
    await setDoc(doc(db, 'class', id), {
      students: students
    })
  }
  catch(err){
    console.error(err);
  }
}

export {
  auth,
  db,
  func,
  signupWithEmail,
  googleSignIn,
  loginWithEmail,
  resetPassword,
  verifyEmail,
  logout,
  addClass,
  deleteClass,
  addStudent,
  deleteStudent
};
export default app;