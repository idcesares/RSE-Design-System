# DateField

Dates in enrollment and event contexts: data de nascimento, início das aulas, prazo de inscrição. Uses the native picker — accessible, localised and familiar on every device.

```jsx
<DateField label="Data de nascimento do aluno" required max="2020-12-31" hint="dd/mm/aaaa" />
<DateField label="Início desejado" min="2026-01-05" deadline="Inscrições até 28/02" />
```

- Bound real ranges with `min`/`max` — never let a family pick an impossible date and fail on submit.
- The `deadline` pill states the window; keep it under ~40 characters.
- Never build a custom calendar for a single date; if a range is needed, use two fields.
