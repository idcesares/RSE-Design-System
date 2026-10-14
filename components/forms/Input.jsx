'use client';
import React from 'react';
const cx = (...c) => c.filter(Boolean).join(' ');
// Renders the CSS contract in Input.css (.rse-field + .rse-input). The message is wired to the
// field with aria-describedby, and an error sets aria-invalid, so it is announced, not only red.
// Every other prop (name, value, onChange, autoComplete, inputMode…) goes to the <input>.
export const Input = React.forwardRef(function Input({ label, helpText, hint, error, id, required, type = 'text', className, ...rest }, ref) {
  const autoId = React.useId();
  const inputId = id || 'rse-input-' + autoId.replace(/:/g, '');
  const message = error || helpText || hint;
  return React.createElement('div', { className: cx('rse-field', error && 'rse-field--invalid', className) },
    label ? React.createElement('label', { className: 'rse-field__label', htmlFor: inputId }, label,
      required ? React.createElement('span', { className: 'rse-field__required', 'aria-hidden': 'true' }, ' *') : null) : null,
    React.createElement('input', {
      ref, id: inputId, type, required, className: 'rse-input',
      'aria-invalid': error ? 'true' : undefined,
      'aria-describedby': message ? inputId + '-msg' : undefined,
      ...rest
    }),
    message ? React.createElement('p', { className: 'rse-field__message', id: inputId + '-msg' }, message) : null
  );
});
