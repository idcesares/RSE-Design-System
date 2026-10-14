'use client';
import React from 'react';
export function Tooltip({ label, children }) {
  const [show, setShow] = React.useState(false);
  const id = React.useMemo(() => 'rse-tip-' + Math.random().toString(36).slice(2, 8), []);
  React.useEffect(() => {
    if (!show) return;
    const onKey = (e) => { if (e.key === 'Escape') setShow(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [show]);
  // Focus/blur mirror hover so keyboard users get the tip too; the bubble is
  // wired with aria-describedby so screen readers announce it on the trigger.
  return React.createElement('span', {
    style: { position: 'relative', display: 'inline-flex' },
    'aria-describedby': show ? id : undefined,
    onMouseEnter: () => setShow(true), onMouseLeave: () => setShow(false),
    onFocus: () => setShow(true), onBlur: () => setShow(false)
  },
    children,
    show ? React.createElement('span', {
      id, role: 'tooltip',
      style: {
        position: 'absolute', bottom: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)',
        background: 'var(--rse-color-surface-inverse)', color: 'var(--rse-color-text-inverse)', padding: '6px 12px',
        borderRadius: 'var(--rse-radius-sm)', fontSize: 'var(--rse-font-size-caption)', whiteSpace: 'nowrap',
        fontFamily: 'var(--rse-font-family)', boxShadow: 'var(--rse-shadow-md)', zIndex: 'var(--rse-z-tooltip)'
      }
    }, label) : null
  );
}
