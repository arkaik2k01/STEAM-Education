// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Imports for emulators and built-in functions
import { getAuth, connectAuthEmulator, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, signOut, updateProfile } from 'firebase/auth';
import { addDoc, deleteDoc, setDoc, updateDoc, getDocs, doc, collection, query, connectFirestoreEmulator, getFirestore, where } from 'firebase/firestore';
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

// Access collections
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

// Update a user's profile
const updateUserProfile = async (displayName, email, password, photoURL) => {
  try{
    await updateProfile(auth.currentUser, {
      displayName: displayName,
      email: email,
      password: password,
      photoURL: photoURL
    })
  }
  catch(err){
    console.error(err);
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

function getProgressClass(classid){
  const classDoc = doc(db, 'class', classid);
  const progressCollect = collection(classDoc, 'studentProgress');
  return progressCollect;
}

// Create a student's progress
const createStudentProgress = async(classid, studentName, moduleNum, LessonNum) => {
  const progressCollect = getProgressClass(classid);
  try{
    const newStudentProgress = await addDoc(progressCollect, {
      currentModule: moduleNum,
      currentLesson: LessonNum,
      name: studentName,
      percentage: 0
    })
    console.log(newStudentProgress);
  }
  catch(err){
    console.error(err);
  }
}

// Delete a student's progress 
const deleteStudentProgress = async(classid, name) => {
  const progressCollect = getProgressClass(classid);
  try{
    const q = query(progressCollect, where('name', '==', name));
    const snapshot = await getDocs(q);
    snapshot.forEach((doc) => {
      deleteDoc(doc.ref);
    })
  }
  catch(err){
    console.error(err);
  }
}

// Update a student's progress using their name
const updateStudentProgress = async(classid, name) => {
  const progressCollect = getProgressClass(classid);
  try{
    const q = query(progressCollect, where('name', '==', name));
    const snapshot = await getDocs(q);

    const totalLessons = 36;
    let percentage = 0;

    snapshot.forEach(async (doc) => {
      var data = doc.data();
      
      // get new percentage (0%-99%)
      if(data.currentModule === 1){
        percentage = (data.currentLesson - 1) / totalLessons;
        percentage = Math.round(percentage * 100);
      }
      else if(data.currentModule === 2){
        percentage = ((12 + data.currentLesson) - 1) / totalLessons;
        percentage = Math.round(percentage * 100);
      }
      else if(data.currentModule === 3){
        percentage = ((21 + data.currentLesson) - 1) / totalLessons;
        percentage = Math.round(percentage * 100);
      }
      else if(data.currentModule === 4){
        percentage = ((25 + data.currentLesson) - 1) / totalLessons;
        percentage = Math.round(percentage * 100);
      }
      else{
        percentage = ((31 + data.currentLesson) - 1) / totalLessons;
        percentage = Math.round(percentage * 100);
      }

      // get new percentage (100%)
      if(data.currentModule === 5 && data.currentLesson === 5){
        percentage = 100;
      }

      // update document
      await updateDoc(doc.ref, {
        percentage: percentage
      });

    })
  }
  catch(err){
    console.error(err);
  }
}

// Update a student's current module and lesson - OnClick
const updateCurrentModuleandLesson = async(classid, name) => {
  const progressCollect = getProgressClass(classid);
  try{
    const q = query(progressCollect, where('name', '==', name));
    const snapshot = await getDocs(q);

    let lesson = 0;
    let module = 0;

    snapshot.forEach(async (doc) => {
      var data = doc.data();
      var docRef = doc.ref;

      if(data.currentModule === 1){
        if(data.currentLesson < 12){
          module = 1;
          lesson = data.currentLesson + 1;
        }
        else{
          module = data.currentModule + 1;
          lesson = 1;
        }
      }
      else if(data.currentModule === 2){
        if(data.currentLesson < 9){
          module = 2;
          lesson = data.currentLesson + 1;
        }
        else{
          module = data.currentModule + 1;
          lesson = 1;
        }
      }
      else if(data.currentModule === 3){
        if(data.currentLesson < 4){
          module = 3;
          lesson = data.currentLesson + 1;

        }
        else{
          module = data.currentModule + 1;
          lesson = 1;
        }
      }
      else if(data.currentModule === 4){
        if(data.currentLesson < 6){
          module = 4;
          lesson = data.currentLesson + 1;
        }
        else{
          module = data.currentModule + 1;
          lesson = 1;
        }
      }
      else{
        if(data.currentLesson < 5){
          module = 5;
          lesson = data.currentLesson + 1;
        }
        else{
          module = data.currentModule + 1;
          lesson = 1;
        }
      }

      // update document
      await updateDoc(docRef, {
        currentModule: module,
        currentLesson: lesson
      })
      
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
  updateUserProfile,
  googleSignIn,
  loginWithEmail,
  resetPassword,
  verifyEmail,
  logout,
  addClass,
  deleteClass,
  addStudent,
  deleteStudent,
  createStudentProgress,
  deleteStudentProgress,
  updateStudentProgress,
  updateCurrentModuleandLesson
};
export default app;