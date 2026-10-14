'use client';
import React from 'react';
export function Tabs({ tabs = [], activeId, onChange, label = 'Seções' }) {
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
  return React.createElement('div', {
    role: 'tablist', 'aria-label': label, onKeyDown,
    style: { display: 'inline-flex', gap: 4, padding: 4, background: 'var(--rse-color-surface-sunken)', borderRadius: 'var(--rse-radius-pill)', fontFamily: 'var(--rse-font-family)' }
  },
    tabs.map(t => {
      const active = t.id === activeId;
      return React.createElement('button', {
        key: t.id, type: 'button', role: 'tab', id: 'tab-' + t.id,
        'aria-selected': active ? 'true' : 'false',
        'aria-controls': t.panelId,
        tabIndex: active ? 0 : -1,
        ref: el => { refs.current[t.id] = el; },
        onClick: () => onChange && onChange(t.id),
        style: {
          padding: '10px 20px', borderRadius: 'var(--rse-radius-pill)', border: 'none', cursor: 'pointer',
          fontFamily: 'var(--rse-font-family)',
          fontSize: 'var(--rse-font-size-body-sm)', fontWeight: 'var(--rse-font-weight-semibold)',
          background: active ? 'var(--rse-color-surface-card)' : 'transparent',
          color: active ? 'var(--rse-color-primary)' : 'var(--rse-color-text-muted)',
          boxShadow: active ? 'var(--rse-shadow-sm)' : 'none',
          transition: 'background var(--rse-duration-base) var(--rse-ease-standard), color var(--rse-duration-base) var(--rse-ease-standard)'
        }
      }, t.label);
    })
  );
}
