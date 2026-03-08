import { useState } from 'react';
import LoginPage from './LoginPage.jsx';
import TeacherDashboard from './TeacherDashboard.jsx';
import StudentDashboard from './StudentDashboard.jsx';

export default function App() {
  const [role, setRole] = useState(null); // null | 'teacher' | 'student'

  if (!role) return <LoginPage onSelect={setRole} />;
  if (role === 'teacher') return <TeacherDashboard onBack={() => setRole(null)} />;
  if (role === 'student') return <StudentDashboard onBack={() => setRole(null)} />;
}
