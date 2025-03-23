import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Import pages
import Homepage from './pages/Homepage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TeacherRegisterPage from './pages/TeacherRegisterPage';
import StudentRegisterPage from './pages/StudentRegisterPage';
import StudentDashboardPage from './pages/StudentDashboardPage';
import TeacherDashboardPage from './pages/TeacherDashboardPage';
import ModulePage from './pages/ModulePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import VerifyEmailPage from './pages/VerifyEmailPage';

// Loading component
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#201E1E' }}>
    <div className="text-white text-xl">Loading...</div>
  </div>
);

// Route guards with AuthContext
const RequireAuth = ({ children }) => {
  const { currentUser, loading, emailVerified } = useAuth();
  
  if (loading) return <LoadingScreen />;
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  if (!emailVerified) {
    return <Navigate to="/verify-email" replace />;
  }
  
  return children;
};

const RequireRole = ({ children, allowedRole }) => {
  const { currentUser, loading, emailVerified, userRole } = useAuth();
  
  if (loading) return <LoadingScreen />;
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  if (!emailVerified) {
    return <Navigate to="/verify-email" replace />;
  }
  
  if (userRole !== allowedRole) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

const RequireUnauth = ({ children }) => {
  const { currentUser, loading, emailVerified, userRole } = useAuth();
  
  if (loading) return <LoadingScreen />;
  
  if (currentUser) {
    if (!emailVerified) {
      return <Navigate to="/verify-email" replace />;
    }
    
    if (userRole === 'teacher') {
      return <Navigate to="/teacher-dashboard" replace />;
    }
    
    if (userRole === 'student') {
      return <Navigate to="/student-dashboard" replace />;
    }
    
    return <Navigate to="/" replace />;
  }
  
  return children;
};

const RequireVerification = ({ children }) => {
  const { currentUser, loading, emailVerified, userRole } = useAuth();
  
  if (loading) return <LoadingScreen />;
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  if (emailVerified) {
    if (userRole === 'teacher') {
      return <Navigate to="/teacher-dashboard" replace />;
    }
    
    if (userRole === 'student') {
      return <Navigate to="/student-dashboard" replace />;
    }
    
    return <Navigate to="/" replace />;
  }
  
  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Home Page - accessible to all */}
          <Route path="/" element={<Homepage />} />
          <Route path="/home" element={<Homepage />} />
          
          {/* Public routes - not for authenticated users */}
          <Route path="/login" element={<RequireUnauth><LoginPage /></RequireUnauth>} />
          <Route path="/register" element={<RequireUnauth><RegisterPage /></RequireUnauth>} />
          <Route path="/register/teacher" element={<RequireUnauth><TeacherRegisterPage /></RequireUnauth>} />
          <Route path="/register/student" element={<RequireUnauth><StudentRegisterPage /></RequireUnauth>} />
          <Route path="/forgot-password" element={<RequireUnauth><ForgotPasswordPage /></RequireUnauth>} />
          
          {/* Verification route - only for unverified users */}
          <Route path="/verify-email" element={<RequireVerification><VerifyEmailPage /></RequireVerification>} />
          
          {/* Teacher-only routes */}
          <Route 
            path="/teacher-dashboard" 
            element={<RequireRole allowedRole="teacher"><TeacherDashboardPage /></RequireRole>} 
          />
          
          {/* Student-only routes */}
          <Route 
            path="/student-dashboard" 
            element={<RequireRole allowedRole="student"><StudentDashboardPage /></RequireRole>} 
          />
          
          <Route 
            path="/module/:moduleId" 
            element={<RequireRole allowedRole="student"><ModulePage /></RequireRole>} 
          />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;