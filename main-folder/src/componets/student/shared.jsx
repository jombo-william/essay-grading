import {
  AlertCircle,
  Info,
  CheckCircle2,
  X,
} from "lucide-react";

export const COLORS = {
  purple: { bg: '#EEEDFE', border: '#CECBF6', text: '#3C3489', dark: '#26215C' },
  blue:   { bg: '#E6F1FB', border: '#B5D4F4', text: '#185FA5', dark: '#042C53' },
  green:  { bg: '#EAF3DE', border: '#C0DD97', text: '#3B6D11', dark: '#173404' },
  amber:  { bg: '#FAEEDA', border: '#FAC775', text: '#854F0B', dark: '#412402' },
  red:    { bg: '#FCEBEB', border: '#F7C1C1', text: '#A32D2D', dark: '#501313' },
  gray:   { bg: '#F1EFE8', border: '#D3D1C7', text: '#5F5E5A', dark: '#2C2C2A' },
};

export const C = {
  page:   { minHeight: '100vh', background: '#F8F7FF', fontFamily: "'DM Sans','Segoe UI',sans-serif" },
  header: {
    background: '#fff',
    borderBottom: '1px solid #E8E6FF',
    padding: '0 24px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 1px 0 #E8E6FF',
  },
  main: { maxWidth: '1100px', margin: '0 auto', padding: '24px 20px 60px' },
  card: {
    background: '#fff',
    borderRadius: '12px',
    border: '1px solid #ECECF2',
    padding: '18px 20px',
    marginBottom: '10px',
  },
  sL: {
    display: 'block',
    fontSize: '11px',
    fontWeight: '600',
    color: '#8884A8',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    marginBottom: '6px',
  },
  tab: active => ({
    padding: '7px 14px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    background: active ? '#fff' : 'transparent',
    color: active ? '#3C3489' : '#6B6890',
    boxShadow: active ? '0 1px 4px rgba(60,52,137,0.10)' : 'none',
    transition: 'all 0.15s',
    whiteSpace: 'nowrap',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  }),
  badge: color => {
    const c = COLORS[color] || COLORS.blue;
    return {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '2px 9px',
      borderRadius: '20px',
      fontSize: '11px',
      fontWeight: '500',
      background: c.bg,
      color: c.text,
      border: `1px solid ${c.border}`,
    };
  },
  pBtn: disabled => ({
    flex: 2,
    padding: '12px',
    background: disabled ? '#AFA9EC' : '#3C3489',
    border: 'none',
    borderRadius: '10px',
    color: '#fff',
    fontWeight: '500',
    fontSize: '14px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '7px',
  }),
  gBtn: {
    flex: 1,
    padding: '12px',
    background: '#F1EFE8',
    border: '1px solid #D3D1C7',
    borderRadius: '10px',
    color: '#5F5E5A',
    fontWeight: '500',
    fontSize: '14px',
    cursor: 'pointer',
  },
  dBtn: {
    flex: 1,
    padding: '12px',
    background: '#FCEBEB',
    border: '1px solid #F7C1C1',
    borderRadius: '10px',
    color: '#A32D2D',
    fontWeight: '500',
    fontSize: '14px',
    cursor: 'pointer',
  },
};




export function Icon({ name, size = 16, style = {}, color }) {
  return (
    <i
      className={`ti ti-${name}`}
      aria-hidden="true"
      style={{
        fontSize: `${size}px`,   // ← must be a string with 'px'
        lineHeight: 1,
        display: 'inline-block',
        color: color || 'inherit', // ← color as separate prop OR from parent
        flexShrink: 0,
        ...style,
      }}
    />
  );
}



export function Badge({ color, icon: LucideIcon, children }) {
  return (
    <span style={C.badge(color)}>
      {LucideIcon && <LucideIcon size={11} style={{ display: 'inline-block' }} />}
      {children}
    </span>
  );
}

export function Toast({ toast }) {
  if (!toast) return null;
  const map = {
    error:   { bg: '#FCEBEB', border: '#F7C1C1', text: '#A32D2D', Icon: AlertCircle },
    info:    { bg: '#E6F1FB', border: '#B5D4F4', text: '#185FA5', Icon: Info },
    success: { bg: '#EAF3DE', border: '#C0DD97', text: '#3B6D11', Icon: CheckCircle2 },
  };
  const t = map[toast.type] || map.success;
  return (
    <div style={{
      position: 'fixed', top: '16px', left: '50%', transform: 'translateX(-50%)',
      zIndex: 999, background: t.bg, border: `1px solid ${t.border}`, color: t.text,
      padding: '10px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: '500',
      boxShadow: '0 4px 16px rgba(0,0,0,0.10)', maxWidth: '90vw', textAlign: 'center',
      display: 'flex', alignItems: 'center', gap: '8px',
    }}>
      <t.Icon size={15} />
      {toast.msg}
    </div>
  );
}

export function Sheet({ onClose, title, subtitle, children, footer }) {
  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(15,13,40,0.55)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        zIndex: 200, backdropFilter: 'blur(4px)',
      }}
    >
      <div style={{
        background: '#fff',
        borderRadius: '20px 20px 0 0',
        width: '100%', maxWidth: '720px',
        maxHeight: '93vh',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 -8px 40px rgba(0,0,0,0.14)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 2px' }}>
          <div style={{ width: '36px', height: '4px', background: '#E2E0F0', borderRadius: '2px' }} />
        </div>
        <div style={{
          padding: '10px 20px 14px',
          borderBottom: '1px solid #F0EFF8',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px',
        }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontWeight: '600', fontSize: '16px', color: '#1A1830', margin: '0 0 2px', lineHeight: 1.3 }}>
              {title}
            </h2>
            {subtitle && <p style={{ fontSize: '12px', color: '#8884A8', margin: 0 }}>{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: '#F1EFE8', border: 'none', borderRadius: '50%',
              width: '30px', height: '30px', cursor: 'pointer', color: '#5F5E5A',
              flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <X size={16} />
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>{children}</div>
        {footer && (
          <div style={{ padding: '12px 20px 20px', borderTop: '1px solid #F0EFF8' }}>{footer}</div>
        )}
      </div>
    </div>
  );
}


export const scoreColor = p => p >= 70 ? '#16a34a' : p >= 50 ? '#d97706' : '#dc2626';
export const scoreLabel = p => p >= 70 ? 'Pass'    : p >= 50 ? 'Borderline' : 'Fail';
export const scoreColor = p => p >= 70 ? '#3B6D11' : p >= 50 ? '#854F0B' : '#A32D2D';
export const scoreLabel = p => p >= 70 ? 'Pass'    : p >= 50 ? 'Borderline' : 'Fail';
export const scoreBg    = p => p >= 70 ? '#EAF3DE' : p >= 50 ? '#FAEEDA'   : '#FCEBEB';

