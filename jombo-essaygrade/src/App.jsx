


// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { useState } from 'react';
// import LandingPage from './componets/auth/landingPage.jsx';
// import LoginPage from './componets/auth/LoginPage.jsx';
// import TeacherDashboard from './componets/teacher/TeacherDashboard.jsx';
// import StudentDashboard from './componets/student/StudentDashboard.jsx';

// function AppContent() {
//   const [user] = useState(() => 
//     JSON.parse(localStorage.getItem('user') || 'null')
//   );
  
//   const handleBack = () => {
//     localStorage.clear();
//     sessionStorage.clear();
//     window.location.href = '/';
//   };

//   return (
//     <Routes>
//       <Route path="/" element={<LandingPage />} />
//       <Route path="/login" element={<LoginPage />} />
//       <Route path="/teacher-dashboard" element={<TeacherDashboard user={user} onBack={handleBack} />} />
//       <Route path="/dashboard" element={<StudentDashboard user={user} onBack={handleBack} />} />
//     </Routes>
//   );
// }

// export default function App() {
//   return (
//     <BrowserRouter>
//       <AppContent />
//     </BrowserRouter>
//   );
// }



import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import LandingPage      from './componets/auth/landingPage.jsx';
import LoginPage        from './componets/auth/LoginPage.jsx';
import ClassSelector    from './componets/teacher/ClassSelector.jsx';
import TeacherDashboard from './componets/teacher/TeacherDashboard.jsx';
import StudentDashboard from './componets/student/StudentDashboard.jsx';

// ── Teacher flow wrapper ──────────────────────────────────────────────────────
// Sits at /teacher-dashboard and manages the two-step flow:
//   Step 1 → ClassSelector  (pick / create a class)
//   Step 2 → TeacherDashboard (scoped to that class)

function TeacherRoute() {
  const [user] = useState(() =>
    JSON.parse(localStorage.getItem('user') || 'null')
  );

  const [selectedClass, setSelectedClass] = useState(null);
  const [classIndex,    setClassIndex]    = useState(0);

  // Guard — if somehow a non-teacher lands here, send them home
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
    setSelectedClass(null);   // back to class selector
  };

  // Step 1 — no class chosen yet
  if (!selectedClass) {
    return (
      <ClassSelector
        user={user}
        onSelectClass={handleSelectClass}
        onBack={handleLogout}
      />
    );
  }

  // Step 2 — class chosen, enter the full dashboard
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

// ── Student route wrapper ─────────────────────────────────────────────────────

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

// ── Root app ──────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                   element={<LandingPage />} />
        <Route path="/login"              element={<LoginPage />} />
        <Route path="/teacher-dashboard"  element={<TeacherRoute />} />
        <Route path="/dashboard"          element={<StudentRoute />} />
      </Routes>
    </BrowserRouter>
  );
}