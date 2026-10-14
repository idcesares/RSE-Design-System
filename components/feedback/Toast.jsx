import React from 'react';
import { Icon } from '../core/Icon.jsx';
export function Toast({ tone = 'info', title, message, onClose }) {
  const tones = {
    success: { accent: 'var(--rse-color-success)' },
    warning: { accent: 'var(--rse-color-warning)' },
    danger: { accent: 'var(--rse-color-danger)' },
    info: { accent: 'var(--rse-color-info)' }
  };
  const t = tones[tone];
  return React.createElement('div', {
    style: {
      display: 'flex', alignItems: 'flex-start', gap: 12, padding: '16px 18px', maxWidth: 360,
      background: 'var(--rse-color-surface-card)', borderRadius: 'var(--rse-radius-md)', boxShadow: 'var(--rse-shadow-lg)',
      borderLeft: `4px solid ${t.accent}`, fontFamily: 'var(--rse-font-family)'
    }
  },
    React.createElement('div', { style: { flex: 1 } },
      title ? React.createElement('div', { style: { fontWeight: 'var(--rse-font-weight-semibold)', fontSize: 'var(--rse-font-size-body-sm)', color: 'var(--rse-color-text-heading)', marginBottom: 2 } }, title) : null,
      React.createElement('div', { style: { fontSize: 'var(--rse-font-size-body-sm)', color: 'var(--rse-color-text-muted)' } }, message)
    ),
    onClose ? React.createElement('button', {
      onClick: onClose, 'aria-label': 'Fechar',
      style: { border: 'none', background: 'transparent', color: 'var(--rse-color-text-muted)', cursor: 'pointer', display: 'inline-flex', padding: 0 }
    }, React.createElement(Icon, { name: 'x', size: 16 })) : null
  );
}
