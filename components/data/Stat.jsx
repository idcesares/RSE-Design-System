import React from 'react';
export function Stat({ value, label, description, accent = 'primary', align = 'left', size = 'md' }) {
  const accents = {
    primary: 'var(--rse-color-primary)', indigo: 'var(--rse-brand-indigo)', pink: 'var(--rse-brand-pink-dark)',
    orange: 'var(--rse-brand-orange-dark)', green: 'var(--rse-brand-green-dark)', blue: 'var(--rse-brand-blue-dark)',
    yellow: 'var(--rse-color-tint-yellow-ink)', inverse: 'var(--rse-color-text-inverse)'
  };
  const valueSize = size === 'lg' ? 'var(--rse-font-size-display-2)' : size === 'sm' ? 'var(--rse-font-size-h2)' : 'var(--rse-font-size-h1)';
  return React.createElement('div', {
    style: { display: 'flex', flexDirection: 'column', gap: 'var(--rse-space-2)', textAlign: align, alignItems: align === 'center' ? 'center' : 'flex-start' }
  },
    React.createElement('span', {
      style: {
        fontSize: valueSize, fontWeight: 'var(--rse-font-weight-black)', lineHeight: 'var(--rse-line-height-tight)',
        letterSpacing: 'var(--rse-letter-spacing-tight)', color: accents[accent] || accents.primary,
        fontFamily: 'var(--rse-font-family)'
      }
    }, value),
    React.createElement('span', {
      style: {
        fontSize: 'var(--rse-font-size-eyebrow)', textTransform: 'uppercase', letterSpacing: 'var(--rse-letter-spacing-eyebrow)',
        fontWeight: 'var(--rse-font-weight-bold)',
        color: accent === 'inverse' ? 'rgba(255,255,255,0.8)' : 'var(--rse-color-text-muted)'
      }
    }, label),
    description ? React.createElement('p', {
      style: {
        marginTop: 'var(--rse-space-1)', fontSize: 'var(--rse-font-size-body-sm)', lineHeight: 'var(--rse-line-height-body)',
        color: accent === 'inverse' ? 'rgba(255,255,255,0.85)' : 'var(--rse-color-text-body)', maxWidth: '32ch'
      }
    }, description) : null
  );
}
