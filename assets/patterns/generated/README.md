# Generated pattern presets

Seven static, full-bleed SVG backgrounds (1920 x 1080) for consumers that cannot run the motif
engine: a CMS, print, Python. They are **generated** by `scripts/build-patterns.mjs` from the motif
engine (`renderMotifPattern`). They are **system work, not supplied by Sesc**: the shapes are
derived from the engine's library and Sesc's brand team has not reviewed them.

Do not edit these files. Change the parameters in `scripts/lib/pattern-presets.mjs` and run:

```bash
npm run patterns          # rewrite the files
npm run sync              # also runs it
npm run check             # fails (naming the file) if one is missing, differs or is unexpected
```

The four **official** patterns, `../cubes-pattern-1.svg` to `../cubes-pattern-4.svg`, are untouched
and are still the pattern to use when the brief says "the Rede pattern".

## Presets

All are static (`animate: none`), `aria-hidden`, flat fills from the palette ramps (no gradients,
filters or `url()` references). `cell` and `gap` are px in the 1920 x 1080 box.

| file | shape | layout | hue | cell | gap | fill | seed |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `triangle-brick-purple.svg` | triangle | brick | purple | 144 | 18 | 0.8 | 3 |
| `stair-grid-blue.svg` | stair | grid | blue | 144 | 22 | 1 | 5 |
| `loop-isometric-green.svg` | loop | isometric | green | 150 | 12 | 0.7 | 11 |
| `tower-grid-pink.svg` | tower | grid | pink | 216 | 28 | 0.85 | 7 |
| `twin-brick-orange.svg` | twin | brick | orange | 216 | 28 | 1 | 9 |
| `cube-isometric-yellow.svg` | cube | isometric | yellow | 144 | 12 | 0.75 | 4 |
| `spectrum.svg` | cube | isometric | all six, `diagonal` | 132 | 4 | 1 | 1 |

`fill` below 1 leaves some cells empty, chosen by the seed; the same parameters always give the
same file. Tower and twin are busy shapes, so they use a large cell.

## Spectrum is artwork only

`spectrum.svg` uses all six palette hues. Multi-hue is allowed **only as the artwork itself** (a
hero field or a standalone piece), never as a page background with copy: page text and bands stay
in one hue (`docs/composition/principles.md`).

## Using them

The SVG fills its box like `background-size: cover`. Put text on a solid panel, never directly on
the cells. See "The cube motif and its patterns" in `docs/recipes.md`.
