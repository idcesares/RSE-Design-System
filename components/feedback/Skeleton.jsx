import React from 'react';
export function Skeleton({ variant = 'text', width, height, lines = 3, radius }) {
  // 1.4s kept literal: no duration token fits a continuous loop (slow is 360ms, which shimmers too fast); loops are not transitions.
  const shimmer = {
    background: 'linear-gradient(90deg, var(--rse-brand-gray-100) 25%, var(--rse-brand-gray-200) 37%, var(--rse-brand-gray-100) 63%)',
    backgroundSize: '400% 100%', animation: 'rse-shimmer 1.4s var(--rse-ease-standard) infinite'
  };
  const r = radius || (variant === 'circle' ? 'var(--rse-radius-pill)' : variant === 'card' ? 'var(--rse-radius-lg)' : 'var(--rse-radius-sm)');
  if (variant === 'text') {
    return React.createElement('div', {
      'aria-hidden': 'true',
      style: { display: 'flex', flexDirection: 'column', gap: 'var(--rse-space-3)', width: width || '100%' }
    }, Array.from({ length: lines }).map((_, i) =>
      React.createElement('div', {
        key: i,
        style: { ...shimmer, height: height || 12, borderRadius: 'var(--rse-radius-pill)', width: i === lines - 1 ? '60%' : '100%' }
      })
    ));
  }
  const dims = variant === 'circle'
    ? { width: width || 48, height: height || width || 48 }
    : { width: width || '100%', height: height || (variant === 'card' ? 180 : 16) };
  return React.createElement('div', { 'aria-hidden': 'true', style: { ...shimmer, ...dims, borderRadius: r } });
}
