import React from 'react';
import { Icon } from '../core/Icon.js';
const cx = (...c) => c.filter(Boolean).join(' ');
export const Toast = React.forwardRef(function Toast({ tone = 'info', title, message, onClose, className, ...rest }, ref) {
  return React.createElement('div', { ref, className: cx('rse-toast', 'rse-toast--' + tone, className), role: tone === 'danger' ? 'alert' : 'status', ...rest },
    React.createElement('div', { className: 'rse-toast__content' },
      title ? React.createElement('div', { className: 'rse-toast__title' }, title) : null,
      React.createElement('div', { className: 'rse-toast__message' }, message)),
    onClose ? React.createElement('button', { type: 'button', className: 'rse-toast__close', onClick: onClose, 'aria-label': 'Fechar' }, React.createElement(Icon, { name: 'x', size: 16 })) : null);
});
