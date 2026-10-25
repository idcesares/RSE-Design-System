# MotifLoader

The loader for a whole page or a section of one: an impossible isometric shape assembles piece by piece, holds, comes apart and loops. Spinner for buttons, MotifLoader for page and section loading at 48 px or larger. Below 32 px the facets blur, and the component logs a console warning once.

```jsx
<MotifLoader label="Carregando unidades" />
<MotifLoader shape="triangle" hue="blue" size={64} label="Carregando programas" />
<MotifLoader shape="twin" hues={['green', 'blue', 'pink']} size={72} />
```

Plain HTML (no React; link `styles.css`, which carries `MotifLoader.css`). Render the shape with the engine (`RSE.motifPieces`) or copy the markup from a React render; the classes and custom properties are the contract:

```html
<span class="rse-motif-loader rse-motion-managed" role="status" aria-label="Carregando" style="--n:12">
  <svg viewBox="-3.46 -4 6.92 8" width="48" height="48" aria-hidden="true" focusable="false">
    <g class="rse-motif-loader__piece" style="--i:0;--ax:0;--ay:-1">
      <polygon points="…" fill="#6c62c4"/>
    </g>
    <!-- one g per piece, with --i (position), --ax/--ay (the piece's axis on screen) -->
  </svg>
</span>
```

## Props

- `shape`: `cube` (default, a 12-bar frame), `triangle`, `stair`, `loop`, `tower` or `twin`. An unknown name renders nothing.
- `hue`: any of the six families, `purple` by default. An unknown name renders nothing. The ramp is derived (see AGENTS.md rule 10); tell the user the purple, orange and yellow hues are not supplied by Sesc.
- `hues`: 2 to 4 families. The fills step through them, one hue per cycle. Any other length falls back to `hue`.
- `size`: width and height in px, 48 by default.
- `label`: the name screen readers announce, in pt-BR, `Carregando` by default. Say what is loading: `Carregando matrículas`.

## Motion

It is `.rse-motion-managed` and implements both forms of the motion setting (`data-rse-motion`, see the guidelines).

- **Full**: each piece slides in along its own axis while fading in, staggered so the last piece is in place by 30% of the cycle, holds until 75%, then comes apart the way it came. One cycle is `--rse-duration-loop` (2.4 s). Nothing rotates, stretches or morphs.
- **Reduced** (the setting, or the OS preference when nothing is set): the same staggered build by opacity only, with no travel, and the cycle doubles (4.8 s), a gentler fade. It never freezes: it keeps changing, and the underlying style is the whole assembled shape, so a viewer that stops animation shows the finished shape.
- The loader announces itself with `role="status"`; the SVG is `aria-hidden`.

## Contrast

Contrast is measured on the base shade of each hue only; the lighter facets have less contrast against the cream page.

The shape is a graphic, so WCAG 1.4.11 asks 3:1 between its base colour and the surface behind it. These combinations fall short (`npm run check` verifies this list in both directions). Put the loader on a surface that clears the floor, or pick another hue:

Evite: green sobre page
Evite: green sobre card
Evite: blue sobre page
Evite: blue sobre card
Evite: pink sobre page
Evite: pink sobre card
Evite: purple sobre page
Evite: orange sobre page
Evite: orange sobre card
Evite: yellow sobre page
Evite: yellow sobre card

(`page` is the cream page, `card` the white card, `ink` the `--rse-brand-ink` band, `dark-page` the dark theme page.) Every hue clears 3:1 on `ink` and on `dark-page`, so on those surfaces any hue works. On the cream page and the white card, use `purple` on card, or put the loader on an ink band.
