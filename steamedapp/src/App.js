import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TeacherRegistration from './components/TeacherRegistration';
import StudentRegistration from './components/StudentRegistration';
import SignIn from './components/auth/SignIn';
import TeacherDashboard from './components/dashboard/TeacherDashboard';
import StudentDashboard from './components/dashboard/StudentDashboard';
import Home from './components/Home';
import Navigation from './components/Navigation';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navigation />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/register/teacher" element={<TeacherRegistration />} />
            <Route path="/register/student" element={<StudentRegistration />} />

            {/* Protected Routes */}
            <Route 
              path="/teacher-dashboard/*" 
              element={
                <ProtectedRoute role="teacher">
                  <TeacherDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student-dashboard/*" 
              element={
                <ProtectedRoute role="student">
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Catch all route for 404 */}
            <Route path="*" element={<div>Page not found</div>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;