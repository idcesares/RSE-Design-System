import React from 'react';
const cx = (...c) => c.filter(Boolean).join(' ');
// Renders the CSS contract in Button.css (.rse-icon-button). The label is required: there is no text.
export const IconButton = React.forwardRef(function IconButton({ icon, ariaLabel, 'aria-label': ariaLabelAttr, variant = 'ghost', size = 'md', type = 'button', className, ...rest }, ref) {
  return React.createElement('button', {
    ref, type, 'aria-label': ariaLabel || ariaLabelAttr,
    className: cx('rse-icon-button', variant !== 'ghost' && 'rse-icon-button--' + variant, size !== 'md' && 'rse-icon-button--' + size, className),
    ...rest
  }, React.createElement('span', { className: 'rse-icon-button__icon', 'aria-hidden': 'true' }, icon));
});
