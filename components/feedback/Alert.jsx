import React from 'react';
export function Alert({ tone = 'info', title, message, onDismiss }) {
  const tones = {
    success: { bg: 'var(--success-surface)', border: 'var(--success)', fg: 'var(--success-text)' },
    warning: { bg: 'var(--warning-surface)', border: 'var(--warning)', fg: 'var(--warning-text)' },
    danger: { bg: 'var(--danger-surface)', border: 'var(--danger)', fg: 'var(--danger-text)' },
    info: { bg: 'var(--info-surface)', border: 'var(--info)', fg: 'var(--info-text)' }
  };
  const t = tones[tone];
  return React.createElement('div', {
    role: 'alert',
    style: {
      display: 'flex', alignItems: 'flex-start', gap: 14, width: '100%', boxSizing: 'border-box',
      padding: '16px 20px', borderRadius: 'var(--radius-md)', background: t.bg,
      border: `1.5px solid ${t.border}`, fontFamily: 'var(--font-family-base)'
    }
  },
    React.createElement('span', { style: { width: 8, height: 8, borderRadius: '50%', background: t.fg, marginTop: 6, flexShrink: 0 } }),
    React.createElement('div', { style: { flex: 1 } },
      title ? React.createElement('div', { style: { fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--text-body-sm)', color: 'var(--text-heading)', marginBottom: 2 } }, title) : null,
      React.createElement('div', { style: { fontSize: 'var(--text-body-sm)', color: 'var(--text-body)', lineHeight: 'var(--line-height-body)' } }, message)
    ),
    onDismiss ? React.createElement('button', {
      onClick: onDismiss, 'aria-label': 'Fechar',
      style: { border: 'none', background: 'transparent', color: t.fg, cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: 0, flexShrink: 0 }
    }, '\u00d7') : null
  );
}
