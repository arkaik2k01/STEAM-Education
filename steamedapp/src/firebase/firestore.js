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
  writeBatch
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