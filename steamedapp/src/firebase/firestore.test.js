import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';

// Firebase configuration for production
const firebaseConfig = {
  apiKey: "AIzaSyD4JfnpMGf6YWFz3CltBhhYzyI4fRDTbuM",
  authDomain: "steameducation-b1b03.firebaseapp.com",
  projectId: "steameducation-b1b03",
  storageBucket: "steameducation-b1b03.firebasestorage.app",
  messagingSenderId: "104577670307",
  appId: "1:104577670307:web:5b82417067bb5b9ae63316",
  measurementId: "G-200FHB1HCH"
};

describe('Firestore Live DB Tests', () => {
  let db;

  beforeAll(() => {
    // Initialize Firebase app
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  });

  test('Can write and read from live Firestore', async () => {
    // Test data
    const testData = {
      name: 'Live Test Class',
      createdAt: new Date(),
    };

    // Add document to collection
    const docRef = await addDoc(collection(db, 'test_classes'), testData);
    expect(docRef.id).toBeDefined();

    // Read documents from collection
    const querySnapshot = await getDocs(collection(db, 'test_classes'));
    const documents = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });

    // Verify data was written
    expect(documents.length).toBeGreaterThan(0);
    expect(documents.some(doc => doc.name === testData.name)).toBe(true);

    // Cleanup: Delete the test document
    await deleteDoc(doc(db, 'test_classes', docRef.id));
  });
}); 