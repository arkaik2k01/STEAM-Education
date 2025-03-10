import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config';

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

// Fetch all modules in database and order them by ID
export const fetchAllModules = async () => {
  try {
    const modulesSnap = await getDocs(collection(db, 'modules'));
    const modules = [];

    for (const doc of modulesSnap.docs) {
      const moduleData = {
        id: doc.id,
        ...doc.data()
      };

      //Get sections subcollection
      const sectionsSnap = await getDocs(collection(db, 'modules', doc.id, 'sections'));
      const sections = [];

      sectionsSnap.forEach(sectionDoc => {
        sections.push({
          id: sectionDoc.id,
          ...sectionDoc.data(),
          isCompleted: false //PLACEHOLDER, save progress in cache
        });
      });

      //Get preAssesment subcollection
      const preAssessmentSnap = await getDocs(collection(db, 'modules', doc.id, 'preAssessment'));

      //Add preAssesment as a section at the top
      if(!preAssessmentSnap.empty) {
        sections.unshift({
          id: 'preAssessment',
          title: 'Pre-Assessment',
          order: -1,
          isCompleted: false //PLACEHOLDER, save progress in cache
        });
      }

      //Sort sections
      sections.sort((a, b) => (a.order || 0) - (b.order || 0));

      //Add module and its sections to the modules array
      modules.push({
        ...moduleData,
        sections
      });
    }

    //Finally, sort modules by their order field
    modules.sort((a, b) => (a.order || 0) - (b.order || 0));

    return modules;
  } catch (error) {
    console.error('Error fetching all modules:', error);
    throw error;
  }
};