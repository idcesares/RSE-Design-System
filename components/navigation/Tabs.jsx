'use client';
import React from 'react';
const cx = (...c) => c.filter(Boolean).join(' ');
// Renders the CSS contract in Tabs.css.
export const Tabs = React.forwardRef(function Tabs({ tabs = [], activeId, onChange, label = 'Seções', className, ...rest }, ref) {
  const refs = React.useRef({});
  const select = (tab) => {
    if (!tab) return;
    if (onChange) onChange(tab.id);
    const el = refs.current[tab.id];
    if (el && el.focus) el.focus();
  };
  const onKeyDown = (e) => {
    const k = e.key;
    if (k !== 'ArrowRight' && k !== 'ArrowLeft' && k !== 'Home' && k !== 'End') return;
    if (!tabs.length) return;
    e.preventDefault();
    const i = tabs.findIndex(t => t.id === activeId);
    if (k === 'Home') return select(tabs[0]);
    if (k === 'End') return select(tabs[tabs.length - 1]);
    if (i < 0) return select(tabs[0]);
    select(tabs[(i + (k === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length]);
  };
  return React.createElement('div', { ref, className: cx('rse-tabs', className), ...rest },
    React.createElement('div', { className: 'rse-tabs__list', role: 'tablist', 'aria-label': label, onKeyDown },
      tabs.map(t => {
        const active = t.id === activeId;
        return React.createElement('button', {
          key: t.id, type: 'button', role: 'tab', className: 'rse-tabs__tab', id: 'tab-' + t.id,
          'aria-selected': active ? 'true' : 'false',
          'aria-controls': t.panelId,
          tabIndex: active ? 0 : -1,
          ref: el => { refs.current[t.id] = el; },
          onClick: () => onChange && onChange(t.id)
        }, t.label);
      })
    )
  );
});
