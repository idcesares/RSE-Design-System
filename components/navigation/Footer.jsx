import React from 'react';
export function Footer({ logoSrc, logoAlt, tagline, columns = [], note }) {
  return React.createElement('footer', { style: { background: 'var(--rse-brand-ink)', color: 'var(--rse-brand-gray-300)', fontFamily: 'var(--rse-font-family)' } },
    React.createElement('div', { style: { maxWidth: 'var(--rse-container-xl)', margin: '0 auto', padding: '64px var(--rse-container-padding) 32px', display: 'grid', gridTemplateColumns: `1.2fr ${columns.map(() => '1fr').join(' ')}`, gap: 40, boxSizing: 'border-box' } },
      React.createElement('div', null,
        logoSrc ? React.createElement('img', { src: logoSrc, alt: logoAlt || '', style: { height: 36, marginBottom: 16, display: 'block' } }) : null,
        tagline ? React.createElement('p', { style: { fontSize: 'var(--rse-font-size-body-sm)', maxWidth: 260, lineHeight: 'var(--rse-line-height-body)', color: 'var(--rse-brand-gray-400)', margin: 0 } }, tagline) : null
      ),
      columns.map((c, i) => React.createElement('div', { key: i },
        React.createElement('div', { style: { fontWeight: 'var(--rse-font-weight-semibold)', color: 'white', fontSize: 'var(--rse-font-size-body-sm)', marginBottom: 14 } }, c.title),
        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 10 } },
          (c.links || []).map((it, j) => React.createElement('a', { key: j, href: it.href || '#', style: { fontSize: 'var(--rse-font-size-body-sm)', color: 'var(--rse-brand-gray-400)', textDecoration: 'none' } }, it.label))
        )
      ))
    ),
    note ? React.createElement('div', { style: { borderTop: '1px solid var(--rse-color-border-on-ink)', padding: '20px var(--rse-container-padding)', maxWidth: 'var(--rse-container-xl)', margin: '0 auto', fontSize: 'var(--rse-font-size-caption)', color: 'var(--rse-brand-gray-400)', boxSizing: 'border-box' } }, note) : null
  );
}
