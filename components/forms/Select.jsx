'use client';
import React from 'react';
import { Icon } from '../core/Icon.jsx';
const cx = (...c) => c.filter(Boolean).join(' ');
// Renders the CSS contract in Select.css: a native <select>, so the platform picker, keyboard
// and screen readers all work, with the chevron drawn on top.
export const Select = React.forwardRef(function Select({ label, options = [], placeholder, helpText, hint, error, id, required, className, ...rest }, ref) {
  const autoId = React.useId();
  const selectId = id || 'rse-select-' + autoId.replace(/:/g, '');
  const message = error || helpText || hint;
  const controlled = rest.value !== undefined;
  return React.createElement('div', { className: cx('rse-field', error && 'rse-field--invalid', className) },
    label ? React.createElement('label', { className: 'rse-field__label', htmlFor: selectId }, label,
      required ? React.createElement('span', { className: 'rse-field__required', 'aria-hidden': 'true' }, ' *') : null) : null,
    React.createElement('span', { className: 'rse-select' },
      React.createElement('select', {
        ref, id: selectId, required, className: 'rse-input',
        defaultValue: !controlled && placeholder ? '' : undefined,
        'aria-invalid': error ? 'true' : undefined,
        'aria-describedby': message ? selectId + '-msg' : undefined,
        ...rest
      },
        placeholder ? React.createElement('option', { value: '', disabled: true }, placeholder) : null,
        options.map((o) => React.createElement('option', { key: o.value, value: o.value }, o.label))
      ),
      React.createElement('span', { className: 'rse-select__chevron', 'aria-hidden': 'true' }, React.createElement(Icon, { name: 'chevron-down', size: 18 }))
    ),
    message ? React.createElement('p', { className: 'rse-field__message', id: selectId + '-msg' }, message) : null
  );
});
