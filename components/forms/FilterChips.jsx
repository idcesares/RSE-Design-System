import React from 'react';
export function FilterChips({ options = [], value = [], onChange, multiple = true, label, showClear = true }) {
  const selected = Array.isArray(value) ? value : (value ? [value] : []);
  const toggle = (id) => {
    if (!onChange) return;
    if (!multiple) { onChange(selected[0] === id ? [] : [id]); return; }
    onChange(selected.includes(id) ? selected.filter(v => v !== id) : selected.concat(id));
  };
  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--rse-space-3)', fontFamily: 'var(--rse-font-family)' } },
    label ? React.createElement('div', {
      style: { fontSize: 'var(--rse-font-size-eyebrow)', textTransform: 'uppercase', letterSpacing: 'var(--rse-letter-spacing-eyebrow)', fontWeight: 'var(--rse-font-weight-bold)', color: 'var(--rse-color-text-muted)' }
    }, label) : null,
    React.createElement('div', { role: 'group', 'aria-label': label, style: { display: 'flex', flexWrap: 'wrap', gap: 'var(--rse-space-2)' } },
      options.map(opt => {
        const id = typeof opt === 'string' ? opt : opt.id;
        const text = typeof opt === 'string' ? opt : opt.label;
        const count = typeof opt === 'string' ? null : opt.count;
        const on = selected.includes(id);
        return React.createElement('button', {
          key: id, type: 'button', 'aria-pressed': on, onClick: () => toggle(id),
          style: {
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 16px',
            borderRadius: 'var(--rse-radius-pill)', cursor: 'pointer',
            background: on ? 'var(--rse-color-primary)' : 'var(--rse-color-surface-card)',
            color: on ? 'var(--rse-color-text-on-primary)' : 'var(--rse-color-text-body)',
            border: '1.5px solid ' + (on ? 'var(--rse-color-primary)' : 'var(--rse-color-border-strong)'),
            fontSize: 'var(--rse-font-size-body-sm)', fontWeight: 'var(--rse-font-weight-semibold)',
            fontFamily: 'var(--rse-font-family)',
            transition: 'background var(--rse-duration-fast) var(--rse-ease-standard), border-color var(--rse-duration-fast) var(--rse-ease-standard), color var(--rse-duration-fast) var(--rse-ease-standard)'
          }
        }, text, count != null ? React.createElement('span', {
          style: { fontSize: 'var(--rse-font-size-caption)', fontWeight: 'var(--rse-font-weight-bold)', color: on ? 'var(--rse-color-text-on-primary)' : 'var(--rse-color-text-muted)' }
        }, count) : null);
      }),
      showClear && selected.length ? React.createElement('button', {
        type: 'button', onClick: () => onChange && onChange([]),
        style: {
          background: 'none', border: 'none', cursor: 'pointer', padding: '9px 8px',
          fontSize: 'var(--rse-font-size-body-sm)', fontWeight: 'var(--rse-font-weight-semibold)',
          color: 'var(--rse-color-text-link)', fontFamily: 'var(--rse-font-family)', textDecoration: 'underline', textUnderlineOffset: 2
        }
      }, 'Limpar') : null
    )
  );
}
