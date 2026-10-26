import React from 'react';
const cx = (...c) => c.filter(Boolean).join(' ');
export const Divider = React.forwardRef(function Divider({ orientation = 'horizontal', label, className, ...rest }, ref) {
  const props = { ref, role: 'separator', 'aria-orientation': orientation, className: cx('rse-divider', orientation === 'vertical' && 'rse-divider--vertical', orientation !== 'vertical' && label && 'rse-divider--labelled', className), ...rest };
  if (orientation === 'vertical') return React.createElement('span', props);
  if (label) {
    return React.createElement('div', props,
      React.createElement('span', { className: 'rse-divider__line' }),
      React.createElement('span', { className: 'rse-divider__label' }, label),
      React.createElement('span', { className: 'rse-divider__line' })
    );
  }
  return React.createElement('div', props);
});
