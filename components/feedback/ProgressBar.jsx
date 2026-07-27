import React from 'react';
export function ProgressBar({ value = 0, tone = 'primary', label, ariaLabel }) {
  const clamped = Math.max(0, Math.min(100, value));
  const fg = tone === 'success' ? 'var(--success)' : tone === 'danger' ? 'var(--danger)' : 'var(--color-primary)';
  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 6, width: '100%', fontFamily: 'var(--font-family-base)' } },
    label ? React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-caption)', color: 'var(--text-muted)' } },
      React.createElement('span', null, label), React.createElement('span', null, `${clamped}%`)
    ) : null,
    React.createElement('div', {
      role: 'progressbar',
      'aria-valuenow': clamped, 'aria-valuemin': 0, 'aria-valuemax': 100,
      'aria-label': ariaLabel || label || 'Progresso',
      style: { width: '100%', height: 8, borderRadius: 'var(--radius-pill)', background: 'var(--surface-sunken)', overflow: 'hidden' }
    },
      React.createElement('div', { style: { width: `${clamped}%`, height: '100%', borderRadius: 'var(--radius-pill)', background: fg, transition: 'width var(--duration-base) var(--ease-standard)' } })
    )
  );
}
