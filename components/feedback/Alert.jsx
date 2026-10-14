import React from 'react';
export function Alert({ tone = 'info', title, message, onDismiss }) {
  const tones = {
    success: { bg: 'var(--rse-color-success-surface)', border: 'var(--rse-color-success)', fg: 'var(--rse-color-success-text)' },
    warning: { bg: 'var(--rse-color-warning-surface)', border: 'var(--rse-color-warning)', fg: 'var(--rse-color-warning-text)' },
    danger: { bg: 'var(--rse-color-danger-surface)', border: 'var(--rse-color-danger)', fg: 'var(--rse-color-danger-text)' },
    info: { bg: 'var(--rse-color-info-surface)', border: 'var(--rse-color-info)', fg: 'var(--rse-color-info-text)' }
  };
  const t = tones[tone];
  return React.createElement('div', {
    role: 'alert',
    style: {
      display: 'flex', alignItems: 'flex-start', gap: 14, width: '100%', boxSizing: 'border-box',
      padding: '16px 20px', borderRadius: 'var(--rse-radius-md)', background: t.bg,
      border: `1.5px solid ${t.border}`, fontFamily: 'var(--rse-font-family)'
    }
  },
    React.createElement('span', { style: { width: 8, height: 8, borderRadius: '50%', background: t.fg, marginTop: 6, flexShrink: 0 } }),
    React.createElement('div', { style: { flex: 1 } },
      title ? React.createElement('div', { style: { fontWeight: 'var(--rse-font-weight-semibold)', fontSize: 'var(--rse-font-size-body-sm)', color: 'var(--rse-color-text-heading)', marginBottom: 2 } }, title) : null,
      React.createElement('div', { style: { fontSize: 'var(--rse-font-size-body-sm)', color: 'var(--rse-color-text-body)', lineHeight: 'var(--rse-line-height-body)' } }, message)
    ),
    onDismiss ? React.createElement('button', {
      onClick: onDismiss, 'aria-label': 'Fechar',
      style: { border: 'none', background: 'transparent', color: t.fg, cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: 0, flexShrink: 0 }
    }, '\u00d7') : null
  );
}
