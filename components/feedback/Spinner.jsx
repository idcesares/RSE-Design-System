import React from 'react';
export function Spinner({ size = 24, tone = 'primary' }) {
  const track = tone === 'inverse' ? 'var(--rse-color-text-on-ink-muted)' : 'var(--rse-color-surface-primary-tint)';
  const head = tone === 'inverse' ? 'var(--rse-brand-white)' : 'var(--rse-color-primary)';
  const thickness = Math.max(2, Math.round(size / 8));
  return React.createElement('span', {
    role: 'status', 'aria-label': 'Carregando',
    style: {
      display: 'inline-block', width: size, height: size, borderRadius: '50%', boxSizing: 'border-box',
      border: `${thickness}px solid ${track}`, borderTopColor: head,
      // 0.8s kept literal: no duration token fits a continuous loop (slow is 360ms, which spins too fast); loops are not transitions.
      animation: 'rse-spin 0.8s linear infinite'
    }
  });
}
