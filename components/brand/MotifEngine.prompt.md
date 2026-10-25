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
- `motifShapes` and `motifShapeNames` — the generated shape library, ready to pass to
  `motifToSvg` (and the default source of shapes for `MotifLoader` and `MotifPattern`).
- `renderMotifPattern(opts)` — library shapes tiled into one full-bleed `<svg>` string (the
  engine behind `MotifPattern`): `shape` (a name or a list), `width`, `height`, `cell` (96),
  `gap` (0), `layout` (`grid`, `brick`, `isometric`), `fill` (0–1), `seed` (1), `hue` or `hues`
  with `sequence` (`row`, `diagonal`, `seeded`), `opacity` (1), `animate` (`none`, `reveal`,
  `ambient`). `''` for an unknown shape or hue; never throws. At most `MAX_PATTERN_CELLS` (1500)
  cells: a smaller `cell` is enlarged until it fits. `width`, `height` and `cell` are clamped to
  1e9. The `<svg>` declares `xmlns:xlink` and every `<use>` carries both `href` and `xlink:href`,
  because older Safari, Inkscape 0.92, old librsvg and some print pipelines resolve only the latter.

Generated shapes — **gerados pelo sistema, não fornecidos pelo Sesc**; the six official
constructions stay in `BrandMotif`:

| Name | Descrição |
| --- | --- |
| `cube` | O cubo da gramática, em moldura de doze barras. |
| `triangle` | Triângulo de Penrose: três barras que se fecham sem poder. |
| `stair` | Escada sem fim: sobe dois lances e volta ao começo. |
| `loop` | Laço de cinco barras que sobe e nunca desce. |
| `tower` | Torre de Escher: a coluna de trás passa pela frente. |
| `twin` | Dois cubos gêmeos encaixados de um jeito impossível. |

```js
import { motifShapes, motifToSvg } from '@idcesares/rse-design-system';
const svg = motifToSvg(motifShapes.triangle, { hue: 'purple', size: 96 });
```

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

A pattern field — decorative, so it is `aria-hidden`; text goes on a solid panel beside or over
it, never on the cells:

```js
import { renderMotifPattern } from '@idcesares/rse-design-system';

// Faixa de fundo do hero "Matrículas abertas": cubos no reticulado isométrico, três cores em diagonal.
const fundo = renderMotifPattern({
  shape: 'cube', width: 1440, height: 480, cell: 96, gap: 8,
  layout: 'isometric', hues: ['blue', 'green', 'yellow'], sequence: 'diagonal',
  fill: 0.7, seed: 12, opacity: 0.3,
});
```

Same options, same SVG (seeded, coordinates rounded to 2 decimals). The SVG fills its box like
`background-size: cover` (`preserveAspectRatio="xMidYMid slice"`) and draws one ring of cells past
every edge, so shapes run off the edges instead of stopping short. Each shape's geometry is
emitted once in `<defs>` (`id="rse-motif-pattern-<shape>-<hue>"`, the same drawing wherever that id
appears) and every cell is `<g class="rse-motif-pattern__cell" style="--d:N">` around a `<use>`;
`--d` is the cell's stagger step (its distance from the top-left, in cells) and `animate` only adds
`data-animate` on the `<svg>`: the motion itself is `MotifPattern`'s CSS. `grid` and `brick` fit
each shape's box to `cell − gap`; `isometric` fits it to the hexagon of its tile, so a cube field
locks together like tumbling blocks and other shapes never cover a neighbour.

Duas malhas na mesma página compartilham os mesmos ids (`rse-motif-pattern-<forma>-<matiz>`) de
propósito: o mesmo id é sempre o mesmo desenho. Por isso esses ids não devem ser reutilizados para
outro conteúdo na página.

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
