import React from 'react';
const cx = (...c) => c.filter(Boolean).join(' ');
// Renders the CSS contract in Card.css. With href, the title is the link and covers the card;
// the footer stays outside it, so a button there is its own control, not a control inside a link.
export const Card = React.forwardRef(function Card({ image, eyebrow, title, description, tag, footer, href, headingLevel = 3, className, ...rest }, ref) {
  return React.createElement('article', { ref, className: cx('rse-card', className), ...rest },
    image ? React.createElement('div', { className: 'rse-card__media' }, image) : null,
    React.createElement('div', { className: 'rse-card__body' },
      tag ? React.createElement('div', { className: 'rse-card__tag' }, tag) : null,
      eyebrow ? React.createElement('span', { className: 'rse-card__eyebrow' }, eyebrow) : null,
      React.createElement('h' + headingLevel, { className: 'rse-card__title' },
        href ? React.createElement('a', { className: 'rse-card__link', href }, title) : title),
      description ? React.createElement('p', { className: 'rse-card__description' }, description) : null,
      footer ? React.createElement('div', { className: 'rse-card__footer' }, footer) : null
    )
  );
});
