import React from 'react';
export const PlatformEntry = React.forwardRef(function PlatformEntry({
  href = '#', logoSrc, logoAlt = 'Plataforma Sesc Sab.IA', eyebrow = 'Plataforma Sesc Sab.IA',
  title = 'Aprendizagem que acompanha cada estudante',
  description = 'Avaliação diagnóstica, trilhas personalizadas e acompanhamento contínuo — o núcleo de inteligência educacional da Rede.',
  ctaLabel = 'Acessar a plataforma', tone = 'purple', note, className, ...rest
}, ref) {
  return React.createElement('section', { ...rest, ref, className: ['rse-platform-entry', tone !== 'purple' && 'rse-platform-entry--cream', className].filter(Boolean).join(' ') },
    React.createElement('div', { className: 'rse-platform-entry__content' },
      logoSrc ? React.createElement('img', { src: logoSrc, alt: logoAlt, className: 'rse-platform-entry__logo' })
        : React.createElement('span', { className: 'rse-platform-entry__eyebrow' }, eyebrow),
      React.createElement('h2', { className: 'rse-platform-entry__title' }, title),
      React.createElement('p', { className: 'rse-platform-entry__description' }, description),
      note ? React.createElement('p', { className: 'rse-platform-entry__note' }, note) : null
    ),
    React.createElement('a', { href, className: 'rse-platform-entry__link' }, ctaLabel)
  );
});
