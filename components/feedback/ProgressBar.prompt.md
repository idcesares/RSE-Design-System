Determinate progress track for multi-step enrollment forms, file uploads, or profile completion.

```jsx
<ProgressBar value={60} label="Etapa 3 de 5" />
<ProgressBar value={100} tone="success" />
```

Pill-shaped to match the brand's rounded system. Pair with `label` for multi-step flows so users know where they stand.

The track is a `role="progressbar"` with `aria-valuenow/min/max`. It takes its accessible name from
`label`; when the bar has no visible label, pass `ariaLabel` instead ("Envio de documentos").

## Plain HTML contract

```html
<div class="rse-progress-bar rse-progress-bar--success" style="--rse-progress-bar-value:60%">
  <div class="rse-progress-bar__label"><span>Etapa 3 de 5</span><span>60%</span></div>
  <div class="rse-progress-bar__track" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" aria-label="Etapa 3 de 5">
    <div class="rse-progress-bar__fill"></div>
  </div>
</div>
```

Keep the custom property, visible percentage and ARIA value in sync, within 0–100. Tone modifiers
are `--primary` (default), `--success`, and `--danger`. React forwards the ref and native div
attributes to the outer div; `ariaLabel` names the inner progressbar. `className` and caller
`style` are merged at the root. Width is the only generated inline custom property.
