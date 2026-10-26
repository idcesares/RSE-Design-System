'use client';
import React from 'react';
import { Icon } from '../core/Icon.jsx';
const cx = (...c) => c.filter(Boolean).join(' ');
export const Menu = React.forwardRef(function Menu({ label, items = [], align = 'left', width = 260, trigger = 'button', open: openProp, onOpenChange, className, style, onKeyDown, ...rest }, forwardedRef) {
  const [uncontrolled, setUncontrolled] = React.useState(false);
  const open = openProp !== undefined ? openProp : uncontrolled;
  const root = React.useRef(null);
  const button = React.useRef(null);
  const pendingFocus = React.useRef(null);
  const id = 'rse-menu-' + React.useId().replace(/:/g, '');
  const setOpen = (value) => { if (openProp === undefined) setUncontrolled(value); if (onOpenChange) onOpenChange(value); };
  const close = () => { setOpen(false); if (button.current) button.current.focus(); };
  React.useEffect(() => {
    if (!open) return undefined;
    if (pendingFocus.current) {
      const entries = root.current.querySelectorAll('[role="menuitem"]');
      const target = pendingFocus.current === 'last' ? entries[entries.length - 1] : entries[0];
      if (target) target.focus();
      pendingFocus.current = null;
    }
    const outside = (event) => { if (root.current && !root.current.contains(event.target)) setOpen(false); };
    document.addEventListener('mousedown', outside);
    document.addEventListener('focusin', outside);
    return () => { document.removeEventListener('mousedown', outside); document.removeEventListener('focusin', outside); };
  }, [open, onOpenChange]);
  const handleKey = (event) => {
    if (onKeyDown) onKeyDown(event);
    if (event.defaultPrevented) return;
    if (event.key === 'Escape' && open) { event.preventDefault(); event.stopPropagation(); close(); return; }
    if (event.key === 'Tab') { if (open) setOpen(false); return; }
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    if (!open) { pendingFocus.current = event.key === 'ArrowUp' || event.key === 'End' ? 'last' : 'first'; setOpen(true); return; }
    const entries = Array.from(root.current.querySelectorAll('[role="menuitem"]'));
    if (!entries.length) return;
    const index = entries.indexOf(document.activeElement);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? entries.length - 1 : (index + (event.key === 'ArrowUp' ? -1 : 1) + entries.length) % entries.length;
    entries[next].focus();
  };
  return React.createElement('div', {
    ref: (node) => { root.current = node; if (typeof forwardedRef === 'function') forwardedRef(node); else if (forwardedRef) forwardedRef.current = node; },
    className: cx('rse-menu', align === 'right' && 'rse-menu--right', trigger === 'link' && 'rse-menu--link', className),
    style: { '--rse-menu-width': width + 'px', ...style }, ...rest, onKeyDown: handleKey
  }, React.createElement('button', {
    ref: button, id: id + '-trigger', className: 'rse-menu__trigger', type: 'button', 'aria-expanded': open,
    'aria-haspopup': 'menu', 'aria-controls': open ? id : undefined,
    onClick: () => { pendingFocus.current = 'first'; setOpen(!open); }
  }, label, React.createElement('span', { className: 'rse-menu__chevron', 'aria-hidden': 'true' }, React.createElement(Icon, { name: 'chevron-down', size: 16 }))),
  open ? React.createElement('div', { className: 'rse-menu__panel', id, role: 'menu', 'aria-labelledby': id + '-trigger' }, items.map((item, i) => item.divider
    ? React.createElement('div', { key: i, className: 'rse-menu__divider', role: 'separator' })
    : item.heading ? React.createElement('div', { key: i, className: 'rse-menu__heading', role: 'presentation' }, item.heading)
    : React.createElement(item.href ? 'a' : 'button', {
      key: i, role: 'menuitem', tabIndex: -1, className: 'rse-menu__item', type: item.href ? undefined : 'button', href: item.href,
      onClick: () => { close(); if (item.onSelect) item.onSelect(); }
    }, item.icon ? React.createElement('span', { className: 'rse-menu__icon', 'aria-hidden': 'true' }, item.icon) : null,
      React.createElement('span', { className: 'rse-menu__label' }, item.label),
      item.meta ? React.createElement('span', { className: 'rse-menu__meta' }, item.meta) : null))) : null);
});
