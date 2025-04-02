import React, { useState, useEffect } from 'react';
import TeacherDashboard from '../components/teacherDashboard';
import PageHeader from '../components/PageHeader';
import { auth } from '../firebase/services/auth';
import { db } from '../firebase/config';
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
import { fetchAllModules } from '../firebase/services/moduleServer';

const TeacherDashboardPage = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get the current teacher's ID
  const teacherId = auth.currentUser ? auth.currentUser.uid : null;

  // Load data on component mount
  useEffect(() => {
    const fetchTeacherClasses = async () => {
      if (!teacherId) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Get teacher document to check if classes exist
        const teacherDocRef = doc(db, 'users', 'teachers', 'accounts', teacherId);
        const teacherDoc = await getDoc(teacherDocRef);
        
        if (!teacherDoc.exists()) {
          setError('Teacher account not found');
          setLoading(false);
          return;
        }
        
        // Get classes data
        const classesQuery = query(collection(db, 'class'), where('teacherId', '==', teacherId));
        const classesSnapshot = await getDocs(classesQuery);
        
        if (classesSnapshot.empty) {
          setClasses([]);
          setLoading(false);
          return;
        }
        
        // Fetch all modules to get their names
        const modulesList = await fetchAllModules();
        const moduleNames = modulesList.reduce((acc, module) => {
          // Map both by ID and title to handle both cases
          acc[module.id] = module.title;
          acc[module.title] = module.title; // Also map by title for backward compatibility
          return acc;
        }, {});
        
        // Process class data and fetch students for each class
        const classesData = [];
        
        for (const classDoc of classesSnapshot.docs) {
          const classData = classDoc.data();
          const studentIds = classData.students || [];
          const students = [];
          
          // Fetch student data for each student in the class
          for (const studentId of studentIds) {
            const studentDocRef = doc(db, 'users', 'students', 'accounts', studentId);
            const studentDoc = await getDoc(studentDocRef);
            
            if (studentDoc.exists() && !studentDoc.data().isDisabled) {
              const studentData = studentDoc.data();
              
              // Get student progress
              const progress = studentData.progress?.moduleProgress || {
                currentModule: null,
                currentLesson: null,
                completedModules: [],
                modules: {}
              };
              
              // Add student with progress and module names
              students.push({
                id: studentId,
                name: studentData.name || 'Unnamed Student',
                email: studentData.email || '',
                progress,
                moduleNames // Pass module names to the student object
              });
            }
          }
          
          // Add class with students to the classes array
          classesData.push({
            id: classDoc.id,
            name: classData.className || 'Unnamed Class',
            classCode: classData.classCode,
            students
          });
        }
        
        setClasses(classesData);
      } catch (err) {
        console.error('Error fetching teacher classes:', err);
        setError('Failed to load classes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherClasses();
  }, [teacherId]);

  // Delete a student from the class and firebase
  const handleStudentDelete = async (studentId, classId) => {
    try {
      // Update the class to remove the student
      const classRef = doc(db, 'class', classId);
      await updateDoc(classRef, {
        students: arrayRemove(studentId)
      });
      
      // Update the student document
      const studentRef = doc(db, 'users', 'students', 'accounts', studentId);
      await updateDoc(studentRef, {
        isDisabled: true,
        disabledAt: new Date(),
        enrolledClassId: null,
        previousClassId: classId,
        reason: 'Removed by teacher'
      });
      
      // Update local state
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
      // Generate a random 6-digit class code
      const classCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Create the class in Firestore
      const classRef = await addDoc(collection(db, 'class'), {
        teacherId,
        className,
        classCode,
        students: [],
        createdAt: new Date()
      });
      
      // Update teacher's classes array
      const teacherRef = doc(db, 'users', 'teachers', 'accounts', teacherId);
      await updateDoc(teacherRef, {
        classes: arrayUnion(classRef.id)
      });
      
      // Add the new class to local state with the class code
      setClasses(prevClasses => [
        ...prevClasses,
        {
          id: classRef.id,
          name: className,
          classCode: classCode, // Include the class code in the state
          students: []
        }
      ]);
      
      // Feedback
      alert('Class created successfully');
    } catch (err) {
      console.error('Error creating class:', err);
      alert('Failed to create class. Please try again.');
    }
  };

  // Rename a existing class
  const handleClassRename = async (classId, newName) => {
    try {
      // Update the class name in Firestore
      const classRef = doc(db, 'class', classId);
      await updateDoc(classRef, {
        className: newName
      });
      
      // Update local state
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
      
      // Feedback
      alert('Class renamed successfully');
    } catch (err) {
      console.error('Error renaming class:', err);
      alert('Failed to rename class. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#201E1E' }}>
        <PageHeader title="Teacher Dashboard" userRole="teacher" />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-white text-xl">Loading classes...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#201E1E' }}>
        <PageHeader title="Teacher Dashboard" userRole="teacher" />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-red-400 text-xl">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#201E1E' }}>
      <PageHeader title="Teacher Dashboard" userRole="teacher" />
      <TeacherDashboard 
        teacherClasses={classes}
        onStudentDelete={handleStudentDelete}
        onClassCreate={handleClassCreate}
        onClassRename={handleClassRename}
      />
    </div>
  );
};

export default TeacherDashboardPage;