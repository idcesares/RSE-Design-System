import React from 'react';
export function Tag({ color = 'purple', children, onRemove }) {
  const colors = {
    pink: { bg: 'var(--tint-pink)', fg: 'var(--tint-pink-ink)' },
    orange: { bg: 'var(--tint-orange)', fg: 'var(--tint-orange-ink)' },
    green: { bg: 'var(--tint-green)', fg: 'var(--tint-green-ink)' },
    blue: { bg: 'var(--tint-blue)', fg: 'var(--tint-blue-ink)' },
    purple: { bg: 'var(--tint-purple)', fg: 'var(--tint-purple-ink)' },
    yellow: { bg: 'var(--tint-yellow)', fg: 'var(--tint-yellow-ink)' }
  };
  const c = colors[color];
  return React.createElement('span', {
    style: {
      display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px',
      borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-body-sm)',
      fontWeight: 'var(--font-weight-medium)', fontFamily: 'var(--font-family-base)',
      background: c.bg, color: c.fg
    }
  }, children, onRemove ? React.createElement('button', {
    onClick: onRemove, 'aria-label': 'Remover',
    style: { border: 'none', background: 'transparent', color: c.fg, cursor: 'pointer', padding: 0, fontSize: '14px', lineHeight: 1, opacity: 0.7 }
  }, '\u00d7') : null);
}
