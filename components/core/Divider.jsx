import React from 'react';
export function Divider({ orientation = 'horizontal', label }) {
  if (orientation === 'vertical') {
    return React.createElement('span', { style: { display: 'inline-block', width: 1, alignSelf: 'stretch', background: 'var(--rse-color-border-subtle)' } });
  }
  if (label) {
    return React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 12, width: '100%', fontFamily: 'var(--rse-font-family)' } },
      React.createElement('span', { style: { flex: 1, height: 1, background: 'var(--rse-color-border-subtle)' } }),
      React.createElement('span', { style: { fontSize: 'var(--rse-font-size-caption)', fontWeight: 'var(--rse-font-weight-semibold)', letterSpacing: 'var(--rse-letter-spacing-eyebrow)', textTransform: 'uppercase', color: 'var(--rse-color-text-muted)', whiteSpace: 'nowrap' } }, label),
      React.createElement('span', { style: { flex: 1, height: 1, background: 'var(--rse-color-border-subtle)' } })
    );
  }
  return React.createElement('div', { style: { width: '100%', height: 1, background: 'var(--rse-color-border-subtle)' } });
}
