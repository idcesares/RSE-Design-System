# Motif engine, brand motion and the motion setting — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a rule-based impossible-shape engine, an animated `MotifLoader`, parametric `MotifPattern` backgrounds, and a `data-rse-motion` accessibility setting, replacing the "motif geometry is untouchable / motion is suppressed" rules.

**Architecture:** The engine is a manifest component (`MotifEngine`, no React) so `build-bundle` copies it to `window.RSE`; node scripts load it through one shared helper. Components animate in CSS only and multiply every travel by `--rse-motion-travel`, which the setting sets to 0. Static checks run in `npm run check`; browser behaviour runs in `npm run test:motion` (Playwright, like `test:pages`, because `check` has no browser dependency).

**Tech Stack:** Node ≥18 ESM scripts (zero dependencies, `node:test` + `node:assert`), React `createElement` form, plain CSS on the contract, Playwright for the browser test only.

**Spec:** `docs/superpowers/specs/2026-10-25-motif-engine-design.md`

## Global Constraints

- Components are `React.createElement` form, never JSX; a component that calls a hook has `'use client';` as line 1.
- Tokens only: no raw hex, font stack, radius, shadow or duration in components or pages. Engine colours come only from `motifRamp(hue, 3)`. SVG user-space px (travel distance) is geometry and may be literal.
- Names in English, user-facing copy in pt-BR (`label` default "Carregando", setting label "Reduzir animações").
- Flat fills only: no gradients, glows or noise. No spring, bounce or overshoot: easing y-values stay within [0, 1].
- Every motion component carries class `rse-motion-managed` and implements both forms; reduced = opacity only, no travel.
- No infinite animation with a cycle shorter than 334 ms (3 flashes per second).
- The six signature constructions, `assets/motifs/`, `BrandMotif` geometry and the four official patterns are not modified.
- New components ship `.jsx`, `.css` (contract), `.d.ts`, `.prompt.md`, a `showcase/demos.js` entry, a `rse.manifest.json` entry and an `index.js` + `index.d.ts` export. Run `npm run sync` then `npm run check`.
- Never edit generated files (`tokens/tokens.css`, `dist/*`, `brand.json`, `docs/components.md`, `docs/tokens.md`, `showcase/showcase-data.js`, `BrandMotif.jsx`, `Icon.jsx`); change their sources.
- Commit trailers: `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>` and `Claude-Session: https://claude.ai/code/session_01GoyHwdXjEJXTjCxK3apbTP`.

## Review Focus

Inputs the spec implies but no obvious test covers, most likely first. Each has a test in the task named.

1. `localStorage` blocked or throwing (private mode, cookies off): `RSE.motion.init()` must not throw and must fall back to the OS value. (Task 1)
2. A `full` section nested inside a `reduced` page (and the reverse) must each behave as marked. (Task 2)
3. Unknown `hue`, `hues` of length 1 or 5, unknown `shape`: render nothing or clamp, never throw. (Tasks 5, 7, 9)
4. Pattern area huge and `cell` tiny, or `fill: 0`: cell count is capped, no hang, still valid SVG. (Task 8)
5. Server render with no `window` (Next.js): importing `motion.js` and rendering `MotifLoader` / `MotifPattern` must not throw. (Tasks 1, 7, 9)

---

## Phase 1 — Motion setting and contract

### Task 1: Tokens, runtime CSS and `motion.js`

**Files:**
- Modify: `tokens/src/effects.tokens.json` (add `rse.duration.reveal` `600ms`, `rse.duration.loop` `2400ms`, `rse.ease.assemble` `cubic-bezier(.65,0,.35,1)`, `rse.ease.settle` `cubic-bezier(.22,1,.36,1)`)
- Modify: `tokens/base-runtime.css:27` (replace the blanket reduced-motion rule)
- Create: `motion.js`, `motion.d.ts`
- Modify: `package.json` (`files`, `sideEffects`, `exports` get `motion.js` and `motion.d.ts`; add script `"test:motion": "node scripts/test-motion.mjs"`)
- Test: `scripts/test-motion-unit.mjs`

**Interfaces:**
- Produces (`motion.js`, classic IIFE, assigns `window.RSE.motion`; no-op when `window` is undefined): `get(): 'full' | 'reduced'`, `set(value: 'full' | 'reduced'): void` (stores, sets `data-rse-motion` on `<html>`), `init(): 'full' | 'reduced'` (stored choice, else `matchMedia('(prefers-reduced-motion: reduce)')`, else `'full'`; sets the attribute; wraps every storage access in try/catch). Storage key `rse-motion`.
- Produces (CSS): `:root{--rse-motion-travel:1}`; `0` under `[data-rse-motion="reduced"]` and under `@media (prefers-reduced-motion:reduce){:root:not([data-rse-motion]){…}}`. Safety net (the old `*` rule: `animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important`) applies only to `[data-rse-motion="reduced"] *` (and the media-query equivalent) excluding `.rse-motion-managed`, its descendants, and descendants of a nested `[data-rse-motion="full"]`.

- [ ] **Step 1: Write failing tests** in `scripts/test-motion-unit.mjs` using `node:test`, loading `motion.js` with `new Function('window', src)` and a fake window: `init() returns 'reduced' when matchMedia reduces and nothing stored`, `init() returns 'full' with no preference`, `stored 'full' beats an OS reduce`, `set('reduced') writes localStorage and the html attribute`, `init() does not throw and returns the OS value when localStorage throws`, `importing with window undefined does not throw`.
- [ ] **Step 2: Run** `node --test scripts/test-motion-unit.mjs`. Expected: FAIL (`motion.js` missing).
- [ ] **Step 3: Implement** `motion.js` and `motion.d.ts` (declare `RSE.motion`), the four tokens, and the `base-runtime.css` rewrite (keep the file's comment style; keep the existing `rse-spin`/`rse-shimmer` keyframes).
- [ ] **Step 4: Run** the unit test again. Expected: PASS. Run `npm run sync && npm run check`. Expected: PASS (Spinner and Skeleton stay unmanaged and keep today's reduced behaviour through the safety net).
- [ ] **Step 5: Wire** `node --test scripts/test-motion-unit.mjs` into the `check` script. Commit `feat: add the motion setting, brand-motion tokens and runtime contract`.

### Task 2: Static motion check and browser test

**Files:**
- Create: `scripts/check-motion.mjs`, `scripts/test-motion.mjs`, `scripts/fixtures/motion-nesting.html`
- Modify: `package.json` (`check` runs `node scripts/check-motion.mjs` after `check-ds`)
- Modify: `AGENTS.md` Commands list (add `npm run test:motion`)

**Interfaces:**
- Consumes: `motion.js`, `--rse-motion-travel` (Task 1).
- Produces: `check-motion.mjs` fails when (a) any `@keyframes` used by an `infinite` animation in `components/**/*.css` or `tokens/base-runtime.css` has a resolved cycle under 334 ms (resolve `var(--rse-duration-*)` from the token source); (b) any `translate(` or `translateX/Y(` inside a `@keyframes` in `components/**/*.css` whose name starts `rse-motif` lacks `var(--rse-motion-travel`; (c) a component CSS file declaring `rse-motif` animations has no `.rse-motion-managed` in the matching `.jsx`.

- [ ] **Step 1: Write failing checks.** In `check-motion.mjs`, add `--selftest` that runs rules (a)–(c) against three inline CSS strings (a 200 ms infinite loop, a `translate(8px, 0)` keyframe, an unmanaged motif component) and exits 1 unless each rule fires. In `test-motion.mjs`, with Playwright (resolve it like `scripts/test-pages.mjs:37`): load `scripts/fixtures/motion-nesting.html` (a `reduced` root containing a `full` section, each holding an element animated by a 1 s transform keyframe, one inside `.rse-motion-managed` and one not) and assert via `document.getAnimations()` paused at 500 ms: unmanaged element in `reduced` has no transform change; unmanaged element in the nested `full` section does; managed element in `reduced` has `--rse-motion-travel` computing to `0`.
- [ ] **Step 2: Run** `node scripts/check-motion.mjs --selftest` and `npm run test:motion`. Expected: FAIL.
- [ ] **Step 3: Implement** both scripts and the fixture.
- [ ] **Step 4: Run** both again. Expected: PASS; `npm run check` PASS.
- [ ] **Step 5: Commit** `test: enforce the motion contract in check and in a browser test`.

### Task 3: Motion rule rewrites (M1–M6)

**Files:**
- Modify: `docs/guidelines.md` (Motion section, lines 49–65), `docs/quality-checklist.md` (lines 26–27, 60), `AGENTS.md` (Accessibility floor motion bullet, line 293; Non-negotiables 3 mentions none), `readme.md:67`, `components/feedback/Skeleton.prompt.md:13`
- Test: `npm run check`

**Interfaces:** Consumes the tokens and contract from Task 1.

- [ ] **Step 1: Rewrite** the guidelines Motion section to: the existing three UI durations unchanged and capped at 360 ms for state changes; a "Brand motion" table with `--rse-duration-reveal` (600 ms, reveals) and `--rse-duration-loop` (2.4 s, loaders and ambient); easing `standard`/`out` for state, `assemble`/`settle` for brand motion; no spring, bounce or overshoot; four categories (state, reveal, loading, ambient); scroll-triggered reveals allowed (opacity plus small travel, played once) and ambient loops allowed with a pause control; **parallax stays banned**; animate `transform`, `opacity`, `background-color`, `box-shadow`, plus `fill`/`stroke` on SVG artwork only. Replace the `prefers-reduced-motion` bullet with the `data-rse-motion` contract (initial value: stored choice, else OS, else `full`; `.rse-motion-managed`; reduced = opacity only).
- [ ] **Step 2: Mirror** the change in the other four files (checklist items become "managed components implement both forms; no unmanaged animation"; Skeleton note says it is unmanaged and the safety net applies in reduced).
- [ ] **Step 3: Run** `npm run check`. Expected: PASS.
- [ ] **Step 4: Commit** `docs: replace the motion rules with the brand-motion and motion-setting contract`.

---

## Phase 2 — Engine and shape library

### Task 4: Export the ramp from `BrandMotif`

**Files:**
- Modify: `scripts/build-motifs.mjs` (template near line 158 and the `.d.ts` template near line 197), regenerate `components/brand/BrandMotif.jsx` and `.d.ts`
- Test: `scripts/test-motif-engine.mjs` (created here, extended in later tasks)

**Interfaces:**
- Produces: `export function motifRamp(hue: MotifHue, steps: number): string[] | null`, lightest first, `null` for an unknown hue. Existing exports and rendered output are byte-identical.

- [ ] **Step 1: Write failing test** `motifRamp returns 3 palette hexes per hue and null for unknown`, and `BrandMotif output unchanged` (compare `renderToStaticMarkup`-free: assert the six official SVG files under `assets/motifs/` are unmodified by `git diff --exit-code assets/`).
- [ ] **Step 2: Run** `node --test scripts/test-motif-engine.mjs`. Expected: FAIL.
- [ ] **Step 3: Implement** by exporting the existing internal `ramp` as `motifRamp` from the generator template; `npm run motifs`.
- [ ] **Step 4: Run** the test and `npm run check`. Expected: PASS.
- [ ] **Step 5: Commit** `feat: export motifRamp from BrandMotif`.

### Task 5: Engine core and registration

**Files:**
- Create: `components/brand/MotifEngine.jsx`, `MotifEngine.d.ts`, `MotifEngine.prompt.md`, `scripts/lib/load-motif-engine.mjs`
- Modify: `rse.manifest.json` (entry `MotifEngine`), `index.js`, `index.d.ts`, `showcase/demos.js` (entry under the brand group describing the engine in pt-BR; a one-line demo that renders `motifToSvg` for `cube` in six hues)
- Test: `scripts/test-motif-engine.mjs`

**Interfaces:**
- Consumes: `motifRamp` (Task 4) via `import { motifRamp } from './BrandMotif.jsx'`.
- Produces (all `export function`/`const`, no React, no hooks):
  - `type Axis = 'x'|'y'|'z'; type Vec = [number, number, number]; type Role = 'top'|'left'|'right'`
  - `isoPoint(p: Vec): [number, number]`: lattice to screen, unit length 1, axes at 90° (z, up), +30° (x) and −30° (y), rounded to 2 decimals.
  - `motifBar(axis: Axis, start: Vec, length: number, thickness?: number): Part` (thickness default 1); `motifCube(at: Vec, size?: number): Part` (size default 1).
  - `type Crossing = { over: number; under: number; overAt: 'start'|'end' }` (indexes into `parts`): part `over` passes in front of `under` at its `overAt` end and behind at the other.
  - `makeMotifShape(name: string, parts: Part[], crossings?: Crossing[]): Shape`
  - `motifFaces(shape: Shape): Face[]` where `Face = { points: [number, number][]; role: Role; layer: number; piece: number }`, in paint order.
  - `motifPieces(shape: Shape, hue: MotifHue): Piece[] | null` where `Piece = { index: number; axis: { x: number; y: number }; faces: { points: string; role: Role; fill: string }[] }`; `axis` is the part's unit screen vector; fills: top = `motifRamp(hue,3)[0]`, left = `[1]`, right = `[2]`; `null` for an unknown hue.
  - `motifToSvg(shape: Shape, opts: { hue: MotifHue; size?: number; title?: string }): string`: one `<svg>` with a `<g class="rse-motif__piece" style="--i:N;--ax:X;--ay:Y">` per piece; `aria-hidden="true"` unless `title`; `''` for an unknown hue.
- `scripts/lib/load-motif-engine.mjs` exports `loadMotifEngine(): Promise<Record<string, unknown>>`, evaluating the two `.jsx` sources with the same transform as `build-bundle` (strip `export`, inline the `motifRamp` import) so node scripts can use them.

- [ ] **Step 1: Write failing tests** in `scripts/test-motif-engine.mjs`: `isoPoint maps lattice axes to 90 and ±30 degrees` (assert `isoPoint([0,0,1])` is straight up and `isoPoint([1,0,0])[1] / isoPoint([1,0,0])[0]` equals `tan(30°)` to 2 decimals); `every face vertex is on the lattice` (each vertex of a `motifCube` equals `isoPoint` of an integer lattice point); `top > left > right luminance for all six hues` using the ramp; `motifToSvg uses only ramp colours` (every `fill` is in `motifRamp(hue,3)`; no `gradient`, `url(`, `filter` in output); `a declared crossing flips layer order at one end only`; `motifToSvg is deterministic`; `unknown hue returns ''`; `motifPieces unknown hue returns null`.
- [ ] **Step 2: Run** `node --test scripts/test-motif-engine.mjs`. Expected: FAIL.
- [ ] **Step 3: Implement** the engine. Approach: each part yields up to three faces (top rhombus, left parallelogram, right parallelogram); a crossing splits the `over` part at its midpoint into two sub-bars on different layers; paint order sorts by `layer`, then depth `(x + y)`.
- [ ] **Step 4: Register** the component (manifest, `index.js`, `index.d.ts`, `.d.ts`, `.prompt.md` stating it is a function library with no visual output, demo). Run `npm run sync && npm run check && node --test scripts/test-motif-engine.mjs`. Expected: PASS.
- [ ] **Step 5: Wire** `node --test scripts/test-motif-engine.mjs` into the `check` script. Commit `feat: add the motif engine`.

### Task 6: Shape library and contact sheet (owner review gate)

**Files:**
- Modify: `components/brand/MotifEngine.jsx`, `.d.ts`, `.prompt.md`, `showcase/demos.js`, `showcase/index.html` or its builder as the showcase requires
- Test: `scripts/test-motif-engine.mjs`

**Interfaces:**
- Produces: `motifShapeNames: ('cube'|'triangle'|'stair'|'loop'|'tower'|'twin')[]`, `motifShapes: Record<MotifShapeName, Shape>`; type `MotifShapeName`. `cube` is the grammar's own cube; `triangle` is a Penrose-style triangle of three bars; `stair` an endless stair; `loop` a closed bar loop; `tower` and `twin` are cube variations. Each shape with a declared impossible join has at least one `Crossing`.

- [ ] **Step 1: Write failing tests**: `all six shapes exist and render in all six hues`, `triangle, stair and loop declare at least one crossing`, `piece count per shape is between 3 and 24`.
- [ ] **Step 2: Run** the test file. Expected: FAIL.
- [ ] **Step 3: Implement** the six shapes with `makeMotifShape`; add a showcase section "Motivo gerado" rendering every shape in every hue with the shape name as a caption.
- [ ] **Step 4: Run** `npm run sync && npm run check`. Expected: PASS.
- [ ] **Step 5: Owner review gate.** Render the contact sheet (`showcase/index.html` via Playwright screenshot into the scratchpad) and ask the owner whether each shape reads as impossible. Do not start Task 7 until they approve or request changes; iterate on geometry until approved.
- [ ] **Step 6: Commit** `feat: add the generated shape library and its contact sheet`.

---

## Phase 3 — Loader

### Task 7: `MotifLoader`

**Files:**
- Create: `components/feedback/MotifLoader.jsx`, `.css`, `.d.ts`, `.prompt.md`
- Modify: `rse.manifest.json`, `index.js`, `index.d.ts`, `showcase/demos.js`
- Create: `scripts/check-motif-contrast.mjs` (wired into `check`)
- Test: extend `scripts/test-motion.mjs`, `scripts/test-motif-engine.mjs`

**Interfaces:**
- Consumes: `motifShapes`, `motifPieces` (Tasks 5–6), `--rse-duration-loop`, `--rse-ease-assemble`, `--rse-motion-travel`.
- Produces: `MotifLoader(props: { shape?: MotifShapeName; hue?: MotifHue; hues?: MotifHue[]; size?: number; label?: string })`, defaults `cube`, `purple`, `48`, `'Carregando'`. Renders `<span class="rse-motif-loader rse-motion-managed" role="status" aria-label={label}>` around an `aria-hidden` SVG. CSS keyframes `rse-motif-build` (per piece: opacity 0 to 1, `translate(calc(var(--rse-motion-travel) * var(--ax) * -8px), calc(var(--rse-motion-travel) * var(--ay) * -8px))` to none; build 0–30%, hold 30–75%, release 75–100%), delay `calc(var(--i) * var(--rse-duration-loop) / 20)`. `hues` of length 2–4 sets `--c0..--c3` on faces and uses `rse-motif-hue-2/-3/-4` keyframes with a cycle of `n × var(--rse-duration-loop)`. In `reduced` the cycle doubles. `hues` outside 2–4 falls back to `hue`; unknown `hue` or `shape` returns `null`; `size < 32` logs `console.warn` once and still renders.
- Produces (`check-motif-contrast.mjs`): for each of six hues, contrast of the `base` palette colour against page, card and ink surfaces, and against the page surface in the dark theme, with floor 3; every failing combination must appear in `MotifLoader.prompt.md` as a line `Evite: <hue> sobre <surface>`, else the script fails.

- [ ] **Step 1: Write failing tests.** Engine/React (node): `renders role=status with the pt-BR label`, `unknown hue and unknown shape return null`, `hues length 1 or 5 falls back to hue`, `size 24 warns once and renders`, `server render without window does not throw`. Browser (`test-motion.mjs`): with an animation paused at 0, 40%, 80% of a cycle, in `full` at least one piece has a non-identity transform at 0%; in `reduced` every piece's transform is identity at all three times while its opacity changes; the last animation keyframe state is the assembled shape.
- [ ] **Step 2: Run** both. Expected: FAIL.
- [ ] **Step 3: Implement** component, CSS contract, prompt (pt-BR example, plain-HTML markup, "Spinner for buttons, MotifLoader for page and section loading at 48 px or larger", the `Evite:` lines), demo, manifest and exports.
- [ ] **Step 4: Run** `npm run sync && npm run check && npm run test:motion`. Expected: PASS.
- [ ] **Step 5: Commit** `feat: add MotifLoader`.

---

## Phase 4 — Patterns

### Task 8: `renderMotifPattern`

**Files:**
- Modify: `components/brand/MotifEngine.jsx`, `.d.ts`
- Test: `scripts/test-motif-engine.mjs`

**Interfaces:**
- Produces: `MAX_PATTERN_CELLS = 1500`; `renderMotifPattern(opts: PatternOptions): string` with `PatternOptions = { shape: MotifShapeName | MotifShapeName[]; width: number; height: number; cell?: number /*96*/; gap?: number /*0*/; layout?: 'grid'|'brick'|'isometric' /*'grid'*/; fill?: number /*1, 0–1*/; seed?: number /*1*/; hue?: MotifHue; hues?: MotifHue[]; sequence?: 'row'|'diagonal'|'seeded'; opacity?: number /*1*/; animate?: 'none'|'reveal'|'ambient' /*'none'*/ }`. Returns one `<svg>` slice-filling `width × height`, each cell `<g class="rse-motif-pattern__cell" style="--d:N">` (N = stagger step by distance from the top-left), coordinates rounded to 2 decimals, seeded PRNG (mulberry32). If the cell count would exceed the cap, `cell` is enlarged until it fits; never throws. `''` for unknown hue or shape.

- [ ] **Step 1: Write failing tests**: `same options give identical output` (run twice, and assert equality of a recorded hash string for `seed:7`); `different seeds differ at fill 0.5`; `fill 0 returns a valid svg with no cells`; `cell count never exceeds MAX_PATTERN_CELLS (width 4000, height 4000, cell 8)`; `brick rows are offset by half a cell`; `hues with sequence "row" cycles hue per row`; `unknown shape returns ''`; `fills come only from ramps`.
- [ ] **Step 2: Run** the test file. Expected: FAIL.
- [ ] **Step 3: Implement** `renderMotifPattern` reusing `motifPieces`; `isometric` places cells on lattice-aligned offsets so neighbouring shapes interlock.
- [ ] **Step 4: Run** the tests and `npm run sync && npm run check`. Expected: PASS.
- [ ] **Step 5: Commit** `feat: add the parametric pattern renderer`.

### Task 9: `MotifPattern` component with reveal, ambient and pause

**Files:**
- Create: `components/brand/MotifPattern.jsx`, `.css`, `.d.ts`, `.prompt.md`
- Modify: `rse.manifest.json`, `index.js`, `index.d.ts`, `motion.js` (+ `.d.ts`), `showcase/demos.js`
- Test: `scripts/test-motif-engine.mjs`, `scripts/test-motion.mjs`

**Interfaces:**
- Consumes: `renderMotifPattern` (Task 8), `RSE.motion`, Lucide `pause`/`play` through `Icon`.
- Produces: `MotifPattern(props: PatternOptions-without-width/height & { className?: string })` filling its container. Root `<div class="rse-motif-pattern rse-motion-managed" aria-hidden="true">` (the pause button is the only exception: it lives outside the aria-hidden node as `<button class="rse-motif-pattern__pause" aria-pressed="false" aria-label="Pausar animação">` rendered only when `animate="ambient"`). `reveal`: `motion.js` gains `RSE.motion.reveal(root?: ParentNode): void`, adding `.is-visible` once via `IntersectionObserver`; cells fade by `--d` stagger, travel multiplied by `--rse-motion-travel`. `ambient`: a shade shift of low amplitude over `--rse-duration-loop`; `[data-paused] *` sets `animation-play-state: paused`. The pause button works in React and in static HTML (`motion.js` has a delegated click handler on `.rse-motif-pattern__pause`). In `reduced`, `ambient` is static and `reveal` is opacity only. Text is never placed on cells: the prompt says so and shows a panel recipe.

- [ ] **Step 1: Write failing tests**: node: `renders aria-hidden root`, `ambient renders exactly one pause button, none/reveal render none`, `unknown hue returns null`, `server render without window does not throw`. Browser: `pause button sets data-paused and aria-pressed=true and pauses animations`, `in reduced, ambient cells have no running animation`, `in reduced, reveal cells never translate`, `clicking pause works with the static-HTML markup and motion.js only`.
- [ ] **Step 2: Run** both. Expected: FAIL.
- [ ] **Step 3: Implement** the component, CSS, `motion.js` additions, prompt (pt-BR), demos (one static, one reveal, one ambient, one multi-hue artwork), manifest and exports.
- [ ] **Step 4: Run** `npm run sync && npm run check && npm run test:motion`. Expected: PASS.
- [ ] **Step 5: Commit** `feat: add MotifPattern`.

### Task 10: Baked pattern presets

**Files:**
- Create: `scripts/build-patterns.mjs`, `assets/patterns/generated/*.svg` (generated), `assets/patterns/generated/README.md`
- Modify: `package.json` (`sync` and `check` call `build-patterns.mjs` and `--check`; add script `"patterns": "node scripts/build-patterns.mjs"`), `docs/recipes.md` (pattern section, line 115)

**Interfaces:**
- Consumes: `loadMotifEngine()`, `renderMotifPattern`.
- Produces: six presets `triangle-brick-purple`, `stair-grid-blue`, `loop-isometric-green`, `tower-grid-pink`, `twin-brick-orange`, `cube-isometric-yellow`, each 1920×1080, `animate: 'none'`, and a seventh multi-hue `spectrum` (all six hues, `sequence: 'diagonal'`). `--check` fails when a file differs.

- [ ] **Step 1: Write failing test** (in `scripts/test-motif-engine.mjs`): `every preset file exists and matches a fresh render`.
- [ ] **Step 2: Run** it. Expected: FAIL.
- [ ] **Step 3: Implement** the script and run `npm run patterns`.
- [ ] **Step 4: Run** `npm run sync && npm run check`. Expected: PASS; `git diff --exit-code assets/patterns/cubes-pattern-*.svg` shows the four official files untouched.
- [ ] **Step 5: Commit** `feat: bake generated pattern presets`.

---

## Phase 5 — Motif rules and release

### Task 11: Motif rule rewrites (R1–R5) and machine-readable rules

**Files:**
- Modify: `AGENTS.md` (rule 10, lines 70–78; Building artwork, line 204–208), `RULES.md:42`, `DESIGN.md:17,29,32`, `readme.md:79`, `SKILL.md`, `components/brand/BrandMotif.prompt.md:35`, `docs/composition/principles.md:29,39`, `docs/composition/rubric.md:37`, `docs/known-gaps.md`, `scripts/build-brand.mjs:266-271,352`, `scripts/check-composition.mjs:255`, `scripts/test-composition.mjs:37`
- Test: `npm run check` (includes `check-composition` and its mutation test)

**Interfaces:** Consumes the shipped components from Tasks 5–10.

- [ ] **Step 1: Rewrite rule 10** to: the six signature constructions render exactly as supplied and are never redrawn, rotated, stretched or distorted; generated shapes and motion come only from `MotifEngine` through `MotifLoader` and `MotifPattern`; any of the six palette families, ramps from the palette only; one *focal* construction per composition, at most 25%, about 0.3 opacity behind content, no text on faces or cells; a pattern is a field and the loader is exempt; patterns are flat colour fields (no gradients, glows or noise); a multi-hue pattern is allowed only as the artwork itself, page text and bands stay in one hue.
- [ ] **Step 2: Mirror** it in every file listed, replacing "never … animate", "recolour outside the sanctioned combinations" and "one hue per composition" per spec rows R1–R5. Add to `known-gaps.md`: generated shapes and motion are system work, not supplied by Sesc, and have not been reviewed by Sesc's brand team.
- [ ] **Step 3: Update** `build-brand.mjs` so `brand.json` `rules.motif` carries `generatedShapes`, `loader`, `pattern` and the new `recolourNote`; update `check-composition.mjs:255` so a `rse-motif-pattern` element is not counted as a second motif, and add a mutation in `test-composition.mjs` that a second focal `class="motif"` still fails while a pattern plus one motif passes.
- [ ] **Step 4: Run** `npm run sync && npm run check`. Expected: PASS.
- [ ] **Step 5: Commit** `docs: replace the motif rules with the generative-motif rules`.

### Task 12: Version, changelog and final verification

**Files:**
- Modify: `package.json` (`2.4.0`, description component count), `CHANGELOG.md` (`## 2.4.0`), every doc that states "40 components" (`grep -rn "40 components" . --include=*.md --include=*.json`), `scripts/audit-baseline.json` only if `npm run audit` demands it

- [ ] **Step 1: Update** the version, changelog entry (engine, loader, pattern, `data-rse-motion`, rule changes, the Sesc-review caveat) and counts (40 → 43: `MotifEngine`, `MotifLoader`, `MotifPattern`).
- [ ] **Step 2: Run** `npm run sync && npm run check && npm run test:motion`, then walk the Definition of done: dark and contrast themes, 360 px width, keyboard path to the pause button, focus visible.
- [ ] **Step 3: Commit** `chore: release 2.4.0 notes`, then `git push -u origin ccr-23f4b5bd-dyfpqm`.

## Notes for the reviewer

- **Deviation from the spec:** the spec lists the Playwright motion test under `npm run check`. `check` has no browser dependency (Playwright is installed only for `test:pages`), so it runs as `npm run test:motion`; everything static runs in `check`. `--rse-motion-travel` lives in `base-runtime.css`, not the token source, because `build-tokens` only models the dark and contrast themes.
- **Not changed:** `Spinner` and `Skeleton` stay unmanaged and keep today's reduced behaviour (the safety net). Giving them a reduced form is a separate follow-up.
