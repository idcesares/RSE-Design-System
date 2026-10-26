Hover label wrapping any trigger element (icon buttons, truncated text).

```jsx
<Tooltip label="Adicionar aos favoritos"><IconButton ariaLabel="Favoritar" icon={<HeartIcon/>} /></Tooltip>
```

Shows on hover *and* on keyboard focus, closes on Escape, and links the bubble to its trigger with
`aria-describedby`. The trigger must be focusable (a button or link) — never wrap plain text you
expect keyboard users to reach. Tooltips are supplementary: never put information here that a user
must have to complete a task.


## CSS contract and plain HTML

Link `styles.css`, or tokens + base runtime + `dist/components.css`. Native root attributes, `className` and a forwarded `ref` are supported.

```html
<span class="rse-tooltip">
  <button type="button" aria-describedby="tip-example">Ajuda</button>
  <span class="rse-tooltip__bubble" id="tip-example" role="tooltip">Consulte as orientações</span>
</span>
```

CSS shows the bubble on hover and focus within. The trigger must forward `aria-describedby` to its focusable element. React adds that attribute to its single child. A plain-HTML controller must set `data-dismissed` on Escape and clear it on the next interaction. Keep the bubble hoverable and IDs unique.
