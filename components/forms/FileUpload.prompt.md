# FileUpload

Enrollment documents: RG, CPF, comprovante de residência, histórico escolar, Credencial Sesc.

```jsx
<FileUpload label="Documentos do aluno" accept=".pdf,.jpg,.png" maxSizeLabel="até 5 MB por arquivo"
  multiple files={files} onFilesChange={setFiles}
  hint="Envie frente e verso do RG." />
```

- Always state accepted formats and the size limit up front — not after a failed upload.
- One field per document type beats one field for everything; families need to know what is missing.
- Keyboard accessible (Enter/Space open the picker); drag-and-drop is an enhancement, never the only route.
- Pair with `Stepper` in a matrícula flow so progress stays visible.

Texts are props: `dropLabel` (default "Arraste os arquivos ou clique para escolher") and `acceptHint` (default "PDF, JPG ou PNG", shown only when `accept`/`maxSizeLabel` are absent). With `error`, the file input gets `aria-invalid` and the message is announced (`role="alert"`).

## HTML (CSS contract)

```html
<div class="rse-field">
  <span class="rse-field__label" id="up-label">Documentos do aluno</span>
  <label class="rse-dropzone" for="up-input">
    <span class="rse-dropzone__title" id="up-title">Arraste os arquivos ou clique para escolher</span>
    <span class="rse-dropzone__hint">PDF, JPG ou PNG</span>
    <input class="rse-control-input" id="up-input" type="file" aria-labelledby="up-label up-title" aria-describedby="up-note">
  </label>
  <ul class="rse-dropzone-list">
    <li class="rse-dropzone-list__item">
      <span class="rse-dropzone-list__name">rg-frente.pdf</span>
      <span class="rse-dropzone-list__size">240 KB</span>
      <button type="button" class="rse-dropzone-list__remove" aria-label="Remover rg-frente.pdf"><!-- ícone "x" do Icon.jsx (SVG Lucide) --></button>
    </li>
  </ul>
  <p class="rse-field__message" id="up-note">Envie frente e verso do RG.</p>
</div>
```

Modifiers: `rse-dropzone--dragging` (drag highlight), `rse-dropzone--error` (plus `rse-field--invalid` on the field). Wiring the picker and drop handling needs a little script; the React component does it.
