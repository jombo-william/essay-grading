// src/components/student/shared.jsx

export const C = {
  page:  { minHeight: '100vh', background: '#f8fafc', fontFamily: "'Plus Jakarta Sans','Segoe UI',sans-serif" },
  header: { background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 20px', height: '62px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 8px rgba(0,0,0,0.05)' },
  main:  { maxWidth: '680px', margin: '0 auto', padding: '24px 16px 60px' },
  card:  { background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', marginBottom: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' },
  sL:    { display: 'block', fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' },
  tab:   a => ({ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '700', background: a ? '#fff' : 'transparent', color: a ? '#6366f1' : '#64748b', boxShadow: a ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.2s', whiteSpace: 'nowrap' }),
  badge: c => ({ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', background: c==='green'?'#f0fdf4':c==='red'?'#fef2f2':c==='amber'?'#fffbeb':c==='purple'?'#fdf4ff':c==='gray'?'#f1f5f9':'#eff6ff', color: c==='green'?'#16a34a':c==='red'?'#dc2626':c==='amber'?'#d97706':c==='purple'?'#9333ea':c==='gray'?'#64748b':'#2563eb' }),
  pBtn:  dis => ({ flex: 2, padding: '13px', background: dis ? '#c7d2fe' : 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: '12px', color: '#fff', fontWeight: '700', fontSize: '14px', cursor: dis ? 'not-allowed' : 'pointer', boxShadow: dis ? 'none' : '0 2px 10px rgba(99,102,241,0.4)', opacity: dis ? 0.7 : 1 }),
  gBtn:  { flex: 1, padding: '13px', background: '#f1f5f9', border: 'none', borderRadius: '12px', color: '#64748b', fontWeight: '700', fontSize: '14px', cursor: 'pointer' },
  dBtn:  { flex: 1, padding: '13px', background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: '12px', color: '#dc2626', fontWeight: '700', fontSize: '14px', cursor: 'pointer' },
};

export function Toast({ toast }) {
  if (!toast) return null;
  const colors = {
    error: { bg: '#fef2f2', border: '#fecaca', text: '#dc2626' },
    info:  { bg: '#eff6ff', border: '#bfdbfe', text: '#2563eb' },
    success: { bg: '#f0fdf4', border: '#bbf7d0', text: '#15803d' },
  };
  const t = colors[toast.type] || colors.success;
  return (
    <div style={{ position: 'fixed', top: '16px', left: '50%', transform: 'translateX(-50%)', zIndex: 999, background: t.bg, border: `1px solid ${t.border}`, color: t.text, padding: '10px 20px', borderRadius: '12px', fontSize: '13px', fontWeight: '700', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', maxWidth: '90vw', textAlign: 'center' }}>
      {toast.msg}
    </div>
  );
}

export function Sheet({ onClose, title, subtitle, children, footer }) {
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 200, backdropFilter: 'blur(3px)' }}>
      <div style={{ background: '#fff', borderRadius: '24px 24px 0 0', width: '100%', maxWidth: '700px', maxHeight: '96vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 -8px 40px rgba(0,0,0,0.18)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
          <div style={{ width: '40px', height: '4px', background: '#e2e8f0', borderRadius: '2px' }} />
        </div>
        <div style={{ padding: '8px 20px 14px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontWeight: '800', fontSize: '17px', color: '#1e293b', margin: '0 0 2px', lineHeight: 1.3 }}>{title}</h2>
            {subtitle && <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>{subtitle}</p>}
          </div>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', fontSize: '18px', cursor: 'pointer', color: '#64748b', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>{children}</div>
        {footer && <div style={{ padding: '14px 20px 20px', borderTop: '1px solid #f1f5f9' }}>{footer}</div>}
      </div>
    </div>
  );
}

export const scoreColor = p => p >= 70 ? '#16a34a' : p >= 50 ? '#d97706' : '#dc2626';
export const scoreLabel = p => p >= 70 ? 'Pass'    : p >= 50 ? 'Borderline' : 'Fail';