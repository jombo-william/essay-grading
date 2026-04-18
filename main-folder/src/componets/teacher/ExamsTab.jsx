// src/componets/teacher/ExamsTab.jsx
import { useState, useEffect, useCallback } from "react";
import { btn } from "./shared.jsx";
import { apiFetch } from "./api.js";
import ExamCard        from "./ExamCard.jsx";
import CreateExamModal from "./CreateExamModal.jsx";

export default function ExamsTab({ selectedClass, showToast }) {
  const [exams,      setExams]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  // ── Fetch exams scoped to this class ───────────────────────────────────────
  const fetchExams = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const data = await apiFetch(`/exams?class_id=${selectedClass.id}`);
      setExams(data.exams || []);
    } catch (err) {
      const msg = err.message || "Failed to load exams.";
      setFetchError(msg);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  }, [selectedClass.id]);

  useEffect(() => { fetchExams(); }, [fetchExams]);

  const openEdit  = exam => setEditTarget(exam);
  const onSaved   = ()   => fetchExams();

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
      <div style={{
        width: "36px", height: "36px",
        border: "4px solid #bfdbfe", borderTopColor: "#3b82f6",
        borderRadius: "50%", animation: "spin 0.7s linear infinite",
      }} />
    </div>
  );

  return (
    <div>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <p style={{ fontSize: "20px", fontWeight: "800", color: "#1e293b", margin: 0 }}>
          Exams
          {exams.length > 0 && (
            <span style={{ marginLeft: "8px", fontSize: "13px", fontWeight: "700", color: "#94a3b8" }}>
              ({exams.length})
            </span>
          )}
        </p>
        <button style={btn.primary} onClick={() => setCreateOpen(true)}>
          + New Exam
        </button>
      </div>

      {/* ── Persistent fetch error ──────────────────────────────────────── */}
      {fetchError && (
        <div style={{
          background: "#fef2f2", border: "1px solid #fecaca",
          borderRadius: "14px", padding: "14px 18px", marginBottom: "16px",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px",
        }}>
          <p style={{ margin: 0, fontSize: "13px", fontWeight: "600", color: "#dc2626" }}>
            ⚠️ {fetchError}
          </p>
          <button onClick={fetchExams} style={{
            padding: "6px 14px", borderRadius: "8px", border: "none",
            background: "#dc2626", color: "#fff",
            fontSize: "12px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit",
          }}>
            Retry
          </button>
        </div>
      )}

      {/* ── Empty state ─────────────────────────────────────────────────── */}
      {!fetchError && exams.length === 0 && (
        <div style={{
          background: "#fff", borderRadius: "20px",
          border: "1px solid #e2e8f0", textAlign: "center",
          padding: "64px 24px", boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
        }}>
          <p style={{ fontSize: "48px", margin: "0 0 14px" }}>📝</p>
          <p style={{ fontWeight: "700", color: "#64748b", fontSize: "16px", margin: "0 0 6px" }}>
            No exams yet
          </p>
          <p style={{ fontSize: "13px", color: "#94a3b8", margin: "0 0 24px" }}>
            Create your first exam for {selectedClass.name}.
          </p>
          <button style={btn.primary} onClick={() => setCreateOpen(true)}>
            + Create First Exam
          </button>
        </div>
      )}

      {/* ── Exam list ───────────────────────────────────────────────────── */}
      {exams.map(exam => (
        <ExamCard key={exam.id} exam={exam} onEdit={openEdit} />
      ))}

      {/* ── Modals ──────────────────────────────────────────────────────── */}
      {createOpen && (
        <CreateExamModal
          selectedClass={selectedClass}
          onClose={() => setCreateOpen(false)}
          onSaved={onSaved}
          showToast={showToast}
        />
      )}
      {editTarget && (
        <CreateExamModal
          selectedClass={selectedClass}
          examToEdit={editTarget}
          onClose={() => setEditTarget(null)}
          onSaved={onSaved}
          showToast={showToast}
        />
      )}

    </div>
  );
}