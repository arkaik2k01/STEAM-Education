import React, { useEffect, useState } from 'react';
import { auth, db, updateUserProfile } from '../DatabaseFunctions/firebase.js';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const StudentAccount = () => {
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [progress, setProgress] = useState(null);

  const [newDisplayName, setNewDisplayName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPhotoURL, setNewPhotoURL] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    // Check if new password and confirm password match
    if (newPassword !== confirmNewPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      // Call updateUserProfile function to update the profile
      await updateUserProfile(newDisplayName, newEmail, newPassword, newPhotoURL);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!auth.currentUser) return;
      const user = auth.currentUser;
      setStudent(user);
      
      try {
        const q = query(collection(db, 'class'), where('students', 'array-contains', user.displayName));
        const classSnapshot = await getDocs(q);
        
        classSnapshot.forEach(async (classDoc) => {
          const progressRef = collection(classDoc.ref, 'studentProgress');
          const progressQuery = query(progressRef, where('name', '==', user.displayName));
          const progressSnapshot = await getDocs(progressQuery);
          
          progressSnapshot.forEach((doc) => {
            setProgress(doc.data());
          });
        });
      } catch (err) {
        console.error("Error fetching student data: ", err);
      }
    };
    
    fetchStudentData();
  }, []);

  
  return (
    <div>
  <div className="flex flex-row justify-center relative">
    <div className="bg-gray-100 rounded-3xl w-[80%] h-[120px] mb-[-150px] mt-[50px] relative flex flex-row justify-center items-center">
      {/* Home Button - Positioned Absolutely to the Left */}
      <button 
        onClick={() => navigate('/dashboard')} 
        className="absolute left-0 ml-4 text-white text-xl bg-blue-600 px-4 py-2 rounded-full"
      >
        Home
      </button>

      {/* STEAM Education Title */}
      <div className="text-6xl font-extrabold text-black">
        STEAM Education
      </div>
    </div>
  </div>
      <div className="flex justify-between p-[40px] gap-[30px]">
        {/* Student Information Container */}
        <div className="bg-white rounded-lg p-[20px] flex flex-col items-left mt-[200px] mb-[150px] w-[600px] gap-[10px]">
          <h1 className="text-3xl font-bold text-black">Class Name: </h1>
          <p className="text-2xl"><strong>Teacher:</strong></p>
          <h1 className="text-3xl font-bold text-black mt-[50px]">Student Account</h1>
          {student ? (
            <div className="text-2xl flex flex-col justify-between gap-[20px] mt-[15px]">
              <p><strong>Display Name:</strong> {student.displayName}</p>
              <p><strong>Email:</strong> {student.email}</p>
            </div>
          ) : (
            <p>Loading student data...</p>
          )}
        </div>

        {/* Profile Update Form */}
        <div className="bg-white rounded-lg p-[20px] flex flex-col mt-[200px] mb-[150px] w-[600px]">
          <h2 className="text-3xl font-bold mb-4 flex justify-center">Update Profile</h2>
          <form onSubmit={handleProfileUpdate} className="flex flex-col">
            <div className="mb-4 flex flex-col justify-left">
              <label className="block text-black-700 text-xl font-bold mb-2" for="displayName">Display Name</label>
              <input
                type="text"
                id="displayName"
                value={newDisplayName}
                onChange={(e) => setNewDisplayName(e.target.value)}
                placeholder="Display name"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4 flex-col justify-left">
              <label className="block text-black-700 text-xl font-bold mb-2" for="email">Email</label>
              <input
                type="email"
                id="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Email"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-black-700 text-xl font-bold mb-2" for="password">Password</label>
              <input
                type="password"
                id="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-black-700 text-xl font-bold mb-2" for="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Confirm password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-black-700 text-xl font-bold mb-2" for="photo">Photo URL:</label>
              <input
                type="text"
                id="photo"
                value={newPhotoURL}
                onChange={(e) => setNewPhotoURL(e.target.value)}
                placeholder="Enter photo URL"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="flex flex-row justify-center">
            <button
              type="submit"
              className="w-[180px] h-[62px] bg-blue-600 text-white items-center rounded-full font-semibold text-lg cursor-pointer mt-4"
            >
              Update Profile
            </button>
            </div>
          </form>
        </div>

        {/* Progress Information Container */}
        <div className="bg-white rounded-lg p-[20px] flex flex-col items-center mt-[200px] mb-[150px] w-[600px]">
          <h1 className="text-3xl font-bold mb-4 flex justify-center">Module Progress</h1>
          {progress ? (
            <div>
              <p><strong>Current Module:</strong> {/* {progress.currentModule} */}</p>
              <p><strong>Current Lesson:</strong> {/* {progress.currentLesson} */}</p>
              <p><strong>Completion Percentage:</strong> {/* {progress.percentage}% */}</p>
            </div>
          ) : (
            <p>Loading progress data...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentAccount;