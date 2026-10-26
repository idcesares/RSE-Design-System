# Accordion

FAQ / progressive-disclosure list. Use for enrollment questions, program requirements, document checklists — anywhere a page would otherwise become a wall of text.

```jsx
<Accordion items={[
  { title: 'Quem pode se inscrever?', content: 'Trabalhadores do comércio…' },
  { title: 'Quais documentos preciso levar?', content: <ul><li>RG</li><li>Comprovante</li></ul> }
]} defaultOpen={[0]} />
```

- Single-open by default (`allowMultiple` for checklists where comparison matters).
- Titles are sentence case, question-shaped, never uppercase.
- Body copy caps at `--rse-container-prose`; do not nest cards or forms inside.


## CSS contract and plain HTML

Link `styles.css`, or tokens + base runtime + `dist/components.css`. Native root attributes, `className` and a forwarded `ref` are supported.

```html
<div class="rse-accordion">
  <div class="rse-accordion__item">
    <button class="rse-accordion__trigger" id="faq-trigger" aria-expanded="true" aria-controls="faq-panel" type="button">Como participar?</button>
    <div class="rse-accordion__panel" id="faq-panel" aria-labelledby="faq-trigger" aria-hidden="false">
      <div class="rse-accordion__clip"><div class="rse-accordion__content">Consulte as orientações da sua unidade.</div></div>
    </div>
  </div>
</div>
```

A host controller must toggle `aria-expanded`, `aria-hidden` and `inert` together. Closed panels use `aria-hidden="true"` and `inert`; remove `inert` before opening. Keep trigger/panel IDs unique.
