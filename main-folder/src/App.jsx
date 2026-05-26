import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LandingPage      from './componets/auth/landingPage.jsx';
import LoginPage        from './componets/auth/LoginPage.jsx';
import ClassSelector    from './componets/teacher/ClassSelector.jsx';
import TeacherDashboard from './componets/teacher/TeacherDashboard.jsx';
import StudentDashboard from './componets/student/StudentDashboard.jsx';

function TeacherRoute() {
  const [user] = useState(() =>
    JSON.parse(localStorage.getItem('user') || 'null')
  );
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);

  // Fetch classes for the teacher
  useEffect(() => {
    if (user && user.role === 'teacher') {
      // Try to get classes from localStorage or API
      const savedClasses = localStorage.getItem('teacher_classes');
      if (savedClasses) {
        setClasses(JSON.parse(savedClasses));
      } else {
        // Set mock classes for demo
        const mockClasses = [
          { id: 1, name: "Form 4A", subject: "English Literature", total_students: 45, section: "A" },
          { id: 2, name: "Form 4B", subject: "English Literature", total_students: 42, section: "B" },
          { id: 3, name: "Form 3A", subject: "English Language", total_students: 48, section: "A" },
        ];
        setClasses(mockClasses);
        localStorage.setItem('teacher_classes', JSON.stringify(mockClasses));
      }
    }
  }, [user]);

  if (!user || user.role !== 'teacher') {
    return <Navigate to="/" replace />;
  }

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/';
  };

  const handleSelectClass = (cls) => {
    setSelectedClass(cls);
  };

  const handleChangeClass = () => {
    setSelectedClass(null);
  };

  if (!selectedClass) {
    return (
      <ClassSelector
        user={user}
        classes={classes}
        onSelectClass={handleSelectClass}
        onBack={handleLogout}
      />
    );
  }

  return (
    <TeacherDashboard
      user={user}
      classes={classes}
      selectedClass={selectedClass}
      onSelectClass={handleSelectClass}
      onLogout={handleLogout}
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