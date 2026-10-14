'use client';
import React from 'react';
export function PlatformEntry({
  href = '#',
  logoSrc,
  logoAlt = 'Plataforma Sesc Sab.IA',
  eyebrow = 'Plataforma Sesc Sab.IA',
  title = 'Aprendizagem que acompanha cada estudante',
  description = 'Avaliação diagnóstica, trilhas personalizadas e acompanhamento contínuo — o núcleo de inteligência educacional da Rede.',
  ctaLabel = 'Acessar a plataforma',
  tone = 'purple',
  note,
}) {
  const onPurple = tone === 'purple';
  const surface = onPurple ? 'var(--rse-color-sabia-purple)' : 'var(--rse-color-sabia-surface)';
  const ink = onPurple ? 'var(--rse-brand-white)' : 'var(--rse-brand-ink)';
  const muted = onPurple ? 'var(--rse-color-text-on-primary)' : 'var(--rse-color-text-body)';
  const [hover, setHover] = React.useState(false);
  return React.createElement('section', {
    style: {
      background: surface, color: ink, borderRadius: 'var(--rse-radius-lg)',
      padding: 'var(--rse-space-7) var(--rse-space-6)', fontFamily: 'var(--rse-font-family)',
      display: 'flex', gap: 'var(--rse-space-6)', alignItems: 'center', flexWrap: 'wrap',
      boxSizing: 'border-box'
    }
  },
    React.createElement('div', { style: { flex: '1 1 320px', display: 'flex', flexDirection: 'column', gap: 'var(--rse-space-3)' } },
      logoSrc
        ? React.createElement('img', { src: logoSrc, alt: logoAlt, style: { height: 34, display: 'block', marginBottom: 'var(--rse-space-2)' } })
        : React.createElement('span', {
            style: {
              fontSize: 'var(--rse-font-size-eyebrow)', fontWeight: 'var(--rse-font-weight-bold)',
              letterSpacing: 'var(--rse-letter-spacing-eyebrow)', textTransform: 'uppercase',
              color: onPurple ? 'var(--rse-color-text-on-primary)' : 'var(--rse-color-sabia-purple)'
            }
          }, eyebrow),
      React.createElement('h2', {
        style: { fontSize: 'var(--rse-font-size-h2)', margin: 0, color: ink, letterSpacing: 'var(--rse-letter-spacing-tight)' }
      }, title),
      React.createElement('p', {
        style: { fontSize: 'var(--rse-font-size-body-md)', lineHeight: 'var(--rse-line-height-body)', color: muted, margin: 0, maxWidth: 'var(--rse-container-prose)' }
      }, description),
      note ? React.createElement('p', {
        style: { fontSize: 'var(--rse-font-size-caption)', color: muted, margin: 0 }
      }, note) : null
    ),
    React.createElement('a', {
      href,
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      style: {
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--rse-space-2)',
        minHeight: 'var(--rse-hit-target-min)', padding: '14px 28px', borderRadius: 'var(--rse-radius-pill)',
        fontSize: 'var(--rse-font-size-body-md)', fontWeight: 'var(--rse-font-weight-semibold)', textDecoration: 'none',
        background: onPurple ? (hover ? 'var(--rse-color-sabia-surface)' : 'var(--rse-brand-white)') : (hover ? 'var(--rse-color-primary-hover)' : 'var(--rse-color-sabia-purple)'),
        color: onPurple ? 'var(--rse-color-sabia-purple)' : 'var(--rse-brand-white)',
        transition: 'background var(--rse-duration-base) var(--rse-ease-standard)', whiteSpace: 'nowrap', flexShrink: 0
      }
    }, ctaLabel)
  );
}
