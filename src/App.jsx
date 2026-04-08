import { useState } from 'react';
import LandingPage from './Student/landingPage.jsx';
import LoginPage from './Student/LoginPage.jsx';
import ForgotPasswordPage from './Student/ForgotPasswordPage';
import TeacherDashboard from './componets/teacher/TeacherDashboard.jsx';
import StudentDashboard from './componets/student/StudentDashboard.jsx';

export default function App() {
  const [page, setPage] = useState('landing');
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);

  const handleSelect = (selectedRole, userData) => {
    setRole(selectedRole);
    setUser(userData);
    setPage('dashboard');
  };

  const handleBack = () => {
    setRole(null);
    setUser(null);
    setPage('landing');
    sessionStorage.clear();
  };

  const handleLoginClick = () => {
    setPage('login');
  };

  const handleForgotPasswordClick = () => {
    setPage('forgot-password');
  };

  const handleBackToLogin = () => {
    setPage('login');
  };

  // Landing Page
  if (page === 'landing') {
    return <LandingPage onLogin={handleLoginClick} />;
  }

  // Login Page
  if (page === 'login') {
    return <LoginPage onSelect={handleSelect} onForgotPassword={handleForgotPasswordClick} />;
  }

  // Forgot Password Page
  if (page === 'forgot-password') {
    return <ForgotPasswordPage onBackToLogin={handleBackToLogin} />;
  }

  // Dashboard Pages
  if (role === 'teacher') {
    return <TeacherDashboard user={user} onBack={handleBack} />;
  }

  // Default to Student Dashboard
  return <StudentDashboard user={user} onBack={handleBack} />;
}