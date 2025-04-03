import { 
  collection, 
  addDoc, 
  deleteDoc, 
  setDoc, 
  updateDoc, 
  getDocs, 
  doc, 
  query, 
  where, 
  writeBatch, 
  getDoc, 
  arrayUnion, 
  arrayRemove, 
  serverTimestamp 
} from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';
import { db } from '../config';

// Class management service for handling class-related operations
export const classManagementService = {
  // Generate a unique 6-digit class code
  generateClassCode: async () => {
    while (true) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      // Check if code already exists
      const classQuery = query(collection(db, 'class'), where('classCode', '==', code));
      const docs = await getDocs(classQuery);
      if (docs.empty) return code;
    }
  },

  // Validate if a class code exists
  validateClassCode: async (classCode) => {
    try {
      const classQuery = query(collection(db, 'class'), where('classCode', '==', classCode));
      const classSnapshot = await getDocs(classQuery);
      
      // Return true if the class code exists, false otherwise
      return !classSnapshot.empty;
    } catch (error) {
      console.error('Error validating class code:', error);
      throw error;
    }
  },

  // Create a new class
  // Create a new class
  createClass: async (teacherId, className) => {
    try {
      // Generate class code
      const classCode = await classManagementService.generateClassCode();
      
      // Create the class document
      const classRef = await addDoc(collection(db, 'class'), {
        teacherId,
        className,
        classCode,
        students: [],
        createdAt: serverTimestamp()
      });

      // Check if teacher document exists before updating
      const teacherDocRef = doc(db, 'users', 'teachers', 'accounts', teacherId);
      const teacherDoc = await getDoc(teacherDocRef);
      
      if (teacherDoc.exists()) {
        // Update teacher's classes array
        await updateDoc(teacherDocRef, {
          classes: arrayUnion(classRef.id)
        });
      } else {
        console.warn(`Teacher document ${teacherId} does not exist. Cannot update classes array.`);
      }

      return { id: classRef.id, classCode };
    } catch (err) {
      console.error('Create class error:', err);
      throw err;
    }
  },

  // Delete a class
  deleteClass: async (classId, teacherId) => {
    try {
      // Get the class to check if teacher owns it
      const classDoc = await getDoc(doc(db, 'class', classId));
      if (!classDoc.exists()) {
        throw new Error('Class not found');
      }
      
      const classData = classDoc.data();
      if (classData.teacherId !== teacherId) {
        throw new Error('Not authorized to delete this class');
      }
      
      // Remove all students from the class first
      const students = classData.students || [];
      if (students.length > 0) {
        for (const studentId of students) {
          await classManagementService.removeStudentFromClass(classId, studentId);
        }
      }
      
      // Delete the class document
      await deleteDoc(doc(db, 'class', classId));
      
      // Remove class ID from teacher's classes array
      const teacherRef = doc(db, 'users', 'teachers', 'accounts', teacherId);
      await updateDoc(teacherRef, {
        classes: arrayRemove(classId)
      });
      
      return true;
    } catch (err) {
      console.error('Delete class error:', err);
      throw err;
    }
  },

  // Join a class using class code
  joinClass: async (classCode, studentId) => { 
    try {
      // Find class with code
      const classQuery = query(collection(db, 'class'), where('classCode', '==', classCode));
      const classSnapshot = await getDocs(classQuery);

      if (classSnapshot.empty) {
        throw new Error('Invalid class code');
      }

      const classDoc = classSnapshot.docs[0];
      const classId = classDoc.id;
      const classData = classDoc.data();
      const classRef = doc(db, 'class', classId);

      // Add student to class
      await updateDoc(classRef, {
        students: arrayUnion(studentId)
      });

      // Update student with class info
      const studentRef = doc(db, 'users', 'students', 'accounts', studentId);
      await updateDoc(studentRef, {
        enrolledClassId: classId,
        classCode: classCode,
        teacherId: classData.teacherId
      });

      return classId;
    } catch (err) {
      console.error('Join class error:', err);
      throw err;
    }
  },

  // Get all classes for a teacher
  getTeacherClasses: async (teacherId) => {
    try {
      const classQuery = query(collection(db, 'class'), where('teacherId', '==', teacherId));
      const snapshot = await getDocs(classQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (err) {
      console.error('Get teacher classes error:', err);
      throw err;
    }
  },

  // Get class details including student roster
  getClassDetails: async (classId) => {
    try {
      const classDoc = await getDoc(doc(db, 'class', classId));
      if (!classDoc.exists()) {
        throw new Error('Class not found');
      }

      const classData = classDoc.data();
      const studentIds = classData.students || [];
      
      if (studentIds.length === 0) {
        // Return class with empty students array if no students
        return {
          ...classData,
          id: classId,
          students: []
        };
      }
      
      // Get student details
      const studentPromises = studentIds.map(studentId => 
        getDoc(doc(db, 'users', 'students', 'accounts', studentId))
      );
      const studentDocs = await Promise.all(studentPromises);
      
      // Only include students that exist and are not disabled
      const students = studentDocs
        .filter(doc => doc.exists() && !doc.data().isDisabled)
        .map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            email: data.email,
            grade: data.grade || '',
            createdAt: data.createdAt ? new Date(data.createdAt.seconds * 1000) : new Date()
          };
        });

      return {
        ...classData,
        id: classId,
        students
      };
    } catch (err) {
      console.error('Get class details error:', err);
      throw err;
    }
  },

  // Remove student from class and mark account as disabled
  removeStudentFromClass: async (classId, studentId) => {
    try {
      const batch = writeBatch(db);
      
      // Remove from class
      const classRef = doc(db, 'class', classId);
      batch.update(classRef, {
        students: arrayRemove(studentId)
      });

      // Mark the student document as disabled rather than deleting it
      const studentRef = doc(db, 'users', 'students', 'accounts', studentId);
      batch.update(studentRef, {
        isDisabled: true,             // Mark as disabled
        disabledAt: serverTimestamp(),// When it was disabled
        enrolledClassId: null,        // Remove class association
        classCode: null,              // Remove class code
        previousClassId: classId,     // Store previous class for reference
        reason: 'Removed by teacher'  // Reason for disabling
      });

      await batch.commit();
      
      console.log(`Student ${studentId} removed from class ${classId} and marked as disabled`);
      return true;
    } catch (err) {
      console.error('Remove student error:', err);
      throw err;
    }
  },
  
  // Get a class by code
  getClassByCode: async (classCode) => {
    try {
      const classQuery = query(collection(db, 'class'), where('classCode', '==', classCode));
      const classSnapshot = await getDocs(classQuery);
      
      if (classSnapshot.empty) {
        return null;
      }
      
      const classDoc = classSnapshot.docs[0];
      return {
        id: classDoc.id,
        ...classDoc.data()
      };
    } catch (err) {
      console.error('Get class by code error:', err);
      throw err;
    }
  },

  // Get all students for a specific teacher
  getTeacherStudents: async (teacherId) => {
    try {
      // First get all classes for this teacher
      const classQuery = query(collection(db, 'class'), where('teacherId', '==', teacherId));
      const classSnapshot = await getDocs(classQuery);
      
      // If no classes, return empty array
      if (classSnapshot.empty) {
        return [];
      }
      
      // Collect all student IDs from all classes
      const studentIds = new Set();
      classSnapshot.forEach(doc => {
        const classData = doc.data();
        (classData.students || []).forEach(studentId => {
          studentIds.add(studentId);
        });
      });
      
      // If no students, return empty array
      if (studentIds.size === 0) {
        return [];
      }
      
      // Get student details from the students subcollection
      const students = [];
      for (const studentId of studentIds) {
        const studentDoc = await getDoc(doc(db, 'users', 'students', 'accounts', studentId));
        if (studentDoc.exists() && !studentDoc.data().isDisabled) {
          const data = studentDoc.data();
          students.push({
            id: studentDoc.id,
            name: data.name,
            email: data.email,
            grade: data.grade || '',
            classId: data.enrolledClassId,
            classCode: data.classCode
          });
        }
      }
      
      return students;
    } catch (err) {
      console.error('Get teacher students error:', err);
      throw err;
    }
  },

  // Rename a class
  renameClass: async (classId, teacherId, newName) => {
    try {
      // Get the class to check if teacher owns it
      const classDoc = await getDoc(doc(db, 'class', classId));
      if (!classDoc.exists()) {
        throw new Error('Class not found');
      }
      
      const classData = classDoc.data();
      if (classData.teacherId !== teacherId) {
        throw new Error('Not authorized to rename this class');
      }
      
      // Update the class name
      await updateDoc(doc(db, 'class', classId), {
        className: newName
      });
      
      return true;
    } catch (err) {
      console.error('Rename class error:', err);
      throw err;
    }
  },

  // Get all disabled student accounts for a teacher
  getDisabledStudentAccounts: async (teacherId) => {
    try {
      // Query for disabled students previously belonging to this teacher
      const studentsQuery = query(
        collection(db, 'users', 'students', 'accounts'),
        where('isDisabled', '==', true),
        where('teacherId', '==', teacherId)
      );
      
      const snapshot = await getDocs(studentsQuery);
      
      const disabledStudents = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          email: data.email,
          grade: data.grade || '',
          disabledAt: data.disabledAt ? new Date(data.disabledAt.seconds * 1000) : null,
          reason: data.reason,
          previousClassId: data.previousClassId
        };
      });
      
      return disabledStudents;
    } catch (err) {
      console.error('Get disabled students error:', err);
      throw err;
    }
  },

  // Check if a student account is disabled
  checkAccountStatus: async (userId) => {
    try {
      // Check if the user is a student
      const studentRef = doc(db, 'users', 'students', 'accounts', userId);
      const studentDoc = await getDoc(studentRef);
      
      if (studentDoc.exists()) {
        const data = studentDoc.data();
        
        // If the account is disabled, throw an error
        if (data.isDisabled) {
          throw new Error('Account has been disabled. Please contact your teacher or administrator.');
        }
      }
      
      return true;
    } catch (err) {
      console.error('Check account status error:', err);
      throw err;
    }
  }
};