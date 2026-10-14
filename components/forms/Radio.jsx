import React from 'react';
const cx = (...c) => c.filter(Boolean).join(' ');
// Renders the CSS contract in Checkbox.css + Radio.css: a real <input> visually hidden behind the
// drawn box. Its :checked state drives the look, so it works controlled, uncontrolled, or before
// React has hydrated. Every other prop (checked, onChange, name, value, disabled…) goes to the input.
export const Radio = React.forwardRef(function Radio({ label, className, ...rest }, ref) {
  return React.createElement('label', { className: cx('rse-choice rse-radio', className) },
    React.createElement('input', { ref, type: 'radio', className: 'rse-control-input', ...rest }),
    React.createElement('span', { className: 'rse-choice__box rse-control-box', 'aria-hidden': 'true' }, null),
    label ? React.createElement('span', { className: 'rse-choice__label' }, label) : null
  );
});
