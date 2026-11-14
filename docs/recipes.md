# Recipes

Worked patterns for the things this system gets used for. Read [../AGENTS.md](../AGENTS.md) first
for the rules these recipes assume.

- [A static page you hand the user as a file](#a-static-page-you-hand-the-user-as-a-file)
- [A page inside a React project](#a-page-inside-a-react-project)
- [A page from a template](#a-page-from-a-template)
- [A deck](#a-deck)
- [A poster or print piece](#a-poster-or-print-piece)
- [A themed surface (dark / high contrast)](#a-themed-surface)
- [Standard section patterns](#standard-section-patterns)

---

## A static page you hand the user as a file

Copy `starters/page.html`. It is self-contained: link the stylesheet, load the bundle, read
components off the global namespace.

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Programas — Rede Sesc de Educação</title>
  <link rel="stylesheet" href="styles.css">
  <script src="dist/rse.js"></script>
</head>
<body>
  <main id="app"></main>
  <script>
    const DS = window.RSE;
    // DS.Button, DS.Card, DS.Stat, … see docs/components.md
  </script>
</body>
</html>
```

Paths are relative to where you put the file. One level down from the system root, `styles.css`
becomes `../styles.css`. If you copy the file somewhere else entirely, copy `styles.css`,
`tokens/`, `assets/fonts/` and `dist/rse.js` with it — the fonts are referenced from
`tokens/fonts.css` by relative path.

Components need React to render. For a page with real interactivity, do what
`starters/page-react.html` does: load the vendored React UMD builds from `assets/vendor/`, then
`dist/rse.js`, and write your screens in `React.createElement` form — no JSX, so no Babel and no
network, and the page opens from `file://`. For a page that is mostly layout, write the markup directly
with tokens and use the components only where behaviour matters — that is what the templates do.

## A page inside a React project

```jsx
import { Navbar, Card, Stat, Tabs, Footer } from '@idcesares/rse-design-system';
import '@idcesares/rse-design-system/styles.css';
```

Or, working inside this repo, `import { … } from './index.js'`. Never import
`components/core/Button.js` directly.

## A page from a template

The fastest path, and the one to prefer.

```bash
cp -r templates/landing-page my-project/pages/programas
```

Then open `ds-base.js` in the copy and point `base` at wherever the design system lives relative to
that page:

```js
const base = '../../_ds';   // the one line to edit
```

`ds-base.js` loads local styles, motion/init, vendored React/DOM, the bundle, image slots and the
local template runtime in order. The page itself mounts
components through `<x-import component-from-global-scope="RSE.Button" …>`.
Attributes are strings — that is why component props are kept to strings, arrays and plain objects.

| Template | Use for |
| --- | --- |
| `templates/landing-page/` | Marketing / campaign pages |
| `templates/program-page/` | A single programme or unit, with turmas and FAQ |
| `templates/enrollment-form/` | Printable A4 matrícula form |
| `templates/institutional-deck/` | 10-slide editorial institutional presentation |

## A deck

For any stack, and for the quality bar, start at [DESIGN.md](../DESIGN.md) and the exemplars in
[docs/composition/exemplars/](composition/exemplars/institutional-deck.md). For a working HTML
starter, copy `templates/institutional-deck/`. Slides are 1920×1080 stages handled by `deck-stage.js`;
each `<section>` is one slide. `deck.css` derives display, headline, body and caption sizes from
the short-side fractions in `docs/composition/formats.json`, rather than hand-setting pixel font sizes.
Its signature artwork comes from BrandMotif, and its photographs remain labelled image slots.
See [application-references.md](application-references.md) for the structure and acceptance checks.

Keep to the deck's existing rhythm: one idea per slide, an eyebrow + a short declarative headline,
and at most one stat band or image per slide.

## A poster or print piece

For any stack, and for the quality bar, start at [DESIGN.md](../DESIGN.md) and the
[A3 poster exemplar](composition/exemplars/poster-a3.md). For a blank HTML starter, copy
`starters/poster.html`. It sets an A3 page box, print CSS (`@page`), and the cream/purple
field structure. Print rules:

- Colour fields in palette colour; subtle palette gradients and depth are welcome
  ([creative latitude](composition/creative-latitude.md#gradients)). No textures over text.
- Shadows do not print — the starter drops them inside `@media print`.
- Type: headline Extrabold with tight tracking, one uppercase tracked eyebrow, generous margins.
  Poster type sizes are geometry, not the web scale.
- Logo: use `assets/logos/wordmark-purple.svg` on cream, `wordmark-white.svg` on purple/ink. Respect
  clearspace ([brand-manual.md](brand-manual.md), shown in `showcase/index.html#selo`).
- Export to PDF from the browser print dialog at 100% scale, background graphics on.

## The cube motif and its patterns

Two different things, used differently.

**One focal construction** — `BrandMotif`, as a quiet accent in negative space:

```jsx
<BrandMotif variant="interlock" size={220} />          // beside a hero
<BrandMotif variant="cube" size={160} opacity={0.3} /> // behind a section marker
```

**A full-bleed field** — the official pattern backgrounds, as a CSS background image. This is the
Sab.IA login screen's signature: a cube field on one side, content on a calm surface on the other.

```css
.hero-field{
  background: var(--rse-brand-blue-light) url('assets/patterns/cubes-pattern-1.svg') left center / cover no-repeat;
}
```

| file | field colour |
| --- | --- |
| `cubes-pattern-1.svg` | blue |
| `cubes-pattern-2.svg` | green |
| `cubes-pattern-3.svg` | orange |
| `cubes-pattern-4.svg` | red |

**Generated presets** — when none of the four official fields fits, `assets/patterns/generated/`
has seven baked 1920 x 1080 SVGs from the motif engine, in single hues (`triangle-brick-purple`,
`stair-grid-blue`, `loop-isometric-green`, `tower-grid-pink`, `twin-brick-orange`,
`cube-isometric-yellow`) and one multi-hue `spectrum`. They are system work, not supplied by Sesc;
the README in that folder lists their parameters. Use them exactly like the official fields:

```css
.faixa-matriculas{
  background: var(--rse-color-surface-page) url('assets/patterns/generated/stair-grid-blue.svg') center / cover no-repeat;
}
```

```html
<!-- Faixa decorativa: a imagem é só enfeite, então alt vazio. -->
<img src="assets/patterns/generated/cube-isometric-yellow.svg" alt="" width="1920" height="1080">
```

`spectrum.svg` is the one multi-hue file and it is artwork only: a hero field or a standalone
piece, never a backdrop for a form or a page of copy, and the text and bands around it stay in one
hue. To change a preset or add one, edit `scripts/lib/pattern-presets.mjs` and run
`npm run patterns`; to tile a pattern at any size in the browser, use `MotifPattern`.

Never put body text on top of a cube field — split the composition, or reserve the field for a
column that carries no copy. Text goes on a solid panel, never directly on the pattern, generated
or official. One field per page, and never behind a form.

## A "Reduzir animações" switch

The motion setting is `data-rse-motion="full" | "reduced"`, and the host product renders the
control. Use the existing `Switch`: it is checked when `RSE.motion.get() === 'reduced'`, and a change
calls `RSE.motion.set(checked ? 'reduced' : 'full')`. React:

```jsx
function MotionSwitch() {
  const [reduced, setReduced] = React.useState(() => RSE.motion.get() === 'reduced');
  return (
    <Switch
      label="Reduzir animações"
      checked={reduced}
      onChange={(e) => {
        setReduced(e.target.checked);
        RSE.motion.set(e.target.checked ? 'reduced' : 'full');
      }}
    />
  );
}
```

Static HTML, with the markup `Switch` renders, and `motion.js` loaded:

```html
<label class="rse-choice rse-switch">
  <input type="checkbox" role="switch" class="rse-control-input" id="reduzir-animacoes">
  <span class="rse-choice__box rse-control-box" aria-hidden="true"></span>
  <span class="rse-choice__label">Reduzir animações</span>
</label>
<script>
  var box = document.getElementById('reduzir-animacoes');
  box.checked = RSE.motion.get() === 'reduced';
  box.addEventListener('change', function () {
    RSE.motion.set(box.checked ? 'reduced' : 'full');
  });
</script>
```

The host persists nothing itself: `RSE.motion.set` stores the choice and writes the attribute on
`<html>`. Run `RSE.motion.init()` early in `<head>` (right after `motion.js`) so a stored choice
applies before first paint, with no flash of full motion. The choice can also be set on one section
with `data-rse-motion`; the nearest ancestor wins.

## Linking to the Plataforma Sesc Sab.IA

```jsx
<PlatformEntry href="https://…" logoSrc="assets/logos/sabia-wordmark-cream.svg" />
```

Once per page, near the end, with the real URL. The header CTA stays on enrollment; the platform
entry is a separate, quieter promise. Background: [sabia-platform.md](sabia-platform.md).

## A themed surface

Set the attribute on any ancestor — usually `<html>`:

```html
<html lang="pt-BR" data-rse-theme="dark">
```

`dark` and `contrast` re-map the semantic layer only. If something looks wrong in a theme, the
cause is nearly always a hard-coded colour in the component or page, not a missing theme value.

To offer a toggle, flip the attribute and let CSS do the rest:

```js
document.documentElement.dataset.rseTheme = isDark ? 'dark' : '';
```

## Layout primitives

Page structure comes from six classes in `components/layout/layout.css` (shipped in `styles.css`
and `dist/components.css`). Use them instead of declaring a container or a stack per page; a page
stylesheet keeps only what is specific to that page.

```html
<section class="rse-section rse-container" id="programas">
  <div class="rse-stack">
    <p class="rse-eyebrow">Programas</p>
    <h2>Escolha um caminho</h2>
  </div>
  <div class="rse-grid" style="--rse-grid-min: 16rem">…cards…</div>
  <div class="rse-cluster">…buttons…</div>
</section>
```

| Class | What it does | Tune with |
| --- | --- | --- |
| `.rse-container` | page width (`--rse-container-xl`) and fluid side padding | `--lg`, `--md`, `--prose` |
| `.rse-section` | `--rse-section-y-md` above and below (`-sm` below the md breakpoint); consecutive sections share one gap | — |
| `.rse-stack` | vertical flow, one gap (`--rse-space-5`) | `--sm`, `--lg`, `--rse-stack-gap` |
| `.rse-cluster` | wrapping row, one gap | `--rse-cluster-gap` |
| `.rse-grid` | auto-fit columns, never a fixed count | `--rse-grid-min` (17.5rem), `--rse-grid-gap` |
| `.rse-eyebrow` | the eyebrow label (Bold, uppercase, primary) | — |

A section with its own surface is a band (`CtaBand`, `StatBand`), not `.rse-section`. Media queries
use the breakpoint scale (`xs 480 · sm 640 · md 834 · lg 1120 · xl 1440`, max-width as the value
minus 1px); `npm run check` rejects anything else.

## Standard section patterns

These compositions recur across the network's surfaces; reuse them rather than inventing new ones.

**Hero** — eyebrow (uppercase, `--rse-color-primary`) → `--rse-font-size-display-2` headline → one supporting
line at `--rse-font-size-body-lg` in `--rse-color-text-muted` → two buttons (`primary` + `ghost`) → an `<image-slot>`
at `--rse-radius-xl`. Use `Hero` (title is the page's one `h1`, `badge` for a deadline, `media` takes the caller's
`<image-slot>`, never a default image) rather than hand-rolling it.

**Stat band** — solid `--rse-color-primary` full-bleed band, 3–4 `Stat` components in a grid, white
figures. This is the "resultado" pillar made visible; keep the figures to four at most. Use `StatBand`
(`tone` primary, indigo, ink or a light/mid accent; `accent="inverse"` on the dark tones) rather than a hand-rolled
grid. Its closing counterpart is **CTA band**: `CtaBand` with the same tone set, buttons composed as children.

**Testimonial** — `Testimonial` with `example` while the text is a placeholder (a visible "Depoimento de exemplo" pill); one static quote, an `Avatar` with initials, name, role and unit. Never invent one, never a carousel.

**Program cards** — 3-up grid of `Card` at 16:10 media, each with a coloured `Tag` above the
eyebrow. Vary the `Tag` colour across the accent families to show the plurality of the rede — this
is the one place multiple accent hues appear together.

**Enrollment flow** — `Stepper` across the top, form fields (`Input`, `Select`, `DateField`,
`FileUpload`) in a single column at `--rse-container-prose` width, `Alert` for the deadline, `Modal`
for confirmation.

**FAQ** — `Accordion`, single-open, at `--rse-container-prose` width. The most-requested pattern on an
education site; use it instead of long unbroken copy.

**Footer** — `Footer` component with 3–4 link columns on `--rse-brand-ink`. Always carries the
institutional note line.

## Building a page — the checklist

1. Pick the closest starting point rather than assembling primitives:
   - `templates/landing-page/` — marketing page (announcement bar, hero, stats, program cards, CTA, footer).
   - `templates/program-page/` — program/unit detail (hero with enrollment window, turmas table, FAQ, stepper).
   - `templates/enrollment-form/` — printable A4 matrícula form.
   - `starters/page.html` — blank page with the system wired up, if nothing above fits.
2. Copy the folder, then edit the one `base` line in its `ds-base.js` so the paths resolve from the
   new location. That single line is the only wiring.
3. Compose from existing components before writing new markup. Check
   [components.md](components.md) first — the set is deliberately complete for this
   use case (43 components), so a "missing" component is usually an existing one with a prop you
   haven't read yet.
4. Structure: page background is cream (`--rse-color-surface-page`), content sits on white cards
   (`--rse-color-surface-card`). A feature or CTA **band** may be brand purple or indigo with white text, or
   any light or mid accent with **ink** text (`--rse-brand-ink`, 4.8–10:1) — that is how the rede's six
   hues reach a page (decision D3). Never white text on an accent (2.3–3.3:1), never a `-dark`
   accent or mid `--rse-brand-purple` as a band (they fail with both white and ink), no off-palette or contrast-breaking
   gradients (a subtle palette gradient is fine on a hero or band, see [creative latitude](composition/creative-latitude.md)),
   one band colour per section.
5. Rhythm: `--rse-section-y-md` (96px) between major blocks, `--rse-container-xl` (1200px) for page width,
   `--rse-container-prose` (66ch) for anything text-heavy.
6. Copy: short declarative sentences, second person ("você"), verbs of transformation (acolhe,
   forma, transforma). The slogan is **"Aprender para a vida acontecer"**. Full voice guidance is
   in [readme.md](../readme.md#content-fundamentals).

Details and worked examples: the recipes in this file.

## Building artwork in HTML

Start at [DESIGN.md](../DESIGN.md). It is written for any stack (HTML, PPTX, SVG, a print pipeline) and
routes to the composition rules, the formats and the exemplars. What follows is the HTML path in
this repo: static pages, no React needed unless you want the components.

- Deck: copy `templates/institutional-deck/` (1920×1080 slides, print/PPTX-ready via `deck-stage.js`). It is
  a working implementation reference: see `docs/application-references.md` for its structure and
  validation, and `docs/composition/exemplars/` for cross-stack editorial direction.
- Poster / print piece: `starters/poster.html` (A3 at 300dpi-equivalent scale, print CSS included).
- Any static page: `starters/page.html`.

Artwork rules on top of the non-negotiables: palette colour only; subtle palette gradients and
depth are welcome ([the gradient rules](composition/creative-latitude.md#gradients)); no
stock or generated photography and no photographic full-bleeds until real photography exists. `BrandMotif` renders the official *cubo impossível* constructions (rule 10): one
focal construction per composition. Generated shapes and motion exist too (`MotifEngine` through
`MotifPattern` and `MotifLoader`; a pattern is a field, not a construction). If you use the purple,
orange or yellow `hue`, or any generated shape, tell the user those are derived, not supplied.
