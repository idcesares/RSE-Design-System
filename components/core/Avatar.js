import React from 'react';
const cx = (...c) => c.filter(Boolean).join(' ');
export const Avatar = React.forwardRef(function Avatar({ src, alt, initials, size = 'md', status, className, ...rest }, ref) {
  return React.createElement('span', { ref, className: cx('rse-avatar', 'rse-avatar--' + size, className), ...rest },
    src
      ? React.createElement('img', { src, alt: alt || '', className: 'rse-avatar__image' })
      : React.createElement('span', { className: 'rse-avatar__initials' }, (initials || '?').slice(0, 2).toUpperCase()),
    status ? React.createElement('span', { className: cx('rse-avatar__status', 'rse-avatar__status--' + status), 'aria-hidden': 'true' }) : null
  );
});
