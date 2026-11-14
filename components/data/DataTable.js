import React from 'react';
export const DataTable = React.forwardRef(function DataTable({ columns = [], rows = [], caption, zebra = true, compact = false, emptyMessage = 'Nenhum resultado.', className, ...rest }, ref) {
  const cellClass = c => 'rse-data-table__cell' + (c.align ? ' rse-data-table__cell--' + c.align : '');
  return React.createElement('div', { ...rest, ref, className: ['rse-data-table', zebra && 'rse-data-table--zebra', compact && 'rse-data-table--compact', className].filter(Boolean).join(' ') },
    React.createElement('div', { className: 'rse-data-table__scroller', tabIndex: 0, role: 'region', 'aria-label': caption || 'Tabela' },
      React.createElement('table', { className: 'rse-data-table__table' },
        caption ? React.createElement('caption', { className: 'rse-data-table__caption' }, caption) : null,
        React.createElement('thead', null, React.createElement('tr', null, columns.map(c => React.createElement('th', {
          key: c.key, scope: 'col', className: cellClass(c), style: c.width ? { '--rse-data-table-column-width': c.width } : undefined
        }, c.label)))),
        React.createElement('tbody', null, rows.length ? rows.map((r, i) => React.createElement('tr', { key: i },
          columns.map(c => React.createElement('td', { key: c.key, className: cellClass(c) }, r[c.key]))
        )) : React.createElement('tr', null, React.createElement('td', { colSpan: Math.max(1, columns.length), className: 'rse-data-table__empty' }, emptyMessage)))
      )
    )
  );
});
