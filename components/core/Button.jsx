'use client';
import React from 'react';
export function Button({ variant = 'primary', size = 'md', icon, disabled, children, onClick, type = 'button' }) {
  const sizes = {
    sm: { padding: '8px 18px', fontSize: 'var(--rse-font-size-body-sm)', gap: 6 },
    md: { padding: '12px 24px', fontSize: 'var(--rse-font-size-body-md)', gap: 8 },
    lg: { padding: '16px 32px', fontSize: 'var(--rse-font-size-body-lg)', gap: 10 }
  };
  const variants = {
    primary: { background: 'var(--rse-color-primary)', color: 'var(--rse-color-text-on-primary)', border: '1px solid transparent' },
    secondary: { background: 'var(--rse-color-surface-primary-tint)', color: 'var(--rse-color-text-on-primary-tint)', border: '1px solid transparent' },
    ghost: { background: 'transparent', color: 'var(--rse-color-primary)', border: '1.5px solid var(--rse-color-border-strong)' }
  };
  const hover = {
    primary: 'var(--rse-color-primary-hover)',
    secondary: 'var(--rse-color-surface-primary-tint-hover)',
    ghost: 'var(--rse-color-surface-sunken)'
  };
  const [isHover, setHover] = React.useState(false);
  const [isActive, setActive] = React.useState(false);
  const v = variants[variant];
  const s = sizes[size];
  const bg = disabled ? 'var(--rse-brand-gray-200)' : (isActive && variant === 'primary' ? 'var(--rse-color-primary-active)' : isHover ? hover[variant] : v.background);
  return React.createElement('button', {
    type,
    disabled,
    onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => { setHover(false); setActive(false); },
    onMouseDown: () => setActive(true),
    onMouseUp: () => setActive(false),
    style: {
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: s.gap,
      padding: s.padding, fontSize: s.fontSize, fontFamily: 'var(--rse-font-family)',
      fontWeight: 'var(--rse-font-weight-semibold)', borderRadius: 'var(--rse-radius-pill)',
      background: bg, color: disabled ? 'var(--rse-color-text-muted)' : v.color, border: v.border,
      cursor: disabled ? 'not-allowed' : 'pointer', transition: 'background var(--rse-duration-base) var(--rse-ease-standard), transform var(--rse-duration-fast) var(--rse-ease-out)',
      transform: isActive && !disabled ? 'scale(0.97)' : 'scale(1)', whiteSpace: 'nowrap'
    }
  }, icon ? React.createElement('span', { style: { display: 'inline-flex', width: 18, height: 18 } }, icon) : null, children);
}
