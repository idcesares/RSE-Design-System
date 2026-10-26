'use client';
import React from 'react';
import { Icon } from '../core/Icon.jsx';
const cx = (...c) => c.filter(Boolean).join(' ');
export const Accordion = React.forwardRef(function Accordion({ items = [], allowMultiple = false, defaultOpen = [], className, ...rest }, ref) {
  const [open, setOpen] = React.useState(() => new Set(defaultOpen));
  const id = 'rse-accordion-' + React.useId().replace(/:/g, '');
  const toggle = (i) => setOpen(prev => {
    const next = allowMultiple ? new Set(prev) : new Set();
    if (prev.has(i)) next.delete(i); else next.add(i);
    return next;
  });
  return React.createElement('div', { ref, className: cx('rse-accordion', className), ...rest }, items.map((item, i) => {
    const isOpen = open.has(i);
    return React.createElement('div', { key: i, className: 'rse-accordion__item' },
      React.createElement('button', {
        type: 'button', className: 'rse-accordion__trigger', id: id + '-trigger-' + i,
        'aria-expanded': isOpen, 'aria-controls': id + '-panel-' + i, onClick: () => toggle(i)
      }, React.createElement('span', null, item.title),
        React.createElement('span', { className: 'rse-accordion__icon', 'aria-hidden': 'true' }, React.createElement(Icon, { name: 'plus', size: 20 }))),
      React.createElement('div', {
        className: 'rse-accordion__panel', id: id + '-panel-' + i, 'aria-labelledby': id + '-trigger-' + i,
        'aria-hidden': !isOpen, ...(isOpen ? {} : { inert: '' })
      }, React.createElement('div', { className: 'rse-accordion__clip' },
        React.createElement('div', { className: 'rse-accordion__content' }, item.content)))
    );
  }));
});
