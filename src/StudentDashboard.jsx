export default function StudentDashboard({ onLogout }) {
  return (
    <div style={{ minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif", background: '#f8fafc', padding: 20 }}>
      <header style={{ maxWidth: 960, margin: '0 auto 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22 }}>🎓 Student Dashboard</h1>
          <p style={{ margin: '6px 0 0', color: '#64748b' }}>Welcome back! Use the teacher login to manage essays.</p>
        </div>
        <button
          onClick={onLogout}
          style={{ padding: '10px 16px', border: 'none', borderRadius: 10, background: '#dc2626', color: '#fff', cursor: 'pointer', fontWeight: 700 }}
        >
          🚪 Logout
        </button>
      </header>

      <main style={{ maxWidth: 960, margin: '0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)', padding: 24 }}>
        <p style={{ color: '#334155', fontSize: 15, lineHeight: 1.6 }}>
          This is a placeholder student portal.
          Your submitted essays, grades, and AI feedback will appear here.
        </p>

        <ul style={{ marginTop: 14, paddingLeft: 20, color: '#475569' }}>
          <li>✅ View essay submission status</li>
          <li>✅ Get AI feedback on your writing</li>
          <li>✅ Review final scores</li>
          <li>✅ Resubmit before due date (future feature)</li>
        </ul>
      </main>
    </div>
  );
}
