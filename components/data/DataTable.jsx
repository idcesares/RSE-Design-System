import React from 'react';
export function DataTable({ columns = [], rows = [], caption, zebra = true, compact = false, emptyMessage = 'Nenhum resultado.' }) {
  const pad = compact ? '10px 14px' : '16px 20px';
  const cell = { padding: pad, fontSize: compact ? 'var(--text-body-sm)' : 'var(--text-body-md)', textAlign: 'left', verticalAlign: 'middle' };
  return React.createElement('div', {
    style: {
      background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)',
      overflow: 'hidden', boxShadow: 'var(--shadow-sm)'
    }
  }, React.createElement('div', { style: { overflowX: 'auto' } },
    React.createElement('table', { style: { width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-family-base)' } },
      caption ? React.createElement('caption', {
        style: {
          captionSide: 'top', textAlign: 'left', padding: pad, fontSize: 'var(--text-caption)',
          textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-eyebrow)',
          fontWeight: 'var(--font-weight-bold)', color: 'var(--text-muted)', background: 'var(--surface-card)'
        }
      }, caption) : null,
      React.createElement('thead', null, React.createElement('tr', null, columns.map(c =>
        React.createElement('th', {
          key: c.key, scope: 'col',
          style: {
            ...cell, textAlign: c.align || 'left', width: c.width, whiteSpace: 'nowrap',
            fontSize: 'var(--text-caption)', textTransform: 'uppercase',
            letterSpacing: 'var(--letter-spacing-eyebrow)', fontWeight: 'var(--font-weight-bold)',
            color: 'var(--text-muted)', background: 'var(--surface-sunken)',
            borderBottom: '1px solid var(--border-subtle)'
          }
        }, c.label)
      ))),
      React.createElement('tbody', null, rows.length ? rows.map((r, i) =>
        React.createElement('tr', {
          key: i,
          style: { background: zebra && i % 2 ? 'var(--gray-50)' : 'transparent', borderBottom: i === rows.length - 1 ? 'none' : '1px solid var(--border-subtle)' }
        }, columns.map((c, j) =>
          React.createElement('td', {
            key: c.key,
            style: {
              ...cell, textAlign: c.align || 'left',
              color: j === 0 ? 'var(--text-heading)' : 'var(--text-body)',
              fontWeight: j === 0 ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)'
            }
          }, r[c.key])
        ))
      ) : React.createElement('tr', null, React.createElement('td', {
        colSpan: columns.length, style: { ...cell, color: 'var(--text-muted)', textAlign: 'center', padding: 'var(--space-7)' }
      }, emptyMessage)))
    )
  ));
}
