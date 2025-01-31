import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col relative justify-center">
      <div className="flex flex-row justify-center relative p-[50px]">
        <div className="bg-gray-100 rounded-3xl w-[80%] h-[120px] mb-[-50px] mt-[-50px] relative flex flex-row justify-center items-center">
          {/* Home Button - Positioned Absolutely to the Left */}
          <button 
            onClick={() => navigate('/dashboard')} 
            className="absolute left-0 ml-4 text-white text-xl bg-blue-600 px-4 py-2 rounded-full"
            
          >
            Home
          </button>
          <button className="absolute right-0 ml-4 text-white text-xl bg-blue-600 px-4 py-2 rounded-full" onClick={() => navigate('/student-account')}>Account</button>
          {/* STEAM Education Title */}
          <div className="text-6xl font-extrabold text-black">
            STEAM Education
          </div>
        </div>
      </div>
      </div>
  );
};

export default Dashboard;