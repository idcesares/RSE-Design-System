import React from 'react';
import { Icon } from '../core/Icon.jsx';
const cx = (...c) => c.filter(Boolean).join(' ');
const ICONS = { info: 'info', success: 'circle-check', warning: 'triangle-alert', danger: 'circle-alert' };
// Renders the CSS contract in Alert.css. A persistent banner is role="status" (announced
// politely); pass `urgent` only when the reader must be interrupted (role="alert").
export const Alert = React.forwardRef(function Alert({ tone = 'info', title, message, children, onDismiss, urgent, dismissLabel = 'Fechar', className, ...rest }, ref) {
  return React.createElement('div', {
    ref, role: urgent ? 'alert' : 'status',
    className: cx('rse-alert', tone !== 'info' && 'rse-alert--' + tone, className), ...rest
  },
    React.createElement('span', { className: 'rse-alert__icon', 'aria-hidden': 'true' }, React.createElement(Icon, { name: ICONS[tone] || 'info', size: 18 })),
    React.createElement('div', { className: 'rse-alert__content' },
      title ? React.createElement('p', { className: 'rse-alert__title' }, title) : null,
      React.createElement('p', { className: 'rse-alert__message' }, message || children)
    ),
    onDismiss ? React.createElement('button', { type: 'button', className: 'rse-alert__dismiss', onClick: onDismiss, 'aria-label': dismissLabel },
      React.createElement(Icon, { name: 'x', size: 16 })) : null
  );
});
