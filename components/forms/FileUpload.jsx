'use client';
import React from 'react';
import { Icon } from '../core/Icon.jsx';
export function FileUpload({ label, hint, accept, multiple = false, files = [], onFilesChange, error, maxSizeLabel }) {
  const [dragging, setDragging] = React.useState(false);
  const inputRef = React.useRef(null);
  const emit = (list) => { if (onFilesChange) onFilesChange(Array.from(list)); };
  const borderColor = error ? 'var(--rse-color-danger)' : dragging ? 'var(--rse-color-primary)' : 'var(--rse-color-border-strong)';
  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--rse-space-3)', fontFamily: 'var(--rse-font-family)' } },
    label ? React.createElement('span', {
      style: { fontSize: 'var(--rse-font-size-body-sm)', fontWeight: 'var(--rse-font-weight-semibold)', color: 'var(--rse-color-text-heading)' }
    }, label) : null,
    React.createElement('div', {
      onDragOver: (e) => { e.preventDefault(); setDragging(true); },
      onDragLeave: () => setDragging(false),
      onDrop: (e) => { e.preventDefault(); setDragging(false); emit(e.dataTransfer.files); },
      onClick: () => inputRef.current && inputRef.current.click(),
      role: 'button', tabIndex: 0,
      onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current && inputRef.current.click(); } },
      style: {
        border: '1.5px dashed ' + borderColor, borderRadius: 'var(--rse-radius-md)',
        background: dragging ? 'var(--rse-color-surface-primary-tint)' : 'var(--rse-color-surface-card)',
        padding: 'var(--rse-space-6)', textAlign: 'center', cursor: 'pointer',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--rse-space-2)',
        transition: 'background var(--rse-duration-fast) var(--rse-ease-standard), border-color var(--rse-duration-fast) var(--rse-ease-standard)'
      }
    },
      React.createElement('span', {
        style: { fontSize: 'var(--rse-font-size-body-md)', fontWeight: 'var(--rse-font-weight-bold)', color: 'var(--rse-color-text-heading)' }
      }, 'Arraste os arquivos ou clique para escolher'),
      React.createElement('span', {
        style: { fontSize: 'var(--rse-font-size-body-sm)', color: 'var(--rse-color-text-muted)' }
      }, [accept, maxSizeLabel].filter(Boolean).join(' · ') || 'PDF, JPG ou PNG'),
      React.createElement('input', {
        ref: inputRef, type: 'file', accept, multiple,
        onChange: (e) => emit(e.target.files),
        style: { display: 'none' }
      })
    ),
    files.length ? React.createElement('ul', { style: { listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--rse-space-2)' } },
      files.map((f, i) => React.createElement('li', {
        key: i,
        style: {
          display: 'flex', alignItems: 'center', gap: 'var(--rse-space-3)', padding: '10px 14px',
          background: 'var(--rse-color-surface-sunken)', borderRadius: 'var(--rse-radius-sm)', fontSize: 'var(--rse-font-size-body-sm)'
        }
      },
        React.createElement('span', { style: { flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--rse-color-text-heading)', fontWeight: 'var(--rse-font-weight-semibold)' } }, f.name || String(f)),
        f.size ? React.createElement('span', { style: { color: 'var(--rse-color-text-muted)', flex: 'none' } }, Math.max(1, Math.round(f.size / 1024)) + ' KB') : null,
        React.createElement('button', {
          type: 'button', 'aria-label': 'Remover ' + (f.name || 'arquivo'),
          onClick: () => onFilesChange && onFilesChange(files.filter((_, j) => j !== i)),
          style: { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--rse-color-text-muted)', display: 'inline-flex', padding: 4 }
        }, React.createElement(Icon, { name: 'x', size: 16 }))
      ))
    ) : null,
    (hint || error) ? React.createElement('span', {
      style: { fontSize: 'var(--rse-font-size-caption)', color: error ? 'var(--rse-color-danger-text)' : 'var(--rse-color-text-muted)' }
    }, error || hint) : null
  );
}
