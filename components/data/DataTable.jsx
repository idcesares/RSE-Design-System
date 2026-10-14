import React from 'react';
export function DataTable({ columns = [], rows = [], caption, zebra = true, compact = false, emptyMessage = 'Nenhum resultado.' }) {
  const pad = compact ? '10px 14px' : '16px 20px';
  const cell = { padding: pad, fontSize: compact ? 'var(--rse-font-size-body-sm)' : 'var(--rse-font-size-body-md)', textAlign: 'left', verticalAlign: 'middle' };
  return React.createElement('div', {
    style: {
      background: 'var(--rse-color-surface-card)', border: '1px solid var(--rse-color-border-subtle)', borderRadius: 'var(--rse-radius-lg)',
      overflow: 'hidden', boxShadow: 'var(--rse-shadow-sm)'
    }
  }, React.createElement('div', { style: { overflowX: 'auto' } },
    React.createElement('table', { style: { width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--rse-font-family)' } },
      caption ? React.createElement('caption', {
        style: {
          captionSide: 'top', textAlign: 'left', padding: pad, fontSize: 'var(--rse-font-size-caption)',
          textTransform: 'uppercase', letterSpacing: 'var(--rse-letter-spacing-eyebrow)',
          fontWeight: 'var(--rse-font-weight-bold)', color: 'var(--rse-color-text-muted)', background: 'var(--rse-color-surface-card)'
        }
      }, caption) : null,
      React.createElement('thead', null, React.createElement('tr', null, columns.map(c =>
        React.createElement('th', {
          key: c.key, scope: 'col',
          style: {
            ...cell, textAlign: c.align || 'left', width: c.width, whiteSpace: 'nowrap',
            fontSize: 'var(--rse-font-size-caption)', textTransform: 'uppercase',
            letterSpacing: 'var(--rse-letter-spacing-eyebrow)', fontWeight: 'var(--rse-font-weight-bold)',
            color: 'var(--rse-color-text-muted)', background: 'var(--rse-color-surface-sunken)',
            borderBottom: '1px solid var(--rse-color-border-subtle)'
          }
        }, c.label)
      ))),
      React.createElement('tbody', null, rows.length ? rows.map((r, i) =>
        React.createElement('tr', {
          key: i,
          style: { background: zebra && i % 2 ? 'var(--rse-brand-gray-50)' : 'transparent', borderBottom: i === rows.length - 1 ? 'none' : '1px solid var(--rse-color-border-subtle)' }
        }, columns.map((c, j) =>
          React.createElement('td', {
            key: c.key,
            style: {
              ...cell, textAlign: c.align || 'left',
              color: j === 0 ? 'var(--rse-color-text-heading)' : 'var(--rse-color-text-body)',
              fontWeight: j === 0 ? 'var(--rse-font-weight-semibold)' : 'var(--rse-font-weight-regular)'
            }
          }, r[c.key])
        ))
      ) : React.createElement('tr', null, React.createElement('td', {
        colSpan: columns.length, style: { ...cell, color: 'var(--rse-color-text-muted)', textAlign: 'center', padding: 'var(--rse-space-7)' }
      }, emptyMessage)))
    )
  ));
}
