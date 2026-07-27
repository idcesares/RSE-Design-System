'use client';
import React from 'react';
const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
export function Modal({ open, onClose, title, children, footer, size = 'md' }) {
  const panel = React.useRef(null);
  const titleId = React.useMemo(() => 'rede-modal-' + Math.random().toString(36).slice(2, 8), []);
  // Escape to close, focus moved into the dialog on open and returned to the
  // trigger on close, Tab cycled inside the panel while it is open.
  React.useEffect(() => {
    if (!open) return;
    const previous = document.activeElement;
    const node = panel.current;
    if (node) {
      const first = node.querySelector(FOCUSABLE);
      (first || node).focus();
    }
    const onKey = (e) => {
      if (e.key === 'Escape') { e.stopPropagation(); if (onClose) onClose(); return; }
      if (e.key !== 'Tab' || !panel.current) return;
      const items = Array.from(panel.current.querySelectorAll(FOCUSABLE));
      if (!items.length) return;
      const edge = e.shiftKey ? items[0] : items[items.length - 1];
      if (document.activeElement === edge) { e.preventDefault(); (e.shiftKey ? items[items.length - 1] : items[0]).focus(); }
    };
    document.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      if (previous && previous.focus) previous.focus();
    };
  }, [open, onClose]);
  if (!open) return null;
  const widths = { sm: 380, md: 520, lg: 720 };
  return React.createElement('div', {
    onClick: onClose,
    style: {
      position: 'fixed', inset: 0, background: 'var(--overlay-scrim)', backdropFilter: 'blur(2px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, zIndex: 'var(--z-modal)'
    }
  },
    React.createElement('div', {
      ref: panel, onClick: e => e.stopPropagation(), role: 'dialog', 'aria-modal': 'true',
      'aria-labelledby': title ? titleId : undefined,
      'aria-label': title ? undefined : 'Diálogo',
      tabIndex: -1,
      style: {
        width: '100%', maxWidth: widths[size], maxHeight: '85vh', overflowY: 'auto',
        background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)',
        fontFamily: 'var(--font-family-base)'
      }
    },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)' } },
        React.createElement('h3', { id: titleId, style: { fontSize: 'var(--text-h3)', margin: 0 } }, title),
        onClose ? React.createElement('button', {
          type: 'button', onClick: onClose, 'aria-label': 'Fechar',
          style: { border: 'none', background: 'var(--surface-sunken)', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', color: 'var(--text-muted)', fontSize: 16 }
        }, '×') : null
      ),
      React.createElement('div', { style: { padding: 24 } }, children),
      footer ? React.createElement('div', { style: { display: 'flex', justifyContent: 'flex-end', gap: 12, padding: '16px 24px', borderTop: '1px solid var(--border-subtle)' } }, footer) : null
    )
  );
}
