import React from 'react';
export function Switch({ label, checked, onChange, disabled }) {
  return React.createElement('label', { style: { position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: 'var(--rse-font-family)', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1 } },
    React.createElement('input', { type: 'checkbox', role: 'switch', className: 'rse-control-input', checked, onChange, disabled }),
    React.createElement('span', {
      className: 'rse-control-box',
      style: {
        width: 40, height: 24, borderRadius: 'var(--rse-radius-pill)', padding: 3, boxSizing: 'border-box',
        background: checked ? 'var(--rse-color-primary)' : 'var(--rse-brand-gray-300)',
        transition: 'background var(--rse-duration-base) var(--rse-ease-standard)', display: 'inline-flex', alignItems: 'center'
      }
    }, React.createElement('span', {
      style: {
        width: 18, height: 18, borderRadius: '50%', background: 'white',
        transform: checked ? 'translateX(16px)' : 'translateX(0)',
        transition: 'transform var(--rse-duration-base) var(--rse-ease-standard)', boxShadow: 'var(--rse-shadow-sm)'
      }
    })),
    label ? React.createElement('span', { style: { fontSize: 'var(--rse-font-size-body-md)', color: 'var(--rse-color-text-body)' } }, label) : null
  );
}
