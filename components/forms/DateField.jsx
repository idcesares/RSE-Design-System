'use client';
import React from 'react';
export function DateField({ label, value, onChange, min, max, hint, error, required, disabled, id, deadline }) {
  const [focused, setFocused] = React.useState(false);
  const inputId = id || 'date-' + (label || 'field').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const borderColor = error ? 'var(--danger)' : focused ? 'var(--color-primary)' : 'var(--border-strong)';
  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontFamily: 'var(--font-family-base)' } },
    label ? React.createElement('label', {
      htmlFor: inputId,
      style: { fontSize: 'var(--text-body-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--text-heading)' }
    }, label, required ? React.createElement('span', { style: { color: 'var(--danger)' }, 'aria-hidden': 'true' }, ' *') : null) : null,
    React.createElement('input', {
      id: inputId, type: 'date', value, onChange, min, max, required, disabled,
      'aria-invalid': error ? 'true' : undefined,
      onFocus: () => setFocused(true), onBlur: () => setFocused(false),
      style: {
        width: '100%', minHeight: 'var(--hit-target-min)', padding: '10px 16px',
        fontFamily: 'var(--font-family-base)', fontSize: 'var(--text-body-md)', color: 'var(--text-heading)',
        background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
        border: '1.5px solid ' + borderColor, borderRadius: 'var(--radius-md)', outline: 'none',
        transition: 'border-color var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast) var(--ease-standard)',
        boxShadow: focused && !error ? '0 0 0 3px var(--surface-primary-tint)' : 'none'
      }
    }),
    deadline ? React.createElement('span', {
      style: {
        display: 'inline-flex', alignSelf: 'flex-start', alignItems: 'center', gap: 6,
        background: 'var(--warning-surface)', color: 'var(--warning)', borderRadius: 'var(--radius-pill)',
        padding: '4px 12px', fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-bold)'
      }
    }, deadline) : null,
    (hint || error) ? React.createElement('span', {
      style: { fontSize: 'var(--text-caption)', color: error ? 'var(--danger)' : 'var(--text-muted)' }
    }, error || hint) : null
  );
}
