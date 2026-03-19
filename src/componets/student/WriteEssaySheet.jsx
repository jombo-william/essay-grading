

// // src/components/student/WriteEssaySheet.jsx
// import { useRef, useState } from 'react';
// import { C, Sheet } from './shared.jsx';

// const loadPdfJs = () =>
//   new Promise(resolve => {
//     if (window.pdfjsLib) return resolve(window.pdfjsLib);
//     const s = document.createElement('script');
//     s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
//     s.onload = () => {
//       window.pdfjsLib.GlobalWorkerOptions.workerSrc =
//         'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
//       resolve(window.pdfjsLib);
//     };
//     document.head.appendChild(s);
//   });

// export default function WriteEssaySheet({ assignment, onClose, onSubmit, submitting, gradingStatus }) {
//   const [submitMode, setSubmitMode] = useState('write');
//   const [essayText,  setEssayText]  = useState('');
//   const [uploadFile, setUploadFile] = useState(null);
//   const [uploadText, setUploadText] = useState('');
//   const fileRef = useRef();

//   if (!assignment) return null;

//   const activeText = submitMode === 'write' ? essayText : uploadText;
//   const wordCount  = activeText.trim().split(/\s+/).filter(Boolean).length;

//   const handleFileChange = async e => {
//     const file = e.target.files[0];
//     if (!file) return;
//     setUploadFile(file);

//     if (file.type === 'text/plain') {
//       const r = new FileReader();
//       r.onload = ev => setUploadText(ev.target.result);
//       r.readAsText(file);

//     } else if (file.type === 'application/pdf') {
//       try {
//         const pdfjsLib = await loadPdfJs();
//         const arrayBuffer = await file.arrayBuffer();
//         const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
//         let fullText = '';
//         for (let i = 1; i <= pdf.numPages; i++) {
//           const page = await pdf.getPage(i);
//           const content = await page.getTextContent();
//           const pageText = content.items.map(item => item.str).join(' ');
//           fullText += pageText + '\n';
//         }
//         setUploadText(fullText.trim() || '[No readable text found in PDF]');
//       } catch (err) {
//         setUploadText(`[Could not extract text from "${file.name}"]`);
//       }

//     } else {
//       setUploadText(`[File attached: "${file.name}" — ${(file.size / 1024).toFixed(1)} KB]`);
//     }
//   };

//   const handleClose = () => {
//     setEssayText(''); setUploadFile(null); setUploadText(''); setSubmitMode('write');
//     onClose();
//   };

//   const canSubmit = submitMode === 'write' ? wordCount >= 50 : !!uploadFile;
//   const isDisabled = submitting || !canSubmit;

//   return (
//     <Sheet
//       onClose={handleClose}
//       title={assignment.title}
//       subtitle={`Due ${new Date(assignment.due_date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} · ${assignment.max_score} pts`}
//       footer={
//         <div style={{ display: 'flex', gap: '10px' }}>
//           <button onClick={handleClose} style={C.gBtn}>Cancel</button>
//           <button
//             onClick={() => onSubmit({ assignment, submitMode, essayText, uploadFile, uploadText, activeText })}
//             disabled={isDisabled}
//             style={C.pBtn(isDisabled)}
//           >
//             {submitting ? gradingStatus || '⏳ Submitting...' : '🚀 Submit Essay'}
//           </button>
//         </div>
//       }
//     >
//       {/* Rubric chips */}
//       {assignment.rubric && (
//         <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
//           {Object.entries(assignment.rubric).map(([k, v]) => (
//             <div key={k} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '4px 10px', display: 'flex', gap: '5px' }}>
//               <span style={{ fontSize: '12px', color: '#475569', textTransform: 'capitalize', fontWeight: '600' }}>{k}</span>
//               <span style={{ fontSize: '12px', color: '#8b5cf6', fontWeight: '800' }}>{v}%</span>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Write / Upload toggle */}
//       <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '10px', padding: '3px', marginBottom: '16px', gap: '2px' }}>
//         {[['write', '✏️ Write Essay'], ['upload', '📎 Upload File']].map(([m, l]) => (
//           <button key={m} onClick={() => setSubmitMode(m)}
//             style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '700', background: submitMode === m ? '#fff' : 'transparent', color: submitMode === m ? '#6366f1' : '#64748b', boxShadow: submitMode === m ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.2s' }}>
//             {l}
//           </button>
//         ))}
//       </div>

//       {/* Instructions box */}
//       <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '12px 14px', marginBottom: '16px' }}>
//         <p style={{ ...C.sL, color: '#92400e', marginBottom: '4px' }}>Instructions</p>
//         <p style={{ fontSize: '13px', color: '#78350f', margin: 0, lineHeight: 1.6 }}>{assignment.instructions}</p>
//       </div>

//       {/* ── Write mode ── */}
//       {submitMode === 'write' && (
//         <div>
//           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
//             <p style={C.sL}>Your Essay</p>
//             <span style={{ fontSize: '12px', fontWeight: '700', color: wordCount >= 50 ? '#16a34a' : '#ef4444' }}>
//               {wordCount} words {wordCount < 50 ? `· need ${50 - wordCount} more` : '✓'}
//             </span>
//           </div>
//           <textarea
//             value={essayText}
//             onChange={e => setEssayText(e.target.value)}
//             placeholder={`Write your essay on "${assignment.title}"...\n\nTip: Aim for 400–800 words. Use specific examples and cite sources (Author, Year).`}
//             style={{ width: '100%', padding: '16px', boxSizing: 'border-box', border: `1.5px solid ${wordCount > 0 && wordCount < 50 ? '#fca5a5' : '#e2e8f0'}`, borderRadius: '14px', fontSize: '14px', lineHeight: '1.8', color: '#1e293b', resize: 'vertical', outline: 'none', fontFamily: 'inherit', minHeight: '260px', background: '#fafafa' }}
//           />
//           <p style={{ fontSize: '12px', color: '#8b5cf6', marginTop: '8px' }}>🤖 Essay will be automatically AI-graded on submission.</p>
//         </div>
//       )}

//       {/* ── Upload mode ── */}
//       {submitMode === 'upload' && (
//         <div>
//           <p style={C.sL}>Upload Your Essay File</p>
//           <input ref={fileRef} type="file" accept=".pdf,.txt,.doc,.docx" onChange={handleFileChange} />
//           {!uploadFile ? (
//             <div onClick={() => fileRef.current?.click()}
//               style={{ border: '2px dashed #c7d2fe', borderRadius: '14px', padding: '40px 24px', textAlign: 'center', cursor: 'pointer', background: '#fafafe', transition: 'all 0.2s' }}
//               onMouseEnter={e => e.currentTarget.style.borderColor = '#6366f1'}
//               onMouseLeave={e => e.currentTarget.style.borderColor = '#c7d2fe'}
//             >
//               <p style={{ fontSize: '32px', margin: '0 0 10px' }}>📎</p>
//               <p style={{ fontWeight: '700', color: '#4f46e5', fontSize: '14px', margin: '0 0 4px' }}>Click to upload your essay</p>
//               <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 12px' }}>PDF, TXT, DOC, DOCX supported</p>
//               <div style={{ display: 'inline-flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
//                 {['PDF', 'TXT', 'DOC', 'DOCX'].map(t => (
//                   <span key={t} style={{ background: '#eff6ff', color: '#3b82f6', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '6px' }}>{t}</span>
//                 ))}
//               </div>
//             </div>
//           ) : (
//             <div>
//               <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
//                   <span style={{ fontSize: '24px' }}>{uploadFile.name.endsWith('.pdf') ? '📄' : uploadFile.name.endsWith('.txt') ? '📝' : '📋'}</span>
//                   <div>
//                     <p style={{ fontWeight: '700', color: '#15803d', fontSize: '13px', margin: 0 }}>{uploadFile.name}</p>
//                     <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>{(uploadFile.size / 1024).toFixed(1)} KB</p>
//                   </div>
//                 </div>
//                 <button onClick={() => { setUploadFile(null); setUploadText(''); if (fileRef.current) fileRef.current.value = ''; }}
//                   style={{ background: '#fee2e2', border: 'none', borderRadius: '8px', padding: '5px 10px', color: '#dc2626', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}>
//                   ✕ Remove
//                 </button>
//               </div>
//               {uploadText && (
//                 <div>
//                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
//                     <p style={{ ...C.sL, margin: 0 }}>Extracted Text Preview</p>
//                     <span style={{ fontSize: '11px', color: wordCount >= 50 ? '#16a34a' : '#f59e0b', fontWeight: '700' }}>~{wordCount} words {wordCount < 50 ? '⚠️' : '✓'}</span>
//                   </div>
//                   <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px', maxHeight: '140px', overflow: 'auto', fontSize: '12px', color: '#475569', lineHeight: '1.6' }}>
//                     {uploadText.slice(0, 500)}{uploadText.length > 500 ? '...' : ''}
//                   </div>
//                 </div>
//               )}
//               <p style={{ fontSize: '12px', color: '#8b5cf6', marginTop: '10px' }}>🤖 AI will grade based on the extracted text.</p>
//             </div>
//           )}
//         </div>
//       )}
//     </Sheet>
//   );
// }






// src/components/student/WriteEssaySheet.jsx
import { useRef, useState } from 'react';
import { C, Sheet } from './shared.jsx';

const loadPdfJs = () =>
  new Promise(resolve => {
    if (window.pdfjsLib) return resolve(window.pdfjsLib);
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    s.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      resolve(window.pdfjsLib);
    };
    document.head.appendChild(s);
  });

const loadMammoth = () =>
  new Promise(resolve => {
    if (window.mammoth) return resolve(window.mammoth);
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js';
    s.onload = () => resolve(window.mammoth);
    document.head.appendChild(s);
  });

export default function WriteEssaySheet({ assignment, onClose, onSubmit, submitting, gradingStatus }) {
  const [submitMode, setSubmitMode] = useState('write');
  const [essayText,  setEssayText]  = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadText, setUploadText] = useState('');
  const [extracting, setExtracting] = useState(false);
  const fileRef = useRef();

  if (!assignment) return null;

  const activeText = submitMode === 'write' ? essayText : uploadText;
  const wordCount  = activeText.trim().split(/\s+/).filter(Boolean).length;

  const handleFileChange = async e => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadFile(file);
    setUploadText('');
    setExtracting(true);

    try {
      if (file.type === 'text/plain') {
        // ── Plain text ────────────────────────────────────────────────────
        const r = new FileReader();
        r.onload = ev => {
          setUploadText(ev.target.result);
          setExtracting(false);
        };
        r.onerror = () => {
          setUploadText(`[Could not read "${file.name}"]`);
          setExtracting(false);
        };
        r.readAsText(file);

      } else if (file.type === 'application/pdf') {
        // ── PDF ───────────────────────────────────────────────────────────
        const pdfjsLib = await loadPdfJs();
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items.map(item => item.str).join(' ');
          fullText += pageText + '\n';
        }
        setUploadText(fullText.trim() || '[No readable text found in PDF]');
        setExtracting(false);

      } else if (
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.name.toLowerCase().endsWith('.docx')
      ) {
        // ── DOCX ──────────────────────────────────────────────────────────
        const mammoth = await loadMammoth();
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        setUploadText(result.value.trim() || '[No readable text found in DOCX]');
        setExtracting(false);

      } else if (
        file.type === 'application/msword' ||
        file.name.toLowerCase().endsWith('.doc')
      ) {
        // ── Legacy .doc — cannot be parsed client-side ────────────────────
        setUploadText('[Legacy .doc files cannot be read in the browser. Please save as .docx or .pdf and re-upload.]');
        setExtracting(false);

      } else {
        // ── Unsupported ───────────────────────────────────────────────────
        setUploadText(`[Unsupported file type: "${file.name}". Please upload a PDF, DOCX, or TXT file.]`);
        setExtracting(false);
      }
    } catch (err) {
      console.error('File extraction error:', err);
      setUploadText(`[Could not extract text from "${file.name}". Try saving as .docx or .pdf.]`);
      setExtracting(false);
    }
  };

  const handleClose = () => {
    setEssayText(''); setUploadFile(null); setUploadText(''); setSubmitMode('write'); setExtracting(false);
    onClose();
  };

  const canSubmit = submitMode === 'write'
    ? wordCount >= 50
    : !!uploadFile && !extracting && wordCount >= 50;

  const isDisabled = submitting || !canSubmit;

  return (
    <Sheet
      onClose={handleClose}
      title={assignment.title}
      subtitle={`Due ${new Date(assignment.due_date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} · ${assignment.max_score} pts`}
      footer={
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleClose} style={C.gBtn}>Cancel</button>
          <button
            onClick={() => onSubmit({ assignment, submitMode, essayText, uploadFile, uploadText, activeText })}
            disabled={isDisabled}
            style={C.pBtn(isDisabled)}
          >
            {submitting ? gradingStatus || '⏳ Submitting...' : '🚀 Submit Essay'}
          </button>
        </div>
      }
    >
      {/* Rubric chips */}
      {assignment.rubric && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
          {Object.entries(assignment.rubric).map(([k, v]) => (
            <div key={k} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '4px 10px', display: 'flex', gap: '5px' }}>
              <span style={{ fontSize: '12px', color: '#475569', textTransform: 'capitalize', fontWeight: '600' }}>{k}</span>
              <span style={{ fontSize: '12px', color: '#8b5cf6', fontWeight: '800' }}>{v}%</span>
            </div>
          ))}
        </div>
      )}

      {/* Write / Upload toggle */}
      <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '10px', padding: '3px', marginBottom: '16px', gap: '2px' }}>
        {[['write', '✏️ Write Essay'], ['upload', '📎 Upload File']].map(([m, l]) => (
          <button key={m} onClick={() => setSubmitMode(m)}
            style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '700', background: submitMode === m ? '#fff' : 'transparent', color: submitMode === m ? '#6366f1' : '#64748b', boxShadow: submitMode === m ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.2s' }}>
            {l}
          </button>
        ))}
      </div>

      {/* Instructions box */}
      <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '12px 14px', marginBottom: '16px' }}>
        <p style={{ ...C.sL, color: '#92400e', marginBottom: '4px' }}>Instructions</p>
        <p style={{ fontSize: '13px', color: '#78350f', margin: 0, lineHeight: 1.6 }}>{assignment.instructions}</p>
      </div>

      {/* ── Write mode ── */}
      {submitMode === 'write' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <p style={C.sL}>Your Essay</p>
            <span style={{ fontSize: '12px', fontWeight: '700', color: wordCount >= 50 ? '#16a34a' : '#ef4444' }}>
              {wordCount} words {wordCount < 50 ? `· need ${50 - wordCount} more` : '✓'}
            </span>
          </div>
          <textarea
            value={essayText}
            onChange={e => setEssayText(e.target.value)}
            placeholder={`Write your essay on "${assignment.title}"...\n\nTip: Aim for 400–800 words. Use specific examples and cite sources (Author, Year).`}
            style={{ width: '100%', padding: '16px', boxSizing: 'border-box', border: `1.5px solid ${wordCount > 0 && wordCount < 50 ? '#fca5a5' : '#e2e8f0'}`, borderRadius: '14px', fontSize: '14px', lineHeight: '1.8', color: '#1e293b', resize: 'vertical', outline: 'none', fontFamily: 'inherit', minHeight: '260px', background: '#fafafa' }}
          />
          <p style={{ fontSize: '12px', color: '#8b5cf6', marginTop: '8px' }}>🤖 Essay will be automatically AI-graded on submission.</p>
        </div>
      )}

      {/* ── Upload mode ── */}
      {submitMode === 'upload' && (
        <div>
          <p style={C.sL}>Upload Your Essay File</p>
          <input ref={fileRef} type="file" accept=".pdf,.txt,.doc,.docx" onChange={handleFileChange} style={{ display: 'none' }} />
          {!uploadFile ? (
            <div onClick={() => fileRef.current?.click()}
              style={{ border: '2px dashed #c7d2fe', borderRadius: '14px', padding: '40px 24px', textAlign: 'center', cursor: 'pointer', background: '#fafafe', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#6366f1'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#c7d2fe'}
            >
              <p style={{ fontSize: '32px', margin: '0 0 10px' }}>📎</p>
              <p style={{ fontWeight: '700', color: '#4f46e5', fontSize: '14px', margin: '0 0 4px' }}>Click to upload your essay</p>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 12px' }}>PDF, TXT, DOCX supported</p>
              <div style={{ display: 'inline-flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {['PDF', 'TXT', 'DOCX'].map(t => (
                  <span key={t} style={{ background: '#eff6ff', color: '#3b82f6', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '6px' }}>{t}</span>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '24px' }}>
                    {uploadFile.name.endsWith('.pdf') ? '📄' : uploadFile.name.endsWith('.txt') ? '📝' : '📋'}
                  </span>
                  <div>
                    <p style={{ fontWeight: '700', color: '#15803d', fontSize: '13px', margin: 0 }}>{uploadFile.name}</p>
                    <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>{(uploadFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button onClick={() => { setUploadFile(null); setUploadText(''); setExtracting(false); if (fileRef.current) fileRef.current.value = ''; }}
                  style={{ background: '#fee2e2', border: 'none', borderRadius: '8px', padding: '5px 10px', color: '#dc2626', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}>
                  ✕ Remove
                </button>
              </div>

              {/* Extracting spinner */}
              {extracting && (
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', textAlign: 'center', marginBottom: '12px' }}>
                  <p style={{ fontSize: '13px', color: '#6366f1', fontWeight: '700', margin: 0 }}>⏳ Extracting text from file...</p>
                </div>
              )}

              {/* Extracted text preview */}
              {!extracting && uploadText && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <p style={{ ...C.sL, margin: 0 }}>Extracted Text Preview</p>
                    <span style={{ fontSize: '11px', color: wordCount >= 50 ? '#16a34a' : '#f59e0b', fontWeight: '700' }}>
                      ~{wordCount} words {wordCount < 50 ? '⚠️ need more' : '✓'}
                    </span>
                  </div>
                  <div style={{ background: '#f8fafc', border: `1px solid ${wordCount < 50 ? '#fca5a5' : '#e2e8f0'}`, borderRadius: '10px', padding: '12px', maxHeight: '160px', overflow: 'auto', fontSize: '12px', color: '#475569', lineHeight: '1.6' }}>
                    {uploadText.startsWith('[') ? (
                      <span style={{ color: '#ef4444' }}>{uploadText}</span>
                    ) : (
                      <>{uploadText.slice(0, 600)}{uploadText.length > 600 ? '...' : ''}</>
                    )}
                  </div>
                  {wordCount < 50 && !uploadText.startsWith('[') && (
                    <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '6px' }}>
                      ⚠️ Your essay must be at least 50 words to submit.
                    </p>
                  )}
                </div>
              )}

              <p style={{ fontSize: '12px', color: '#8b5cf6', marginTop: '10px' }}>🤖 AI will grade based on the extracted text.</p>
            </div>
          )}
        </div>
      )}
    </Sheet>
  );
}