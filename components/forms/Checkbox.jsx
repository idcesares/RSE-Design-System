import React from 'react';
export function Checkbox({ label, checked, onChange, disabled }) {
  return React.createElement('label', { style: { position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: 'var(--rse-font-family)', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1 } },
    React.createElement('input', { type: 'checkbox', className: 'rse-control-input', checked, onChange, disabled }),
    React.createElement('span', {
      className: 'rse-control-box',
      style: {
        width: 20, height: 20, borderRadius: 6, flexShrink: 0,
        border: `1.5px solid ${checked ? 'var(--rse-color-primary)' : 'var(--rse-color-border-strong)'}`,
        background: checked ? 'var(--rse-color-primary)' : 'var(--rse-color-surface-card)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background var(--rse-duration-fast) var(--rse-ease-standard)'
      }
    }, checked ? React.createElement('svg', { width: 12, height: 10, viewBox: '0 0 12 10', fill: 'none' },
      React.createElement('path', { d: 'M1 5l3.5 3.5L11 1.5', stroke: 'white', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' })) : null),
    label ? React.createElement('span', { style: { fontSize: 'var(--rse-font-size-body-md)', color: 'var(--rse-color-text-body)' } }, label) : null
  );
}
