# DateField

Dates in enrollment and event contexts: data de nascimento, início das aulas, prazo de inscrição. Uses the native picker — accessible, localised and familiar on every device.

```jsx
<DateField label="Data de nascimento do aluno" required max="2020-12-31" hint="dd/mm/aaaa" />
<DateField label="Início desejado" min="2026-01-05" deadline="Inscrições até 28/02" />
```

- Bound real ranges with `min`/`max` — never let a family pick an impossible date and fail on submit.
- The `deadline` pill states the window; keep it under ~40 characters.
- Never build a custom calendar for a single date; if a range is needed, use two fields.

## HTML (CSS contract)

Same field structure as `Input`; the control is an `.rse-input` with `type="date"`. Link the message with `aria-describedby`; on error add `rse-field--invalid` and `aria-invalid="true"`.

```html
<div class="rse-field">
  <label class="rse-field__label" for="nasc">Data de nascimento do aluno<span class="rse-field__required" aria-hidden="true"> *</span></label>
  <input class="rse-input" type="date" id="nasc" required max="2020-12-31" aria-describedby="nasc-deadline nasc-msg">
  <span class="rse-field__deadline" id="nasc-deadline">Inscrições até 28/02</span>
  <p class="rse-field__message" id="nasc-msg">dd/mm/aaaa</p>
</div>
```

Props: `id` (optional, otherwise generated), `error`, `hint`, `deadline`; `ref`, `className` and any input attribute are forwarded.
