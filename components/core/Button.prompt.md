Pill-shaped call-to-action button, the primary way people move through Rede Sesc de Educação surfaces (enroll, learn more, submit forms).

```jsx
<Button variant="primary" size="md" onClick={() => {}}>Quero me inscrever</Button>
<Button variant="secondary">Saiba mais</Button>
<Button variant="ghost" size="sm">Voltar</Button>
```

Variants: `primary` (solid purple, on colored surfaces or as the main CTA), `secondary` (tinted purple, lower-emphasis actions), `ghost` (outlined, for use on busy or colored backgrounds). Sizes: `sm`, `md`, `lg`. Pass `icon` for a leading glyph; set `disabled` to mute and block interaction.
