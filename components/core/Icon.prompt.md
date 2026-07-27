The single source of truth for iconography — 97 line glyphs from Lucide (ISC), drawn on a 24×24
grid with a 2px stroke, inheriting `currentColor` so icons take the colour of surrounding text.

```jsx
<Icon name="graduation-cap" size={24} />
<Icon name="map-pin" title="Unidade mais próxima" />

// Inside action components:
<Button variant="primary" icon={<Icon name="arrow-right" />}>Quero me inscrever</Button>
<IconButton ariaLabel="Buscar unidades" icon={<Icon name="search" />} />
```

Size with `size` (default 20; 24 in buttons and navigation, 16 inside dense tables).

Reach for these first on this brand's surfaces: `graduation-cap`, `school`, `book-open` (programmes
and levels), `map-pin`, `building-2`, `navigation` (units), `file-text`, `clipboard-check`,
`upload`, `id-card`, `calendar-check` (enrollment), `chart-column`, `trending-up`, `target`
(results and the IDE-Sesc), `sparkles`, `brain`, `bot` (the Sab.IA platform). The full list is the
`IconName` union in `Icon.d.ts`.

Accessibility: an icon with no `title` renders `aria-hidden` — correct for decoration beside a text
label. Pass `title` (in pt-BR) only when the icon carries meaning on its own; if it sits inside an
`IconButton`, label the button instead. An unknown name renders nothing, so a typo shows up as a
missing icon in review rather than a broken glyph.

**Never hand-draw an icon or paste a one-off SVG into a page.** `Icon.jsx` is generated from the
vendored SVGs — vendor the glyph you need and re-run the generator (`assets/icons/README.md`).
Edits made directly to `Icon.jsx` are overwritten.
