Full-width, in-flow banner for page-level or form-level announcements — enrollment windows, deadline notices, validation summaries.

```jsx
<Alert tone="info" title="Matrículas abertas" message="Garanta a vaga para o ano letivo de 2027." />
<Alert tone="danger" message="Verifique os campos destacados abaixo." onDismiss={() => {}} />
```

Different from `Toast`: `Alert` sits inline in the page flow (bordered all around, no shadow, no auto-dismiss) for persistent messages; `Toast` floats and is transient. Don't use both for the same message.
