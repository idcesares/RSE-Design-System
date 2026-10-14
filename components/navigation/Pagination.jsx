import React from 'react';
import { Icon } from '../core/Icon.jsx';
export function Pagination({ page = 1, totalPages = 1, onChange }) {
  const go = p => { if (p >= 1 && p <= totalPages && p !== page && onChange) onChange(p); };
  const pages = [];
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - page) <= 1) pages.push(p);
    else if (pages[pages.length - 1] !== '...') pages.push('...');
  }
  const btnStyle = active => ({
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 36, height: 36, borderRadius: 'var(--rse-radius-pill)', border: 'none', cursor: 'pointer',
    fontFamily: 'var(--rse-font-family)', fontSize: 'var(--rse-font-size-body-sm)', fontWeight: 'var(--rse-font-weight-semibold)',
    background: active ? 'var(--rse-color-primary)' : 'transparent', color: active ? 'var(--rse-color-text-on-primary)' : 'var(--rse-color-text-body)'
  });
  return React.createElement('nav', { 'aria-label': 'Paginação', style: { display: 'inline-flex', alignItems: 'center', gap: 4 } },
    React.createElement('button', { onClick: () => go(page - 1), disabled: page === 1, 'aria-label': 'Página anterior', style: { ...btnStyle(false), opacity: page === 1 ? 0.4 : 1, cursor: page === 1 ? 'not-allowed' : 'pointer' } }, React.createElement(Icon, { name: 'chevron-left', size: 16 })),
    pages.map((p, i) => p === '...'
      ? React.createElement('span', { key: `e${i}`, style: { padding: '0 6px', color: 'var(--rse-color-text-muted)' } }, '\u2026')
      : React.createElement('button', { key: p, onClick: () => go(p), 'aria-current': p === page ? 'page' : undefined, style: btnStyle(p === page) }, p)
    ),
    React.createElement('button', { onClick: () => go(page + 1), disabled: page === totalPages, 'aria-label': 'Próxima página', style: { ...btnStyle(false), opacity: page === totalPages ? 0.4 : 1, cursor: page === totalPages ? 'not-allowed' : 'pointer' } }, React.createElement(Icon, { name: 'chevron-right', size: 16 }))
  );
}
