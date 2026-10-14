import React from 'react';
import { Icon } from './Icon.jsx';
const cx = (...c) => c.filter(Boolean).join(' ');
// Renders the CSS contract in Tag.css.
export const Tag = React.forwardRef(function Tag({ color = 'purple', children, onRemove, removeLabel = 'Remover', className, ...rest }, ref) {
  return React.createElement('span', { ref, className: cx('rse-tag', color !== 'purple' && 'rse-tag--' + color, className), ...rest },
    children,
    onRemove ? React.createElement('button', { type: 'button', className: 'rse-tag__remove', onClick: onRemove, 'aria-label': removeLabel },
      React.createElement(Icon, { name: 'x', size: 14 })) : null
  );
});
