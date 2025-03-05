import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from './config';

// Fetch a module by its ID
export const fetchModuleById = async (moduleId) => {
  try {
    // Fetch the module document
    const moduleRef = doc(db, 'modules', moduleId);
    const moduleSnap = await getDoc(moduleRef);
    
    if (!moduleSnap.exists()) {
      throw new Error(`Module with ID ${moduleId} not found`);
    }
    
    const moduleData = moduleSnap.data();
    
    // Fetch sections for this module
    const sectionsQuery = query(
      collection(db, 'sections'),
      where('moduleId', '==', moduleId)
    );
    
    const sectionsSnap = await getDocs(sectionsQuery);
    const sections = [];
    
    sectionsSnap.forEach((doc) => {
      sections.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Sort sections by their order field
    sections.sort((a, b) => (a.order || 0) - (b.order || 0));
    
    return {
      id: moduleSnap.id,
      title: moduleData.title,
      sections
    };
  } catch (error) {
    console.error('Error fetching module:', error);
    throw error;
  }
};

// Fetch all modules in database
export const fetchAllModules = async () => {
  try {
    const modulesSnap = await getDocs(collection(db, 'modules'));
    const modules = [];
    
    modulesSnap.forEach((doc) => {
      modules.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return modules;
  } catch (error) {
    console.error('Error fetching all modules:', error);
    throw error;
  }
};