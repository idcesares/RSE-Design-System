import React from 'react';
const cx = (...c) => c.filter(Boolean).join(' ');
export const Breadcrumb = React.forwardRef(function Breadcrumb({ items = [], className, ...rest }, ref) {
  return React.createElement('nav', { ref, 'aria-label': 'Trilha de navegação', className: cx('rse-breadcrumb', className), ...rest },
    React.createElement('ol', { className: 'rse-breadcrumb__list' },
      items.map((it, i) => {
        const last = i === items.length - 1;
        return React.createElement('li', { key: i, className: 'rse-breadcrumb__item' },
          last
            ? React.createElement('span', { 'aria-current': 'page', className: 'rse-breadcrumb__current' }, it.label)
            : React.createElement('a', { href: it.href || '#', className: 'rse-breadcrumb__link' }, it.label),
          !last ? React.createElement('span', { className: 'rse-breadcrumb__separator', 'aria-hidden': 'true' }, '/') : null
        );
      })
    )
  );
});
