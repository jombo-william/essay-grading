import { useState, useEffect } from "react";
import { apiFetch } from "./api.js";
import CreateQuizMoodle from "./CreateQuizMoodle.jsx";

// Helper function to get token (same as api.js)
function getToken(cookieName, localKey) {
  const cookieMatch = document.cookie.match(
    new RegExp('(?:^|;\\s*)' + cookieName + '=([^;]+)')
  );
  if (cookieMatch) return decodeURIComponent(cookieMatch[1]);
  return sessionStorage.getItem(cookieName) 
      || sessionStorage.getItem(localKey)
      || localStorage.getItem(localKey) 
      || '';
}

export default function QuizzesTab({ selectedClass, showToast, moodleToken, moodleSiteUrl, moodleCourses, moodleConnected }) {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizDetails, setQuizDetails] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [syncQuizId, setSyncQuizId] = useState(null);
  const [syncCourseId, setSyncCourseId] = useState("");
  const [syncLoading, setSyncLoading] = useState(false);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const response = await apiFetch('/moodle/quizzes', {
        params: { 
          moodle_token: moodleToken || 'dummy',
          site_url: moodleSiteUrl || ''
        }
      });
      
      if (response.success) {
        setQuizzes(response.quizzes || []);
      }
    } catch (error) {
      console.error("Failed to fetch quizzes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [moodleConnected, moodleToken]);

  const handleQuizCreated = (newQuiz) => {
    fetchQuizzes();
    setShowCreateModal(false);
    showToast(`✅ Quiz created successfully!`, "success");
  };

  const viewQuizResults = async (quizId) => {
    setSelectedQuiz(quizId);
    setShowResults(true);
    try {
      const response = await apiFetch(`/moodle/quiz-results/${quizId}`, {
        params: { 
          moodle_token: moodleToken || '',
          site_url: moodleSiteUrl || ''
        }
      });
      setQuizDetails(response);
    } catch (error) {
      console.error("Failed to fetch results:", error);
      showToast(error.message || "Failed to fetch quiz results", "error");
    }
  };

  // Fixed export function - uses same token method as api.js
  const handleExportToMoodle = async (quizId, quizTitle) => {
    try {
      // Use the same token method as api.js
      const sessionToken = getToken('session_token', 'session_token');
      
      if (!sessionToken) {
        showToast('Not authenticated. Please log in again.', 'error');
        return;
      }
      
      const response = await fetch(`http://localhost:8000/api/teacher/moodle/export-quiz/${quizId}`, {
        headers: {
          'Authorization': `Bearer ${sessionToken}`
        }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `quiz_${quizId}_${quizTitle.replace(/[^a-z0-9]/gi, '_')}.xml`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        showToast('✅ Quiz exported to Moodle XML format!', 'success');
      } else if (response.status === 401) {
        showToast('Session expired. Please log in again.', 'error');
        // Optionally redirect to login
        window.location.href = '/login';
      } else {
        const error = await response.text();
        showToast(`Export failed: ${error}`, 'error');
      }
    } catch (error) {
      console.error('Export error:', error);
      showToast(error.message || 'Export failed', 'error');
    }
  };

  const handleSyncToMoodle = async () => {
    if (!syncCourseId) {
      showToast("Please select a Moodle course", "error");
      return;
    }
    
    setSyncLoading(true);
    try {
      const response = await apiFetch(`/moodle/sync-quiz/${syncQuizId}`, {
        method: 'POST',
        params: {
          moodle_course_id: parseInt(syncCourseId),
          moodle_token: moodleToken,
          site_url: moodleSiteUrl
        }
      });
      
      if (response.success) {
        showToast(response.message, "success");
        setShowSyncModal(false);
        fetchQuizzes();
      } else {
        showToast(response.message, "error");
      }
    } catch (error) {
      showToast(error.message || "Failed to sync quiz", "error");
    } finally {
      setSyncLoading(false);
      setSyncQuizId(null);
      setSyncCourseId("");
    }
  };

  const openSyncModal = (quizId) => {
    setSyncQuizId(quizId);
    setShowSyncModal(true);
  };

  const styles = {
    container: {
      background: '#fff',
      borderRadius: '18px',
      padding: '24px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 6px rgba(0,0,0,0.04)'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      flexWrap: 'wrap',
      gap: '12px'
    },
    title: {
      fontSize: '18px',
      fontWeight: '800',
      color: '#1e293b'
    },
    addButton: {
      padding: '10px 20px',
      background: 'linear-gradient(135deg,#10b981,#34d399)',
      color: '#fff',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      fontWeight: '700',
      fontSize: '13px'
    },
    quizCard: {
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '12px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: '#fafafa'
    },
    quizTitle: {
      fontWeight: '700',
      fontSize: '15px',
      color: '#1e293b',
      marginBottom: '5px'
    },
    quizMeta: {
      fontSize: '12px',
      color: '#64748b'
    },
    viewButton: {
      padding: '6px 14px',
      background: '#6366f1',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: '600',
      marginRight: '8px'
    },
    exportButton: {
      padding: '6px 14px',
      background: '#10b981',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: '600',
      marginRight: '8px'
    },
    syncButton: {
      padding: '6px 14px',
      background: '#f59e0b',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: '600'
    },
    badge: {
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: '12px',
      fontSize: '10px',
      fontWeight: '700',
      marginLeft: '8px'
    },
    emptyState: {
      textAlign: 'center',
      padding: '40px',
      color: '#94a3b8'
    },
    resultsModal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    },
    resultsContent: {
      backgroundColor: '#fff',
      borderRadius: '20px',
      maxWidth: '600px',
      width: '100%',
      maxHeight: '80vh',
      overflowY: 'auto',
      padding: '24px'
    },
    syncModal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    },
    syncContent: {
      backgroundColor: '#fff',
      borderRadius: '20px',
      maxWidth: '450px',
      width: '100%',
      padding: '24px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>📝 Quizzes & Exams</h3>
        <button style={styles.addButton} onClick={() => setShowCreateModal(true)}>
          + Create New Quiz
        </button>
      </div>

      {!moodleConnected && (
        <div style={{ background: '#fef3c7', padding: '12px', borderRadius: '10px', marginBottom: '20px' }}>
          <p style={{ margin: 0, fontSize: '13px', color: '#92400e' }}>
            ⚠️ Not connected to Moodle. Connect in the Integrations tab to sync quizzes.
          </p>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>⏳ Loading quizzes...</div>
      ) : quizzes.length === 0 ? (
        <div style={styles.emptyState}>
          <p style={{ fontSize: '14px', marginBottom: '10px' }}>📭 No quizzes yet</p>
          <p style={{ fontSize: '12px' }}>Click "Create New Quiz" to get started!</p>
        </div>
      ) : (
        <div>
          {quizzes.map((quiz) => (
            <div key={quiz.id} style={styles.quizCard}>
              <div>
                <div style={styles.quizTitle}>
                  {quiz.title}
                  {quiz.synced_to_moodle ? (
                    <span style={{ ...styles.badge, background: '#d1fae5', color: '#065f46' }}>✅ Synced</span>
                  ) : (
                    <span style={{ ...styles.badge, background: '#fed7aa', color: '#92400e' }}>📝 Local Only</span>
                  )}
                </div>
                <div style={styles.quizMeta}>
                  📊 {quiz.question_count || 0} questions • 
                  🕐 {quiz.time_limit_minutes ? `${quiz.time_limit_minutes} min` : 'No time limit'} • 
                  📅 {quiz.created_at ? new Date(quiz.created_at).toLocaleDateString() : 'Recently'}
                </div>
              </div>
              <div>
                <button style={styles.viewButton} onClick={() => viewQuizResults(quiz.id)}>View Results</button>
                <button style={styles.exportButton} onClick={() => handleExportToMoodle(quiz.id, quiz.title)}>📥 Export XML</button>
                {!quiz.synced_to_moodle && moodleConnected && (
                  <button style={styles.syncButton} onClick={() => openSyncModal(quiz.id)}>🔄 Sync to Moodle</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateQuizMoodle
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onQuizCreated={handleQuizCreated}
        moodleToken={moodleToken}
        moodleSiteUrl={moodleSiteUrl}
        moodleCourses={moodleCourses}
        showToast={showToast}
      />

      {showSyncModal && (
        <div style={styles.syncModal} onClick={() => setShowSyncModal(false)}>
          <div style={styles.syncContent} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0 }}>🔄 Sync Quiz to Moodle</h3>
              <button onClick={() => setShowSyncModal(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
            </div>
            
            <p style={{ marginBottom: '16px', fontSize: '13px', color: '#64748b' }}>
              Select a Moodle course to sync this quiz:
            </p>
            
            <select 
              value={syncCourseId} 
              onChange={(e) => setSyncCourseId(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                border: '1.5px solid #e2e8f0',
                fontSize: '14px',
                marginBottom: '20px',
                background: '#fff'
              }}
            >
              <option value="">Select a course...</option>
              {moodleCourses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.fullname || course.name}
                </option>
              ))}
            </select>
            
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowSyncModal(false)} style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleSyncToMoodle} disabled={syncLoading || !syncCourseId} style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: syncLoading || !syncCourseId ? '#94a3b8' : '#f59e0b', color: '#fff', cursor: syncLoading || !syncCourseId ? 'not-allowed' : 'pointer', fontWeight: '600' }}>
                {syncLoading ? "Syncing..." : "Sync to Moodle"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showResults && quizDetails && (
        <div style={styles.resultsModal} onClick={() => setShowResults(false)}>
          <div style={styles.resultsContent} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0 }}>📊 Quiz Results</h3>
              <button onClick={() => setShowResults(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <h4>{quizDetails.quiz?.title}</h4>
              <p style={{ fontSize: '13px', color: '#64748b' }}>{quizDetails.quiz?.description || 'No description'}</p>
              <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                <span style={{ fontSize: '12px' }}>📝 {quizDetails.quiz?.total_questions} questions</span>
              </div>
            </div>
            
            <div style={{ background: '#f0fdf4', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
              <p style={{ margin: 0, color: '#16a34a' }}>{quizDetails.message || 'No submissions yet'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
