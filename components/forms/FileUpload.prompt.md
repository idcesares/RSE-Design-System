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
