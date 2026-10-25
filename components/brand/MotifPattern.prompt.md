# MotifPattern

A field of impossible isometric shapes (the engine's cubes, triangles, stairs and loops) that fills the box you give it. Use it as the artwork of a hero band, a section background or a standalone spectrum piece. It is a field, not a focal construction: the rule of one focal `BrandMotif` per composition still stands, and the field is not that construction.

The component fills its parent (`display: block; width: 100%; height: 100%`). **The host sets the size**: a wrapper with a height, or a `className` that gives one.

```jsx
<div style={{ height: 320 }}>
  <MotifPattern shape="cube" hue="purple" cell={72} />
</div>

<section className="faixa-hero">          {/* position: relative; min-height: 420px */}
  <MotifPattern className="faixa-hero__fundo" shape={['cube', 'stair']} hue="blue" animate="reveal" opacity={0.3} />
  <div className="faixa-hero__painel">…</div>
</section>
```

## Text never sits on the cells

Text goes on a **solid panel** beside the pattern or on top of it, never straight on the cells: the faces change tone every few pixels, so no text colour clears the contrast floor across them. Put a `--rse-color-surface-card` (or ink band) panel over the field, with padding, and keep the copy inside it:

```html
<section style="position: relative; min-height: 420px; overflow: hidden">
  <div class="rse-motif-pattern rse-motion-managed" style="position: absolute; inset: 0">…</div>
  <div style="position: relative; max-width: var(--rse-container-prose); margin: var(--rse-section-y-md) auto;
              padding: var(--rse-space-8); background: var(--rse-color-surface-card); border-radius: var(--rse-radius-lg)">
    <h2>Aprender para a vida acontecer</h2>
    <p>Matrículas abertas nas unidades da Rede Sesc de Educação.</p>
  </div>
</section>
```

## Props

- `shape`: `cube`, `triangle`, `stair`, `loop`, `tower` or `twin`, or a list the seed picks from per cell. Required. An unknown name renders nothing.
- `hue`: any of the six families, `purple` by default. An unknown name renders nothing. The ramps are derived (AGENTS.md rule 10); tell the user the purple, orange and yellow hues are not supplied by Sesc.
- `hues` + `sequence` (`row`, `diagonal`, `seeded`): several families spread over the cells. **A multi-hue pattern is allowed only as the artwork itself** (a hero field or a standalone spectrum piece). Page text, bands and panels around it stay in one hue (rule R4).
- `cell` (px, 96), `gap` (px, 0), `layout` (`grid`, `brick`, `isometric`), `fill` (0 to 1, the share of cells drawn), `seed` (same options, same SVG), `opacity` (0 to 1, for the whole field; about 0.3 behind content).
- `width` / `height`: the drawing box, 1920 x 1080 by default. Only the proportion matters, because the art is scaled to fill the host ("slice": it covers the box and crops the overflow). A bigger `cell` or a smaller box gives fewer cells; the renderer caps the count.
- `animate`: `none` (default), `reveal` or `ambient`.

Two patterns on one page share their `<defs>` ids by design (`rse-motif-pattern-<shape>-<hue>`): the same shape in the same hue is the same drawing, so the browser resolves either one. Do not rename them.

## Motion

It is `.rse-motion-managed` and implements both forms of the motion setting (`data-rse-motion`).

- **`reveal`**: each cell fades in and settles from a small offset, staggered outward from the top-left corner, once, when the pattern scrolls into view. It is progressive enhancement: cells are visible by default, and are hidden only after `RSE.motion.reveal()` (from `motion.js`) has marked the pattern, on a browser with `IntersectionObserver`. No `motion.js`, no `IntersectionObserver` or no JavaScript: the pattern is simply there. The React component calls `RSE.motion.reveal` itself when it exists. Reduced: opacity only, no travel.
- **`ambient`**: every cell's opacity breathes between 1 and 0.8, staggered, one cycle every 4.8 s. It is a slow, flat shift, never a flash. Reduced: static.
- **Pause (WCAG 2.2.2)**: `ambient` always renders one pause button in the bottom-right corner, 44 px, on a solid chip so it reads over any hue. It toggles `data-paused` on the pattern, `aria-pressed` and its label (`Pausar animação` / `Retomar animação`), and swaps the pause and play icons. `none` and `reveal` render no button. Keep the button; never hide it.

## Plain HTML

Link `styles.css` (it carries `MotifPattern.css`) and load `motion.js`. Render the SVG with the engine (`RSE.renderMotifPattern({ shape: 'cube', hue: 'purple', width: 1920, height: 1080, animate: 'ambient' })`) and put its string inside the art div. The classes and the two attributes are the contract:

```html
<div style="height: 320px">
  <div class="rse-motif-pattern rse-motion-managed" data-animate="ambient">
    <div class="rse-motif-pattern__art" aria-hidden="true">
      <svg viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" …>
        <defs>…</defs>
        <g class="rse-motif-pattern__cells">
          <g class="rse-motif-pattern__cell" style="--d:0"><use href="#rse-motif-pattern-cube-purple" transform="…"/></g>
          …
        </g>
      </svg>
    </div>
    <!-- Only with data-animate="ambient". Both icons are in the markup; CSS shows one by [aria-pressed]. -->
    <button type="button" class="rse-motif-pattern__pause" aria-pressed="false" aria-label="Pausar animação">
      <span class="rse-motif-pattern__icon rse-motif-pattern__icon--pause">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="14" y="3" width="5" height="18" rx="1"/><rect x="5" y="3" width="5" height="18" rx="1"/></svg>
      </span>
      <span class="rse-motif-pattern__icon rse-motif-pattern__icon--play">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/></svg>
      </span>
    </button>
  </div>
</div>
<script src="motion.js"></script>
<script>RSE.motion.init(); RSE.motion.reveal();</script>
```

`motion.js` binds one delegated click handler for every `.rse-motif-pattern__pause` at load, so the button works with no further code. For `data-animate="reveal"`, call `RSE.motion.reveal()` once the markup is in the page (it takes an optional root). The root is not `aria-hidden` (the button lives in it); the art div is. When printing, a reveal pattern that never scrolled into view is shown in full (a `@media print` override), so it never prints as an empty field.

## Contrast and use

The shapes are graphics (WCAG 1.4.11 asks 3:1 against the surface for anything that carries meaning); as decoration behind a solid panel they carry none, so any hue works on any surface. Do not rely on the field to communicate anything. Flat fills only: no gradients, glows or noise. Generated shapes and motion are system work that Sesc's brand team has not reviewed yet.
