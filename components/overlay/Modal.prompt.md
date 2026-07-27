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
