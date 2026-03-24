// src/componets/teacher/AssignmentForm.jsx
import { useRef, useState } from "react";
import { inp, label } from "./shared.jsx";

const FILE_TYPES = [
  { label: "📄 PDF / Word", accept: ".pdf,.doc,.docx", bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" },
  { label: "🖼️ Image",      accept: "image/*",          bg: "#fdf4ff", color: "#9333ea", border: "#e9d5ff" },
  { label: "🎬 Video",      accept: "video/*",          bg: "#fff7ed", color: "#ea580c", border: "#fed7aa" },
  { label: "📎 Any File",   accept: "*",                bg: "#f8fafc", color: "#475569", border: "#e2e8f0" },
];

const API_BASE = "http://localhost:8080/api";

const loadPdfJs = () =>
  new Promise(resolve => {
    if (window.pdfjsLib) return resolve(window.pdfjsLib);
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    s.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      resolve(window.pdfjsLib);
    };
    document.head.appendChild(s);
  });

export default function AssignmentForm({ form, setForm, attachments, setAttachments, onAttachFile, assignmentId }) {
  const fileRef      = useRef();
  const refFileRef   = useRef();
  const rubricTotal  = Object.values(form.rubric || {}).reduce((a, b) => a + b, 0);

  const [refUploading, setRefUploading] = useState(false);
  const [refUploadMsg, setRefUploadMsg] = useState("");
  const [refFileName,  setRefFileName]  = useState("");

  const triggerUpload = (accept) => {
    fileRef.current.accept = accept;
    fileRef.current.click();
  };

  // ── Handle reference material file upload ─────────────────────────────────
  const handleRefFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setRefUploading(true);
    setRefFileName(file.name);
    setRefUploadMsg("📤 Reading file...");

    try {
      let extractedText = "";

      if (file.type === "text/plain") {
        // TXT — read directly
        extractedText = await file.text();

      } else if (file.type === "application/pdf") {
        // PDF — extract with pdf.js
        setRefUploadMsg("📄 Extracting text from PDF...");
        try {
          const pdfjsLib    = await loadPdfJs();
          const arrayBuffer = await file.arrayBuffer();
          const pdf         = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          let fullText = "";
          for (let i = 1; i <= pdf.numPages; i++) {
            const page    = await pdf.getPage(i);
            const content = await page.getTextContent();
            fullText += content.items.map(item => item.str).join(" ") + "\n";
          }
          extractedText = fullText.trim();
        } catch (pdfErr) {
          setRefUploadMsg(`❌ Could not extract PDF text: ${pdfErr.message}`);
          setTimeout(() => setRefUploadMsg(""), 4000);
          setRefUploading(false);
          e.target.value = "";
          return;
        }

      } else {
        // Other files — try reading as text
        try {
          extractedText = await file.text();
        } catch {
          setRefUploadMsg("❌ Could not read this file type. Please use PDF or TXT.");
          setTimeout(() => setRefUploadMsg(""), 4000);
          setRefUploading(false);
          e.target.value = "";
          return;
        }
      }

      if (!extractedText || extractedText.trim().length < 10) {
        setRefUploadMsg("❌ No readable text found in the file.");
        setTimeout(() => setRefUploadMsg(""), 4000);
        setRefUploading(false);
        e.target.value = "";
        return;
      }

      // Limit to 5000 chars and append to existing reference material
      const trimmed  = extractedText.trim().slice(0, 5000);
      const existing = form.referenceMaterial ? form.referenceMaterial.trim() + "\n\n" : "";
      setForm(prev => ({
        ...prev,
        referenceMaterial: existing + `--- ${file.name} ---\n${trimmed}`,
      }));

      setRefUploadMsg(`✅ "${file.name}" — ${trimmed.length} characters extracted successfully`);
      setTimeout(() => setRefUploadMsg(""), 5000);

    } catch (err) {
      setRefUploadMsg(`❌ Error: ${err.message}`);
      setTimeout(() => setRefUploadMsg(""), 4000);
    } finally {
      setRefUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <input ref={fileRef}    type="file" multiple style={{ display: "none" }} onChange={onAttachFile} />
      <input ref={refFileRef} type="file" accept=".pdf,.txt,.doc,.docx" style={{ display: "none" }} onChange={handleRefFileChange} />

      {/* Title */}
      <div>
        <label style={label}>Title *</label>
        <input style={inp} value={form.title || ""} placeholder="e.g. Climate Change & Society"
          onChange={e => setForm({ ...form, title: e.target.value })} />
      </div>

      {/* Description */}
      <div>
        <label style={label}>Description</label>
        <input style={inp} value={form.description || ""} placeholder="Brief overview shown to students..."
          onChange={e => setForm({ ...form, description: e.target.value })} />
      </div>

      {/* Instructions */}
      <div>
        <label style={label}>Essay Instructions *</label>
        <textarea style={{ ...inp, resize: "vertical", lineHeight: "1.65", minHeight: "90px" }}
          rows={3} placeholder="Detailed instructions for students..."
          value={form.instructions || ""}
          onChange={e => setForm({ ...form, instructions: e.target.value })} />
      </div>

      {/* Reference material with file upload */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
          <label style={{ ...label, margin: 0 }}>Reference Material (for AI grading)</label>
          <button
            type="button"
            onClick={() => refFileRef.current.click()}
            disabled={refUploading}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "6px 14px", borderRadius: "8px",
              border: "1.5px dashed #8b5cf6",
              background: refUploading ? "#f5f3ff" : "#faf5ff",
              color: "#7c3aed", fontSize: "12px", fontWeight: "700",
              cursor: refUploading ? "not-allowed" : "pointer",
              fontFamily: "inherit",
            }}
          >
            {refUploading ? "⏳ Reading..." : "📎 Upload File"}
          </button>
        </div>

        {/* Upload status message */}
        {refUploadMsg && (
          <div style={{
            padding: "8px 12px", borderRadius: "8px", marginBottom: "8px",
            background: refUploadMsg.startsWith("✅") ? "#f0fdf4" : refUploadMsg.startsWith("❌") ? "#fef2f2" : "#eff6ff",
            border: `1px solid ${refUploadMsg.startsWith("✅") ? "#bbf7d0" : refUploadMsg.startsWith("❌") ? "#fecaca" : "#bfdbfe"}`,
            fontSize: "12px", fontWeight: "600",
            color: refUploadMsg.startsWith("✅") ? "#15803d" : refUploadMsg.startsWith("❌") ? "#dc2626" : "#1d4ed8",
          }}>
            {refUploadMsg}
          </div>
        )}

        <textarea
          style={{ ...inp, resize: "vertical", lineHeight: "1.65", minHeight: "90px" }}
          rows={3}
          placeholder="Paste key facts, model answers, or study notes here... OR click 'Upload File' to extract text from a PDF or TXT book/document."
          value={form.referenceMaterial || ""}
          onChange={e => setForm({ ...form, referenceMaterial: e.target.value })}
        />
        <p style={{ fontSize: "12px", color: "#8b5cf6", marginTop: "6px", fontWeight: "500" }}>
          🤖 Upload a book, notes, or any document — the AI will use it to strictly assess student essays.
        </p>
      </div>

      {/* Max score + due date */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div>
          <label style={label}>Max Score *</label>
          <input style={inp} type="number" min="1" value={form.max_score || 100}
            onChange={e => setForm({ ...form, max_score: parseInt(e.target.value) || 100 })} />
        </div>
        <div>
          <label style={label}>Due Date *</label>
          <input style={inp} type="datetime-local" value={form.due_date || ""}
            onChange={e => setForm({ ...form, due_date: e.target.value })} />
        </div>
      </div>

      {/* Rubric */}
      <div>
        <label style={label}>Grading Rubric</label>
        <div style={{ background: "#f8fafc", borderRadius: "14px", padding: "18px", border: "1px solid #e2e8f0" }}>
          {Object.entries(form.rubric || {}).map(([k, v]) => (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
              <span style={{ fontSize: "13px", color: "#475569", fontWeight: "600", textTransform: "capitalize", width: "100px", flexShrink: 0 }}>{k}</span>
              <input type="number" min="0" max="100" value={v}
                onChange={e => setForm({ ...form, rubric: { ...form.rubric, [k]: parseInt(e.target.value) || 0 } })}
                style={{ width: "64px", padding: "7px 10px", border: "1.5px solid #e2e8f0", borderRadius: "9px", fontSize: "13px", fontWeight: "700", outline: "none", textAlign: "center", fontFamily: "inherit" }} />
              <span style={{ fontSize: "12px", color: "#94a3b8" }}>%</span>
              <div style={{ flex: 1, height: "7px", background: "#e2e8f0", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ height: "7px", background: "linear-gradient(90deg,#3b82f6,#38bdf8)", borderRadius: "4px", width: `${v}%`, transition: "width 0.2s" }} />
              </div>
            </div>
          ))}
          <p style={{ fontSize: "12px", fontWeight: "700", margin: "4px 0 0", color: rubricTotal !== 100 ? "#dc2626" : "#16a34a" }}>
            Total: {rubricTotal}% {rubricTotal !== 100 && "⚠️ Must equal 100"}
          </p>
        </div>
      </div>

      {/* File attachments for students */}
      <div>
        <label style={label}>Attach Files for Students</label>
        <p style={{ fontSize: "12px", color: "#94a3b8", margin: "0 0 12px" }}>
          Attach reading materials, PDFs, images, videos — any file type.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
          {FILE_TYPES.map(ft => (
            <button key={ft.label} type="button" onClick={() => triggerUpload(ft.accept)}
              style={{ padding: "8px 16px", borderRadius: "10px", border: `1px solid ${ft.border}`, background: ft.bg, color: ft.color, fontSize: "12px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit" }}>
              {ft.label}
            </button>
          ))}
        </div>
        {attachments.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {attachments.map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "6px 12px" }}>
                <span style={{ fontSize: "14px" }}>{f.icon}</span>
                <span style={{ fontSize: "12px", color: "#4f46e5", fontWeight: "600", maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</span>
                <span style={{ fontSize: "11px", color: "#94a3b8" }}>{(f.size / 1024).toFixed(0)}KB</span>
                <button onClick={() => setAttachments(prev => prev.filter((_, j) => j !== i))}
                  style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "14px", fontWeight: "700", padding: 0, lineHeight: 1 }}>×</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}