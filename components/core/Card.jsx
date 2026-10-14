'use client';
import React from 'react';
export function Card({ image, eyebrow, title, description, tag, footer, href }) {
  const [isHover, setHover] = React.useState(false);
  return React.createElement('a', {
    href: href || '#', onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false),
    style: {
      display: 'flex', flexDirection: 'column', width: '100%', textDecoration: 'none',
      background: 'var(--rse-color-surface-card)', borderRadius: 'var(--rse-radius-lg)', overflow: 'hidden',
      boxShadow: isHover ? 'var(--rse-shadow-md)' : 'var(--rse-shadow-sm)',
      transform: isHover ? 'translateY(-4px)' : 'translateY(0)',
      transition: 'transform var(--rse-duration-base) var(--rse-ease-out), box-shadow var(--rse-duration-base) var(--rse-ease-standard)',
      border: '1px solid var(--rse-color-border-subtle)'
    }
  },
    image ? React.createElement('div', { style: { width: '100%', aspectRatio: '16/10', overflow: 'hidden' } }, image) : null,
    React.createElement('div', { style: { padding: 'var(--rse-space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--rse-space-2)', flex: 1 } },
      tag ? React.createElement('div', null, tag) : null,
      eyebrow ? React.createElement('span', { style: { fontSize: 'var(--rse-font-size-eyebrow)', fontWeight: 'var(--rse-font-weight-bold)', letterSpacing: 'var(--rse-letter-spacing-eyebrow)', textTransform: 'uppercase', color: 'var(--rse-color-primary)' } }, eyebrow) : null,
      React.createElement('h3', { style: { fontSize: 'var(--rse-font-size-h4)', margin: 0 } }, title),
      description ? React.createElement('p', { style: { color: 'var(--rse-color-text-muted)', fontSize: 'var(--rse-font-size-body-sm)', margin: 0 } }, description) : null,
      footer ? React.createElement('div', { style: { marginTop: 'auto', paddingTop: 'var(--rse-space-3)' } }, footer) : null
    )
  );
}
