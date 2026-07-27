'use client';
import React from 'react';
export function Card({ image, eyebrow, title, description, tag, footer, href }) {
  const [isHover, setHover] = React.useState(false);
  return React.createElement('a', {
    href: href || '#', onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false),
    style: {
      display: 'flex', flexDirection: 'column', width: '100%', textDecoration: 'none',
      background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)', overflow: 'hidden',
      boxShadow: isHover ? 'var(--shadow-md)' : 'var(--shadow-sm)',
      transform: isHover ? 'translateY(-4px)' : 'translateY(0)',
      transition: 'transform var(--duration-base) var(--ease-out), box-shadow var(--duration-base) var(--ease-standard)',
      border: '1px solid var(--border-subtle)'
    }
  },
    image ? React.createElement('div', { style: { width: '100%', aspectRatio: '16/10', overflow: 'hidden' } }, image) : null,
    React.createElement('div', { style: { padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', flex: 1 } },
      tag ? React.createElement('div', null, tag) : null,
      eyebrow ? React.createElement('span', { style: { fontSize: 'var(--text-eyebrow)', fontWeight: 'var(--font-weight-bold)', letterSpacing: 'var(--letter-spacing-eyebrow)', textTransform: 'uppercase', color: 'var(--color-primary)' } }, eyebrow) : null,
      React.createElement('h3', { style: { fontSize: 'var(--text-h4)', margin: 0 } }, title),
      description ? React.createElement('p', { style: { color: 'var(--text-muted)', fontSize: 'var(--text-body-sm)', margin: 0 } }, description) : null,
      footer ? React.createElement('div', { style: { marginTop: 'auto', paddingTop: 'var(--space-3)' } }, footer) : null
    )
  );
}
