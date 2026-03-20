import { useState } from 'react';
import LoginPage from './LoginPage.jsx';
import PendingTab from "./teacher/pendingTab.jsx";
import StudentsTab from "./teacher/studentsTab.jsx";

export default function App() {
  const [role, setRole] = useState(null);
  const [teacherTab, setTeacherTab] = useState('pending');

  if (!role) {
    return <LoginPage onSelect={setRole} />;
  }

  if (role === 'student') {
    return <div style={{ padding: 40, textAlign: 'center' }}>Student dashboard coming soon.</div>;
  }

  if (role === 'teacher') {
    return (
      <div>
        {teacherTab === 'pending' && <PendingTab onLogout={() => setRole(null)} />}
        {teacherTab === 'students' && <StudentsTab onBack={() => setTeacherTab('pending')} />}

        {/* Tab switcher bar at the bottom */}
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          display: 'flex', justifyContent: 'center', gap: 10,
          padding: '12px 20px', background: '#fff',
          borderTop: '1px solid #e2e8f0', zIndex: 300
        }}>
          <button onClick={() => setTeacherTab('pending')} style={{
            padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer',
            background: teacherTab === 'pending' ? '#022aa4' : '#f1f5f9',
            color: teacherTab === 'pending' ? '#fff' : '#000', fontWeight: 700
          }}>
            📋 Pending Review
          </button>
          <button onClick={() => setTeacherTab('students')} style={{
            padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer',
            background: teacherTab === 'students' ? '#022aa4' : '#f1f5f9',
            color: teacherTab === 'students' ? '#fff' : '#000', fontWeight: 700
          }}>
            👥 Students
          </button>
          <button onClick={() => setRole(null)} style={{
            padding: '8px 20px', borderRadius: 8, border: 'none',
            cursor: 'pointer', background: '#dc2626', color: '#fff', fontWeight: 700
          }}>
            🚪 Logout
          </button>
        </div>
      </div>
    );
  }

  return null;
}