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
import { Navbar, Card, Stat, Tabs, Footer } from 'rede-sesc-educacao-design-system';
import 'rede-sesc-educacao-design-system/styles.css';
```

Or, working inside this repo, `import { … } from './index.js'`. Never import
`components/core/Button.jsx` directly.

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

`ds-base.js` link-tags the token stylesheets and loads `dist/rse.js`; the page itself mounts
components through `<x-import component-from-global-scope="RSE.Button" …>`.
Attributes are strings — that is why component props are kept to strings, arrays and plain objects.

| Template | Use for |
| --- | --- |
| `templates/landing-page/` | Marketing / campaign pages |
| `templates/program-page/` | A single programme or unit, with turmas and FAQ |
| `templates/enrollment-form/` | Printable A4 matrícula form |
| `templates/institutional-deck/` | 9-slide institutional presentation |

## A deck

Copy `templates/institutional-deck/`. Slides are 1920×1080 stages handled by `deck-stage.js`;
each `<section>` is one slide. Type scales up hard at that size — the deck uses explicit px sizes
(40–120px) rather than the web type scale, which is the one sanctioned place to leave the `--rse-font-size-*`
scale, because the tokens are tuned for screen reading distance.

Keep to the deck's existing rhythm: one idea per slide, an eyebrow + a short declarative headline,
and at most one stat band or image per slide.

## A poster or print piece

Copy `starters/poster.html`. It sets an A3 page box, print CSS (`@page`), and the cream/purple
field structure. Print rules:

- Flat colour fields only. The brand has no gradients or textures.
- Shadows do not print — the starter drops them inside `@media print`.
- Type: headline Extrabold with tight tracking, one uppercase tracked eyebrow, generous margins.
  Poster type sizes are geometry, not the web scale.
- Logo: use `assets/logos/wordmark-purple.svg` on cream, `wordmark-white.svg` on purple/ink. Respect
  clearspace ([brand-manual.md](brand-manual.md), shown in `showcase/index.html#selo`).
- Export to PDF from the browser print dialog at 100% scale, background graphics on.

## The cube motif and its patterns

Two different things, used differently.

**One construction** — `BrandMotif`, as a quiet accent in negative space:

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

Never put body text on top of a cube field — split the composition, or reserve the field for a
column that carries no copy. One field per page, and never behind a form.

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

## Standard section patterns

These compositions recur across the network's surfaces; reuse them rather than inventing new ones.

**Hero** — eyebrow (uppercase, `--rse-color-primary`) → `--rse-font-size-display-2` headline → one supporting
line at `--rse-font-size-body-lg` in `--rse-color-text-muted` → two buttons (`primary` + `ghost`) → an `<image-slot>`
at `--rse-radius-xl`.

**Stat band** — solid `--rse-color-primary` full-bleed band, 3–4 `Stat` components in a grid, white
figures. This is the "resultado" pillar made visible; keep the figures to four at most. Use `StatBand`
(`tone` primary, indigo, ink or a light/mid accent; `accent="inverse"` on the dark tones) rather than a hand-rolled
grid. Its closing counterpart is **CTA band**: `CtaBand` with the same tone set, buttons composed as children.

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
