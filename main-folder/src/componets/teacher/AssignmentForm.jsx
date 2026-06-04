// src/componets/teacher/AssignmentForm.jsx
import { useRef, useState } from "react";
import { inp, label, Icon } from "./shared.jsx";

const FILE_TYPES = [
  { label: "PDF / Word", accept: ".pdf,.doc,.docx", bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe", icon: "file-text" },
  { label: "Image",      accept: "image/*",          bg: "#fdf4ff", color: "#9333ea", border: "#e9d5ff", icon: "image" },
  { label: "Video",      accept: "video/*",          bg: "#fff7ed", color: "#ea580c", border: "#fed7aa", icon: "video" },
  { label: "Any File",   accept: "*",                bg: "#f8fafc", color: "#475569", border: "#e2e8f0", icon: "paperclip" },
];

//const API_BASE = "https://jombo-essaygrade.fly.dev/api";
const BASE_URL = 'https://jombo-essaygrade.fly.dev/api/teacher';

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
  const rubricFileRef = useRef();

  const [refUploading, setRefUploading] = useState(false);
  const [refUploadMsg, setRefUploadMsg] = useState("");
  const [refFileNames, setRefFileNames] = useState([]);

  const [rubricUploading, setRubricUploading] = useState(false);
  const [rubricUploadMsg, setRubricUploadMsg] = useState("");
  const [rubricFileName, setRubricFileName] = useState("");

  const triggerUpload = (accept) => {
    fileRef.current.accept = accept;
    fileRef.current.click();
  };

  // ── Handle rubric/marking key file upload ──────────────────────────────────
  const handleRubricFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setRubricUploading(true);
    setRubricFileName(files[0].name);
    setRubricUploadMsg("Reading rubric file...");

    try {
      let extractedText = "";
      const file = files[0];

      if (file.type === "text/plain") {
        extractedText = await file.text();
      } else if (file.type === "application/pdf") {
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
          setRubricUploadMsg("Error reading PDF file.");
          setTimeout(() => setRubricUploadMsg(""), 4000);
          setRubricUploading(false);
          return;
        }
      } else {
        try {
          extractedText = await file.text();
        } catch {
          setRubricUploadMsg("Error reading file.");
          setTimeout(() => setRubricUploadMsg(""), 4000);
          setRubricUploading(false);
          return;
        }
      }

      if (!extractedText || extractedText.trim().length < 10) {
        setRubricUploadMsg("No readable text found in the file.");
        setTimeout(() => setRubricUploadMsg(""), 4000);
        setRubricUploading(false);
        return;
      }

      setForm(prev => ({
        ...prev,
        rubricContent: extractedText.trim().slice(0, 10000),
      }));

      setRubricUploadMsg(`Rubric uploaded successfully (${extractedText.trim().length} characters).`);
      setTimeout(() => setRubricUploadMsg(""), 5000);

    } catch (err) {
      setRubricUploadMsg(`Error: ${err.message}`);
      setTimeout(() => setRubricUploadMsg(""), 4000);
    } finally {
      setRubricUploading(false);
      e.target.value = "";
    }
  };

  // ── Handle reference material file upload ─────────────────────────────────
  const handleRefFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setRefUploading(true);
    setRefFileNames(files.map(file => file.name));
    setRefUploadMsg(`Reading ${files.length} file${files.length === 1 ? "" : "s"}...`);

    try {
      let appendedText = "";
      let totalChars = 0;
      let succeeded = 0;
      const failed = [];

      for (const file of files) {
        let extractedText = "";

        if (file.type === "text/plain") {
          extractedText = await file.text();

        } else if (file.type === "application/pdf") {
          setRefUploadMsg(`Extracting text from ${file.name}...`);
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
            failed.push(file.name);
            continue;
          }

        } else {
          try {
            extractedText = await file.text();
          } catch {
            failed.push(file.name);
            continue;
          }
        }

        if (!extractedText || extractedText.trim().length < 10) {
          failed.push(file.name);
          continue;
        }

        const trimmed = extractedText.trim().slice(0, 5000);
        if (appendedText) appendedText += "\n\n";
        appendedText += `--- ${file.name} ---\n${trimmed}`;
        totalChars += trimmed.length;
        succeeded += 1;
      }

      if (succeeded === 0) {
        setRefUploadMsg(`No readable text found in the selected file${files.length === 1 ? "" : "s"}.`);
        setTimeout(() => setRefUploadMsg(""), 4000);
        return;
      }

      const existing = form.referenceMaterial ? form.referenceMaterial.trim() + "\n\n" : "";
      setForm(prev => ({
        ...prev,
        referenceMaterial: existing + appendedText,
      }));

      const failedMsg = failed.length > 0 ? ` (${failed.length} failed)` : "";
      setRefUploadMsg(`${succeeded} of ${files.length} file${files.length === 1 ? "" : "s"} uploaded successfully${failedMsg}, ${totalChars} characters added.`);
      setTimeout(() => setRefUploadMsg(""), 5000);

    } catch (err) {
      setRefUploadMsg(`Error: ${err.message}`);
      setTimeout(() => setRefUploadMsg(""), 4000);
    } finally {
      setRefUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <input ref={fileRef}    type="file" multiple style={{ display: "none" }} onChange={onAttachFile} />
      <input ref={refFileRef} type="file" multiple accept=".pdf,.txt,.doc,.docx" style={{ display: "none" }} onChange={handleRefFileChange} />
      <input ref={rubricFileRef} type="file" accept=".pdf,.txt,.doc,.docx" style={{ display: "none" }} onChange={handleRubricFileChange} />

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
            <Icon name={refUploading ? "loader-2" : "upload"} size={14} style={{ color: "#7c3aed" }} />
            {refUploading ? "Reading..." : "Upload files"}
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

        {refFileNames.length > 0 && (
          <div style={{ marginBottom: "10px", fontSize: "12px", color: "#475569" }}>
            Uploaded files: {refFileNames.join(", ")}
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
          Upload a book, notes, or multiple documents — the AI will use them to strictly assess student essays.
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

      {/* Rubric / Marking Key */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
          <label style={{ ...label, margin: 0 }}>Rubric / Marking Key</label>
          <button
            type="button"
            onClick={() => rubricFileRef.current.click()}
            disabled={rubricUploading}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "6px 14px", borderRadius: "8px",
              border: "1.5px dashed #059669",
              background: rubricUploading ? "#f0fdf4" : "#ecfdf5",
              color: "#059669", fontSize: "12px", fontWeight: "700",
              cursor: rubricUploading ? "not-allowed" : "pointer",
              fontFamily: "inherit",
            }}
          >
            <Icon name={rubricUploading ? "loader-2" : "file-up"} size={14} style={{ color: "#059669" }} />
            {rubricUploading ? "Reading..." : "Upload rubric"}
          </button>
        </div>

        {/* Rubric upload status message */}
        {rubricUploadMsg && (
          <div style={{
            padding: "8px 12px", borderRadius: "8px", marginBottom: "8px",
            background: rubricUploadMsg.includes("Error") ? "#fef2f2" : "#f0fdf4",
            border: `1px solid ${rubricUploadMsg.includes("Error") ? "#fecaca" : "#bbf7d0"}`,
            fontSize: "12px", fontWeight: "600",
            color: rubricUploadMsg.includes("Error") ? "#dc2626" : "#15803d",
          }}>
            {rubricUploadMsg}
          </div>
        )}

        {rubricFileName && (
          <div style={{ marginBottom: "10px", fontSize: "12px", color: "#475569" }}>
            <Icon name="check-circle" size={14} style={{ color: "#059669", marginRight: "4px", display: "inline" }} />
            Rubric: {rubricFileName}
          </div>
        )}

        <textarea
          style={{ ...inp, resize: "vertical", lineHeight: "1.65", minHeight: "90px" }}
          rows={3}
          placeholder="Paste or upload a rubric/marking key with assessment criteria and marks distribution..."
          value={form.rubricContent || ""}
          onChange={e => setForm({ ...form, rubricContent: e.target.value })}
        />
        <p style={{ fontSize: "12px", color: "#059669", marginTop: "6px", fontWeight: "500" }}>
          Upload a PDF or text file containing your rubric, marking guide, or assessment criteria. The AI will use this to grade essays consistently.
        </p>
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
              style={{ padding: "8px 16px", borderRadius: "10px", border: `1px solid ${ft.border}`, background: ft.bg, color: ft.color, fontSize: "12px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: "6px" }}>
              <Icon name={ft.icon} size={14} style={{ color: ft.color }} />
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
