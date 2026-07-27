import React from 'react';
export function Input({ label, placeholder, value, onChange, error, helpText, disabled, type = 'text' }) {
  const [focused, setFocused] = React.useState(false);
  return React.createElement('label', { style: { display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'var(--font-family-base)', width: '100%' } },
    label ? React.createElement('span', { style: { fontSize: 'var(--text-body-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--text-heading)' } }, label) : null,
    React.createElement('input', {
      type, placeholder, value, disabled, onChange,
      onFocus: () => setFocused(true), onBlur: () => setFocused(false),
      style: {
        padding: '12px 16px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-body-md)',
        fontFamily: 'var(--font-family-base)', color: 'var(--text-heading)',
        background: disabled ? 'var(--gray-100)' : 'var(--surface-card)',
        border: `1.5px solid ${error ? 'var(--danger)' : focused ? 'var(--color-primary)' : 'var(--border-strong)'}`,
        outline: 'none', boxShadow: focused ? '0 0 0 3px var(--surface-primary-tint)' : 'none',
        transition: 'border var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast) var(--ease-standard)'
      }
    }),
    error ? React.createElement('span', { style: { fontSize: 'var(--text-caption)', color: 'var(--danger)' } }, error)
      : helpText ? React.createElement('span', { style: { fontSize: 'var(--text-caption)', color: 'var(--text-muted)' } }, helpText) : null
  );
}
