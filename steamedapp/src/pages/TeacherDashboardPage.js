import React, { useState, useEffect } from 'react';
import TeacherDashboard from '../components/teacherDashboard';
import { db } from '../firebase/config';
import { mockTeacherData } from '../utils/debugTeacherData';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  arrayRemove, 
  arrayUnion,
  deleteDoc, 
  query,
  where,
  addDoc
} from 'firebase/firestore';

// useMockData for testing and debuggin purposes, delete later
const TeacherDashboardPage = ({ useMockData = false }) => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Mock teacher ID - Replace with actual auth user ID in production
  const teacherId = "teacher123";

  // Load data on component mount
  useEffect(() => {
      // *** DEBUG ***
      if (useMockData) {
        const timer = setTimeout(() => {
          setClasses(mockTeacherData.classes);
          setLoading(false);
        }, 800);
        
        return () => clearTimeout(timer);
      }
    }, [teacherId, useMockData]);

  // Delete a student from the class and firebase
  const handleStudentDelete = async (studentId, classId) => {
    try {
      if (useMockData) {
        // Just update local state for mock data
        setClasses(prevClasses => 
          prevClasses.map(classItem => {
            if (classItem.id === classId) {
              return {
                ...classItem,
                students: classItem.students.filter(student => student.id !== studentId)
              };
            }
            return classItem;
          })
        );
      } 
      // Feedback
      alert('Student deleted successfully');
    } catch (err) {
      console.error('Error deleting student:', err);
      alert('Failed to delete student. Please try again.');
    }
  };

  // Create a new class for this teacher
  const handleClassCreate = async (className) => {
    try {
      if (useMockData) {
        // Create a class with unique ID
        const newClass = {
          id: `class${Date.now()}`,
          name: className,
          students: []
        };
        
        setClasses(prevClasses => [...prevClasses, newClass]);
      }
      // Feedback
      alert('Class created successfully');
    } catch (err) {
      console.error('Error creating class:', err);
      alert('Failed to create class. Please try again.');
    }
  };

  // Rename a exissting class
  const handleClassRename = async (classId, newName) => {
    try {
      if (useMockData) {
        // Just update local state for mock data
        setClasses(prevClasses => 
          prevClasses.map(classItem => {
            if (classItem.id === classId) {
              return {
                ...classItem,
                name: newName
              };
            }
            return classItem;
          })
        );
      }
      // Feedback
      alert('Class renamed successfully');
    } catch (err) {
      console.error('Error renaming class:', err);
      alert('Failed to rename class. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#201E1E' }}>
        <div className="text-white text-xl">Loading classes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#201E1E' }}>
        <div className="text-red-400 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <TeacherDashboard 
      teacherClasses={classes}
      onStudentDelete={handleStudentDelete}
      onClassCreate={handleClassCreate}
      onClassRename={handleClassRename}
    />
  );
};

export default TeacherDashboardPage;