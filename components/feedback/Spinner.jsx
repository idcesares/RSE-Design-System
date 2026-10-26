import React from 'react';
import { MotifLoader } from './MotifLoader.jsx';
// Compatibility adapter: one loading implementation, branded by default.
export const Spinner = React.forwardRef(function Spinner({ size = 24, tone = 'primary', className, ...rest }, ref) {
  return React.createElement(MotifLoader, { ...rest, ref, size, tone, variant: 'inline', className: ['rse-spinner', className].filter(Boolean).join(' ') });
});
