'use client';
import React from 'react';
export function Menu({ label, items = [], align = 'left', width = 260, trigger = 'button', open: openProp, onOpenChange }) {
  const [uncontrolled, setUncontrolled] = React.useState(false);
  const open = openProp !== undefined ? openProp : uncontrolled;
  const setOpen = (v) => { if (openProp === undefined) setUncontrolled(v); if (onOpenChange) onOpenChange(v); };
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [open]);
  const triggerStyle = trigger === 'link'
    ? { background: 'none', border: 'none', padding: '6px 0', color: open ? 'var(--rse-color-primary)' : 'var(--rse-color-text-heading)', fontWeight: 'var(--rse-font-weight-semibold)' }
    : { background: open ? 'var(--rse-color-surface-primary-tint)' : 'var(--rse-color-surface-card)', border: '1.5px solid ' + (open ? 'var(--rse-color-primary)' : 'var(--rse-color-border-strong)'), padding: '10px 18px', color: 'var(--rse-color-text-heading)', fontWeight: 'var(--rse-font-weight-semibold)', borderRadius: 'var(--rse-radius-pill)' };
  return React.createElement('div', { ref, style: { position: 'relative', display: 'inline-block', fontFamily: 'var(--rse-font-family)' } },
    React.createElement('button', {
      type: 'button', 'aria-expanded': open, 'aria-haspopup': 'true', onClick: () => setOpen(!open),
      style: {
        display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 'var(--rse-font-size-body-sm)',
        fontFamily: 'var(--rse-font-family)', minHeight: 'var(--rse-hit-target-min)',
        transition: 'background var(--rse-duration-fast) var(--rse-ease-standard), border-color var(--rse-duration-fast) var(--rse-ease-standard)',
        ...triggerStyle
      }
    }, label, React.createElement('span', {
      'aria-hidden': 'true',
      style: { fontSize: 10, transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform var(--rse-duration-base) var(--rse-ease-standard)', color: 'var(--rse-color-primary)' }
    }, '▾')),
    open ? React.createElement('div', {
      role: 'menu',
      style: {
        position: 'absolute', top: 'calc(100% + 8px)', left: align === 'left' ? 0 : 'auto', right: align === 'right' ? 0 : 'auto',
        width, background: 'var(--rse-color-surface-card)', border: '1px solid var(--rse-color-border-subtle)',
        borderRadius: 'var(--rse-radius-md)', boxShadow: 'var(--rse-shadow-md)', padding: 'var(--rse-space-2)',
        zIndex: 'var(--rse-z-dropdown)', display: 'flex', flexDirection: 'column', gap: 2
      }
    }, items.map((item, i) => item.divider
      ? React.createElement('div', { key: i, style: { height: 1, background: 'var(--rse-color-border-subtle)', margin: '6px 8px' } })
      : item.heading
        ? React.createElement('div', {
            key: i,
            style: { padding: '10px 12px 4px', fontSize: 'var(--rse-font-size-caption)', textTransform: 'uppercase', letterSpacing: 'var(--rse-letter-spacing-eyebrow)', fontWeight: 'var(--rse-font-weight-bold)', color: 'var(--rse-color-text-muted)' }
          }, item.heading)
        : React.createElement(MenuItem, { key: i, item, onSelect: () => { setOpen(false); if (item.onSelect) item.onSelect(); } })
    )) : null
  );
}
function MenuItem({ item, onSelect }) {
  const [hover, setHover] = React.useState(false);
  return React.createElement(item.href ? 'a' : 'button', {
    role: 'menuitem', type: item.href ? undefined : 'button', href: item.href,
    onClick: onSelect, onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false),
    style: {
      display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left',
      padding: '10px 12px', borderRadius: 'var(--rse-radius-sm)', border: 'none', textDecoration: 'none',
      background: hover ? 'var(--rse-color-surface-primary-tint)' : 'transparent',
      color: hover ? 'var(--rse-color-text-on-primary-tint)' : 'var(--rse-color-text-body)',
      fontSize: 'var(--rse-font-size-body-sm)', fontFamily: 'var(--rse-font-family)',
      fontWeight: 'var(--rse-font-weight-medium)', cursor: 'pointer',
      transition: 'background var(--rse-duration-fast) var(--rse-ease-standard), color var(--rse-duration-fast) var(--rse-ease-standard)'
    }
  },
    item.icon ? React.createElement('span', { style: { display: 'inline-flex', width: 18, height: 18, flex: 'none' } }, item.icon) : null,
    React.createElement('span', { style: { flex: 1, minWidth: 0 } }, item.label),
    item.meta ? React.createElement('span', { style: { fontSize: 'var(--rse-font-size-caption)', color: 'var(--rse-color-text-muted)' } }, item.meta) : null
  );
}
