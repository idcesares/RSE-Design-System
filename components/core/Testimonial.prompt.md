# Testimonial

One quote from a parent, student or alumnus, with who said it. Static: no carousel, no auto-rotation; for several, lay out several `Testimonial`s in a grid.

**Never invent a testimonial.** Real ones need the person's authorization. Until you have one, pass `example` so the card carries a visible "Depoimento de exemplo" pill (screen readers read it too) and tell the user it must be replaced before publishing.

```jsx
<Testimonial
  example
  quote="Depoimento de exemplo: substitua por um relato real e autorizado."
  name="Nome Sobrenome"
  role="responsável"
  unit="unidade a definir"
  avatar={<Avatar initials="NS" size="lg" />}
/>
```

- `quote` is the text only; the typographic quotes come from CSS.
- `role` is the role or relationship ("responsável", "ex-estudante"); `unit` is optional.
- `avatar` is an `Avatar` node. Use initials; a photo needs real consent and a real `alt`.
- `example` defaults to `false`. Demos, templates and prompts always set it.

Plain HTML:

```html
<figure class="rse-testimonial rse-testimonial--example">
  <span class="rse-testimonial__example">Depoimento de exemplo</span>
  <blockquote class="rse-testimonial__quote">Depoimento de exemplo: substitua por um relato real e autorizado.</blockquote>
  <figcaption class="rse-testimonial__author">
    <span class="rse-testimonial__who">
      <span class="rse-testimonial__name">Nome Sobrenome</span>
      <span class="rse-testimonial__role">responsável</span>
      <span class="rse-testimonial__unit">unidade a definir</span>
    </span>
  </figcaption>
</figure>
```
