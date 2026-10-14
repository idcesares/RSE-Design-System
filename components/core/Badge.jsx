import React from 'react';
export function Badge({ tone = 'neutral', children }) {
  const tones = {
    success: { bg: 'var(--rse-color-success-surface)', fg: 'var(--rse-color-success-text)', dot: 'var(--rse-color-success)' },
    warning: { bg: 'var(--rse-color-warning-surface)', fg: 'var(--rse-color-warning-text)', dot: 'var(--rse-color-warning-text)' },
    danger: { bg: 'var(--rse-color-danger-surface)', fg: 'var(--rse-color-danger-text)', dot: 'var(--rse-color-danger)' },
    info: { bg: 'var(--rse-color-info-surface)', fg: 'var(--rse-color-info-text)', dot: 'var(--rse-color-info)' },
    neutral: { bg: 'var(--rse-brand-gray-100)', fg: 'var(--rse-color-text-body)', dot: 'var(--rse-color-text-body)' },
    primary: { bg: 'var(--rse-color-surface-primary-tint)', fg: 'var(--rse-color-text-on-primary-tint)', dot: 'var(--rse-color-primary)' }
  };
  const t = tones[tone];
  return React.createElement('span', {
    style: {
      display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px',
      borderRadius: 'var(--rse-radius-pill)', fontSize: 'var(--rse-font-size-caption)',
      fontWeight: 'var(--rse-font-weight-semibold)', fontFamily: 'var(--rse-font-family)',
      letterSpacing: '0.02em', background: t.bg, color: t.fg
    }
  }, React.createElement('span', { style: { width: 6, height: 6, borderRadius: '50%', background: t.dot } }), children);
}
