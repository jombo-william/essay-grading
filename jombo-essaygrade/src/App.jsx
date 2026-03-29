


// C:\Users\BR\Desktop\final_p\jombo-essaygrade\src\App.jsx
import { useState } from 'react';
import LoginPage from './componets/auth/LoginPage.jsx';
import TeacherDashboard from './componets/teacher/TeacherDashboard.jsx';
import StudentDashboard from './componets/student/StudentDashboard.jsx';

export default function App() {
  const [role, setRole] = useState(null);   // null | 'teacher' | 'student'
  const [user, setUser] = useState(null);   // full user object from backend

  const handleSelect = (selectedRole, userData) => {
    setRole(selectedRole);
    setUser(userData);
  };

  const handleBack = () => {
    setRole(null);
    setUser(null);
    sessionStorage.clear();
  };

  if (!role) return <LoginPage onSelect={handleSelect} />;
  if (role === 'teacher') return <TeacherDashboard user={user} onBack={handleBack} />;
  if (role === 'student') return <StudentDashboard user={user} onBack={handleBack} />;
}

