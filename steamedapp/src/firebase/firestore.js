import { db } from './config';
import { 
  addDoc, 
  deleteDoc, 
  setDoc, 
  updateDoc, 
  getDocs,
  doc, 
  collection, 
  query, 
  where,
  writeBatch,
  getDoc,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';

export const firestoreService = {
  createClassCode: () => {
    return Math.floor(Math.random() * 1000000);
  },

  addClass: async (name, studentlist) => {
    try {
      const code = firestoreService.createClassCode();
      const newClass = await addDoc(collection(db, 'class'), {
        classCode: code,
        className: name,
        students: studentlist,
        createdAt: new Date().toISOString()
      });
      return newClass;
    } catch (err) {
      console.error('Add class error:', err);
      throw err;
    }
  },

  deleteClass: async (id) => {
    try {
      await deleteDoc(doc(db, 'class', id));
    } catch (err) {
      console.error('Delete class error:', err);
      throw err;
    }
  },

  addStudent: async (name, students, id) => {
    try {
      students.push(name);
      await setDoc(doc(db, 'class', id), { students });
    } catch (err) {
      console.error('Add student error:', err);
      throw err;
    }
  },

  deleteStudent: async (name, students, id) => {
    const updatedStudents = students.filter(student => student !== name);
    try {
      await setDoc(doc(db, 'class', id), { students: updatedStudents });
    } catch (err) {
      console.error('Delete student error:', err);
      throw err;
    }
  },

  createStudentProgress: async (classid, studentName, moduleNum, lessonNum) => {
    const progressCollect = collection(doc(db, 'class', classid), 'studentProgress');
    try {
      const newStudentProgress = await addDoc(progressCollect, {
        currentModule: moduleNum,
        currentLesson: lessonNum,
        name: studentName,
        percentage: 0
      });
      return newStudentProgress;
    } catch (err) {
      console.error('Create student progress error:', err);
      throw err;
    }
  },

  deleteStudentProgress: async (classid, name) => {
    const progressCollect = collection(doc(db, 'class', classid), 'studentProgress');
    try {
      const q = query(progressCollect, where('name', '==', name));
      const snapshot = await getDocs(q);
      snapshot.forEach(doc => deleteDoc(doc.ref));
    } catch (err) {
      console.error('Delete student progress error:', err);
      throw err;
    }
  },

  updateStudentProgress: async (classid, name) => {
    const progressCollect = collection(doc(db, 'class', classid), 'studentProgress');
    try {
      const q = query(progressCollect, where('name', '==', name));
      const snapshot = await getDocs(q);

      snapshot.forEach(async doc => {
        const data = doc.data();
        const percentage = progressService.calculateProgress(data.currentModule, data.currentLesson);
        await updateDoc(doc.ref, { percentage });
      });
    } catch (err) {
      console.error('Update student progress error:', err);
      throw err;
    }
  },

  updateCurrentModuleAndLesson: async (classid, name) => {
    const progressCollect = collection(doc(db, 'class', classid), 'studentProgress');
    try {
      const q = query(progressCollect, where('name', '==', name));
      const snapshot = await getDocs(q);

      snapshot.forEach(async doc => {
        const data = doc.data();
        const { module, lesson } = progressService.getNextLesson(data.currentModule, data.currentLesson);
        await updateDoc(doc.ref, { currentModule: module, currentLesson: lesson });
      });
    } catch (err) {
      console.error('Update current module and lesson error:', err);
      throw err;
    }
  }
};

export const batchOperations = {
  updateMultipleStudents: async (classId, updates) => {
    const batch = writeBatch(db);
    
    updates.forEach(({ studentId, data }) => {
      const ref = doc(db, 'class', classId, 'studentProgress', studentId);
      batch.update(ref, data);
    });
    
    await batch.commit();
  }
};

export const classManagementService = {
  // Generate a unique 6-digit class code
  generateClassCode: async () => {
    while (true) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      // Check if code already exists
      const query = query(collection(db, 'class'), where('classCode', '==', code));
      const docs = await getDocs(query);
      if (docs.empty) return code;
    }
  },

  // Create a new class
  createClass: async (teacherId, className) => {
    try {
      const classCode = await classManagementService.generateClassCode();
      const classRef = await addDoc(collection(db, 'class'), {
        teacherId,
        className,
        classCode,
        students: [],
        createdAt: new Date().toISOString()
      });

      // Add class to teacher's classes array
      const teacherRef = doc(db, 'users', teacherId);
      await updateDoc(teacherRef, {
        classes: arrayUnion(classRef.id)
      });

      return { id: classRef.id, classCode };
    } catch (err) {
      console.error('Create class error:', err);
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
      const classRef = doc(db, 'class', classDoc.id);

      // Add student to class
      await updateDoc(classRef, {
        students: arrayUnion(studentId)
      });

      // Add class to student's classes
      const studentRef = doc(db, 'users', studentId);
      await updateDoc(studentRef, {
        enrolledClasses: arrayUnion(classDoc.id)
      });

      return classDoc.id;
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
      
      // Get student details
      const studentPromises = classData.students.map(studentId => 
        getDoc(doc(db, 'users', studentId))
      );
      const studentDocs = await Promise.all(studentPromises);
      
      const students = studentDocs.map(doc => ({
        id: doc.id,
        name: doc.data().displayName,
        email: doc.data().email
      }));

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

  // Remove student from class
  removeStudentFromClass: async (classId, studentId) => {
    try {
      const batch = writeBatch(db);
      
      // Remove from class
      const classRef = doc(db, 'class', classId);
      batch.update(classRef, {
        students: arrayRemove(studentId)
      });

      // Remove from student's enrolled classes
      const studentRef = doc(db, 'users', studentId);
      batch.update(studentRef, {
        enrolledClasses: arrayRemove(classId)
      });

      await batch.commit();
    } catch (err) {
      console.error('Remove student error:', err);
      throw err;
    }
  }
};