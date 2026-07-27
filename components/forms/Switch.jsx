import React from 'react';
export function Switch({ label, checked, onChange, disabled }) {
  return React.createElement('label', { style: { position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-family-base)', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1 } },
    React.createElement('input', { type: 'checkbox', role: 'switch', className: 'rede-control-input', checked, onChange, disabled }),
    React.createElement('span', {
      className: 'rede-control-box',
      style: {
        width: 40, height: 24, borderRadius: 'var(--radius-pill)', padding: 3, boxSizing: 'border-box',
        background: checked ? 'var(--color-primary)' : 'var(--gray-300)',
        transition: 'background var(--duration-base) var(--ease-standard)', display: 'inline-flex', alignItems: 'center'
      }
    }, React.createElement('span', {
      style: {
        width: 18, height: 18, borderRadius: '50%', background: 'white',
        transform: checked ? 'translateX(16px)' : 'translateX(0)',
        transition: 'transform var(--duration-base) var(--ease-standard)', boxShadow: 'var(--shadow-sm)'
      }
    })),
    label ? React.createElement('span', { style: { fontSize: 'var(--text-body-md)', color: 'var(--text-body)' } }, label) : null
  );
}
