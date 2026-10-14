'use client';
import React from 'react';
export function Textarea({ label, placeholder, value, onChange, rows = 4, hint, error, maxLength, required, disabled, id }) {
  const [focused, setFocused] = React.useState(false);
  const inputId = id || 'ta-' + (label || 'field').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const borderColor = error ? 'var(--rse-color-danger)' : focused ? 'var(--rse-color-primary)' : 'var(--rse-color-border-strong)';
  const count = typeof value === 'string' ? value.length : 0;
  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--rse-space-2)', fontFamily: 'var(--rse-font-family)' } },
    label ? React.createElement('label', {
      htmlFor: inputId,
      style: { fontSize: 'var(--rse-font-size-body-sm)', fontWeight: 'var(--rse-font-weight-semibold)', color: 'var(--rse-color-text-heading)' }
    }, label, required ? React.createElement('span', { style: { color: 'var(--rse-color-danger-text)' }, 'aria-hidden': 'true' }, ' *') : null) : null,
    React.createElement('textarea', {
      id: inputId, rows, placeholder, value, onChange, disabled, maxLength, required,
      'aria-invalid': error ? 'true' : undefined,
      onFocus: () => setFocused(true), onBlur: () => setFocused(false),
      style: {
        width: '100%', padding: '12px 16px', fontFamily: 'var(--rse-font-family)', fontSize: 'var(--rse-font-size-body-md)',
        lineHeight: 'var(--rse-line-height-body)', color: 'var(--rse-color-text-heading)',
        background: disabled ? 'var(--rse-color-surface-sunken)' : 'var(--rse-color-surface-card)',
        border: '1.5px solid ' + borderColor, borderRadius: 'var(--rse-radius-md)', outline: 'none', resize: 'vertical',
        transition: 'border-color var(--rse-duration-fast) var(--rse-ease-standard), box-shadow var(--rse-duration-fast) var(--rse-ease-standard)',
        boxShadow: focused && !error ? '0 0 0 3px var(--rse-color-surface-primary-tint)' : 'none'
      }
    }),
    (hint || error || maxLength) ? React.createElement('div', {
      style: { display: 'flex', justifyContent: 'space-between', gap: 'var(--rse-space-4)', fontSize: 'var(--rse-font-size-caption)' }
    },
      React.createElement('span', { style: { color: error ? 'var(--rse-color-danger-text)' : 'var(--rse-color-text-muted)' } }, error || hint || ''),
      maxLength ? React.createElement('span', { style: { color: 'var(--rse-color-text-muted)', flex: 'none' } }, count + '/' + maxLength) : null
    ) : null
  );
}
