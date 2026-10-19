'use client';
import React from 'react';
const cx = (...c) => c.filter(Boolean).join(' ');
// Renders the CSS contract in StatBand.css. Children are Stat components, one per list item.
export const StatBand = React.forwardRef(function StatBand({ tone = 'primary', title, note, children, className, ...rest }, ref) {
  const titleId = React.useId();
  const items = React.Children.toArray(children).map((child, i) => React.createElement('li', { key: i, className: 'rse-stat-band__item' }, child));
  return React.createElement('section', { ref, 'aria-labelledby': title ? titleId : undefined, className: cx('rse-stat-band', tone !== 'primary' && 'rse-stat-band--' + tone, className), ...rest },
    React.createElement('div', { className: 'rse-stat-band__inner' },
      title ? React.createElement('h2', { id: titleId, className: 'rse-stat-band__title' }, title) : null,
      React.createElement('ul', { className: 'rse-stat-band__list' }, items),
      note ? React.createElement('p', { className: 'rse-stat-band__note' }, note) : null
    )
  );
});
