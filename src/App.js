import React from 'react';
import {Routes, Route} from 'react-router-dom';
import './App.css';
import LoginRegister from './Components/LoginRegister/LoginRegister';
import Dashboard from './Components/LoginRegister/Dashboard';
import StudentAccount from './Components/AccountPages/StudentAccount';

function App() {
  return (
      <Routes>
          <Route path="/" element={<LoginRegister />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/student-account" element={<StudentAccount />} />
      </Routes>
  );
}

export default App;
