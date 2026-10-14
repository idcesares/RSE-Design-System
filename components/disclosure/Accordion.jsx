'use client';
import React from 'react';
export function Accordion({ items = [], allowMultiple = false, defaultOpen = [] }) {
  const [open, setOpen] = React.useState(() => new Set(defaultOpen));
  const toggle = (i) => setOpen(prev => {
    const next = allowMultiple ? new Set(prev) : new Set();
    if (prev.has(i)) next.delete(i); else next.add(i);
    return next;
  });
  return React.createElement('div', {
    style: { display: 'flex', flexDirection: 'column', gap: 0, borderTop: '1px solid var(--rse-color-border-subtle)' }
  }, items.map((item, i) => {
    const isOpen = open.has(i);
    return React.createElement('div', { key: i, style: { borderBottom: '1px solid var(--rse-color-border-subtle)' } },
      React.createElement('button', {
        type: 'button',
        'aria-expanded': isOpen,
        onClick: () => toggle(i),
        style: {
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--rse-space-4)',
          padding: 'var(--rse-space-5) 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
          fontFamily: 'var(--rse-font-family)', fontSize: 'var(--rse-font-size-h4)',
          fontWeight: 'var(--rse-font-weight-bold)', color: 'var(--rse-color-text-heading)'
        }
      },
        React.createElement('span', null, item.title),
        React.createElement('span', {
          'aria-hidden': 'true',
          style: {
            flex: 'none', width: 28, height: 28, borderRadius: 'var(--rse-radius-pill)', display: 'inline-flex',
            alignItems: 'center', justifyContent: 'center',
            background: isOpen ? 'var(--rse-color-primary)' : 'var(--rse-color-surface-primary-tint)',
            color: isOpen ? 'var(--rse-color-text-on-primary)' : 'var(--rse-color-primary)',
            transition: 'background var(--rse-duration-base) var(--rse-ease-standard), transform var(--rse-duration-base) var(--rse-ease-standard)',
            transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)', fontSize: 20, lineHeight: 1, fontWeight: 400
          }
        }, '+')
      ),
      React.createElement('div', {
        style: {
          display: 'grid', gridTemplateRows: isOpen ? '1fr' : '0fr',
          transition: 'grid-template-rows var(--rse-duration-base) var(--rse-ease-standard)'
        }
      }, React.createElement('div', { style: { overflow: 'hidden' } },
        React.createElement('div', {
          style: {
            paddingBottom: 'var(--rse-space-5)', paddingRight: 'var(--rse-space-7)', maxWidth: 'var(--rse-container-prose)',
            fontSize: 'var(--rse-font-size-body-md)', lineHeight: 'var(--rse-line-height-body)', color: 'var(--rse-color-text-body)'
          }
        }, item.content)
      ))
    );
  }));
}
