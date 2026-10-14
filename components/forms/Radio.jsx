import React from 'react';
export function Radio({ label, name, checked, onChange, disabled }) {
  return React.createElement('label', { style: { position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: 'var(--rse-font-family)', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1 } },
    React.createElement('input', { type: 'radio', className: 'rse-control-input', name, checked, onChange, disabled }),
    React.createElement('span', {
      className: 'rse-control-box',
      style: {
        width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
        border: `1.5px solid ${checked ? 'var(--rse-color-primary)' : 'var(--rse-color-border-strong)'}`,
        background: 'var(--rse-color-surface-card)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
      }
    }, checked ? React.createElement('span', { style: { width: 10, height: 10, borderRadius: '50%', background: 'var(--rse-color-primary)' } }) : null),
    label ? React.createElement('span', { style: { fontSize: 'var(--rse-font-size-body-md)', color: 'var(--rse-color-text-body)' } }, label) : null
  );
}
