Hover label wrapping any trigger element (icon buttons, truncated text).

```jsx
<Tooltip label="Adicionar aos favoritos"><IconButton ariaLabel="Favoritar" icon={<HeartIcon/>} /></Tooltip>
```

Shows on hover *and* on keyboard focus, closes on Escape, and links the bubble to its trigger with
`aria-describedby`. The trigger must be focusable (a button or link) — never wrap plain text you
expect keyboard users to reach. Tooltips are supplementary: never put information here that a user
must have to complete a task.
