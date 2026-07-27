import React from 'react';
export function Footer({ logoSrc, logoAlt, tagline, columns = [], note }) {
  return React.createElement('footer', { style: { background: 'var(--color-ink)', color: 'var(--gray-300)', fontFamily: 'var(--font-family-base)' } },
    React.createElement('div', { style: { maxWidth: 'var(--container-max)', margin: '0 auto', padding: '64px var(--container-padding) 32px', display: 'grid', gridTemplateColumns: `1.2fr ${columns.map(() => '1fr').join(' ')}`, gap: 40, boxSizing: 'border-box' } },
      React.createElement('div', null,
        logoSrc ? React.createElement('img', { src: logoSrc, alt: logoAlt || '', style: { height: 36, marginBottom: 16, display: 'block' } }) : null,
        tagline ? React.createElement('p', { style: { fontSize: 'var(--text-body-sm)', maxWidth: 260, lineHeight: 'var(--line-height-body)', color: 'var(--gray-400)', margin: 0 } }, tagline) : null
      ),
      columns.map((c, i) => React.createElement('div', { key: i },
        React.createElement('div', { style: { fontWeight: 'var(--font-weight-semibold)', color: 'white', fontSize: 'var(--text-body-sm)', marginBottom: 14 } }, c.title),
        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 10 } },
          (c.links || []).map((it, j) => React.createElement('a', { key: j, href: it.href || '#', style: { fontSize: 'var(--text-body-sm)', color: 'var(--gray-400)', textDecoration: 'none' } }, it.label))
        )
      ))
    ),
    note ? React.createElement('div', { style: { borderTop: '1px solid var(--border-on-ink)', padding: '20px var(--container-padding)', maxWidth: 'var(--container-max)', margin: '0 auto', fontSize: 'var(--text-caption)', color: 'var(--gray-400)', boxSizing: 'border-box' } }, note) : null
  );
}
