import React from 'react';
export function Skeleton({ variant = 'text', width, height, lines = 3, radius }) {
  const shimmer = {
    background: 'linear-gradient(90deg, var(--gray-100) 25%, var(--gray-200) 37%, var(--gray-100) 63%)',
    backgroundSize: '400% 100%', animation: 'rede-shimmer 1.4s var(--ease-standard) infinite'
  };
  const r = radius || (variant === 'circle' ? 'var(--radius-pill)' : variant === 'card' ? 'var(--radius-lg)' : 'var(--radius-sm)');
  if (variant === 'text') {
    return React.createElement('div', {
      'aria-hidden': 'true',
      style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', width: width || '100%' }
    }, Array.from({ length: lines }).map((_, i) =>
      React.createElement('div', {
        key: i,
        style: { ...shimmer, height: height || 12, borderRadius: 'var(--radius-pill)', width: i === lines - 1 ? '60%' : '100%' }
      })
    ));
  }
  const dims = variant === 'circle'
    ? { width: width || 48, height: height || width || 48 }
    : { width: width || '100%', height: height || (variant === 'card' ? 180 : 16) };
  return React.createElement('div', { 'aria-hidden': 'true', style: { ...shimmer, ...dims, borderRadius: r } });
}
