// src/componets/student/AssignmentsTab.jsx
import { useState } from 'react';
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
        <Icon name="clipboard-list" size={36} style={{ color: '#C0DD97', marginBottom: '12px' }} />
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
        
        let statusBadge = null;
        let actionButton = null;
        
        if (isPast && !hasSubmission) {
          statusBadge = <Badge color="gray" icon="lock">Closed</Badge>;
          actionButton = null;
        } else if (hasSubmission) {
          if (isGraded) {
            statusBadge = <Badge color="green" icon="circle-check">Graded</Badge>;
            actionButton = (
              <button
                onClick={() => onViewResult(submission)}
                style={C.smallButton}
              >
                <Icon name="chart-bar" size={12} /> View Result
              </button>
            );
          } else {
            statusBadge = <Badge color="amber" icon="clock">Submitted</Badge>;
            actionButton = (
              <button
                onClick={() => onViewEssay(submission)}
                style={C.smallButton}
              >
                <Icon name="eye" size={12} /> View Submission
              </button>
            );
          }
        } else {
          statusBadge = <Badge color="green" icon="plus">Active</Badge>;
          actionButton = (
            <button
              onClick={() => onWrite(assignment)}
              style={C.smallPrimaryButton}
            >
              <Icon name="pencil" size={12} /> Write Essay
            </button>
          );
        }
        
        return (
          <div
            key={assignment.id}
            style={{
              ...C.card,
              borderLeft: `4px solid ${isPast && !hasSubmission ? '#D3D1C7' : '#3C3489'}`,
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
                  <Badge color="purple" icon="star">{assignment.max_score} pts</Badge>
                </div>
                
                {assignment.description && (
                  <p style={{ fontSize: '13px', color: '#8884A8', margin: '0 0 8px', lineHeight: 1.5 }}>
                    {assignment.description}
                  </p>
                )}
                
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#B0AECB', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Icon name="calendar" size={11} />
                    Due {new Date(assignment.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
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
                    </span>
                  )}
                  
                  {submission?.ai_detection_score >= 50 && (
                    <Badge color="red" icon="alert-triangle">AI Flagged</Badge>
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