'use client';
import React from 'react';
const cx = (...c) => c.filter(Boolean).join(' ');
// Renders the CSS contract in Input.css (.rse-field + .rse-input, type=date, plus .rse-field__deadline).
// Hint/error and the deadline pill are linked with aria-describedby; an error sets aria-invalid.
// Every other prop (name, value, onChange, min, max, disabled…) goes to the <input>.
export const DateField = React.forwardRef(function DateField({ label, hint, helpText, error, required, id, deadline, className, ...rest }, ref) {
  const autoId = React.useId();
  const inputId = id || 'rse-date-' + autoId.replace(/:/g, '');
  const message = error || helpText || hint;
  const describedBy = [message ? inputId + '-msg' : null, deadline ? inputId + '-deadline' : null].filter(Boolean).join(' ');
  return React.createElement('div', { className: cx('rse-field', error && 'rse-field--invalid', className) },
    label ? React.createElement('label', { className: 'rse-field__label', htmlFor: inputId }, label,
      required ? React.createElement('span', { className: 'rse-field__required', 'aria-hidden': 'true' }, ' *') : null) : null,
    React.createElement('input', {
      ref, id: inputId, type: 'date', required, className: 'rse-input',
      'aria-invalid': error ? 'true' : undefined,
      'aria-describedby': describedBy || undefined,
      ...rest
    }),
    deadline ? React.createElement('span', { className: 'rse-field__deadline', id: inputId + '-deadline' }, deadline) : null,
    message ? React.createElement('p', { className: 'rse-field__message', id: inputId + '-msg', role: error ? 'alert' : undefined }, message) : null
  );
});
