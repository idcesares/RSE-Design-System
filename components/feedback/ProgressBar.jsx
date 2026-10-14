import React from 'react';
export function ProgressBar({ value = 0, tone = 'primary', label, ariaLabel }) {
  const clamped = Math.max(0, Math.min(100, value));
  const fg = tone === 'success' ? 'var(--rse-color-success)' : tone === 'danger' ? 'var(--rse-color-danger)' : 'var(--rse-color-primary)';
  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 6, width: '100%', fontFamily: 'var(--rse-font-family)' } },
    label ? React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: 'var(--rse-font-size-caption)', color: 'var(--rse-color-text-muted)' } },
      React.createElement('span', null, label), React.createElement('span', null, `${clamped}%`)
    ) : null,
    React.createElement('div', {
      role: 'progressbar',
      'aria-valuenow': clamped, 'aria-valuemin': 0, 'aria-valuemax': 100,
      'aria-label': ariaLabel || label || 'Progresso',
      style: { width: '100%', height: 8, borderRadius: 'var(--rse-radius-pill)', background: 'var(--rse-color-surface-sunken)', overflow: 'hidden' }
    },
      React.createElement('div', { style: { width: `${clamped}%`, height: '100%', borderRadius: 'var(--rse-radius-pill)', background: fg, transition: 'width var(--rse-duration-base) var(--rse-ease-standard)' } })
    )
  );
}
