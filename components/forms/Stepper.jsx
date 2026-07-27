import React from 'react';
export function Stepper({ steps = [], current = 0, orientation = 'horizontal', onStepClick }) {
  const isH = orientation === 'horizontal';
  return React.createElement('ol', {
    style: {
      listStyle: 'none', margin: 0, padding: 0, display: 'flex',
      flexDirection: isH ? 'row' : 'column', gap: 0, fontFamily: 'var(--font-family-base)'
    }
  }, steps.map((step, i) => {
    const done = i < current, active = i === current;
    const label = typeof step === 'string' ? step : step.label;
    const desc = typeof step === 'string' ? null : step.description;
    const dotBg = done ? 'var(--color-primary)' : active ? 'var(--surface-card)' : 'var(--surface-sunken)';
    const dotColor = done ? 'var(--text-on-primary)' : active ? 'var(--color-primary)' : 'var(--text-muted)';
    return React.createElement('li', {
      key: i,
      'aria-current': active ? 'step' : undefined,
      style: { flex: isH ? 1 : 'none', display: 'flex', flexDirection: isH ? 'column' : 'row', gap: isH ? 'var(--space-3)' : 'var(--space-4)', minWidth: 0 }
    },
      React.createElement('div', { style: { display: 'flex', flexDirection: isH ? 'row' : 'column', alignItems: 'center', gap: 0, flex: 'none' } },
        React.createElement(onStepClick ? 'button' : 'div', {
          type: onStepClick ? 'button' : undefined,
          onClick: onStepClick ? () => onStepClick(i) : undefined,
          style: {
            flex: 'none', width: 34, height: 34, borderRadius: 'var(--radius-pill)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            background: dotBg, color: dotColor,
            border: (done || active) ? '2px solid var(--color-primary)' : '2px solid var(--border-strong)',
            fontSize: 'var(--text-body-sm)', fontWeight: 'var(--font-weight-bold)',
            fontFamily: 'var(--font-family-base)', cursor: onStepClick ? 'pointer' : 'default',
            transition: 'background var(--duration-base) var(--ease-standard), border-color var(--duration-base) var(--ease-standard)'
          }
        }, done ? '✓' : String(i + 1)),
        i < steps.length - 1 ? React.createElement('div', {
          'aria-hidden': 'true',
          style: isH
            ? { flex: 1, height: 2, background: done ? 'var(--color-primary)' : 'var(--border-subtle)', minWidth: 16 }
            : { width: 2, flex: 1, minHeight: 28, background: done ? 'var(--color-primary)' : 'var(--border-subtle)' }
        }) : null
      ),
      React.createElement('div', { style: { minWidth: 0, paddingBottom: isH ? 0 : 'var(--space-5)', paddingRight: isH ? 'var(--space-4)' : 0 } },
        React.createElement('div', {
          style: {
            fontSize: 'var(--text-body-sm)', fontWeight: active || done ? 'var(--font-weight-bold)' : 'var(--font-weight-medium)',
            color: active || done ? 'var(--text-heading)' : 'var(--text-muted)'
          }
        }, label),
        desc ? React.createElement('div', {
          style: { marginTop: 2, fontSize: 'var(--text-caption)', color: 'var(--text-muted)', lineHeight: 'var(--line-height-body)' }
        }, desc) : null
      )
    );
  }));
}
