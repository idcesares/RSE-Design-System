# Accordion

FAQ / progressive-disclosure list. Use for enrollment questions, program requirements, document checklists — anywhere a page would otherwise become a wall of text.

```jsx
<Accordion items={[
  { title: 'Quem pode se inscrever?', content: 'Trabalhadores do comércio…' },
  { title: 'Quais documentos preciso levar?', content: <ul><li>RG</li><li>Comprovante</li></ul> }
]} defaultOpen={[0]} />
```

- Single-open by default (`allowMultiple` for checklists where comparison matters).
- Titles are sentence case, question-shaped, never uppercase.
- Body copy caps at `--container-prose`; do not nest cards or forms inside.
