import React from 'react';
export function Divider({ orientation = 'horizontal', label }) {
  if (orientation === 'vertical') {
    return React.createElement('span', { style: { display: 'inline-block', width: 1, alignSelf: 'stretch', background: 'var(--border-subtle)' } });
  }
  if (label) {
    return React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 12, width: '100%', fontFamily: 'var(--font-family-base)' } },
      React.createElement('span', { style: { flex: 1, height: 1, background: 'var(--border-subtle)' } }),
      React.createElement('span', { style: { fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: 'var(--letter-spacing-eyebrow)', textTransform: 'uppercase', color: 'var(--text-muted)', whiteSpace: 'nowrap' } }, label),
      React.createElement('span', { style: { flex: 1, height: 1, background: 'var(--border-subtle)' } })
    );
  }
  return React.createElement('div', { style: { width: '100%', height: 1, background: 'var(--border-subtle)' } });
}
