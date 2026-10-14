Labeled text field with focus ring, error and helper-text states.

```jsx
<Input label="Nome completo" placeholder="Digite seu nome" />
<Input label="E-mail" error="E-mail inválido" />
```

The label, the field and its message are wired for screen readers: the message is the field's
`aria-describedby`, and `error` sets `aria-invalid`. Any native attribute (`name`, `autoComplete`,
`inputMode`, `required`…) goes straight to the `<input>`; `ref` reaches it too. `className` styles the
wrapper.

```jsx
<Input label="CPF do responsável" name="cpf" inputMode="numeric" autoComplete="off" required
  error={erroCpf} helpText="Somente números" />
```

Without React (CMS, portal):

```html
<div class="rse-field rse-field--invalid">
  <label class="rse-field__label" for="cpf">CPF do responsável</label>
  <input class="rse-input" id="cpf" name="cpf" aria-invalid="true" aria-describedby="cpf-msg">
  <p class="rse-field__message" id="cpf-msg">Informe os 11 dígitos do CPF.</p>
</div>
```
