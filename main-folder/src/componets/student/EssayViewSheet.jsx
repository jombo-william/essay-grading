



// src/components/student/EssayViewSheet.jsx
import { C, Icon, Sheet } from './shared.jsx';

export default function EssayViewSheet({ sub, user, canUnsubmit, onClose, onUnsubmit }) {
  if (!sub) return null;

  const words = sub.essay_text?.trim().split(/\s+/).filter(Boolean).length ?? 0;

  return (
    <Sheet
      onClose={onClose}
      title="Your submitted essay"
      subtitle={sub.assignment_title}
      footer={
        <div style={{ display: 'flex', gap: '10px' }}>
          {canUnsubmit && (
            <button
              style={C.dBtn}
              onClick={() => {
                if (window.confirm('Unsubmit? You can rewrite before the deadline.')) onUnsubmit(sub);
              }}
            >
              <Icon name="arrow-back-up" size={15} />
              Unsubmit
            </button>
          )}
          <button style={C.gBtn} onClick={onClose}>Close</button>
        </div>
      }
    >

      {/* Submission meta */}
      <div style={{
        background: '#EEEDFE', border: '1px solid #CECBF6',
        borderRadius: '10px', padding: '12px 16px', marginBottom: '14px',
        display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px',
      }}>
        <div>
          <p style={{ fontSize: '11px', fontWeight: '600', color: '#534AB7', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Submitted</p>
          <p style={{ fontSize: '13px', color: '#3C3489', fontWeight: '500', margin: 0 }}>
            {new Date(sub.submitted_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '11px', fontWeight: '600', color: '#534AB7', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Format</p>
          <p style={{ fontSize: '13px', color: '#3C3489', fontWeight: '500', margin: 0, display: 'flex', alignItems: 'center', gap: '5px' }}>
            {sub.file_name
              ? <><Icon name="paperclip" size={13} />{sub.file_name}</>
              : <><Icon name="writing" size={13} />Written in app</>}
          </p>
        </div>
      </div>

      {/* Unsubmit hint */}
      {canUnsubmit && (
        <div style={{
          background: '#FAEEDA', border: '1px solid #FAC775',
          borderRadius: '10px', padding: '10px 14px', marginBottom: '14px',
          display: 'flex', gap: '8px', alignItems: 'flex-start',
        }}>
          <Icon name="info-circle" size={15} style={{ color: '#854F0B', flexShrink: 0, marginTop: '1px' }} />
          <p style={{ fontSize: '12px', color: '#633806', margin: 0, lineHeight: 1.5 }}>
            You can unsubmit and rewrite before the deadline. Once graded, unsubmitting is no longer available.
          </p>
        </div>
      )}

      {/* Essay text */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={C.sL}>Essay content</span>
        <span style={{ fontSize: '11px', color: '#8884A8' }}>{words} words</span>
      </div>
      <div style={{
        background: '#F8F7FF', border: '1px solid #ECECF2',
        borderRadius: '12px', padding: '18px',
        fontSize: '14px', color: '#44425C', lineHeight: '1.85', whiteSpace: 'pre-wrap',
      }}>
        {sub.essay_text}
      </div>

    </Sheet>
  );
}