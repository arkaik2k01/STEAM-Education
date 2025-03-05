const { db } = require('../firebase/config');
const { collection, getDocs, doc, getDoc } = require('firebase/firestore');

const verifyContent = async () => {
  try {
    // Check modules
    const modulesSnapshot = await getDocs(collection(db, 'modules'));
    console.log('Modules:', modulesSnapshot.size);

    // Check each module
    for (const moduleDoc of modulesSnapshot.docs) {
      console.log('\nModule:', moduleDoc.data().title);

      // Check pre-assessment
      const preAssessmentDoc = await getDoc(doc(moduleDoc.ref, 'preAssessment', 'questions'));
      if (preAssessmentDoc.exists()) {
        console.log('Pre-assessment questions:', preAssessmentDoc.data().questions.length);
      }

      // Check sections
      const sectionsSnapshot = await getDocs(collection(moduleDoc.ref, 'sections'));
      console.log('Sections:', sectionsSnapshot.size);

      // Check each section
      for (const sectionDoc of sectionsSnapshot.docs) {
        console.log('\nSection:', sectionDoc.data().title);

        // Check exercises
        const exercisesSnapshot = await getDocs(collection(sectionDoc.ref, 'exercises'));
        console.log('Exercises:', exercisesSnapshot.size);

        // Log exercise details
        for (const exerciseDoc of exercisesSnapshot.docs) {
          const exerciseData = exerciseDoc.data();
          console.log(`- ${exerciseData.title} (${exerciseData.type})`);
          console.log(`  Items: ${exerciseData.items.length}`);
        }
      }
    }
  } catch (error) {
    console.error('Error verifying content:', error);
  }
};

// Run the verification
verifyContent(); 