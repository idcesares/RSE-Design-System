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
  const surface = onPurple ? 'var(--sabia-purple)' : 'var(--sabia-cream)';
  const ink = onPurple ? 'var(--color-white)' : 'var(--color-ink)';
  const muted = onPurple ? 'rgba(255,255,255,0.82)' : 'var(--text-body)';
  const [hover, setHover] = React.useState(false);
  return React.createElement('section', {
    style: {
      background: surface, color: ink, borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-7) var(--space-6)', fontFamily: 'var(--font-family-base)',
      display: 'flex', gap: 'var(--space-6)', alignItems: 'center', flexWrap: 'wrap',
      boxSizing: 'border-box'
    }
  },
    React.createElement('div', { style: { flex: '1 1 320px', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' } },
      logoSrc
        ? React.createElement('img', { src: logoSrc, alt: logoAlt, style: { height: 34, display: 'block', marginBottom: 'var(--space-2)' } })
        : React.createElement('span', {
            style: {
              fontSize: 'var(--text-eyebrow)', fontWeight: 'var(--font-weight-bold)',
              letterSpacing: 'var(--letter-spacing-eyebrow)', textTransform: 'uppercase',
              color: onPurple ? 'rgba(255,255,255,0.85)' : 'var(--sabia-purple)'
            }
          }, eyebrow),
      React.createElement('h2', {
        style: { fontSize: 'var(--text-h2)', margin: 0, color: ink, letterSpacing: 'var(--letter-spacing-tight)' }
      }, title),
      React.createElement('p', {
        style: { fontSize: 'var(--text-body-md)', lineHeight: 'var(--line-height-body)', color: muted, margin: 0, maxWidth: 'var(--container-prose)' }
      }, description),
      note ? React.createElement('p', {
        style: { fontSize: 'var(--text-caption)', color: muted, margin: 0, opacity: 0.85 }
      }, note) : null
    ),
    React.createElement('a', {
      href,
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      style: {
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)',
        minHeight: 'var(--hit-target-min)', padding: '14px 28px', borderRadius: 'var(--radius-pill)',
        fontSize: 'var(--text-body-md)', fontWeight: 'var(--font-weight-semibold)', textDecoration: 'none',
        background: onPurple ? (hover ? 'var(--sabia-cream)' : 'var(--color-white)') : (hover ? 'var(--color-primary-hover)' : 'var(--sabia-purple)'),
        color: onPurple ? 'var(--sabia-purple)' : 'var(--color-white)',
        transition: 'background var(--duration-base) var(--ease-standard)', whiteSpace: 'nowrap', flexShrink: 0
      }
    }, ctaLabel)
  );
}
