import React from 'react';
const cx = (...c) => c.filter(Boolean).join(' ');
export const ProgressBar = React.forwardRef(function ProgressBar({ value = 0, tone = 'primary', label, ariaLabel, className, style, ...rest }, ref) {
  const clamped = Math.max(0, Math.min(100, value));
  return React.createElement('div', { ref, className: cx('rse-progress-bar', 'rse-progress-bar--' + tone, className), style: { '--rse-progress-bar-value': `${clamped}%`, ...style }, ...rest },
    label ? React.createElement('div', { className: 'rse-progress-bar__label' },
      React.createElement('span', null, label), React.createElement('span', null, `${clamped}%`)
    ) : null,
    React.createElement('div', {
      className: 'rse-progress-bar__track', role: 'progressbar',
      'aria-valuenow': clamped, 'aria-valuemin': 0, 'aria-valuemax': 100,
      'aria-label': ariaLabel || label || 'Progresso'
    }, React.createElement('div', { className: 'rse-progress-bar__fill' }))
  );
});
