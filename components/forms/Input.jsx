'use client';
import React from 'react';
export function Input({ label, placeholder, value, onChange, error, helpText, disabled, type = 'text' }) {
  const [focused, setFocused] = React.useState(false);
  return React.createElement('label', { style: { display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'var(--rse-font-family)', width: '100%' } },
    label ? React.createElement('span', { style: { fontSize: 'var(--rse-font-size-body-sm)', fontWeight: 'var(--rse-font-weight-semibold)', color: 'var(--rse-color-text-heading)' } }, label) : null,
    React.createElement('input', {
      type, placeholder, value, disabled, onChange,
      onFocus: () => setFocused(true), onBlur: () => setFocused(false),
      style: {
        padding: '12px 16px', borderRadius: 'var(--rse-radius-md)', fontSize: 'var(--rse-font-size-body-md)',
        fontFamily: 'var(--rse-font-family)', color: 'var(--rse-color-text-heading)',
        background: disabled ? 'var(--rse-brand-gray-100)' : 'var(--rse-color-surface-card)',
        border: `1.5px solid ${error ? 'var(--rse-color-danger)' : focused ? 'var(--rse-color-primary)' : 'var(--rse-color-border-strong)'}`,
        outline: 'none', boxShadow: focused ? '0 0 0 3px var(--rse-color-surface-primary-tint)' : 'none',
        transition: 'border var(--rse-duration-fast) var(--rse-ease-standard), box-shadow var(--rse-duration-fast) var(--rse-ease-standard)'
      }
    }),
    error ? React.createElement('span', { style: { fontSize: 'var(--rse-font-size-caption)', color: 'var(--rse-color-danger-text)' } }, error)
      : helpText ? React.createElement('span', { style: { fontSize: 'var(--rse-font-size-caption)', color: 'var(--rse-color-text-muted)' } }, helpText) : null
  );
}
