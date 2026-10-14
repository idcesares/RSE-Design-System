'use client';
import React from 'react';
const cx = (...c) => c.filter(Boolean).join(' ');
// Renders the CSS contract in Input.css + Textarea.css, with an optional character counter.
export const Textarea = React.forwardRef(function Textarea({ label, hint, helpText, error, maxLength, rows = 4, id, required, className, ...rest }, ref) {
  const autoId = React.useId();
  const fieldId = id || 'rse-textarea-' + autoId.replace(/:/g, '');
  const message = error || hint || helpText;
  const count = typeof rest.value === 'string' ? rest.value.length : null;
  return React.createElement('div', { className: cx('rse-field', error && 'rse-field--invalid', className) },
    label ? React.createElement('label', { className: 'rse-field__label', htmlFor: fieldId }, label,
      required ? React.createElement('span', { className: 'rse-field__required', 'aria-hidden': 'true' }, ' *') : null) : null,
    React.createElement('textarea', {
      ref, id: fieldId, rows, maxLength, required, className: 'rse-input rse-textarea',
      'aria-invalid': error ? 'true' : undefined,
      'aria-describedby': message ? fieldId + '-msg' : undefined,
      ...rest
    }),
    (message || maxLength) ? React.createElement('p', { className: 'rse-field__message' },
      React.createElement('span', { id: fieldId + '-msg' }, message || ''),
      maxLength && count !== null ? React.createElement('span', { className: 'rse-field__count', 'aria-live': 'polite' }, count + '/' + maxLength) : null
    ) : null
  );
});
