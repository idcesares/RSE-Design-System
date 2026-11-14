import React from 'react';
const cx = (...c) => c.filter(Boolean).join(' ');
const dimension = (value) => typeof value === 'number' ? `${value}px` : value;
export const Skeleton = React.forwardRef(function Skeleton({ variant = 'text', width, height, lines = 3, radius, className, style, ...rest }, ref) {
  const geometry = {
    ...(width ? { '--rse-skeleton-width': dimension(width) } : {}),
    ...(height ? { '--rse-skeleton-height': dimension(height) } : {}),
    ...(radius && variant !== 'text' ? { '--rse-skeleton-radius': radius } : {}),
    ...style
  };
  const props = { ref, 'aria-hidden': 'true', className: cx('rse-skeleton', 'rse-skeleton--' + variant, className), style: geometry, ...rest };
  if (variant === 'text') {
    return React.createElement('div', props, Array.from({ length: lines }).map((_, i) =>
      React.createElement('div', { key: i, className: 'rse-skeleton__line' })
    ));
  }
  return React.createElement('div', props);
});
