# Textarea

Long-answer field for enrollment forms, contact and feedback. Visually identical to `Input` (14px radius, 1.5px border, tinted focus glow).

```jsx
<Textarea label="Conte por que quer estudar no Sesc" maxLength={500} hint="Opcional" rows={5} />
```

- Always label; placeholders are examples, never the label.
- `error` replaces `hint` — write it as a fix ("Escreva ao menos 20 caracteres"), not a scold.
- Only set `maxLength` when a real limit exists; the counter is otherwise noise.
