// src/componets/student/AssignmentsTab.jsx
import { Icon, Badge, C } from './shared.jsx';

export default function AssignmentsTab({ assignments, loading, onWrite, onViewEssay, onViewResult }) {
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
        <div style={{ width: 28, height: 28, border: '2px solid #E8E6FF', borderTopColor: '#3C3489', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <div style={{ ...C.card, textAlign: 'center', padding: '48px 24px' }}>
        <Icon name="inbox" size={36} style={{ color: '#C0DD97', marginBottom: '12px' }} />
        <p style={{ color: '#8884A8', fontSize: '14px', margin: 0 }}>
          No assignments available yet.
        </p>
      </div>
    );
  }

  return (
    <div>
      {assignments.map(assignment => {
        const isPast = assignment.isPast;
        const hasSubmission = assignment.submitted;
        const submission = assignment.submission;
        const isGraded = submission?.final_score !== null;
        const isAIFlagged = (submission?.ai_detection_score ?? 0) >= 50;
        
        let statusBadge = null;
        let actionButton = null;
        
        if (isPast && !hasSubmission) {
          statusBadge = <Badge color="gray">Closed</Badge>;
          actionButton = null;
        } else if (hasSubmission) {
          if (isGraded) {
            statusBadge = <Badge color="green">Graded</Badge>;
            actionButton = (
              <button
                onClick={() => onViewResult(submission)}
                style={C.pBtn(false)}
              >
                <Icon name="chart-bar" size={14} /> View Result
              </button>
            );
          } else if (isAIFlagged) {
            statusBadge = <Badge color="red">AI Flagged</Badge>;
            actionButton = (
              <button
                onClick={() => onViewEssay(submission)}
                style={{ ...C.gBtn, background: '#FCEBEB', color: '#A32D2D', border: '1px solid #F7C1C1' }}
              >
                <Icon name="eye" size={14} /> View Submission
              </button>
            );
          } else {
            statusBadge = <Badge color="amber">Submitted</Badge>;
            actionButton = (
              <button
                onClick={() => onViewEssay(submission)}
                style={C.gBtn}
              >
                <Icon name="eye" size={14} /> View Submission
              </button>
            );
          }
        } else {
          statusBadge = <Badge color="green">Active</Badge>;
          actionButton = (
            <button
              onClick={() => onWrite(assignment)}
              style={C.pBtn(false)}
            >
              <Icon name="pencil" size={14} /> Write Essay
            </button>
          );
        }
        
        // Calculate days remaining
        const dueDate = new Date(assignment.due_date);
        const now = new Date();
        const daysRemaining = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
        const isUrgent = daysRemaining <= 2 && daysRemaining > 0 && !hasSubmission;
        
        return (
          <div
            key={assignment.id}
            style={{
              ...C.card,
              borderLeft: `4px solid ${isPast && !hasSubmission ? '#D3D1C7' : isUrgent ? '#A32D2D' : '#3C3489'}`,
              marginBottom: '12px',
              opacity: isPast && !hasSubmission ? 0.7 : 1,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontWeight: '600', fontSize: '15px', color: '#1A1830' }}>
                    {assignment.title}
                  </span>
                  {statusBadge}
                  <Badge color="purple">{assignment.max_score} pts</Badge>
                  {isUrgent && !hasSubmission && (
                    <Badge color="red">⚠️ Due soon</Badge>
                  )}
                </div>
                
                {assignment.description && (
                  <p style={{ fontSize: '13px', color: '#8884A8', margin: '0 0 8px', lineHeight: 1.5 }}>
                    {assignment.description}
                  </p>
                )}
                
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#B0AECB', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Icon name="calendar" size={11} />
                    Due {dueDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    {!isPast && !hasSubmission && daysRemaining > 0 && (
                      <span style={{ color: isUrgent ? '#A32D2D' : '#8884A8' }}>
                        ({daysRemaining} day{daysRemaining !== 1 ? 's' : ''} left)
                      </span>
                    )}
                  </span>
                  
                  {submission && (
                    <span style={{ fontSize: '11px', color: '#B0AECB', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Icon name="clock" size={11} />
                      Submitted {new Date(submission.submitted_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </span>
                  )}
                  
                  {submission?.final_score !== null && (
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#3B6D11', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Icon name="chart-bar" size={12} />
                      Score: {submission.final_score}/{assignment.max_score}
                      <span style={{ fontSize: '11px', fontWeight: 'normal' }}>
                        ({Math.round((submission.final_score / assignment.max_score) * 100)}%)
                      </span>
                    </span>
                  )}
                  
                  {submission?.ai_score !== null && submission?.final_score === null && (
                    <span style={{ fontSize: '11px', color: '#854F0B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Icon name="robot" size={11} />
                      AI Score: {submission.ai_score}/{assignment.max_score}
                    </span>
                  )}
                  
                  {submission?.ai_detection_score >= 50 && (
                    <Badge color="red" icon="alert-triangle">
                      {submission.ai_detection_score}% AI
                    </Badge>
                  )}
                </div>
              </div>
              
              <div style={{ flexShrink: 0 }}>
                {actionButton}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}