'use client';
import React from 'react';
export function IconButton({ icon, ariaLabel, 'aria-label': ariaLabelAttr, variant = 'ghost', size = 'md', disabled, onClick }) {
  const label = ariaLabel || ariaLabelAttr;
  const sizes = { sm: 32, md: 40, lg: 48 };
  const dim = sizes[size];
  const variants = {
    primary: { background: 'var(--rse-color-primary)', color: 'var(--rse-color-text-on-primary)' },
    ghost: { background: 'var(--rse-color-surface-sunken)', color: 'var(--rse-color-text-heading)' }
  };
  const [isHover, setHover] = React.useState(false);
  const v = variants[variant];
  return React.createElement('button', {
    'aria-label': label, disabled, onClick,
    onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false),
    style: {
      width: dim, height: dim, borderRadius: 'var(--rse-radius-pill)', border: 'none',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      background: disabled ? 'var(--rse-brand-gray-200)' : (isHover ? (variant === 'primary' ? 'var(--rse-color-primary-hover)' : 'var(--rse-color-border-subtle)') : v.background),
      color: disabled ? 'var(--rse-color-text-muted)' : v.color, cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'background var(--rse-duration-base) var(--rse-ease-standard)'
    }
  }, React.createElement('span', { style: { width: 18, height: 18, display: 'inline-flex' } }, icon));
}
