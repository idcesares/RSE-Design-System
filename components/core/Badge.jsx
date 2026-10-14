import React from 'react';
export function Badge({ tone = 'neutral', children }) {
  const tones = {
    success: { bg: 'var(--success-surface)', fg: 'var(--success-text)', dot: 'var(--success)' },
    warning: { bg: 'var(--warning-surface)', fg: 'var(--warning-text)', dot: 'var(--warning-text)' },
    danger: { bg: 'var(--danger-surface)', fg: 'var(--danger-text)', dot: 'var(--danger)' },
    info: { bg: 'var(--info-surface)', fg: 'var(--info-text)', dot: 'var(--info)' },
    neutral: { bg: 'var(--gray-100)', fg: 'var(--text-body)', dot: 'var(--text-body)' },
    primary: { bg: 'var(--surface-primary-tint)', fg: 'var(--text-on-primary-tint)', dot: 'var(--color-primary)' }
  };
  const t = tones[tone];
  return React.createElement('span', {
    style: {
      display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px',
      borderRadius: 'var(--radius-pill)', fontSize: 'var(--text-caption)',
      fontWeight: 'var(--font-weight-semibold)', fontFamily: 'var(--font-family-base)',
      letterSpacing: '0.02em', background: t.bg, color: t.fg
    }
  }, React.createElement('span', { style: { width: 6, height: 6, borderRadius: '50%', background: t.dot } }), children);
}
