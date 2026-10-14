'use client';
import React from 'react';
export function DateField({ label, value, onChange, min, max, hint, error, required, disabled, id, deadline }) {
  const [focused, setFocused] = React.useState(false);
  const inputId = id || 'date-' + (label || 'field').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const borderColor = error ? 'var(--rse-color-danger)' : focused ? 'var(--rse-color-primary)' : 'var(--rse-color-border-strong)';
  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--rse-space-2)', fontFamily: 'var(--rse-font-family)' } },
    label ? React.createElement('label', {
      htmlFor: inputId,
      style: { fontSize: 'var(--rse-font-size-body-sm)', fontWeight: 'var(--rse-font-weight-semibold)', color: 'var(--rse-color-text-heading)' }
    }, label, required ? React.createElement('span', { style: { color: 'var(--rse-color-danger-text)' }, 'aria-hidden': 'true' }, ' *') : null) : null,
    React.createElement('input', {
      id: inputId, type: 'date', value, onChange, min, max, required, disabled,
      'aria-invalid': error ? 'true' : undefined,
      onFocus: () => setFocused(true), onBlur: () => setFocused(false),
      style: {
        width: '100%', minHeight: 'var(--rse-hit-target-min)', padding: '10px 16px',
        fontFamily: 'var(--rse-font-family)', fontSize: 'var(--rse-font-size-body-md)', color: 'var(--rse-color-text-heading)',
        background: disabled ? 'var(--rse-color-surface-sunken)' : 'var(--rse-color-surface-card)',
        border: '1.5px solid ' + borderColor, borderRadius: 'var(--rse-radius-md)', outline: 'none',
        transition: 'border-color var(--rse-duration-fast) var(--rse-ease-standard), box-shadow var(--rse-duration-fast) var(--rse-ease-standard)',
        boxShadow: focused && !error ? '0 0 0 3px var(--rse-color-surface-primary-tint)' : 'none'
      }
    }),
    deadline ? React.createElement('span', {
      style: {
        display: 'inline-flex', alignSelf: 'flex-start', alignItems: 'center', gap: 6,
        background: 'var(--rse-color-warning-surface)', color: 'var(--rse-color-warning-text)', borderRadius: 'var(--rse-radius-pill)',
        padding: '4px 12px', fontSize: 'var(--rse-font-size-caption)', fontWeight: 'var(--rse-font-weight-bold)'
      }
    }, deadline) : null,
    (hint || error) ? React.createElement('span', {
      style: { fontSize: 'var(--rse-font-size-caption)', color: error ? 'var(--rse-color-danger-text)' : 'var(--rse-color-text-muted)' }
    }, error || hint) : null
  );
}
