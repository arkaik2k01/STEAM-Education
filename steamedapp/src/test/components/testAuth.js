import React from "react";

// Import your firebase auth and functions here !!!
import { signupWithEmail, loginWithEmail, addClass, deleteClass, addStudent, deleteStudent, createStudentProgress, deleteStudentProgress, updateStudentProgress, updateCurrentModuleandLesson } from '../../firebase.js';

export const TestAuth = () => {
  // Register user by email: WORKS
  const handleRegister = async () => {
    try {
      const displayName = 'Test User2';
      const email = "testuser2@example.com";
      const password = "password1234";
      const userCredential = await signupWithEmail(displayName, email, password);
      console.log("Registered User:", userCredential.displayName);
      alert("Registration successful!");
    } catch (error) {
      console.error("Registration Error:", error.message);
      alert("Could not register user!");
    }
  };

  // Login user with email: WORKS
  const handleLogin = async () => {
    try {
      const email = "testuser2@example.com";
      const password = "password1234";
      const userCredential = await loginWithEmail(email, password);
      console.log("Logged In User:", userCredential.displayName);
      alert("Login successful!");
    } catch (error) {
      console.error("Login Error:", error.message);
      alert("Could not login!");
    }
  };

  // Add class to collection: WORKS
  const handleAddClass = async () => {
    try{
      const name = 'Test Class';
      const students = [];
      const classCredential = await addClass(name, students);
      console.log('Class added: ', classCredential);
      alert('Class added successfully!');
    }
    catch(err){
      console.error(err);
      alert('Could not add class!');
    }
  };

  // Delete class by id: WORKS
  const handleDeleteClass = async () => {
    const id = 'QzGV549e9WyEWO2FBoqg';
    try{
      await deleteClass(id);
      alert('Class deleted successfully!');
    }
    catch(err){
      console.error(err);
    }
  };

  // Add a student by name and initialize student progress: WORKS
  const handleAddStudentandProgress = async () => {
    const id = 'PvweufFH3IDvb62iLVvF';
    const students = ['Kate Grimes', 'John Smith'];
    const name = 'Sam Jones';
    try{
      await addStudent(name, students, id);
      console.log('Student added successfully!');

      await createStudentProgress(
        id,
        name,
        1,
        1
      );
      alert('Student added and student progress created!');
    }
    catch(err){
      console.error(err);
    }
  }

  // Delete a student by name and, by extension, their progress: WORKS
  const handleDeleteStudentandProgress = async () => {
    const id = 'PvweufFH3IDvb62iLVvF';
    const students = ['Kate Grimes', 'John Smith', 'Sam Jones'];
    const name = 'Sam Jones';
    try{
      await deleteStudent(name, students, id);
      console.log('Student deleted successfully!');

      await deleteStudentProgress(id,name);
      alert('Student and student progress deleted!');
    }
    catch(err){
      console.error(err);
    }
  }

  // Updates a student's percentage of progress: WORKS
  const handleUpdateProgress = async () => {
    const id = 'PvweufFH3IDvb62iLVvF';
    const name = 'John Smith';
    try{
      await updateStudentProgress(id,name);
      alert(name + "'s progress has been updated!");
    }
    catch(err){
      console.error(err);
    }
  }

  // Updates a student's current module and lesson: WORKS
  const handleUpdateCurrentModuleandLesson = async () => {
    const id = 'PvweufFH3IDvb62iLVvF';
    const name = 'John Smith';
    try{
      await updateCurrentModuleandLesson(id,name);
      alert(name + "'s current module and lesson has been updated!");
    }
    catch(err){
      console.error(err);
    }
  }

  return (
    <div>
      <button onClick={handleRegister} style={{ padding: "10px 20px", margin: "10px" }}>
        Register
      </button>
      <button onClick={handleLogin} style={{ padding: "10px 20px", margin: "10px" }}>
        Login
      </button>
      <button onClick={handleAddClass} style={{ padding: "10px 20px", margin: "10px" }}>
        Add Class
      </button>
      <button onClick={handleDeleteClass} style={{ padding: "10px 20px", margin: "10px" }}>
        Delete Class
      </button>
      <button onClick={handleAddStudentandProgress} style={{ padding: "10px 20px", margin: "10px" }}>
        Add Student/Progress
      </button>
      <button onClick={handleDeleteStudentandProgress} style={{ padding: "10px 20px", margin: "10px" }}>
        Delete Student/Progress
      </button>
      <button onClick={handleUpdateProgress} style={{ padding: "10px 20px", margin: "10px" }}>
        Update Student Progress
      </button>
      <button onClick={handleUpdateCurrentModuleandLesson} style={{ padding: "10px 20px", margin: "10px" }}>
        Update Current Module and Lesson
      </button>
    </div>
  );
};