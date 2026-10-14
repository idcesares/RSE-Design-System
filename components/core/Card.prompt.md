Content card for programs, schools, or news — image, category tag, eyebrow, title, description, footer slot (e.g. a Button or Badge).

```jsx
<Card
  image={<img src="photo.jpg" />}
  tag={<Tag color="green">Educação Infantil</Tag>}
  eyebrow="Rede Sesc"
  title="Colégio Sesc de Ensino Médio"
  description="Formação integral com foco em protagonismo estudantil."
  footer={<Button size="sm" variant="secondary">Saiba mais</Button>}
/>
```

Pass `href` to make the card a link: the title becomes the link and its hit area covers the card, so
the whole card is clickable while a `footer` button stays its own control (never nest a control in a
link). Linked cards lift on hover. Without `href` the card is static — use that when the footer
holds the only action. Use `<image-slot>` as the `image` placeholder in prototypes.

Without React: `<article class="rse-card">` with `.rse-card__media`, `.rse-card__body`,
`.rse-card__eyebrow`, `.rse-card__title > a.rse-card__link`, `.rse-card__description`, `.rse-card__footer`.
