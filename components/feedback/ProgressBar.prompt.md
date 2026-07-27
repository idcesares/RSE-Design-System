Determinate progress track for multi-step enrollment forms, file uploads, or profile completion.

```jsx
<ProgressBar value={60} label="Etapa 3 de 5" />
<ProgressBar value={100} tone="success" />
```

Pill-shaped to match the brand's rounded system. Pair with `label` for multi-step flows so users know where they stand.

The track is a `role="progressbar"` with `aria-valuenow/min/max`. It takes its accessible name from
`label`; when the bar has no visible label, pass `ariaLabel` instead ("Envio de documentos").
