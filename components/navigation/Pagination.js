import React from 'react';
import { Icon } from '../core/Icon.js';
export const Pagination = React.forwardRef(function Pagination({ page = 1, totalPages = 1, onChange, className, ...rest }, ref) {
  const go = p => { if (p >= 1 && p <= totalPages && p !== page && onChange) onChange(p); };
  const pages = [];
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - page) <= 1) pages.push(p);
    else if (pages[pages.length - 1] !== '...') pages.push('...');
  }
  return React.createElement('nav', { 'aria-label': 'Paginação', ...rest, ref, className: ['rse-pagination', className].filter(Boolean).join(' ') },
    React.createElement('button', { type: 'button', className: 'rse-pagination__button', onClick: () => go(page - 1), disabled: page === 1, 'aria-label': 'Página anterior' }, React.createElement(Icon, { name: 'chevron-left', size: 16 })),
    pages.map((p, i) => p === '...'
      ? React.createElement('span', { key: `e${i}`, className: 'rse-pagination__ellipsis' }, '\u2026')
      : React.createElement('button', { type: 'button', className: 'rse-pagination__button', key: p, onClick: () => go(p), 'aria-label': 'Página ' + p, 'aria-current': p === page ? 'page' : undefined }, p)
    ),
    React.createElement('button', { type: 'button', className: 'rse-pagination__button', onClick: () => go(page + 1), disabled: page === totalPages, 'aria-label': 'Próxima página' }, React.createElement(Icon, { name: 'chevron-right', size: 16 }))
  );
});
