import { useState, useEffect } from "react";
import { apiFetch } from "../api.js";
import CreateQuizMoodle from "./CreateQuizMoodle.jsx";

export default function QuizzesTab({ selectedClass, showToast, moodleToken, moodleSiteUrl, moodleCourses, moodleConnected }) {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizResults, setQuizResults] = useState(null);
  const [moodleCoursesList, setMoodleCoursesList] = useState(moodleCourses || []);

  // Fetch quizzes from backend
  const fetchQuizzes = async () => {
    if (!moodleConnected || !moodleToken) {
      // Still show locally created quizzes even if not connected to Moodle
      try {
        const response = await apiFetch('/api/teacher/moodle/quizzes', {
          params: { moodle_token: 'dummy', site_url: moodleSiteUrl || '' }
        });
        if (response.success) {
          setQuizzes(response.quizzes || []);
        }
      } catch (error) {
        console.error("Failed to fetch quizzes:", error);
      }
      return;
    }
    
    setLoading(true);
    try {
      const response = await apiFetch('/api/teacher/moodle/quizzes', {
        params: { 
          moodle_token: moodleToken,
          site_url: moodleSiteUrl
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
    setQuizzes([newQuiz.quiz, ...quizzes]);
    setShowCreateModal(false);
    fetchQuizzes();
    showToast(`✅ Quiz "${newQuiz.quiz.title}" created successfully!`, "success");
  };

  const viewQuizResults = async (quizId) => {
    if (!moodleToken) {
      showToast("Please connect to Moodle to view results", "error");
      return;
    }
    try {
      const response = await apiFetch(`/api/teacher/moodle/quiz-results/${quizId}`, {
        params: { moodle_token: moodleToken }
      });
      setQuizResults(response);
      setSelectedQuiz(quizId);
    } catch (error) {
      showToast(error.message || "Failed to fetch results", "error");
    }
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
      transition: 'all 0.2s',
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
            ⚠️ Not connected to Moodle. Quizzes will be saved locally only. 
            Connect in the Integrations tab to sync with Moodle.
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
                    <span style={{ ...styles.badge, background: '#fed7aa', color: '#92400e' }}>📝 Local</span>
                  )}
                </div>
                <div style={styles.quizMeta}>
                  📊 {quiz.question_count || 0} questions • 
                  🕐 {quiz.time_limit_minutes ? `${quiz.time_limit_minutes} min` : 'No time limit'} • 
                  📅 Created {quiz.created_at ? new Date(quiz.created_at).toLocaleDateString() : 'Recently'}
                </div>
              </div>
              <button style={styles.viewButton} onClick={() => viewQuizResults(quiz.id)}>
                View Results
              </button>
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
        moodleCourses={moodleCoursesList}
        showToast={showToast}
      />

      {quizResults && (
        <div style={{ marginTop: '24px', padding: '16px', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h4 style={{ margin: 0, color: '#16a34a' }}>📊 Quiz Results</h4>
            <button onClick={() => setSelectedQuiz(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>×</button>
          </div>
          <pre style={{ overflow: 'auto', fontSize: '12px' }}>{JSON.stringify(quizResults, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
