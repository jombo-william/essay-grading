import { useRef, useState } from 'react';
import { C, Icon, Sheet } from './shared.jsx';

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
  const canSubmit  = submitMode === 'write'
    ? wordCount >= 50
    : !!uploadFile && !extracting && wordCount >= 50;
  const isDisabled = submitting || !canSubmit;

  const handleFileChange = async e => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadFile(file);
    setUploadText('');
    setExtracting(true);
    try {
      if (file.type === 'text/plain') {
        const r = new FileReader();
        r.onload  = ev => { setUploadText(ev.target.result); setExtracting(false); };
        r.onerror = ()  => { setUploadText(`[Could not read "${file.name}"]`); setExtracting(false); };
        r.readAsText(file);
      } else if (file.type === 'application/pdf') {
        const pdfjsLib    = await loadPdfJs();
        const arrayBuffer = await file.arrayBuffer();
        const pdf         = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let   fullText    = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page    = await pdf.getPage(i);
          const content = await page.getTextContent();
          fullText += content.items.map(it => it.str).join(' ') + '\n';
        }
        setUploadText(fullText.trim() || '[No readable text found in PDF]');
        setExtracting(false);
      } else if (
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.name.toLowerCase().endsWith('.docx')
      ) {
        const mammoth     = await loadMammoth();
        const arrayBuffer = await file.arrayBuffer();
        const result      = await mammoth.extractRawText({ arrayBuffer });
        setUploadText(result.value.trim() || '[No readable text found in DOCX]');
        setExtracting(false);
      } else if (file.name.toLowerCase().endsWith('.doc')) {
        setUploadText('[Legacy .doc files cannot be read in-browser. Please save as .docx or .pdf.]');
        setExtracting(false);
      } else {
        setUploadText(`[Unsupported file type: "${file.name}". Upload PDF, DOCX, or TXT.]`);
        setExtracting(false);
      }
    } catch (err) {
      console.error(err);
      setUploadText(`[Could not extract text from "${file.name}".]`);
      setExtracting(false);
    }
  };

  const handleClose = () => {
    setEssayText(''); setUploadFile(null); setUploadText('');
    setSubmitMode('write'); setExtracting(false);
    onClose();
  };

  const fileIcon = name => {
    if (!name) return 'file';
    if (name.endsWith('.pdf'))  return 'file-type-pdf';
    if (name.endsWith('.txt'))  return 'file-type-txt';
    return 'file-type-doc';
  };

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
            {submitting
              ? <><Icon name="loader-2" size={15} style={{ animation: 'spin 0.8s linear infinite' }} />{gradingStatus || 'Submitting…'}</>
              : <><Icon name="send" size={15} />Submit essay</>}
          </button>
        </div>
      }
    >

      {/* Rubric chips */}
      {assignment.rubric && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
          {Object.entries(assignment.rubric).map(([k, v]) => (
            <div key={k} style={{
              background: '#F8F7FF', border: '1px solid #ECECF2',
              borderRadius: '8px', padding: '4px 10px',
              display: 'flex', gap: '5px', alignItems: 'center',
            }}>
              <span style={{ fontSize: '12px', color: '#6B6890', textTransform: 'capitalize', fontWeight: '500' }}>
                {k.replace(/_/g, ' ')}
              </span>
              <span style={{ fontSize: '12px', color: '#3C3489', fontWeight: '600' }}>{v}%</span>
            </div>
          ))}
        </div>
      )}

      {/* Write / Upload toggle */}
      <div style={{
        display: 'flex', background: '#F1EFE8',
        borderRadius: '10px', padding: '3px', marginBottom: '16px', gap: '2px',
      }}>
        {[
          { id: 'write',  label: 'Write essay', icon: 'writing'   },
          { id: 'upload', label: 'Upload file',  icon: 'paperclip' },
        ].map(m => (
          <button
            key={m.id}
            onClick={() => setSubmitMode(m.id)}
            style={{
              flex: 1, padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer',
              fontSize: '13px', fontWeight: '500',
              background: submitMode === m.id ? '#fff' : 'transparent',
              color: submitMode === m.id ? '#3C3489' : '#6B6890',
              boxShadow: submitMode === m.id ? '0 1px 4px rgba(60,52,137,0.10)' : 'none',
              transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            }}
          >
            <Icon name={m.icon} size={14} />
            {m.label}
          </button>
        ))}
      </div>

      {/* Instructions */}
      <div style={{
        background: '#FAEEDA', border: '1px solid #FAC775',
        borderRadius: '10px', padding: '12px 14px', marginBottom: '16px',
      }}>
        <span style={{ ...C.sL, color: '#854F0B' }}>Instructions</span>
        <p style={{ fontSize: '13px', color: '#633806', margin: 0, lineHeight: 1.65 }}>
          {assignment.instructions}
        </p>
      </div>

      {/* Write mode */}
      {submitMode === 'write' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={C.sL}>Your essay</span>
            <span style={{ fontSize: '12px', fontWeight: '500', color: wordCount >= 50 ? '#3B6D11' : '#A32D2D' }}>
              {wordCount} words {wordCount < 50 ? `· ${50 - wordCount} more needed` : '· minimum met'}
            </span>
          </div>
          <textarea
            value={essayText}
            onChange={e => setEssayText(e.target.value)}
            placeholder={`Write your essay on "${assignment.title}"…\n\nTip: Aim for 400–800 words. Use specific examples and cite sources.`}
            style={{
              width: '100%', padding: '16px', boxSizing: 'border-box',
              border: `1px solid ${wordCount > 0 && wordCount < 50 ? '#F7C1C1' : '#ECECF2'}`,
              borderRadius: '12px', fontSize: '14px', lineHeight: '1.8',
              color: '#1A1830', resize: 'vertical', outline: 'none',
              fontFamily: "'DM Sans','Segoe UI',sans-serif", minHeight: '260px',
              background: '#FAFAF8',
            }}
          />
          <p style={{ fontSize: '12px', color: '#8884A8', marginTop: '6px' }}>
            Your essay will be graded automatically on submission.
          </p>
        </div>
      )}

      {/* Upload mode */}
      {submitMode === 'upload' && (
        <div>
          <span style={{ ...C.sL, marginBottom: '8px' }}>Upload your essay file</span>
          <input ref={fileRef} type="file" accept=".pdf,.txt,.doc,.docx" onChange={handleFileChange} style={{ display: 'none' }} />

          {!uploadFile ? (
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                border: '1.5px dashed #C0BDEA', borderRadius: '12px',
                padding: '40px 24px', textAlign: 'center', cursor: 'pointer',
                background: '#FAFAF8', transition: 'border-color 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#3C3489'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#C0BDEA'; }}
            >
              <Icon name="cloud-upload" size={36} style={{ color: '#3C3489', marginBottom: '10px' }} />
              <p style={{ fontWeight: '500', color: '#3C3489', fontSize: '14px', margin: '0 0 4px' }}>
                Click to upload your essay
              </p>
              <p style={{ fontSize: '12px', color: '#8884A8', margin: '0 0 12px' }}>
                PDF, TXT, DOCX supported
              </p>
              <div style={{ display: 'inline-flex', gap: '6px' }}>
                {['PDF', 'TXT', 'DOCX'].map(t => (
                  <span key={t} style={{
                    background: '#EEEDFE', color: '#534AB7',
                    fontSize: '11px', fontWeight: '600', padding: '2px 8px', borderRadius: '6px',
                  }}>{t}</span>
                ))}
              </div>
            </div>
          ) : (
            <div>
              {/* File card */}
              <div style={{
                background: '#EAF3DE', border: '1px solid #C0DD97',
                borderRadius: '10px', padding: '12px 16px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: '12px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon name={fileIcon(uploadFile.name)} size={24} style={{ color: '#3B6D11' }} />
                  <div>
                    <p style={{ fontWeight: '500', color: '#27500A', fontSize: '13px', margin: 0 }}>{uploadFile.name}</p>
                    <p style={{ fontSize: '12px', color: '#3B6D11', margin: 0 }}>{(uploadFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button
                  onClick={() => { setUploadFile(null); setUploadText(''); if (fileRef.current) fileRef.current.value = ''; }}
                  style={{
                    background: '#FCEBEB', border: 'none', borderRadius: '8px',
                    padding: '5px 10px', color: '#A32D2D', fontWeight: '500',
                    fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
                  }}
                >
                  <Icon name="x" size={12} />Remove
                </button>
              </div>

              {extracting && (
                <div style={{
                  background: '#F8F7FF', border: '1px solid #ECECF2',
                  borderRadius: '10px', padding: '16px', textAlign: 'center', marginBottom: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                }}>
                  <Icon name="loader-2" size={16} style={{ color: '#3C3489', animation: 'spin 0.8s linear infinite' }} />
                  <p style={{ fontSize: '13px', color: '#3C3489', fontWeight: '500', margin: 0 }}>Extracting text…</p>
                </div>
              )}

              {!extracting && uploadText && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={C.sL}>Extracted text preview</span>
                    <span style={{ fontSize: '11px', color: wordCount >= 50 ? '#3B6D11' : '#854F0B', fontWeight: '500' }}>
                      ~{wordCount} words {wordCount < 50 ? '— need more' : '— ok'}
                    </span>
                  </div>
                  <div style={{
                    background: '#F8F7FF', border: `1px solid ${wordCount < 50 ? '#F7C1C1' : '#ECECF2'}`,
                    borderRadius: '10px', padding: '12px',
                    maxHeight: '160px', overflow: 'auto',
                    fontSize: '12px', color: '#44425C', lineHeight: '1.6',
                  }}>
                    {uploadText.startsWith('[')
                      ? <span style={{ color: '#A32D2D' }}>{uploadText}</span>
                      : <>{uploadText.slice(0, 600)}{uploadText.length > 600 ? '…' : ''}</>}
                  </div>
                  {wordCount < 50 && !uploadText.startsWith('[') && (
                    <p style={{ fontSize: '12px', color: '#A32D2D', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Icon name="alert-circle" size={13} />Your essay must be at least 50 words to submit.
                    </p>
                  )}
                </div>
              )}

              <p style={{ fontSize: '12px', color: '#8884A8', marginTop: '10px' }}>
                Grading is based on the extracted text above.
              </p>
            </div>
          )}
        </div>
      )}
    </Sheet>
  );
}

