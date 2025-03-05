import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  connectFirestoreEmulator 
} from 'firebase/firestore';

// Your Firebase config
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD4JfnpMGf6YWFz3CltBhhYzyI4fRDTbuM",
  authDomain: "steameducation-b1b03.firebaseapp.com",
  projectId: "steameducation-b1b03",
  storageBucket: "steameducation-b1b03.firebasestorage.app",
  messagingSenderId: "104577670307",
  appId: "1:104577670307:web:5b82417067bb5b9ae63316",
  measurementId: "G-200FHB1HCH"
};

async function testFirestore() {
  try {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    // Connect to emulator
    connectFirestoreEmulator(db, 'localhost', 8080);
    console.log('Connected to Firestore emulator');

    // Test writing data
    const testData = {
      name: 'Test Item',
      createdAt: new Date(),
      description: 'This is a test'
    };

    const docRef = await addDoc(collection(db, 'test_collection'), testData);
    console.log('Document written with ID:', docRef.id);

    // Test reading data
    const querySnapshot = await getDocs(collection(db, 'test_collection'));
    console.log('\nReading all documents:');
    querySnapshot.forEach((doc) => {
      console.log('Document ID:', doc.id);
      console.log('Document data:', doc.data());
    });

  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the test
testFirestore(); 