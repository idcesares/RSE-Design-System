import React from 'react';
const cx = (...c) => c.filter(Boolean).join(' ');
// Renders the CSS contract in CtaBand.css. Buttons arrive as children, composed by the caller.
export const CtaBand = React.forwardRef(function CtaBand({ tone = 'primary', eyebrow, title, description, align = 'center', as = 'h2', children, className, ...rest }, ref) {
  return React.createElement('section', { ref, className: cx('rse-cta-band', tone !== 'primary' && 'rse-cta-band--' + tone, align === 'left' && 'rse-cta-band--left', className), ...rest },
    React.createElement('div', { className: 'rse-cta-band__inner' },
      eyebrow ? React.createElement('p', { className: 'rse-cta-band__eyebrow' }, eyebrow) : null,
      React.createElement(as, { className: 'rse-cta-band__title' }, title),
      description ? React.createElement('p', { className: 'rse-cta-band__description' }, description) : null,
      children ? React.createElement('div', { className: 'rse-cta-band__actions' }, children) : null
    )
  );
});
