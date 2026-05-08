
// import { C, Sheet } from './shared.jsx';
// import ChatPanel from '../ChatPanel.jsx';

// export default function EssayViewSheet({ sub, user, canUnsubmit, onClose, onUnsubmit }) {
//   if (!sub) return null;

//   return (
//     <Sheet
//       onClose={onClose}
//       title="Your Submitted Essay"
//       subtitle={sub.assignment_title}
//       footer={
//         <div style={{ display: 'flex', gap: '10px' }}>
//           {canUnsubmit && (
//             <button
//               onClick={() => { if (window.confirm('Unsubmit? You can rewrite before the deadline.')) onUnsubmit(sub); }}
//               style={C.dBtn}
//             >
//               ↩ Unsubmit
//             </button>
//           )}
//           <button onClick={onClose} style={C.gBtn}>Close</button>
//         </div>
//       }
//     >
//       {}
//       <div style={{ background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '12px', padding: '12px 16px', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
//         <div>
//           <p style={{ fontSize: '11px', fontWeight: '700', color: '#7e22ce', margin: '0 0 2px' }}>SUBMITTED</p>
//           <p style={{ fontSize: '13px', color: '#6d28d9', fontWeight: '600', margin: 0 }}>{new Date(sub.submitted_at).toLocaleString()}</p>
//         </div>
//         <div style={{ textAlign: 'right' }}>
//           <p style={{ fontSize: '11px', fontWeight: '700', color: '#7e22ce', margin: '0 0 2px' }}>MODE</p>
//           <p style={{ fontSize: '13px', color: '#6d28d9', fontWeight: '600', margin: 0 }}>{sub.file_name ? `📎 ${sub.file_name}` : '✏️ Written'}</p>
//         </div>
//       </div>

//       {}
//       {canUnsubmit && (
//         <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '10px', padding: '10px 14px', marginBottom: '14px', display: 'flex', gap: '8px' }}>
//           <span>💡</span>
//           <p style={{ fontSize: '12px', color: '#c2410c', margin: 0, lineHeight: 1.5 }}>
//             You can unsubmit and rewrite before the deadline. Once graded, unsubmit is no longer available.
//           </p>
//         </div>
//       )}

//       {}
//       <p style={{ ...C.sL, marginBottom: '8px' }}>
//         Essay Content · {sub.essay_text?.trim().split(/\s+/).filter(Boolean).length} words
//       </p>
//       <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px', fontSize: '14px', color: '#374151', lineHeight: '1.85', whiteSpace: 'pre-wrap' }}>
//         {sub.essay_text}
//       </div>

//       <ChatPanel submissionId={sub.id ?? sub.submission_id} user={user} />
//     </Sheet>
//   );
// }







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