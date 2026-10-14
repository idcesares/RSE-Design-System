Pill-shaped call-to-action button, the primary way people move through Rede Sesc de Educação surfaces (enroll, learn more, submit forms).

```jsx
<Button variant="primary" size="md" onClick={() => {}}>Quero me inscrever</Button>
<Button variant="secondary">Saiba mais</Button>
<Button variant="ghost" size="sm">Voltar</Button>
```

Variants: `primary` (solid purple, on colored surfaces or as the main CTA), `secondary` (tinted purple, lower-emphasis actions), `ghost` (outlined, for use on busy or colored backgrounds). Sizes: `sm`, `md`, `lg`. Pass `icon` for a leading glyph; set `disabled` to mute and block interaction.

Pass `href` for navigation — it renders an `<a>` with the same look (a button that navigates is a
link). Every native attribute and a `ref` pass through.

Without React: `<button class="rse-button rse-button--secondary rse-button--sm">` or
`<a class="rse-button" href="/matricula">`. Hover, press, focus and disabled are pure CSS.
