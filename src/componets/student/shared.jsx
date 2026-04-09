// src/components/student/shared.jsx
import React from 'react';

// ──────────────────────────────────────────────────────────────────────────
// NAVY & WHITE COLOR THEME
// ──────────────────────────────────────────────────────────────────────────
const NAVY_DARK = '#0f172a';    // Dark Navy
const NAVY_PRIMARY = '#1e3a8a'; // Primary Navy
const NAVY_LIGHT = '#3b82f6';   // Secondary Blue
const NAVY_LIGHTER = '#93c5fd'; // Lighter Accent Blue
const WHITE = '#ffffff';         // White
const GRAY_50 = '#f8fafc';       // Very Light Gray
const GRAY_100 = '#f1f5f9';      // Light Gray
const GRAY_200 = '#e2e8f0';      // Medium Light Gray
const GRAY_400 = '#cbd5e1';      // Medium Gray
const GRAY_600 = '#475569';      // Dark Gray
const GRAY_700 = '#334155';      // Darker Gray

const SUCCESS = '#10b981';       // Green
const WARNING = '#f59e0b';       // Amber
const ERROR = '#ef4444';         // Red
const GOLD = '#c9a227';          // Gold Accent

// ─────────────────────────────────────────────────────────────────────────
// MAIN STYLE CONSTANTS
// ─────────────────────────────────────────────────────────────────────────
export const C = {
  page: { 
    minHeight: '100vh', 
    background: '#f9fafb',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif',
    color: NAVY_DARK
  },
  header: { 
    background: NAVY_DARK,
    borderBottom: `3px solid ${WHITE}`,
    padding: '0 24px', 
    height: '70px', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    position: 'sticky', 
    top: 0, 
    zIndex: 100, 
    boxShadow: `0 4px 20px rgba(15, 29, 58, 0.3)`
  },
  main: { 
    maxWidth: '1000px', 
    margin: '0 auto', 
    padding: '32px 20px 80px'
  },
  card: { 
    background: WHITE,
    borderRadius: '16px', 
    border: `1px solid ${GRAY_200}`,
    padding: '24px', 
    marginBottom: '16px', 
    boxShadow: `0 2px 10px rgba(15, 29, 58, 0.08)`,
    transition: 'all 0.25s ease',
    color: NAVY_DARK,
    ':hover': {
      boxShadow: `0 6px 20px rgba(15, 29, 58, 0.12)`,
      transform: 'translateY(-2px)'
    }
  },
  sL: { 
    display: 'block', 
    fontSize: '12px', 
    fontWeight: '700', 
    color: WHITE,
    textTransform: 'uppercase', 
    letterSpacing: '0.08em', 
    marginBottom: '10px',
    opacity: 0.9
  },
  tab: a => ({
    padding: '10px 20px', 
    borderRadius: '999px', 
    border: `1px solid transparent`,
    cursor: 'pointer', 
    fontSize: '14px', 
    fontWeight: '700', 
    background: NAVY_PRIMARY,
    color: WHITE, 
    boxShadow: `0 4px 16px rgba(30, 58, 138, 0.16)`, 
    transition: 'background 0.2s ease, transform 0.2s ease', 
    whiteSpace: 'nowrap'
  }),
  badge: c => {
    const badgeColors = {
      green: { bg: '#d1fae5', color: SUCCESS },
      red: { bg: '#fee2e2', color: ERROR },
      amber: { bg: '#fef3c7', color: WARNING },
      purple: { bg: '#ede9fe', color: '#8b5cf6' },
      gray: { bg: GRAY_100, color: GRAY_600 },
      navy: { bg: '#e0e7ff', color: NAVY_PRIMARY },
      default: { bg: '#dbeafe', color: '#2563eb' }
    };
    const col = badgeColors[c] || badgeColors.default;
    return {
      display: 'inline-flex', 
      alignItems: 'center', 
      gap: '6px', 
      padding: '4px 12px', 
      borderRadius: '20px', 
      fontSize: '11px', 
      fontWeight: '700', 
      background: col.bg,
      color: col.color
    }
  },
  pBtn: dis => ({
    flex: 2, 
    padding: '14px 20px', 
    background: dis ? GRAY_400 : WHITE,
    border: 'none', 
    borderRadius: '10px', 
    color: dis ? GRAY_600 : NAVY_PRIMARY, 
    fontWeight: '700', 
    fontSize: '15px', 
    cursor: dis ? 'not-allowed' : 'pointer', 
    boxShadow: dis ? 'none' : `0 4px 14px rgba(255, 255, 255, 0.2)`,
    opacity: dis ? 0.6 : 1,
    transition: 'all 0.3s ease'
  }),
  gBtn: { 
    flex: 1, 
    padding: '14px 20px', 
    background: NAVY_LIGHTER, 
    border: `2px solid ${WHITE}`, 
    borderRadius: '10px', 
    color: WHITE, 
    fontWeight: '700', 
    fontSize: '15px', 
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  dBtn: { 
    flex: 1, 
    padding: '14px 20px', 
    background: '#fff5f5', 
    border: `2px solid ${ERROR}`, 
    borderRadius: '10px', 
    color: ERROR, 
    fontWeight: '700', 
    fontSize: '15px', 
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
};

// ─────────────────────────────────────────────────────────────────────────
// TOAST NOTIFICATION COMPONENT
// ─────────────────────────────────────────────────────────────────────────
export function Toast({ toast }) {
  if (!toast) return null;

  const colors = {
    error: { bg: '#fee2e2', border: ERROR, text: ERROR, icon: '❌' },
    info: { bg: '#dbeafe', border: '#2563eb', text: '#2563eb', icon: 'ℹ️' },
    success: { bg: '#d1fae5', border: SUCCESS, text: SUCCESS, icon: '✅' },
  };

  const t = colors[toast.type] || colors.success;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 999,
      background: t.bg,
      border: `2px solid ${t.border}`,
      color: t.text,
      padding: '14px 24px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '700',
      boxShadow: `0 8px 24px rgba(26, 46, 90, 0.15)`,
      maxWidth: '90vw',
      textAlign: 'center',
      animation: 'slideDown 0.3s ease-out',
      backdropFilter: 'blur(10px)'
    }}>
      {toast.msg}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// SHEET / MODAL COMPONENT
// ─────────────────────────────────────────────────────────────────────────
export function Sheet({ onClose, title, subtitle, children, footer }) {
  return (
    <div 
      onClick={e => e.target === e.currentTarget && onClose()} 
      style={{
        position: 'fixed',
        inset: 0,
        background: `rgba(15, 29, 58, 0.7)`,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 200,
        backdropFilter: 'blur(5px)',
        animation: 'fadeIn 0.3s ease-out'
      }}
    >
      <div style={{
        background: WHITE,
        borderRadius: '20px 20px 0 0',
        width: '100%',
        maxWidth: '700px',
        maxHeight: '96vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: `0 -12px 48px rgba(15, 29, 58, 0.25)`,
        animation: 'slideUp 0.3s ease-out'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '14px 0 6px' }}>
          <div style={{ width: '40px', height: '5px', background: NAVY_PRIMARY, borderRadius: '3px', opacity: 0.3 }} />
        </div>
        <div style={{
          padding: '16px 24px',
          borderBottom: `2px solid ${NAVY_PRIMARY}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '12px'
        }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontWeight: '800', fontSize: '18px', color: NAVY_PRIMARY, margin: '0 0 3px', lineHeight: 1.3 }}>{title}</h2>
            {subtitle && <p style={{ fontSize: '13px', color: GRAY_600, margin: 0 }}>{subtitle}</p>}
          </div>
          <button 
            onClick={onClose} 
            style={{
              background: GRAY_100, 
              border: 'none', 
              borderRadius: '50%', 
              width: '36px', 
              height: '36px', 
              fontSize: '20px', 
              cursor: 'pointer', 
              color: GRAY_600, 
              flexShrink: 0, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = NAVY_PRIMARY;
              e.currentTarget.style.color = WHITE;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = GRAY_100;
              e.currentTarget.style.color = GRAY_600;
            }}
          >
            ×
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', background: 'rgba(248, 250, 252, 0.5)' }}>
          {children}
        </div>
        {footer && <div style={{ padding: '16px 24px 24px', borderTop: `2px solid ${GRAY_200}`, background: WHITE }}>{footer}</div>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// SCORE UTILITIES
// ─────────────────────────────────────────────────────────────────────────
export const scoreColor = p => p >= 70 ? SUCCESS : p >= 50 ? WARNING : ERROR;
export const scoreLabel = p => p >= 70 ? 'Pass' : p >= 50 ? 'Borderline' : 'Fail';

// ─────────────────────────────────────────────────────────────────────────
// GLOBAL ANIMATIONS
// ─────────────────────────────────────────────────────────────────────────
export const globalStyles = `
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(100px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }

  body {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  * {
    box-sizing: border-box;
  }
`;

// ─────────────────────────────────────────────────────────────────────────
// EXPORT COLORS FOR EXTERNAL USE
// ─────────────────────────────────────────────────────────────────────────
export const COLORS = {
  NAVY_DARK,
  NAVY_PRIMARY,
  NAVY_LIGHT,
  NAVY_LIGHTER,
  WHITE,
  GRAY_50,
  GRAY_100,
  GRAY_200,
  GRAY_400,
  GRAY_600,
  GRAY_700,
  SUCCESS,
  WARNING,
  ERROR,
  GOLD
};