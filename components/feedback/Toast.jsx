import React from 'react';
export function Toast({ tone = 'info', title, message, onClose }) {
  const tones = {
    success: { accent: 'var(--success)' },
    warning: { accent: 'var(--warning)' },
    danger: { accent: 'var(--danger)' },
    info: { accent: 'var(--info)' }
  };
  const t = tones[tone];
  return React.createElement('div', {
    style: {
      display: 'flex', alignItems: 'flex-start', gap: 12, padding: '16px 18px', maxWidth: 360,
      background: 'var(--surface-card)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)',
      borderLeft: `4px solid ${t.accent}`, fontFamily: 'var(--font-family-base)'
    }
  },
    React.createElement('div', { style: { flex: 1 } },
      title ? React.createElement('div', { style: { fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--text-body-sm)', color: 'var(--text-heading)', marginBottom: 2 } }, title) : null,
      React.createElement('div', { style: { fontSize: 'var(--text-body-sm)', color: 'var(--text-muted)' } }, message)
    ),
    onClose ? React.createElement('button', {
      onClick: onClose, 'aria-label': 'Fechar',
      style: { border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: 0 }
    }, '\u00d7') : null
  );
}
