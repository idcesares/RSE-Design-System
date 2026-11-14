import React from 'react';
export const FilterChips = React.forwardRef(function FilterChips({ options = [], value = [], onChange, multiple = true, label, showClear = true, className, ...rest }, ref) {
  const selected = Array.isArray(value) ? value : (value ? [value] : []);
  const toggle = id => {
    if (!onChange) return;
    if (!multiple) { onChange(selected[0] === id ? [] : [id]); return; }
    onChange(selected.includes(id) ? selected.filter(v => v !== id) : selected.concat(id));
  };
  return React.createElement('div', { ...rest, ref, className: ['rse-filter-chips', className].filter(Boolean).join(' ') },
    label ? React.createElement('div', { className: 'rse-filter-chips__label' }, label) : null,
    React.createElement('div', { role: 'group', 'aria-label': label, className: 'rse-filter-chips__options' },
      options.map(opt => {
        const id = typeof opt === 'string' ? opt : opt.id;
        const text = typeof opt === 'string' ? opt : opt.label;
        const count = typeof opt === 'string' ? null : opt.count;
        return React.createElement('button', { key: id, type: 'button', className: 'rse-filter-chips__chip', 'aria-pressed': selected.includes(id), onClick: () => toggle(id) }, text,
          count != null ? React.createElement('span', { className: 'rse-filter-chips__count' }, count) : null);
      }),
      showClear && selected.length ? React.createElement('button', { type: 'button', className: 'rse-filter-chips__clear', onClick: () => onChange && onChange([]) }, 'Limpar') : null
    )
  );
});
