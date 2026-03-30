import { useState } from 'react';
import LandingPage from './Student/landingPage.jsx';
import LoginPage from './Student/LoginPage.jsx';
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

//   if (page === 'landing') return <LandingPage onLogin={() => setPage('login')} />;
//   if (page === 'login')   return <LoginPage onSelect={handleSelect} />;
//   if (role === 'teacher') return <TeacherDashboard user={user} onBack={handleBack} />;
//   if (role === 'student') return <StudentDashboard user={user} onBack={handleBack} />;
// }



if (page === 'landing') return <LandingPage onLogin={() => setPage('login')} />;
if (page === 'login')   return <LoginPage onSelect={handleSelect} />;
if (role === 'teacher') return <TeacherDashboard user={user} onBack={handleBack} />;
return <StudentDashboard user={user} onBack={handleBack} />
}