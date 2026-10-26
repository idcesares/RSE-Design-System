Transient notification card, left-accent colored by tone.

```jsx
<Toast tone="success" title="Inscrição enviada" message="Você receberá um e-mail de confirmação." />
```


## CSS contract and plain HTML

Link `styles.css`, or tokens + base runtime + `dist/components.css`. Native root attributes, `className` and a forwarded `ref` are supported.

```html
<div class="rse-toast rse-toast--success" role="status">
  <div class="rse-toast__content">
    <div class="rse-toast__title">Dados salvos</div>
    <div class="rse-toast__message">Você pode continuar.</div>
  </div>
</div>
```

Use `role="status"` for ordinary updates, `role="alert"` only for urgent errors. An optional `.rse-toast__close` button needs a host dismiss handler; React uses `onClose`.
