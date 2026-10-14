'use client';
import React from 'react';
export function Textarea({ label, placeholder, value, onChange, rows = 4, hint, error, maxLength, required, disabled, id }) {
  const [focused, setFocused] = React.useState(false);
  const inputId = id || 'ta-' + (label || 'field').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const borderColor = error ? 'var(--danger)' : focused ? 'var(--color-primary)' : 'var(--border-strong)';
  const count = typeof value === 'string' ? value.length : 0;
  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontFamily: 'var(--font-family-base)' } },
    label ? React.createElement('label', {
      htmlFor: inputId,
      style: { fontSize: 'var(--text-body-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--text-heading)' }
    }, label, required ? React.createElement('span', { style: { color: 'var(--danger-text)' }, 'aria-hidden': 'true' }, ' *') : null) : null,
    React.createElement('textarea', {
      id: inputId, rows, placeholder, value, onChange, disabled, maxLength, required,
      'aria-invalid': error ? 'true' : undefined,
      onFocus: () => setFocused(true), onBlur: () => setFocused(false),
      style: {
        width: '100%', padding: '12px 16px', fontFamily: 'var(--font-family-base)', fontSize: 'var(--text-body-md)',
        lineHeight: 'var(--line-height-body)', color: 'var(--text-heading)',
        background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
        border: '1.5px solid ' + borderColor, borderRadius: 'var(--radius-md)', outline: 'none', resize: 'vertical',
        transition: 'border-color var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast) var(--ease-standard)',
        boxShadow: focused && !error ? '0 0 0 3px var(--surface-primary-tint)' : 'none'
      }
    }),
    (hint || error || maxLength) ? React.createElement('div', {
      style: { display: 'flex', justifyContent: 'space-between', gap: 'var(--space-4)', fontSize: 'var(--text-caption)' }
    },
      React.createElement('span', { style: { color: error ? 'var(--danger-text)' : 'var(--text-muted)' } }, error || hint || ''),
      maxLength ? React.createElement('span', { style: { color: 'var(--text-muted)', flex: 'none' } }, count + '/' + maxLength) : null
    ) : null
  );
}
