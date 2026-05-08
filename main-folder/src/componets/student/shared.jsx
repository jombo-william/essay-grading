// // src/components/student/shared.jsx

// export const C = {
//   page:  { minHeight: '100vh', background: '#f8fafc', fontFamily: "'Plus Jakarta Sans','Segoe UI',sans-serif" },
//   header: { background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 20px', height: '62px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 8px rgba(0,0,0,0.05)' },
//   main:  { maxWidth: '680px', margin: '0 auto', padding: '24px 16px 60px' },
//   card:  { background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', marginBottom: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' },
//   sL:    { display: 'block', fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' },
//   tab:   a => ({ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '700', background: a ? '#fff' : 'transparent', color: a ? '#6366f1' : '#64748b', boxShadow: a ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.2s', whiteSpace: 'nowrap' }),
//   badge: c => ({ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', background: c==='green'?'#f0fdf4':c==='red'?'#fef2f2':c==='amber'?'#fffbeb':c==='purple'?'#fdf4ff':c==='gray'?'#f1f5f9':'#eff6ff', color: c==='green'?'#16a34a':c==='red'?'#dc2626':c==='amber'?'#d97706':c==='purple'?'#9333ea':c==='gray'?'#64748b':'#2563eb' }),
//   pBtn:  dis => ({ flex: 2, padding: '13px', background: dis ? '#c7d2fe' : 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: '12px', color: '#fff', fontWeight: '700', fontSize: '14px', cursor: dis ? 'not-allowed' : 'pointer', boxShadow: dis ? 'none' : '0 2px 10px rgba(99,102,241,0.4)', opacity: dis ? 0.7 : 1 }),
//   gBtn:  { flex: 1, padding: '13px', background: '#f1f5f9', border: 'none', borderRadius: '12px', color: '#64748b', fontWeight: '700', fontSize: '14px', cursor: 'pointer' },
//   dBtn:  { flex: 1, padding: '13px', background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: '12px', color: '#dc2626', fontWeight: '700', fontSize: '14px', cursor: 'pointer' },
// };

// export function Toast({ toast }) {
//   if (!toast) return null;
//   const colors = {
//     error: { bg: '#fef2f2', border: '#fecaca', text: '#dc2626' },
//     info:  { bg: '#eff6ff', border: '#bfdbfe', text: '#2563eb' },
//     success: { bg: '#f0fdf4', border: '#bbf7d0', text: '#15803d' },
//   };
//   const t = colors[toast.type] || colors.success;
//   return (
//     <div style={{ position: 'fixed', top: '16px', left: '50%', transform: 'translateX(-50%)', zIndex: 999, background: t.bg, border: `1px solid ${t.border}`, color: t.text, padding: '10px 20px', borderRadius: '12px', fontSize: '13px', fontWeight: '700', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', maxWidth: '90vw', textAlign: 'center' }}>
//       {toast.msg}
//     </div>
//   );
// }

// export function Sheet({ onClose, title, subtitle, children, footer }) {
//   return (
//     <div onClick={e => e.target === e.currentTarget && onClose()} style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 200, backdropFilter: 'blur(3px)' }}>
//       <div style={{ background: '#fff', borderRadius: '24px 24px 0 0', width: '100%', maxWidth: '700px', maxHeight: '96vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 -8px 40px rgba(0,0,0,0.18)' }}>
//         <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
//           <div style={{ width: '40px', height: '4px', background: '#e2e8f0', borderRadius: '2px' }} />
//         </div>
//         <div style={{ padding: '8px 20px 14px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
//           <div style={{ flex: 1 }}>
//             <h2 style={{ fontWeight: '800', fontSize: '17px', color: '#1e293b', margin: '0 0 2px', lineHeight: 1.3 }}>{title}</h2>
//             {subtitle && <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>{subtitle}</p>}
//           </div>
//           <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', fontSize: '18px', cursor: 'pointer', color: '#64748b', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
//         </div>
//         <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>{children}</div>
//         {footer && <div style={{ padding: '14px 20px 20px', borderTop: '1px solid #f1f5f9' }}>{footer}</div>}
//       </div>
//     </div>
//   );
// }

// export const scoreColor = p => p >= 70 ? '#16a34a' : p >= 50 ? '#d97706' : '#dc2626';
// export const scoreLabel = p => p >= 70 ? 'Pass'    : p >= 50 ? 'Borderline' : 'Fail';








// // src/components/student/shared.jsx
// // Requires Tabler Icons in index.html:
// // <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css" />

// export const COLORS = {
//   purple:  { bg: '#EEEDFE', border: '#CECBF6', text: '#3C3489', dark: '#26215C' },
//   blue:    { bg: '#E6F1FB', border: '#B5D4F4', text: '#185FA5', dark: '#042C53' },
//   green:   { bg: '#EAF3DE', border: '#C0DD97', text: '#3B6D11', dark: '#173404' },
//   amber:   { bg: '#FAEEDA', border: '#FAC775', text: '#854F0B', dark: '#412402' },
//   red:     { bg: '#FCEBEB', border: '#F7C1C1', text: '#A32D2D', dark: '#501313' },
//   gray:    { bg: '#F1EFE8', border: '#D3D1C7', text: '#5F5E5A', dark: '#2C2C2A' },
// };

// export const C = {
//   page:   { minHeight: '100vh', background: '#F8F7FF', fontFamily: "'DM Sans','Segoe UI',sans-serif" },
//   header: {
//     background: '#fff',
//     borderBottom: '1px solid #E8E6FF',
//     padding: '0 24px',
//     height: '60px',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     position: 'sticky',
//     top: 0,
//     zIndex: 100,
//     boxShadow: '0 1px 0 #E8E6FF',
//   },
//   main: { maxWidth: '1100px', margin: '0 auto', padding: '24px 20px 60px' },
//   card: {
//     background: '#fff',
//     borderRadius: '12px',
//     border: '1px solid #ECECF2',
//     padding: '18px 20px',
//     marginBottom: '10px',
//   },
//   sL: {
//     display: 'block',
//     fontSize: '11px',
//     fontWeight: '600',
//     color: '#8884A8',
//     textTransform: 'uppercase',
//     letterSpacing: '0.07em',
//     marginBottom: '6px',
//   },
//   tab: active => ({
//     padding: '7px 14px',
//     borderRadius: '8px',
//     border: 'none',
//     cursor: 'pointer',
//     fontSize: '13px',
//     fontWeight: '500',
//     background: active ? '#fff' : 'transparent',
//     color: active ? '#3C3489' : '#6B6890',
//     boxShadow: active ? '0 1px 4px rgba(60,52,137,0.10)' : 'none',
//     transition: 'all 0.15s',
//     whiteSpace: 'nowrap',
//     display: 'flex',
//     alignItems: 'center',
//     gap: '5px',
//   }),
//   badge: color => {
//     const c = COLORS[color] || COLORS.blue;
//     return {
//       display: 'inline-flex',
//       alignItems: 'center',
//       gap: '4px',
//       padding: '2px 9px',
//       borderRadius: '20px',
//       fontSize: '11px',
//       fontWeight: '500',
//       background: c.bg,
//       color: c.text,
//       border: `1px solid ${c.border}`,
//     };
//   },
//   pBtn: disabled => ({
//     flex: 2,
//     padding: '12px',
//     background: disabled ? '#AFA9EC' : '#3C3489',
//     border: 'none',
//     borderRadius: '10px',
//     color: '#fff',
//     fontWeight: '500',
//     fontSize: '14px',
//     cursor: disabled ? 'not-allowed' : 'pointer',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: '7px',
//   }),
//   gBtn: {
//     flex: 1,
//     padding: '12px',
//     background: '#F1EFE8',
//     border: '1px solid #D3D1C7',
//     borderRadius: '10px',
//     color: '#5F5E5A',
//     fontWeight: '500',
//     fontSize: '14px',
//     cursor: 'pointer',
//   },
//   dBtn: {
//     flex: 1,
//     padding: '12px',
//     background: '#FCEBEB',
//     border: '1px solid #F7C1C1',
//     borderRadius: '10px',
//     color: '#A32D2D',
//     fontWeight: '500',
//     fontSize: '14px',
//     cursor: 'pointer',
//   },
// };

// export function Icon({ name, size = 16, style = {} }) {
//   return (
//     <i
//       className={`ti ti-${name}`}
//       aria-hidden="true"
//       style={{ fontSize: size, lineHeight: 1, ...style }}
//     />
//   );
// }

// export function Badge({ color, icon, children }) {
//   return (
//     <span style={C.badge(color)}>
//       {icon && <Icon name={icon} size={11} />}
//       {children}
//     </span>
//   );
// }

// export function Toast({ toast }) {
//   if (!toast) return null;
//   const map = {
//     error:   { bg: '#FCEBEB', border: '#F7C1C1', text: '#A32D2D', icon: 'alert-circle' },
//     info:    { bg: '#E6F1FB', border: '#B5D4F4', text: '#185FA5', icon: 'info-circle' },
//     success: { bg: '#EAF3DE', border: '#C0DD97', text: '#3B6D11', icon: 'circle-check' },
//   };
//   const t = map[toast.type] || map.success;
//   return (
//     <div style={{
//       position: 'fixed', top: '16px', left: '50%', transform: 'translateX(-50%)',
//       zIndex: 999, background: t.bg, border: `1px solid ${t.border}`, color: t.text,
//       padding: '10px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: '500',
//       boxShadow: '0 4px 16px rgba(0,0,0,0.10)', maxWidth: '90vw', textAlign: 'center',
//       display: 'flex', alignItems: 'center', gap: '8px',
//     }}>
//       <Icon name={t.icon} size={15} />
//       {toast.msg}
//     </div>
//   );
// }

// // Bottom sheet for mobile / overlay panels
// export function Sheet({ onClose, title, subtitle, children, footer }) {
//   return (
//     <div
//       onClick={e => e.target === e.currentTarget && onClose()}
//       style={{
//         position: 'fixed', inset: 0,
//         background: 'rgba(15,13,40,0.55)',
//         display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
//         zIndex: 200, backdropFilter: 'blur(4px)',
//       }}
//     >
//       <div style={{
//         background: '#fff',
//         borderRadius: '20px 20px 0 0',
//         width: '100%', maxWidth: '720px',
//         maxHeight: '93vh',
//         display: 'flex', flexDirection: 'column',
//         overflow: 'hidden',
//         boxShadow: '0 -8px 40px rgba(0,0,0,0.14)',
//       }}>
//         {/* Handle */}
//         <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 2px' }}>
//           <div style={{ width: '36px', height: '4px', background: '#E2E0F0', borderRadius: '2px' }} />
//         </div>
//         {/* Header */}
//         <div style={{
//           padding: '10px 20px 14px',
//           borderBottom: '1px solid #F0EFF8',
//           display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px',
//         }}>
//           <div style={{ flex: 1 }}>
//             <h2 style={{ fontWeight: '600', fontSize: '16px', color: '#1A1830', margin: '0 0 2px', lineHeight: 1.3 }}>
//               {title}
//             </h2>
//             {subtitle && <p style={{ fontSize: '12px', color: '#8884A8', margin: 0 }}>{subtitle}</p>}
//           </div>
//           <button
//             onClick={onClose}
//             aria-label="Close"
//             style={{
//               background: '#F1EFE8', border: 'none', borderRadius: '50%',
//               width: '30px', height: '30px', cursor: 'pointer', color: '#5F5E5A',
//               flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
//             }}
//           >
//             <Icon name="x" size={16} />
//           </button>
//         </div>
//         {/* Body */}
//         <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>{children}</div>
//         {/* Footer */}
//         {footer && (
//           <div style={{ padding: '12px 20px 20px', borderTop: '1px solid #F0EFF8' }}>{footer}</div>
//         )}
//       </div>
//     </div>
//   );
// }

// export const scoreColor = p => p >= 70 ? '#3B6D11' : p >= 50 ? '#854F0B' : '#A32D2D';
// export const scoreLabel = p => p >= 70 ? 'Pass' : p >= 50 ? 'Borderline' : 'Fail';
// export const scoreBg    = p => p >= 70 ? '#EAF3DE' : p >= 50 ? '#FAEEDA' : '#FCEBEB';












// src/components/student/shared.jsx
// Requires: npm install lucide-react

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

// Icon wrapper — pass any Lucide component as `component`
// Usage: <Icon component={CheckCircle2} size={16} style={{ color: 'red' }} />
// export function Icon({ component: LucideIcon, size = 16, style = {} }) {
//   if (!LucideIcon) return null;
//   return <LucideIcon size={size} style={{ display: 'inline-block', flexShrink: 0, ...style }} />;
// }



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

export const scoreColor = p => p >= 70 ? '#3B6D11' : p >= 50 ? '#854F0B' : '#A32D2D';
export const scoreLabel = p => p >= 70 ? 'Pass'    : p >= 50 ? 'Borderline' : 'Fail';
export const scoreBg    = p => p >= 70 ? '#EAF3DE' : p >= 50 ? '#FAEEDA'   : '#FCEBEB';