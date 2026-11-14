'use client';
import React from 'react';
import { Icon } from '../core/Icon.js';
const cx = (...c) => c.filter(Boolean).join(' ');
const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
export const Modal = React.forwardRef(function Modal({ open, onClose, title, children, footer, size = 'md', className, onClick, ...rest }, forwardedRef) {
  const panel = React.useRef(null);
  const close = React.useRef(onClose);
  close.current = onClose;
  const titleId = 'rse-modal-' + React.useId().replace(/:/g, '');
  React.useEffect(() => {
    if (!open) return undefined;
    const previous = document.activeElement;
    const node = panel.current;
    const focusable = () => Array.from(node.querySelectorAll(FOCUSABLE)).filter(el => el.getClientRects().length && !el.closest('[inert]'));
    (focusable()[0] || node).focus();
    const onKey = (event) => {
      if (event.key === 'Escape') { event.stopPropagation(); if (close.current) close.current(); return; }
      if (event.key !== 'Tab') return;
      const items = focusable();
      if (!items.length) { event.preventDefault(); node.focus(); return; }
      const edge = event.shiftKey ? items[0] : items[items.length - 1];
      if (document.activeElement === edge || !node.contains(document.activeElement) || document.activeElement === node) {
        event.preventDefault(); (event.shiftKey ? items[items.length - 1] : items[0]).focus();
      }
    };
    document.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      if (previous && previous.isConnected && previous.focus) previous.focus();
    };
  }, [open]);
  if (!open) return null;
  return React.createElement('div', { className: 'rse-modal-backdrop', onClick: (event) => { if (event.target === event.currentTarget && onClose) onClose(); } },
    React.createElement('div', {
      ref: (node) => { panel.current = node; if (typeof forwardedRef === 'function') forwardedRef(node); else if (forwardedRef) forwardedRef.current = node; },
      className: cx('rse-modal', 'rse-modal--' + size, className), role: 'dialog', 'aria-modal': 'true',
      'aria-labelledby': title ? titleId : undefined, 'aria-label': title ? undefined : 'Diálogo', tabIndex: -1,
      ...rest, onClick: (event) => { event.stopPropagation(); if (onClick) onClick(event); }
    }, React.createElement('div', { className: 'rse-modal__header' },
      React.createElement('h3', { className: 'rse-modal__title', id: titleId }, title),
      onClose ? React.createElement('button', { className: 'rse-modal__close', type: 'button', onClick: onClose, 'aria-label': 'Fechar' }, React.createElement(Icon, { name: 'x', size: 16 })) : null),
      React.createElement('div', { className: 'rse-modal__body' }, children),
      footer ? React.createElement('div', { className: 'rse-modal__footer' }, footer) : null));
});
