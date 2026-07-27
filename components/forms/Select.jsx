'use client';
import React from 'react';
export function Select({ label, options = [], value, onChange, placeholder, disabled }) {
  const [focused, setFocused] = React.useState(false);
  return React.createElement('label', { style: { display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'var(--font-family-base)', width: '100%' } },
    label ? React.createElement('span', { style: { fontSize: 'var(--text-body-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--text-heading)' } }, label) : null,
    React.createElement('select', {
      value, onChange, disabled, onFocus: () => setFocused(true), onBlur: () => setFocused(false),
      style: {
        padding: '12px 16px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-body-md)',
        fontFamily: 'var(--font-family-base)', color: value ? 'var(--text-heading)' : 'var(--text-muted)',
        background: disabled ? 'var(--gray-100)' : 'var(--surface-card)',
        border: `1.5px solid ${focused ? 'var(--color-primary)' : 'var(--border-strong)'}`,
        outline: 'none', appearance: 'none',
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23615d4f' stroke-width='1.6' fill='none'/%3E%3C/svg%3E\")",
        backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center'
      }
    },
      placeholder ? React.createElement('option', { value: '', disabled: true, hidden: true }, placeholder) : null,
      options.map((o, i) => React.createElement('option', { key: i, value: o.value }, o.label))
    )
  );
}
