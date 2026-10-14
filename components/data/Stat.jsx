import React from 'react';
export function Stat({ value, label, description, accent = 'primary', align = 'left', size = 'md' }) {
  const accents = {
    primary: 'var(--color-primary)', indigo: 'var(--color-indigo)', pink: 'var(--color-pink-dark)',
    orange: 'var(--color-orange-dark)', green: 'var(--color-green-dark)', blue: 'var(--color-blue-dark)',
    yellow: 'var(--tint-yellow-ink)', inverse: 'var(--text-inverse)'
  };
  const valueSize = size === 'lg' ? 'var(--text-display-2)' : size === 'sm' ? 'var(--text-h2)' : 'var(--text-h1)';
  return React.createElement('div', {
    style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', textAlign: align, alignItems: align === 'center' ? 'center' : 'flex-start' }
  },
    React.createElement('span', {
      style: {
        fontSize: valueSize, fontWeight: 'var(--font-weight-black)', lineHeight: 'var(--line-height-tight)',
        letterSpacing: 'var(--letter-spacing-tight)', color: accents[accent] || accents.primary,
        fontFamily: 'var(--font-family-base)'
      }
    }, value),
    React.createElement('span', {
      style: {
        fontSize: 'var(--text-eyebrow)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-eyebrow)',
        fontWeight: 'var(--font-weight-bold)',
        color: accent === 'inverse' ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)'
      }
    }, label),
    description ? React.createElement('p', {
      style: {
        marginTop: 'var(--space-1)', fontSize: 'var(--text-body-sm)', lineHeight: 'var(--line-height-body)',
        color: accent === 'inverse' ? 'rgba(255,255,255,0.85)' : 'var(--text-body)', maxWidth: '32ch'
      }
    }, description) : null
  );
}
