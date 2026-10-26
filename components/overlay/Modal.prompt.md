Centered dialog on a dimmed backdrop — confirmations, enrollment step forms, unit detail popups (the pattern behind the ui kit's `EnrollDialog`).

```jsx
<Modal open={isOpen} onClose={() => setOpen(false)} title="Confirmar inscrição"
  footer={<><Button variant="ghost" onClick={close}>Cancelar</Button><Button variant="primary">Confirmar</Button></>}>
  <p>Revise seus dados antes de enviar.</p>
</Modal>
```

Click on the backdrop or the close button calls `onClose`; clicks inside the panel don't bubble. Renders `null` when `open` is false — mount it unconditionally and toggle `open`.

Accessibility is handled for you: Escape closes, focus moves to the first control on open and returns
to the trigger on close, Tab is cycled inside the panel, body scroll is locked, and the panel is
labelled by its `title`. Keep `title` set — an untitled dialog falls back to a generic label.


## CSS contract and plain HTML

Link `styles.css`, or tokens + base runtime + `dist/components.css`. Native root attributes, `className` and a forwarded `ref` are supported.

```html
<div class="rse-modal-backdrop">
  <div class="rse-modal rse-modal--md" role="dialog" aria-modal="true" aria-labelledby="dialog-title" tabindex="-1">
    <div class="rse-modal__header"><h3 class="rse-modal__title" id="dialog-title">Revise seus dados</h3></div>
    <div class="rse-modal__body">Confira as informações antes de continuar.</div>
    <div class="rse-modal__footer"><button class="rse-button" type="button">Continuar</button></div>
  </div>
</div>
```

CSS supplies the appearance only. The host must handle Escape/backdrop dismissal, initial focus, focus trapping, focus return and body scroll locking. Remove the backdrop when closed. React supplies these behaviors. Native attributes, `className` and `ref` target the dialog panel, not the backdrop.
