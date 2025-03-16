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

    //Gather Pre-Assesment information
    const preAssessmentQuery = query(
      collection(db, 'modules', moduleId, 'preAssessment')
    );
    const preAssessmentSnap = await getDocs(preAssessmentQuery);
    let preAssessment = null;

    if (!preAssessmentSnap.empty) {
      const preAssessmentDoc = preAssessmentSnap.docs[0]; // Assuming there's just one document
      preAssessment = {
        id: preAssessmentDoc.id,
        ...preAssessmentDoc.data()
      };
    }

    // Fetch sections for this module
    const sectionsQuery = query(
      collection(db, 'modules', moduleId, 'sections')
    );

    const sectionsSnap = await getDocs(sectionsQuery);
    const sections = [];

    // Process each section
    for(const sectionDoc of sectionsSnap.docs) {
      const sectionData = {
        id: sectionDoc.id,
        ...sectionDoc.data()
      };

      const exercisesQuery = query(
        collection(db, 'modules', moduleId, 'sections', sectionDoc.id, 'exercises')
      );

      const exercisesSnap = await getDocs(exercisesQuery);
      const exercises = [];

      exercisesSnap.forEach((exerciseDoc) => {
        exercises.push({
          id: exerciseDoc.id,
          ...exerciseDoc.data()
        });
      });
      
      // Sort exercises if they have an order field
      exercises.sort((a, b) => (a.order || 0) - (b.order || 0));
      
      // Add exercises to section data
      sectionData.exercises = exercises;
      
      sections.push(sectionData);
    }

    // Sort sections by their order field
    sections.sort((a, b) => (a.order || 0) - (b.order || 0));

    return {
      id: moduleSnap.id,
      title: moduleData.title,
      description: moduleData.description,
      preAssessment,
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