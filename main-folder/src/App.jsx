import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import LandingPage      from './componets/auth/landingPage.jsx';
import LoginPage        from './componets/auth/LoginPage.jsx';
import ClassSelector    from './componets/teacher/ClassSelector.jsx';
import TeacherDashboard from './componets/teacher/TeacherDashboard.jsx';
import StudentDashboard from './componets/student/StudentDashboard.jsx';

function TeacherRoute() {
  const [user] = useState(() =>
    JSON.parse(localStorage.getItem('user') || 'null')
  );

  const [selectedClass, setSelectedClass] = useState(null);
  const [classIndex,    setClassIndex]    = useState(0);

  if (!user || user.role !== 'teacher') {
    return <Navigate to="/" replace />;
  }

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/';
  };

  const handleSelectClass = (cls, idx = 0) => {
    setSelectedClass(cls);
    setClassIndex(idx);
  };

  const handleChangeClass = () => {
    setSelectedClass(null);
  };

  if (!selectedClass) {
    return (
      <ClassSelector
        user={user}
        onSelectClass={handleSelectClass}
        onBack={handleLogout}
      />
    );
  }

  return (
    <TeacherDashboard
      user={user}
      selectedClass={selectedClass}
      classIndex={classIndex}
      onBack={handleLogout}
      onChangeClass={handleChangeClass}
    />
  );
}

function StudentRoute() {
  const [user] = useState(() =>
    JSON.parse(localStorage.getItem('user') || 'null')
  );

  if (!user || user.role !== 'student') {
    return <Navigate to="/" replace />;
  }

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/';
  };

  return <StudentDashboard user={user} onBack={handleLogout} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                  element={<LandingPage />} />
        <Route path="/login"             element={<LoginPage />} />
        <Route path="/teacher-dashboard" element={<TeacherRoute />} />
        <Route path="/dashboard"         element={<StudentRoute />} />
      </Routes>
    </BrowserRouter>
  );
}
