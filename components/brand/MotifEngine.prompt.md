The motif engine — a **function library with no visual output of its own**. It builds impossible
isometric shapes in the language of the *cubo impossível* (lattice bars and cubes, shaded top
lightest, left mid, right darkest) and returns them as data or as an SVG string, in any of the six
palette families. `MotifLoader` and `MotifPattern` are built on it; reach for those first. Use the
engine directly only to place a generated shape the components do not cover.

Exported functions (also grouped on the `MotifEngine` object):

- `isoPoint(p)` — lattice point `[x, y, z]` to screen point (z up, x at +30°, y at −30°).
- `motifBar(axis, start, length, thickness?)` and `motifCube(at, size?)` — the two primitives.
- `makeMotifShape(name, parts, crossings?)` — a shape; a crossing `{ over, under, overAt }` says
  part `over` passes in front of `under` at its `overAt` end and behind at the other. Everything
  else paints by plain geometry (what is behind paints first). A part may be `over` in one crossing
  and `under` in another, so an impossible loop is declared the natural way, one crossing per joint
  (A over B, B over C, C over A). Crossings beat geometry; the first declared wins a contradiction.
- `motifFaces(shape)` — every visible face in paint order.
- `motifPieces(shape, hue)` — faces grouped per piece and filled from the palette ramp; `null` for
  an unknown hue.
- `motifToSvg(shape, { hue, size?, title? })` — one `<svg>` string; `''` for an unknown hue.

```js
import { motifBar, motifCube, makeMotifShape, motifToSvg } from '@idcesares/rse-design-system';

const shape = makeMotifShape('bridge', [
  motifBar('x', [0, 0, 0], 4),
  motifBar('y', [2, -2, 1], 4),  // rests on the first bar, so geometry puts it in front…
  motifCube([0, 2, 0]),
], [{ over: 0, under: 1, overAt: 'end' }]);  // …and the crossing brings the first bar's end over it

// Decorative (aria-hidden):
const svg = motifToSvg(shape, { hue: 'orange', size: 160 });
// Carrying meaning: the title is read out, in pt-BR.
const named = motifToSvg(shape, { hue: 'blue', size: 160, title: 'Forma impossível da Rede' });
```

In a static page, the same functions are on `window.RSE`:

```html
<div id="motif"></div>
<script>
  const { motifCube, makeMotifShape, motifToSvg } = window.RSE;
  document.getElementById('motif').innerHTML =
    motifToSvg(makeMotifShape('cube', [motifCube([0, 0, 0], 2)]), { hue: 'green', size: 96 });
</script>
```

Rules: colours come only from the palette ramp (`light`, base, `dark`); never add gradients,
strokes or effects to the output. Generated shapes are system work, not artwork supplied by Sesc:
the six official constructions stay in `BrandMotif`. Same input, same SVG, coordinates rounded to
2 decimals. Every piece is a `<g class="rse-motif__piece">` carrying `--i` (part index) and
`--ax`/`--ay` (its axis on screen) for motion built on top.
