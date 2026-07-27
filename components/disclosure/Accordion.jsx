import React from 'react';
export function Accordion({ items = [], allowMultiple = false, defaultOpen = [] }) {
  const [open, setOpen] = React.useState(() => new Set(defaultOpen));
  const toggle = (i) => setOpen(prev => {
    const next = allowMultiple ? new Set(prev) : new Set();
    if (prev.has(i)) next.delete(i); else next.add(i);
    return next;
  });
  return React.createElement('div', {
    style: { display: 'flex', flexDirection: 'column', gap: 0, borderTop: '1px solid var(--border-subtle)' }
  }, items.map((item, i) => {
    const isOpen = open.has(i);
    return React.createElement('div', { key: i, style: { borderBottom: '1px solid var(--border-subtle)' } },
      React.createElement('button', {
        type: 'button',
        'aria-expanded': isOpen,
        onClick: () => toggle(i),
        style: {
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)',
          padding: 'var(--space-5) 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
          fontFamily: 'var(--font-family-base)', fontSize: 'var(--text-h4)',
          fontWeight: 'var(--font-weight-bold)', color: 'var(--text-heading)'
        }
      },
        React.createElement('span', null, item.title),
        React.createElement('span', {
          'aria-hidden': 'true',
          style: {
            flex: 'none', width: 28, height: 28, borderRadius: 'var(--radius-pill)', display: 'inline-flex',
            alignItems: 'center', justifyContent: 'center',
            background: isOpen ? 'var(--color-primary)' : 'var(--surface-primary-tint)',
            color: isOpen ? 'var(--text-on-primary)' : 'var(--color-primary)',
            transition: 'background var(--duration-base) var(--ease-standard), transform var(--duration-base) var(--ease-standard)',
            transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)', fontSize: 20, lineHeight: 1, fontWeight: 400
          }
        }, '+')
      ),
      React.createElement('div', {
        style: {
          display: 'grid', gridTemplateRows: isOpen ? '1fr' : '0fr',
          transition: 'grid-template-rows var(--duration-base) var(--ease-standard)'
        }
      }, React.createElement('div', { style: { overflow: 'hidden' } },
        React.createElement('div', {
          style: {
            paddingBottom: 'var(--space-5)', paddingRight: 'var(--space-7)', maxWidth: 'var(--container-prose)',
            fontSize: 'var(--text-body-md)', lineHeight: 'var(--line-height-body)', color: 'var(--text-body)'
          }
        }, item.content)
      ))
    );
  }));
}
