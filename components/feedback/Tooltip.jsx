'use client';
import React from 'react';
const cx = (...c) => c.filter(Boolean).join(' ');
export const Tooltip = React.forwardRef(function Tooltip({ label, children, className, onFocus, onBlur, onPointerEnter, onPointerLeave, ...rest }, ref) {
  const [dismissed, setDismissed] = React.useState(false);
  const id = 'rse-tip-' + React.useId().replace(/:/g, '');
  React.useEffect(() => {
    const onKey = (event) => { if (event.key === 'Escape') setDismissed(true); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);
  const trigger = React.isValidElement(children) ? React.cloneElement(children, {
    'aria-describedby': [children.props['aria-describedby'], id].filter(Boolean).join(' ')
  }) : children;
  return React.createElement('span', {
    ref, className: cx('rse-tooltip', className), 'data-dismissed': dismissed ? '' : undefined, ...rest,
    onFocus: (event) => { setDismissed(false); if (onFocus) onFocus(event); },
    onBlur: (event) => { if (!event.currentTarget.contains(event.relatedTarget) && !event.currentTarget.matches(':hover')) setDismissed(false); if (onBlur) onBlur(event); },
    onPointerEnter: (event) => { setDismissed(false); if (onPointerEnter) onPointerEnter(event); },
    onPointerLeave: (event) => { if (!event.currentTarget.contains(document.activeElement)) setDismissed(false); if (onPointerLeave) onPointerLeave(event); }
  }, trigger, React.createElement('span', { className: 'rse-tooltip__bubble', id, role: 'tooltip' }, label));
});
