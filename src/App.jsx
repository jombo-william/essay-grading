import { useState } from 'react';
import LoginPage from './LoginPage.jsx';
import PendingTab from "./teacher/pendingTab.jsx";
import StudentsTab from "./teacher/studentsTab.jsx";
import StudentDashboard from './StudentDashboard.jsx';

export default function App() {
  const [role, setRole] = useState(null);
  const [teacherTab, setTeacherTab] = useState('pending');

  if (!role) {
    return <LoginPage onSelect={setRole} />;
  }

  if (role === 'student') {
    return <StudentDashboard />;
  }

  if (role === 'teacher') {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setTeacherTab('pending')} style={{ padding: '10px', background: teacherTab === 'pending' ? '#6366f1' : '#f1f5f9', color: teacherTab === 'pending' ? '#fff' : '#000' }}>
              Pending Essays
            </button>
            <button onClick={() => setTeacherTab('students')} style={{ padding: '10px', background: teacherTab === 'students' ? '#6366f1' : '#f1f5f9', color: teacherTab === 'students' ? '#fff' : '#000' }}>
              Students Overview
            </button>
          </div>
          <button onClick={() => setRole(null)} style={{ padding: '10px', background: '#dc2626', color: '#fff' }}>
            Logout
          </button>
        </div>
        {teacherTab === 'pending' && <PendingTab />}
        {teacherTab === 'students' && <StudentsTab />}
      </div>
    );
  }

  return null;
}