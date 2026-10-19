'use client';
import React from 'react';
import { Icon } from '../core/Icon.jsx';
const cx = (...c) => c.filter(Boolean).join(' ');
// Renders the CSS contract in FileUpload.css (.rse-dropzone) with the shared .rse-field label and
// message. The dropzone is a role=button wired to the label and message by id; the native file
// input stays in the DOM, visually hidden. Only the drag highlight is a className toggle.
export const FileUpload = React.forwardRef(function FileUpload({
  label, hint, accept, multiple = false, files = [], onFilesChange, error, maxSizeLabel, id,
  dropLabel = 'Arraste os arquivos ou clique para escolher', acceptHint = 'PDF, JPG ou PNG', className, ...rest
}, ref) {
  const [dragging, setDragging] = React.useState(false);
  const inputRef = React.useRef(null);
  const autoId = React.useId();
  const uid = id || 'rse-upload-' + autoId.replace(/:/g, '');
  const labelId = uid + '-label';
  const noteId = uid + '-note';
  const emit = (list) => { if (onFilesChange) onFilesChange(Array.from(list)); };
  const open = () => inputRef.current && inputRef.current.click();
  const message = error || hint;
  return React.createElement('div', { ref, className: cx('rse-field', error && 'rse-field--invalid', className), ...rest },
    label ? React.createElement('span', { id: labelId, className: 'rse-field__label' }, label) : null,
    React.createElement('div', {
      className: cx('rse-dropzone', dragging && 'rse-dropzone--dragging', error && 'rse-dropzone--error'),
      onDragOver: (e) => { e.preventDefault(); setDragging(true); },
      onDragLeave: () => setDragging(false),
      onDrop: (e) => { e.preventDefault(); setDragging(false); emit(e.dataTransfer.files); },
      onClick: open,
      role: 'button', tabIndex: 0,
      'aria-labelledby': label ? labelId : undefined,
      'aria-describedby': message ? noteId : undefined,
      'aria-invalid': error ? 'true' : undefined,
      onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } }
    },
      React.createElement('span', { className: 'rse-dropzone__title' }, dropLabel),
      React.createElement('span', { className: 'rse-dropzone__hint' }, [accept, maxSizeLabel].filter(Boolean).join(' · ') || acceptHint),
      React.createElement('input', {
        ref: inputRef, type: 'file', accept, multiple,
        className: 'rse-control-input', tabIndex: -1, 'aria-hidden': 'true',
        onChange: (e) => emit(e.target.files)
      })
    ),
    files.length ? React.createElement('ul', { className: 'rse-dropzone-list' },
      files.map((f, i) => React.createElement('li', { key: i, className: 'rse-dropzone-list__item' },
        React.createElement('span', { className: 'rse-dropzone-list__name' }, f.name || String(f)),
        f.size ? React.createElement('span', { className: 'rse-dropzone-list__size' }, Math.max(1, Math.round(f.size / 1024)) + ' KB') : null,
        React.createElement('button', {
          type: 'button', className: 'rse-dropzone-list__remove', 'aria-label': 'Remover ' + (f.name || 'arquivo'),
          onClick: () => onFilesChange && onFilesChange(files.filter((_, j) => j !== i))
        }, React.createElement(Icon, { name: 'x', size: 16 }))
      ))
    ) : null,
    message ? React.createElement('p', { className: 'rse-field__message', id: noteId, role: error ? 'alert' : undefined }, message) : null
  );
});
