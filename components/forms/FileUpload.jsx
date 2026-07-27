import React from 'react';
export function FileUpload({ label, hint, accept, multiple = false, files = [], onFilesChange, error, maxSizeLabel }) {
  const [dragging, setDragging] = React.useState(false);
  const inputRef = React.useRef(null);
  const emit = (list) => { if (onFilesChange) onFilesChange(Array.from(list)); };
  const borderColor = error ? 'var(--danger)' : dragging ? 'var(--color-primary)' : 'var(--border-strong)';
  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', fontFamily: 'var(--font-family-base)' } },
    label ? React.createElement('span', {
      style: { fontSize: 'var(--text-body-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--text-heading)' }
    }, label) : null,
    React.createElement('div', {
      onDragOver: (e) => { e.preventDefault(); setDragging(true); },
      onDragLeave: () => setDragging(false),
      onDrop: (e) => { e.preventDefault(); setDragging(false); emit(e.dataTransfer.files); },
      onClick: () => inputRef.current && inputRef.current.click(),
      role: 'button', tabIndex: 0,
      onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current && inputRef.current.click(); } },
      style: {
        border: '1.5px dashed ' + borderColor, borderRadius: 'var(--radius-md)',
        background: dragging ? 'var(--surface-primary-tint)' : 'var(--surface-card)',
        padding: 'var(--space-6)', textAlign: 'center', cursor: 'pointer',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)',
        transition: 'background var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard)'
      }
    },
      React.createElement('span', {
        style: { fontSize: 'var(--text-body-md)', fontWeight: 'var(--font-weight-bold)', color: 'var(--text-heading)' }
      }, 'Arraste os arquivos ou clique para escolher'),
      React.createElement('span', {
        style: { fontSize: 'var(--text-body-sm)', color: 'var(--text-muted)' }
      }, [accept, maxSizeLabel].filter(Boolean).join(' · ') || 'PDF, JPG ou PNG'),
      React.createElement('input', {
        ref: inputRef, type: 'file', accept, multiple,
        onChange: (e) => emit(e.target.files),
        style: { display: 'none' }
      })
    ),
    files.length ? React.createElement('ul', { style: { listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' } },
      files.map((f, i) => React.createElement('li', {
        key: i,
        style: {
          display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: '10px 14px',
          background: 'var(--surface-sunken)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-body-sm)'
        }
      },
        React.createElement('span', { style: { flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-heading)', fontWeight: 'var(--font-weight-semibold)' } }, f.name || String(f)),
        f.size ? React.createElement('span', { style: { color: 'var(--text-muted)', flex: 'none' } }, Math.max(1, Math.round(f.size / 1024)) + ' KB') : null,
        React.createElement('button', {
          type: 'button', 'aria-label': 'Remover ' + (f.name || 'arquivo'),
          onClick: () => onFilesChange && onFilesChange(files.filter((_, j) => j !== i)),
          style: { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 16, lineHeight: 1, padding: 4 }
        }, '×')
      ))
    ) : null,
    (hint || error) ? React.createElement('span', {
      style: { fontSize: 'var(--text-caption)', color: error ? 'var(--danger)' : 'var(--text-muted)' }
    }, error || hint) : null
  );
}
