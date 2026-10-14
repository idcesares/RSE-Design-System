import React from 'react';
import { Icon } from '../core/Icon.jsx';
export function Stepper({ steps = [], current = 0, orientation = 'horizontal', onStepClick }) {
  const isH = orientation === 'horizontal';
  return React.createElement('ol', {
    style: {
      listStyle: 'none', margin: 0, padding: 0, display: 'flex',
      flexDirection: isH ? 'row' : 'column', gap: 0, fontFamily: 'var(--rse-font-family)'
    }
  }, steps.map((step, i) => {
    const done = i < current, active = i === current;
    const label = typeof step === 'string' ? step : step.label;
    const desc = typeof step === 'string' ? null : step.description;
    const dotBg = done ? 'var(--rse-color-primary)' : active ? 'var(--rse-color-surface-card)' : 'var(--rse-color-surface-sunken)';
    const dotColor = done ? 'var(--rse-color-text-on-primary)' : active ? 'var(--rse-color-primary)' : 'var(--rse-color-text-muted)';
    return React.createElement('li', {
      key: i,
      'aria-current': active ? 'step' : undefined,
      style: { flex: isH ? 1 : 'none', display: 'flex', flexDirection: isH ? 'column' : 'row', gap: isH ? 'var(--rse-space-3)' : 'var(--rse-space-4)', minWidth: 0 }
    },
      React.createElement('div', { style: { display: 'flex', flexDirection: isH ? 'row' : 'column', alignItems: 'center', gap: 0, flex: 'none' } },
        React.createElement(onStepClick ? 'button' : 'div', {
          type: onStepClick ? 'button' : undefined,
          'aria-label': onStepClick ? 'Etapa ' + (i + 1) + ': ' + label + (done ? ' (concluída)' : '') : undefined,
          onClick: onStepClick ? () => onStepClick(i) : undefined,
          style: {
            flex: 'none', width: 34, height: 34, borderRadius: 'var(--rse-radius-pill)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            background: dotBg, color: dotColor,
            border: (done || active) ? '2px solid var(--rse-color-primary)' : '2px solid var(--rse-color-border-strong)',
            fontSize: 'var(--rse-font-size-body-sm)', fontWeight: 'var(--rse-font-weight-bold)',
            fontFamily: 'var(--rse-font-family)', cursor: onStepClick ? 'pointer' : 'default',
            transition: 'background var(--rse-duration-base) var(--rse-ease-standard), border-color var(--rse-duration-base) var(--rse-ease-standard)'
          }
        }, done ? React.createElement(Icon, { name: 'check', size: 16 }) : String(i + 1)),
        i < steps.length - 1 ? React.createElement('div', {
          'aria-hidden': 'true',
          style: isH
            ? { flex: 1, height: 2, background: done ? 'var(--rse-color-primary)' : 'var(--rse-color-border-subtle)', minWidth: 16 }
            : { width: 2, flex: 1, minHeight: 28, background: done ? 'var(--rse-color-primary)' : 'var(--rse-color-border-subtle)' }
        }) : null
      ),
      React.createElement('div', { style: { minWidth: 0, paddingBottom: isH ? 0 : 'var(--rse-space-5)', paddingRight: isH ? 'var(--rse-space-4)' : 0 } },
        React.createElement('div', {
          style: {
            fontSize: 'var(--rse-font-size-body-sm)', fontWeight: active || done ? 'var(--rse-font-weight-bold)' : 'var(--rse-font-weight-medium)',
            color: active || done ? 'var(--rse-color-text-heading)' : 'var(--rse-color-text-muted)'
          }
        }, label),
        desc ? React.createElement('div', {
          style: { marginTop: 2, fontSize: 'var(--rse-font-size-caption)', color: 'var(--rse-color-text-muted)', lineHeight: 'var(--rse-line-height-body)' }
        }, desc) : null
      )
    );
  }));
}
