import React from 'react';
export function Navbar({ logoSrc, logoAlt, links = [], activeHref, ctaLabel, ctaHref, onCtaClick }) {
  return React.createElement('header', {
    style: { position: 'sticky', top: 0, zIndex: 'var(--rse-z-sticky)', background: 'var(--rse-color-surface-page-translucent)', backdropFilter: 'blur(8px)', borderBottom: '1px solid var(--rse-color-border-subtle)', fontFamily: 'var(--rse-font-family)' }
  },
    React.createElement('div', { style: { maxWidth: 'var(--rse-container-xl)', margin: '0 auto', padding: '16px var(--rse-container-padding)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, boxSizing: 'border-box' } },
      logoSrc ? React.createElement('img', { src: logoSrc, alt: logoAlt || '', style: { height: 34 } }) : null,
      React.createElement('nav', { style: { display: 'flex', gap: 28, flexWrap: 'wrap' } },
        links.map((l, i) => React.createElement('a', {
          key: i, href: l.href || '#',
          style: { fontSize: 'var(--rse-font-size-body-sm)', fontWeight: 'var(--rse-font-weight-semibold)', textDecoration: 'none', color: l.href === activeHref ? 'var(--rse-color-primary)' : 'var(--rse-color-text-body)' }
        }, l.label))
      ),
      ctaLabel ? React.createElement('a', {
        href: ctaHref || '#', onClick: onCtaClick,
        style: { fontWeight: 'var(--rse-font-weight-semibold)', fontSize: 'var(--rse-font-size-body-sm)', padding: '10px 22px', borderRadius: 'var(--rse-radius-pill)', background: 'var(--rse-color-primary)', color: 'var(--rse-color-text-on-primary)', textDecoration: 'none', whiteSpace: 'nowrap' }
      }, ctaLabel) : null
    )
  );
}
