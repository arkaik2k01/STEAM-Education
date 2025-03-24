import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentDashboardPage from './pages/StudentDashboardPage';
import ModulePage from './pages/ModulePage';
import TeacherDashboardPage from './pages/TeacherDashboardPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StudentDashboardPage />} />
        <Route path="/dashboard" element={<StudentDashboardPage />} />
        <Route path="/module/:moduleId" element={<ModulePage />} />
        <Route path="/teacher" element={<TeacherDashboardPage useMockData={true} />} />
        {/* Missing: login, register */}
      </Routes>
    </Router>
  );
}

export default App;
