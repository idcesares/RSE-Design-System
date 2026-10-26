# Stepper

Horizontal steppers stack vertically at 480 px and below so labels remain readable. Explicit
`orientation="vertical"` stays vertical at every width.

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

## Plain HTML contract

The root is `ol.rse-stepper`; add `.rse-stepper--vertical` for a sidebar layout. Native
attributes and the forwarded ref target the list. Each `li.rse-stepper__step` carries
`aria-current="step"` when current and `.rse-stepper__step--complete` when completed.
Use the vendored Icon check markup inside completed markers, with an accessible completed label.

```html
<ol class="rse-stepper" aria-label="Etapas da matrícula">
  <li class="rse-stepper__step" aria-current="step">
    <div class="rse-stepper__track">
      <div class="rse-stepper__marker">1</div>
      <div class="rse-stepper__connector" aria-hidden="true"></div>
    </div>
    <div class="rse-stepper__content">
      <div class="rse-stepper__label">Dados do aluno</div>
      <div class="rse-stepper__description">Informações iniciais</div>
    </div>
  </li>
  <li class="rse-stepper__step">
    <div class="rse-stepper__track"><div class="rse-stepper__marker">2</div></div>
    <div class="rse-stepper__content"><div class="rse-stepper__label">Documentos</div></div>
  </li>
</ol>
```

The last step has no connector. Static progress needs no JavaScript. To allow navigation,
replace markers with `button type="button"`, give each a label such as `Etapa 1: Dados do aluno`,
and implement JavaScript to navigate the flow and update the current/completed state. The React
wrapper calls `onStepClick(index)`; the caller owns the current index and form validation.
