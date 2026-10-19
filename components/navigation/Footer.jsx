import React from 'react';
const cx = (...c) => c.filter(Boolean).join(' ');
// Renders the CSS contract in Footer.css. Column count follows the `columns` array.
export const Footer = React.forwardRef(function Footer({ logoSrc, logoAlt, tagline, columns = [], note, className, ...rest }, ref) {
  return React.createElement('footer', { ref, className: cx('rse-footer', className), ...rest },
    React.createElement('div', { className: 'rse-footer__inner' },
      (logoSrc || tagline) ? React.createElement('div', { className: 'rse-footer__brand' },
        logoSrc ? React.createElement('img', { className: 'rse-footer__logo', src: logoSrc, alt: logoAlt || '' }) : null,
        tagline ? React.createElement('p', { className: 'rse-footer__tagline' }, tagline) : null
      ) : null,
      columns.length ? React.createElement('div', { className: 'rse-footer__columns' },
        columns.map((c, i) => React.createElement('nav', { key: i, className: 'rse-footer__column', 'aria-label': c.title },
          React.createElement('p', { className: 'rse-footer__title' }, c.title),
          (c.links || []).map((it, j) => React.createElement('a', { key: j, className: 'rse-footer__link', href: it.href || '#' }, it.label))
        ))
      ) : null
    ),
    note ? React.createElement('div', { className: 'rse-footer__note' }, note) : null
  );
});
