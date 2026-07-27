import React from 'react';
export function Avatar({ src, alt, initials, size = 'md', status }) {
  const dims = { sm: 32, md: 44, lg: 64 };
  const fontSizes = { sm: 'var(--text-caption)', md: 'var(--text-body-sm)', lg: 'var(--text-h4)' };
  const dim = dims[size];
  const statusColors = { online: 'var(--success)', offline: 'var(--gray-400)', away: 'var(--warning)' };
  return React.createElement('span', { style: { position: 'relative', display: 'inline-flex', width: dim, height: dim, flexShrink: 0 } },
    src
      ? React.createElement('img', { src, alt: alt || '', style: { width: dim, height: dim, borderRadius: '50%', objectFit: 'cover', display: 'block' } })
      : React.createElement('span', {
        style: {
          width: dim, height: dim, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--surface-primary-tint)', color: 'var(--color-primary)', fontFamily: 'var(--font-family-base)',
          fontWeight: 'var(--font-weight-semibold)', fontSize: fontSizes[size], letterSpacing: '0.02em'
        }
      }, (initials || '?').slice(0, 2).toUpperCase()),
    status ? React.createElement('span', {
      style: {
        position: 'absolute', bottom: -1, right: -1, width: Math.max(8, dim * 0.28), height: Math.max(8, dim * 0.28),
        borderRadius: '50%', background: statusColors[status] || statusColors.offline, border: '2px solid var(--surface-card)'
      }
    }) : null
  );
}
