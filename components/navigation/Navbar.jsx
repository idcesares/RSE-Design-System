import React from 'react';
const cx = (...c) => c.filter(Boolean).join(' ');
// Renders the CSS contract in Navbar.css. Hover, focus and the current-page colour live in CSS.
export const Navbar = React.forwardRef(function Navbar({ logoSrc, logoAlt, links = [], activeHref, ctaLabel, ctaHref, onCtaClick, className, ...rest }, ref) {
  return React.createElement('header', { ref, className: cx('rse-navbar', className), ...rest },
    React.createElement('div', { className: 'rse-navbar__inner' },
      logoSrc ? React.createElement('img', { className: 'rse-navbar__logo', src: logoSrc, alt: logoAlt || '' }) : null,
      links.length ? React.createElement('nav', { className: 'rse-navbar__links', 'aria-label': 'Principal' },
        links.map((l, i) => React.createElement('a', {
          key: i, className: 'rse-navbar__link', href: l.href || '#',
          'aria-current': activeHref && l.href === activeHref ? 'page' : undefined
        }, l.label))
      ) : null,
      ctaLabel ? React.createElement('a', { className: 'rse-navbar__cta', href: ctaHref || '#', onClick: onCtaClick }, ctaLabel) : null
    )
  );
});
