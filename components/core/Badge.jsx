import React from 'react';
const cx = (...c) => c.filter(Boolean).join(' ');
// Renders the CSS contract in Badge.css.
export const Badge = React.forwardRef(function Badge({ tone = 'neutral', children, className, ...rest }, ref) {
  return React.createElement('span', { ref, className: cx('rse-badge', tone !== 'neutral' && 'rse-badge--' + tone, className), ...rest }, children);
});
