import React from 'react';
import { Icon } from '../core/Icon.jsx';
const cx = (...c) => c.filter(Boolean).join(' ');
// Renders the CSS contract in Checkbox.css : a real <input> visually hidden behind the
// drawn box. Its :checked state drives the look, so it works controlled, uncontrolled, or before
// React has hydrated. Every other prop (checked, onChange, name, value, disabled…) goes to the input.
export const Checkbox = React.forwardRef(function Checkbox({ label, className, ...rest }, ref) {
  return React.createElement('label', { className: cx('rse-choice rse-checkbox', className) },
    React.createElement('input', { ref, type: 'checkbox', className: 'rse-control-input', ...rest }),
    React.createElement('span', { className: 'rse-choice__box rse-control-box', 'aria-hidden': 'true' }, React.createElement('span', { className: 'rse-choice__mark' }, React.createElement(Icon, { name: 'check', size: 14, strokeWidth: 3 }))),
    label ? React.createElement('span', { className: 'rse-choice__label' }, label) : null
  );
});
