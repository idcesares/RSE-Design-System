import React from 'react';
export function Avatar({ src, alt, initials, size = 'md', status }) {
  const dims = { sm: 32, md: 44, lg: 64 };
  const fontSizes = { sm: 'var(--rse-font-size-caption)', md: 'var(--rse-font-size-body-sm)', lg: 'var(--rse-font-size-h4)' };
  const dim = dims[size];
  const statusColors = { online: 'var(--rse-color-success)', offline: 'var(--rse-brand-gray-400)', away: 'var(--rse-color-warning)' };
  return React.createElement('span', { style: { position: 'relative', display: 'inline-flex', width: dim, height: dim, flexShrink: 0 } },
    src
      ? React.createElement('img', { src, alt: alt || '', style: { width: dim, height: dim, borderRadius: '50%', objectFit: 'cover', display: 'block' } })
      : React.createElement('span', {
        style: {
          width: dim, height: dim, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--rse-color-surface-primary-tint)', color: 'var(--rse-color-text-on-primary-tint)', fontFamily: 'var(--rse-font-family)',
          fontWeight: 'var(--rse-font-weight-semibold)', fontSize: fontSizes[size], letterSpacing: '0.02em'
        }
      }, (initials || '?').slice(0, 2).toUpperCase()),
    status ? React.createElement('span', {
      style: {
        position: 'absolute', bottom: -1, right: -1, width: Math.max(8, dim * 0.28), height: Math.max(8, dim * 0.28),
        borderRadius: '50%', background: statusColors[status] || statusColors.offline, border: '2px solid var(--rse-color-surface-card)'
      }
    }) : null
  );
}
