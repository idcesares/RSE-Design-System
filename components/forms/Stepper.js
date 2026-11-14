import React from 'react';
import { Icon } from '../core/Icon.js';
export const Stepper = React.forwardRef(function Stepper({ steps = [], current = 0, orientation = 'horizontal', onStepClick, className, ...rest }, ref) {
  return React.createElement('ol', { ...rest, ref, className: ['rse-stepper', orientation === 'vertical' && 'rse-stepper--vertical', className].filter(Boolean).join(' ') }, steps.map((step, i) => {
    const done = i < current, active = i === current;
    const label = typeof step === 'string' ? step : step.label;
    const desc = typeof step === 'string' ? null : step.description;
    return React.createElement('li', { key: i, 'aria-current': active ? 'step' : undefined, className: ['rse-stepper__step', done && 'rse-stepper__step--complete'].filter(Boolean).join(' ') },
      React.createElement('div', { className: 'rse-stepper__track' },
        React.createElement(onStepClick ? 'button' : 'div', {
          className: 'rse-stepper__marker', type: onStepClick ? 'button' : undefined, role: done && !onStepClick ? 'img' : undefined,
          'aria-label': onStepClick ? 'Etapa ' + (i + 1) + ': ' + label + (done ? ' (concluída)' : '') : done ? 'Concluída' : undefined,
          onClick: onStepClick ? () => onStepClick(i) : undefined
        }, done ? React.createElement(Icon, { name: 'check', size: 16 }) : String(i + 1)),
        i < steps.length - 1 ? React.createElement('div', { className: 'rse-stepper__connector', 'aria-hidden': 'true' }) : null
      ),
      React.createElement('div', { className: 'rse-stepper__content' },
        React.createElement('div', { className: 'rse-stepper__label' }, label),
        desc ? React.createElement('div', { className: 'rse-stepper__description' }, desc) : null
      )
    );
  }));
});
