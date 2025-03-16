import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentDashboardPage from './pages/StudentDashboardPage';
import ModulePage from './pages/ModulePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StudentDashboardPage />} />
        <Route path="/dashboard" element={<StudentDashboardPage />} />
        <Route path="/module/:moduleId" element={<ModulePage />} />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
