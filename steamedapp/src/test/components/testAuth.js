import React from "react";

// Import your firebase auth and functions here !!!
import { signupWithEmail, loginWithEmail, addClass, deleteClass, addStudent, deleteStudent } from '../../firebase.js';

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

  // Add a student by name: WORKS
  const handleAddStudent = async () => {
    const id = 'PvweufFH3IDvb62iLVvF';
    const students = ['Kate Grimes', 'John Smith'];
    const name = 'Sam Jones';
    try{
      await addStudent(name, students, id);
      alert('Student added successfully!');
    }
    catch(err){
      console.error(err);
    }
  }

  // Delete a student by name: WORKS
  const handleDeleteStudent = async () => {
    const id = 'PvweufFH3IDvb62iLVvF';
    const students = ['Kate Grimes', 'John Smith', 'Sam Jones'];
    const name = 'Sam Jones';
    try{
      await deleteStudent(name, students, id);
      alert('Student deleted successfully!');
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
      <button onClick={handleAddStudent} style={{ padding: "10px 20px", margin: "10px" }}>
        Add Student
      </button>
      <button onClick={handleDeleteStudent} style={{ padding: "10px 20px", margin: "10px" }}>
        Delete Student
      </button>
    </div>
  );
};