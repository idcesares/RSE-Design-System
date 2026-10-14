import React from 'react';
export function Tag({ color = 'purple', children, onRemove }) {
  const colors = {
    pink: { bg: 'var(--rse-color-tint-pink)', fg: 'var(--rse-color-tint-pink-ink)' },
    orange: { bg: 'var(--rse-color-tint-orange)', fg: 'var(--rse-color-tint-orange-ink)' },
    green: { bg: 'var(--rse-color-tint-green)', fg: 'var(--rse-color-tint-green-ink)' },
    blue: { bg: 'var(--rse-color-tint-blue)', fg: 'var(--rse-color-tint-blue-ink)' },
    purple: { bg: 'var(--rse-color-tint-purple)', fg: 'var(--rse-color-tint-purple-ink)' },
    yellow: { bg: 'var(--rse-color-tint-yellow)', fg: 'var(--rse-color-tint-yellow-ink)' }
  };
  const c = colors[color];
  return React.createElement('span', {
    style: {
      display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px',
      borderRadius: 'var(--rse-radius-sm)', fontSize: 'var(--rse-font-size-body-sm)',
      fontWeight: 'var(--rse-font-weight-medium)', fontFamily: 'var(--rse-font-family)',
      background: c.bg, color: c.fg
    }
  }, children, onRemove ? React.createElement('button', {
    onClick: onRemove, 'aria-label': 'Remover',
    style: { border: 'none', background: 'transparent', color: c.fg, cursor: 'pointer', padding: 0, fontSize: '14px', lineHeight: 1, opacity: 0.7 }
  }, '\u00d7') : null);
}
