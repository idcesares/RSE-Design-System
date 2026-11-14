import React from 'react';
const cx = (...c) => c.filter(Boolean).join(' ');
export const Stat = React.forwardRef(function Stat({ value, label, description, accent = 'primary', align = 'left', size = 'md', className, ...rest }, ref) {
  return React.createElement('div', {
    ref, className: cx('rse-stat', 'rse-stat--' + accent, 'rse-stat--' + size, align === 'center' && 'rse-stat--center', className), ...rest
  },
    React.createElement('span', { className: 'rse-stat__value' }, value),
    React.createElement('span', { className: 'rse-stat__label' }, label),
    description ? React.createElement('p', { className: 'rse-stat__description' }, description) : null
  );
});
