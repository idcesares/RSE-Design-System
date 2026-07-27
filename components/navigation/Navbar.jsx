import React from 'react';
export function Navbar({ logoSrc, logoAlt, links = [], activeHref, ctaLabel, ctaHref, onCtaClick }) {
  return React.createElement('header', {
    style: { position: 'sticky', top: 0, zIndex: 'var(--z-sticky)', background: 'var(--surface-page-translucent)', backdropFilter: 'blur(8px)', borderBottom: '1px solid var(--border-subtle)', fontFamily: 'var(--font-family-base)' }
  },
    React.createElement('div', { style: { maxWidth: 'var(--container-max)', margin: '0 auto', padding: '16px var(--container-padding)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, boxSizing: 'border-box' } },
      logoSrc ? React.createElement('img', { src: logoSrc, alt: logoAlt || '', style: { height: 34 } }) : null,
      React.createElement('nav', { style: { display: 'flex', gap: 28, flexWrap: 'wrap' } },
        links.map((l, i) => React.createElement('a', {
          key: i, href: l.href || '#',
          style: { fontSize: 'var(--text-body-sm)', fontWeight: 'var(--font-weight-semibold)', textDecoration: 'none', color: l.href === activeHref ? 'var(--color-primary)' : 'var(--text-body)' }
        }, l.label))
      ),
      ctaLabel ? React.createElement('a', {
        href: ctaHref || '#', onClick: onCtaClick,
        style: { fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--text-body-sm)', padding: '10px 22px', borderRadius: 'var(--radius-pill)', background: 'var(--color-primary)', color: 'var(--text-on-primary)', textDecoration: 'none', whiteSpace: 'nowrap' }
      }, ctaLabel) : null
    )
  );
}
