'use client';
import React from 'react';
export function Button({ variant = 'primary', size = 'md', icon, disabled, children, onClick, type = 'button' }) {
  const sizes = {
    sm: { padding: '8px 18px', fontSize: 'var(--text-body-sm)', gap: 6 },
    md: { padding: '12px 24px', fontSize: 'var(--text-body-md)', gap: 8 },
    lg: { padding: '16px 32px', fontSize: 'var(--text-body-lg)', gap: 10 }
  };
  const variants = {
    primary: { background: 'var(--color-primary)', color: 'var(--text-on-primary)', border: '1px solid transparent' },
    secondary: { background: 'var(--surface-primary-tint)', color: 'var(--color-primary)', border: '1px solid transparent' },
    ghost: { background: 'transparent', color: 'var(--color-primary)', border: '1.5px solid var(--border-strong)' }
  };
  const hover = {
    primary: 'var(--color-primary-hover)',
    secondary: 'var(--surface-primary-tint-hover)',
    ghost: 'var(--surface-sunken)'
  };
  const [isHover, setHover] = React.useState(false);
  const [isActive, setActive] = React.useState(false);
  const v = variants[variant];
  const s = sizes[size];
  const bg = disabled ? 'var(--gray-200)' : (isActive && variant === 'primary' ? 'var(--color-primary-active)' : isHover ? hover[variant] : v.background);
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
      padding: s.padding, fontSize: s.fontSize, fontFamily: 'var(--font-family-base)',
      fontWeight: 'var(--font-weight-semibold)', borderRadius: 'var(--radius-pill)',
      background: bg, color: disabled ? 'var(--text-muted)' : v.color, border: v.border,
      cursor: disabled ? 'not-allowed' : 'pointer', transition: 'background var(--duration-base) var(--ease-standard), transform var(--duration-fast) var(--ease-out)',
      transform: isActive && !disabled ? 'scale(0.97)' : 'scale(1)', whiteSpace: 'nowrap'
    }
  }, icon ? React.createElement('span', { style: { display: 'inline-flex', width: 18, height: 18 } }, icon) : null, children);
}
