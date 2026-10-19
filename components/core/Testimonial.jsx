import React from 'react';
const cx = (...c) => c.filter(Boolean).join(' ');
// Renders the CSS contract in Testimonial.css. Static: one quote, no carousel. The avatar is a node
// the caller passes (an Avatar). `example` keeps placeholder usage visibly placeholder.
export const Testimonial = React.forwardRef(function Testimonial({ quote, name, role, unit, avatar, example = false, className, ...rest }, ref) {
  return React.createElement('figure', { ref, className: cx('rse-testimonial', example && 'rse-testimonial--example', className), ...rest },
    example ? React.createElement('span', { className: 'rse-testimonial__example' }, 'Depoimento de exemplo') : null,
    React.createElement('blockquote', { className: 'rse-testimonial__quote' }, quote),
    React.createElement('figcaption', { className: 'rse-testimonial__author' },
      avatar || null,
      React.createElement('span', { className: 'rse-testimonial__who' },
        React.createElement('span', { className: 'rse-testimonial__name' }, name),
        role ? React.createElement('span', { className: 'rse-testimonial__role' }, role) : null,
        unit ? React.createElement('span', { className: 'rse-testimonial__unit' }, unit) : null
      )
    )
  );
});
