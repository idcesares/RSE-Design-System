# Motif engine, brand motion and the motion setting — design

Status: draft for review · Date: 2026-10-25

## Goal

Make the *cubo impossível* a generative visual language and make motion a first-class part of the
brand, while keeping motion accessible through an explicit setting. The design owner replaces the
inherited rule that the motif geometry is untouchable and that motion is suppressed.

Outcomes:

- A rule-based engine that builds impossible isometric shapes in any of the six palette families.
- An animated loader (`MotifLoader`) and parametric pattern backgrounds (`MotifPattern`) built on it.
- Motion that is part of the default experience, with an accessibility setting that reduces it.

## What was said, and what is assumed

Said by the owner (design owner of this repo):

- The motif is the brand's most ownable asset and is underused. Use it for a loader, parametric
  patterns, and in all brand colours.
- Completely replace the rule that the geometry is untouchable.
- Keep the six supplied constructions as the canonical "signature" set (option A); generate the rest.
- Build it as a shared SVG engine with components on top (option 1).
- Full motion is the default experience, with a specific accessibility setting to reduce it, meeting
  the W3C criteria. The OS `prefers-reduced-motion` value seeds the setting; the user can change it.
- Approved all rule changes in the review below, including R4 option A and M4 option A.

Assumed (correct me):

- WCAG 2.2 AA is the required floor, plus AAA 2.3.3 for motion.
- Generated shapes and all motion are system work, not supplied by Sesc. Sesc's brand team has not
  reviewed them. `docs/known-gaps.md` says so.
- Version bump is a minor (additive); rule rewrites are documentation and policy.

## Architecture

### 1. Motif engine (`components/brand/motif-engine.js`, exact path settled in the plan)

Plain ESM, no JSX, no React, so `build-bundle` can copy it. It models only what the official
artwork is made of:

- **Lattice.** Every vertex sits on an isometric grid with axes at 90°, +30° and −30°. Nothing is
  placed freehand.
- **Primitives.** `bar(axis, start, length, thickness)` and `cube(at, size)`. Each draws up to three
  visible faces. A face's shade comes from its orientation: top lightest, left mid, right darkest,
  the order of the supplied cube.
- **Crossings.** A shape declares where one piece passes in front of another at one end and behind
  it at the other. This is explicit data and is what makes the shape impossible.
- **Shape.** A list of primitives plus its crossings. `toSvg(shape, { hue })` returns an SVG string.
- **Colour.** Ramps (`light → base → dark`) come from the palette tokens, the same source
  `scripts/build-motifs.mjs` reads. All six families work. No hex is written into the engine.
- **Starter library.** About six generated shapes: an impossible triangle of bars (Penrose style), an
  endless stair, a bar loop, and cube variations.
- **Signature set.** The six supplied constructions and `BrandMotif` are unchanged.
  `assets/motifs/` is unchanged.

### 2. Motion setting

- `data-rse-motion="full | reduced"` on `<html>` or any section; nests like `data-rse-theme`.
- Initial value: the saved choice, else the OS `prefers-reduced-motion` value, else `full`.
- A helper (`RSE.motion.get/set/init`) stores the choice and sets the attribute before first
  paint. Without JavaScript, CSS alone follows the OS:
  `@media (prefers-reduced-motion: reduce) { :root:not([data-rse-motion]) { … } }`.
- The host product renders the control. A recipe shows one built with the existing `Switch`,
  labelled "Reduzir animações".
- `.rse-motion-managed` marks components that implement both the full and the reduced form. The
  blanket `*` rule in `tokens/base-runtime.css` no longer applies in the full state. It stays only
  as a safety net for unmarked elements in the reduced state.
- Tokens added in `tokens/src/`: `--rse-duration-reveal` (about 600 ms), `--rse-duration-loop`
  (about 2.4 s per cycle), `--rse-motion-travel` (full value; 0 when reduced), and one or two
  smoother easing curves (no spring, bounce or overshoot).
- Reduced form: opacity and colour changes stay; travel, spinning, looping and parallax go.

### 3. `MotifLoader`

- Full: the shape assembles piece by piece. Each piece slides in along its own lattice axis (one
  unit of travel) while its opacity rises, staggered by `--i`. It holds, comes apart in reverse and
  loops. With `hues`, fills step through them, one hue per cycle. Nothing rotates, stretches or
  morphs; every frame is the engine's exact geometry.
- Reduced: the same staggered build by opacity only, with no travel. The loop slows to a gentle
  fade. Content still changes over time, so a status indicator is never frozen.
- Props: `shape` (default `cube`), `hue` (default `purple`), `hues` (2–4 families), `size`
  (default 48), `label` (default pt-BR "Carregando").
- Contract: `.rse-motif-loader`, pieces `.rse-motif-loader__piece` with `--i`. React only emits
  markup; the CSS animates. `role="status"` with `aria-label`; the SVG is `aria-hidden`.
- `Spinner` stays for buttons and inline waits. `MotifLoader` is for page and section loading at
  48 px or larger; below about 32 px the facets blur and the component warns.

### 4. `MotifPattern`

- Component plus engine function `renderPattern()` that returns an SVG string. A build step bakes
  presets into `assets/patterns/generated/` for CMS, print and Python consumers. The four official
  patterns are unchanged.
- Parameters: `shape` (one or a list), `cell`, `gap`, `layout` (`grid`, `brick`, `isometric`),
  `fill` (0–1), `seed` (same parameters always give identical SVG), `hue` or `hues` with
  `sequence` (`row`, `diagonal`, `seeded`), `opacity`, `animate` (`none` default, `reveal`,
  `ambient`).
- `reveal`: cells fade in with a stagger from an origin, once, scroll-triggered by a small helper
  that adds `.is-visible`. Reduced: opacity only, no travel.
- `ambient`: a slow, low-amplitude shade shift. Always renders a visible pause button (WCAG 2.2.2)
  using the vendored Lucide `pause` and `play` icons. Reduced: static.
- Static is the default. The SVG is `aria-hidden`. Text never sits directly on pattern cells; it
  goes on a solid panel or beside the pattern. The renderer caps the cell count.
- Multi-hue applies only to the pattern artwork itself (rule R4).

## Rule changes

Approved by the owner. Each row names where the rule lives so the plan can update every copy.

### Motif

| # | Change | Locations |
| --- | --- | --- |
| R1 | Signature constructions stay exactly as supplied. Generated shapes and motion come only from the engine. Replaces "never redraw, rotate, distort or animate". | `AGENTS.md` rule 10, `BrandMotif.prompt.md`, `DESIGN.md`, `RULES.md`, `readme.md`, `brand.json`, `SKILL.md` |
| R2 | Keep "one *focal* construction per composition", the 25% limit, ~0.3 opacity behind content and "no text on faces". A pattern is a field, not a construction. The loader is exempt (transient). | `BrandMotif.prompt.md`, `DESIGN.md`, `RULES.md` |
| R3 | Reword "never recolour outside sanctioned combinations" to "any of the six palette families; ramps from the palette only". | `DESIGN.md` |
| R4 | "One hue per composition" stands for layouts. A multi-hue pattern is allowed only as the artwork itself (hero field or standalone spectrum piece); page text and bands stay in one hue. | `docs/composition/principles.md` |
| R5 | Patterns are flat colour fields. Gradients, glows and noise stay banned. | `docs/composition/principles.md`, `rubric.md` |

### Motion

| # | Change | Locations |
| --- | --- | --- |
| M1 | Keep the 360 ms cap for UI state changes. Add a brand-motion tier: `--rse-duration-reveal`, `--rse-duration-loop`. | `docs/guidelines.md`, `readme.md`, `tokens/src/` |
| M2 | Keep "no spring, bounce or overshoot". Add one or two smoother easing curves. | `docs/guidelines.md`, `tokens/src/` |
| M3 | Replace "motion is limited to hover and press" with defined categories: state, reveal, loading, ambient. | `docs/quality-checklist.md` |
| M4 | Allow scroll-triggered reveals (opacity plus small travel, once) and autoplaying ambient loops with a pause control. Parallax stays banned. | `docs/guidelines.md`, `readme.md`, `docs/quality-checklist.md` |
| M5 | Allow animating `fill` and `stroke` for SVG artwork only. | `docs/guidelines.md` |
| M6 | Replace "`prefers-reduced-motion` honoured globally" with the `data-rse-motion` contract and the managed-component marker. | `AGENTS.md`, `docs/guidelines.md`, `docs/quality-checklist.md`, `Skeleton.prompt.md`, `tokens/base-runtime.css` |

Also updated: the machine-readable rules in `brand.json`, `scripts/check-composition.mjs` and
`scripts/test-composition.mjs`, `docs/known-gaps.md` (generated shapes and motion are derived, not
supplied; Sesc review pending), and `CHANGELOG.md`.

## W3C mapping

| Criterion | Level | How it is met |
| --- | --- | --- |
| 2.2.2 Pause, Stop, Hide | A | Content that moves by itself for more than 5 s (animated patterns) has a pause control or follows the setting. A loader is essential feedback and ends with the load. |
| 2.3.1 Three Flashes | A | No flashing or strobing fills. `npm run check` rejects keyframes that swap fills faster than 3 times a second. |
| 2.3.3 Animation from Interactions | AAA | The in-page setting is a mechanism to disable motion triggered by interaction. |
| 1.4.11 Non-text Contrast | AA | The loader's hue is measured against each surface. Light yellow and light orange on white fail; docs say "use on an ink band". |

## Testing

Added to `npm run check`:

- **Engine:** output is deterministic by seed; all vertices are on the lattice; shade luminance
  rank holds in all six hues; crossings are declared; fills come only from the palette; no
  gradients.
- **Motion:** with `data-rse-motion="reduced"` emulated in Playwright, no managed component animates
  `transform`. A static check enforces the 3-flashes limit.
- **Contrast:** the loader's hue against white, cream, ink and dark surfaces through
  `scripts/contrast-pairs.mjs`.

Not testable by machine: whether a generated shape still reads as impossible. A contact sheet of
every shape in all six hues goes in the showcase for the owner to judge. The first pass of the
shape library will likely need review rounds.

## Files touched

New components (`MotifLoader`, `MotifPattern`) with `.css`, `.jsx`, `.d.ts`, `.prompt.md`;
registered in `rse.manifest.json` and `index.js`; demos in `showcase/demos.js`. New helper
`RSE.motion`. Token source in `tokens/src/`; `npm run sync` regenerates the rest. Version bump
(minor) and `CHANGELOG.md`.

## Rollout

One spec, four independently shippable phases in the plan:

1. Tokens, the motion setting, the managed-component contract and the rule rewrites.
2. The engine, the shape library and the contact sheet.
3. `MotifLoader`.
4. `MotifPattern` and its presets.

## Out of scope

- Parallax (stays banned).
- Persisting the setting or building the settings UI; the host product owns both.
- Changes to the selo, its rules (rule 9), or the four official patterns.
- A free-form drawing tool for new shapes.
