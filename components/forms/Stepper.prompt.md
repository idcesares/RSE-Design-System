# Stepper

Multi-step flow progress — matrícula, envio de documentos, inscrição em processo seletivo. Tells families how much is left, which is the main anxiety in an enrollment form.

```jsx
<Stepper current={1} steps={[
  { label: 'Dados do aluno' },
  { label: 'Documentos', description: 'RG, CPF e comprovante' },
  { label: 'Confirmação' }
]} />
```

- 3–5 steps; more than that means the flow needs splitting, not more dots.
- Horizontal above the form on desktop; `orientation="vertical"` in a sidebar or on narrow screens.
- Labels are nouns ("Documentos"), not instructions ("Envie seus documentos").
