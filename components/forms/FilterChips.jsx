import React from 'react';
export function FilterChips({ options = [], value = [], onChange, multiple = true, label, showClear = true }) {
  const selected = Array.isArray(value) ? value : (value ? [value] : []);
  const toggle = (id) => {
    if (!onChange) return;
    if (!multiple) { onChange(selected[0] === id ? [] : [id]); return; }
    onChange(selected.includes(id) ? selected.filter(v => v !== id) : selected.concat(id));
  };
  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', fontFamily: 'var(--font-family-base)' } },
    label ? React.createElement('div', {
      style: { fontSize: 'var(--text-eyebrow)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-eyebrow)', fontWeight: 'var(--font-weight-bold)', color: 'var(--text-muted)' }
    }, label) : null,
    React.createElement('div', { role: 'group', 'aria-label': label, style: { display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' } },
      options.map(opt => {
        const id = typeof opt === 'string' ? opt : opt.id;
        const text = typeof opt === 'string' ? opt : opt.label;
        const count = typeof opt === 'string' ? null : opt.count;
        const on = selected.includes(id);
        return React.createElement('button', {
          key: id, type: 'button', 'aria-pressed': on, onClick: () => toggle(id),
          style: {
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 16px',
            borderRadius: 'var(--radius-pill)', cursor: 'pointer',
            background: on ? 'var(--color-primary)' : 'var(--surface-card)',
            color: on ? 'var(--text-on-primary)' : 'var(--text-body)',
            border: '1.5px solid ' + (on ? 'var(--color-primary)' : 'var(--border-strong)'),
            fontSize: 'var(--text-body-sm)', fontWeight: 'var(--font-weight-semibold)',
            fontFamily: 'var(--font-family-base)',
            transition: 'background var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard), color var(--duration-fast) var(--ease-standard)'
          }
        }, text, count != null ? React.createElement('span', {
          style: { fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-bold)', color: on ? 'rgba(255,255,255,0.75)' : 'var(--text-muted)' }
        }, count) : null);
      }),
      showClear && selected.length ? React.createElement('button', {
        type: 'button', onClick: () => onChange && onChange([]),
        style: {
          background: 'none', border: 'none', cursor: 'pointer', padding: '9px 8px',
          fontSize: 'var(--text-body-sm)', fontWeight: 'var(--font-weight-semibold)',
          color: 'var(--text-link)', fontFamily: 'var(--font-family-base)', textDecoration: 'underline', textUnderlineOffset: 2
        }
      }, 'Limpar') : null
    )
  );
}
