import React from 'react';
const cx = (...c) => c.filter(Boolean).join(' ');
// Renders the CSS contract in Button.css. With href it is a link that looks like a button.
export const Button = React.forwardRef(function Button({ variant = 'primary', size = 'md', icon, block, href, disabled, type = 'button', className, children, ...rest }, ref) {
  const classes = cx('rse-button', variant !== 'primary' && 'rse-button--' + variant, size !== 'md' && 'rse-button--' + size, block && 'rse-button--block', className);
  const iconEl = icon ? React.createElement('span', { className: 'rse-button__icon', 'aria-hidden': 'true' }, icon) : null;
  if (href) {
    return React.createElement('a', { ref, className: classes, href: disabled ? undefined : href, 'aria-disabled': disabled ? 'true' : undefined, ...rest }, iconEl, children);
  }
  return React.createElement('button', { ref, className: classes, type, disabled, ...rest }, iconEl, children);
});
