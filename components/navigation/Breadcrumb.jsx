import React from 'react';
export function Breadcrumb({ items = [] }) {
  return React.createElement('nav', { 'aria-label': 'Breadcrumb', style: { fontFamily: 'var(--font-family-base)' } },
    React.createElement('ol', { style: { display: 'flex', alignItems: 'center', gap: 8, margin: 0, padding: 0, listStyle: 'none', flexWrap: 'wrap' } },
      items.map((it, i) => {
        const last = i === items.length - 1;
        return React.createElement('li', { key: i, style: { display: 'flex', alignItems: 'center', gap: 8 } },
          last
            ? React.createElement('span', { 'aria-current': 'page', style: { fontSize: 'var(--text-body-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--text-heading)' } }, it.label)
            : React.createElement('a', { href: it.href || '#', style: { fontSize: 'var(--text-body-sm)', color: 'var(--text-muted)', textDecoration: 'none' } }, it.label),
          !last ? React.createElement('span', { style: { color: 'var(--border-strong)', fontSize: 'var(--text-body-sm)' } }, '/') : null
        );
      })
    )
  );
}
