# AGENTS.md — working in the Rede Sesc de Educação design system

This repo is the brand + UI source of truth for the **Rede Sesc de Educação**, Sesc's national
network of schools and educational programmes in Brazil. It exists to be *consumed*: agents and
designers use it to generate marketing sites, program pages, enrollment flows, decks and print
artwork that all look like one institution.

You are almost always doing one of four things. Jump straight to the one you're on:

| Task | Start at |
| --- | --- |
| Build a page, site or prototype | [Building a page](#building-a-page) |
| Build a deck, poster or other artwork | [Building artwork](#building-artwork) |
| Add or change a component | [Changing a component](#changing-a-component) |
| Change tokens / brand foundations | [Changing tokens](#changing-tokens) |
| Put this system into another project | [docs/integration.md](docs/integration.md) |
| Improve the system itself (roadmap work) | [docs/roadmap/roadmap.md](docs/roadmap/roadmap.md) |

Before you ship anything, run:

```bash
npm run check
```

---

## Non-negotiables

These hold for every output, in every mode. They are what makes generated work look like the Rede
and not like a generic template.

1. **Tokens only.** Never write a raw hex colour, font stack, radius, shadow or duration into a
   component or page. Use `var(--rse-…)`: `--rse-color-*` for colour roles and the scales
   (`--rse-space-*`, `--rse-font-size-*`, `--rse-radius-*`…). `--rse-brand-*` is the palette — for
   brand artwork and the token source only. The full list is [docs/tokens.md](docs/tokens.md).
   Spacing may use literal px only when it is layout geometry that has no token (e.g. a 16:10
   media box); colour, type, radius, shadow and motion never may.
2. **The name says the category.** `--rse-<category>-<role>`: `--rse-color-text-body` is a colour,
   `--rse-font-size-body-md` a size. Everything is prefixed `--rse-` (and themes use
   `data-rse-theme`) so the system never collides with a host site's CSS.
3. **Montserrat only**, weights 400–900. Headings Extrabold (800) with `--rse-letter-spacing-tight`.
   Eyebrows Bold (700), uppercase, `--rse-letter-spacing-eyebrow` — the *only* uppercase in the system.
   The manual authorises all Montserrat weights including Thin/ExtraLight/Light; this system
   deliberately stops at 400 because below it Montserrat misses the contrast floor at body sizes.
4. **Two languages, one rule each.** Everything a person reads is **pt-BR**: page copy, labels,
   `alt` text, error messages, `title`s, comments inside a template. Everything the *system* is
   made of is **English**: file and folder names, token names, component and prop names, script
   output, and this documentation — so the repo stays legible to any agent or developer regardless
   of language. Set `<html lang="pt-BR">`. Sentence case for headings and body.
5. **No emoji, no hand-drawn icons.** This is an institutional, credibility-driven brand. Every
   glyph comes from `components/core/Icon.jsx` (Lucide, ISC, vendored in `assets/icons/lucide/`).
   Missing an icon? Vendor it and run `npm run icons` — never paste a one-off SVG into a page,
   never a unicode glyph standing in for an icon.
6. **Never invent Sesc facts.** Student counts, unit addresses, fees, dates, testimonials and
   enrollment windows in this repo are *examples*. Keep them visibly placeholder-ish, and tell the
   user which numbers need verification before anything goes public.
7. **Never invent imagery.** No real photography exists yet. Use `<image-slot>` (see
   [image-slot.js](image-slot.js)) with a `placeholder` describing the shot needed, e.g.
   `placeholder="estudantes em sala, luz natural, estilo documental"`. Do not generate or
   describe fake photos of real students.
8. **Accessibility is part of "done"** — see [Accessibility floor](#accessibility-floor).
9. **The selo has three versions and a fixed geometry.** Principal (`badge-solid.svg`), secundária
   (`badge-outline.svg`), simplificada (`wordmark-*.svg`, below the minimum size). Never rotate,
   stretch, distort, add effects to, or redraw it. It **may** carry any of the ~25 colour
   combinations the manual sanctions — palette colours only, contrast good enough to read the
   lettering, never a gradient, never outlined lettering. Clearspace is **X on all sides**, X being
   the height of the stem of the E; minimum size 45 mm print / 150 px digital. Never lock it up with
   the Sesc signature — they sit at a distance. Details:
   `docs/brand-manual.md`, `assets/logos/README.md`.
10. **The motif is artwork. Its geometry is untouchable; its hue is not.** `BrandMotif` renders the
   official *cubo impossível* constructions — never redraw, rotate, stretch or distort one, and it
   never re-maps per theme. It **does** take a `hue`, authorised by the design owner: the supplied
   sheet ships green, blue and pink only, so that prop is how the other three palette families are
   reached. Omit it and the artwork renders in the exact fills Sesc supplied. Ramps derive from the
   manual's published palette, never from sampling the artwork (see known gap 9), and the remap
   holds each shade's luminance rank — reorder those and the impossible cube stops reading as a
   solid. One construction per composition. Full-bleed cube fields come from `assets/patterns/`.
   Sanctioned treatments, per the manual: small, blown up, in outline, or tiled as a pattern.
11. **Sab.IA is the platform, the Rede is the network.** Learning lives in Sab.IA; enrollment and
   records live in the TOTVS portal. Never route an enrollment task to the platform. Link to it
   with `PlatformEntry` — see [docs/sabia-platform.md](docs/sabia-platform.md).

---

## Repo map

```
AGENTS.md                 You are here: rules, routing, recipes, definition of done.
RULES.md                  The short rules that ship inside the package, for consuming projects.
readme.md                 Brand brief, voice, visual foundations. Read it once.
SKILL.md                  Claude Skill entry point (this system as a portable skill).
tokens/src/*.tokens.json  THE token source (W3C DTCG). Edit tokens here and nowhere else.
tokens/tokens.css         GENERATED. Every custom property; light on :root, then the
                          data-rse-theme dark / contrast / auto blocks.
tokens/fonts.css          Montserrat @font-face.
tokens/base-runtime.css   What components need (focus ring, control hiding, keyframes). Required.
tokens/base-reset.css     Opinionated element styles (body, links, headings). Opt-in.
tokens/tokens-only.css    fonts + tokens, nothing else: for a site with its own base styles.
components/<group>/*.css  The component CSS contract (.rse-button, .rse-field…), next to each component.
dist/components.css       GENERATED. All of them in @layer rse.components.
styles.css                Everything above. The one stylesheet for a page that should look like the Rede.
dist/                     GENERATED. rse.js (every component on window.RSE), tokens.json (resolved
                          per theme), tokens.js + tokens.d.ts (typed module).
brand.json                GENERATED. The brand contract for non-browser consumers: palette with
                          CMYK, tokens per theme, scales, assets by role, machine-readable rules.
index.js / index.d.ts     React entry. Import components from here, never from a component file.
components/<group>/       36 components: Name.jsx + Name.d.ts + Name.prompt.md (+ Name.css on the contract).
                          Icon.jsx and BrandMotif.jsx are GENERATED — edit their sources.
templates/                Four starting points (deck, program page, enrollment form, landing page).
starters/                 Blank, dependency-free starting points: page, React page, A3 poster.
showcase/index.html       The system as one page, for leadership and newcomers. Opens offline.
docs/brand-manual.md      What the official manual specifies. Settle brand questions here.
docs/guidelines.md        The system's own rules for imagery, motion, theming and accessibility.
docs/integration.md       How a project that is not this repo uses the system.
docs/known-gaps.md        Open caveats to say out loud.
docs/roadmap/             The assessment and the plan; read before improving the system itself.
docs/                     Generated component + token references, recipes, authoring, QA checklist.
scripts/                  build-tokens, build-icons, build-motifs, build-bundle, build-brand, gen-docs,
                          build-showcase, check-ds, audit (+ contrast-pairs), pack-static.
rse.manifest.json         Machine index: components, the showcase card, templates, tokens, themes, fonts.
assets/logos/             Official vector lockups (Rede + Sab.IA); originals in source/. Read its README.
assets/motifs/            Official cubo impossível artwork and its six constructions.
assets/patterns/          Four full-bleed cube pattern backgrounds.
assets/icons/lucide/      Vendored Lucide set (ISC) that Icon.jsx is generated from.
assets/vendor/            React 18 UMD, so static pages run offline.
uploads/                  Original source material (selo PDFs, reference screenshots). Read-only.
```

## The three consumption modes

**Static HTML (decks, mocks, artwork, anything you hand the user as a file).** Link `styles.css`,
load React 18 UMD from `assets/vendor/` and then `dist/rse.js`, and read components off
`window.RSE`. No build step. This is the default for artifacts. Start from [starters/](starters/).

**React project (production code).** Install `@idcesares/rse-design-system` and import from the
package root:

```jsx
import { Button, Card, Stat, Tabs } from '@idcesares/rse-design-system';
import '@idcesares/rse-design-system/styles.css';
```

Never import a component file directly — `npm run check` forbids it inside this repo, so that a
component can be re-implemented (roadmap P2) without breaking consumers.

**Anything that is not a browser** (a Python generator, a print pipeline, a design tool). Read
[`brand.json`](brand.json) for the brand (palette with CMYK, rules, assets by role) or
`dist/tokens.json` for every token resolved per theme. Both are generated. Worked example:
[docs/examples/social_post.py](docs/examples/social_post.py), a 1080×1080 social post rendered with
the Python standard library and nothing else.

Putting the system into another project — npm, the static kit for CMSs, Python: see
[docs/integration.md](docs/integration.md).

> `dist/rse.js` is a **copy of the component sources, not a second implementation**. Editing a
> `.jsx` without running `npm run sync` means every static page keeps running the old code.
> `npm run check` catches this.

---

## Building a page

1. Pick the closest starting point rather than assembling primitives:
   - `templates/landing-page/` — marketing page (announcement bar, hero, stats, program cards, CTA, footer).
   - `templates/program-page/` — program/unit detail (hero with enrollment window, turmas table, FAQ, stepper).
   - `templates/enrollment-form/` — printable A4 matrícula form.
   - `starters/page.html` — blank page with the system wired up, if nothing above fits.
2. Copy the folder, then edit the one `base` line in its `ds-base.js` so the paths resolve from the
   new location. That single line is the only wiring.
3. Compose from existing components before writing new markup. Check
   [docs/components.md](docs/components.md) first — the set is deliberately complete for this
   use case (36 components), so a "missing" component is usually an existing one with a prop you
   haven't read yet.
4. Structure: page background is cream (`--rse-color-surface-page`), content sits on white cards
   (`--rse-color-surface-card`). A feature or CTA **band** may be brand purple or indigo with white text, or
   any light or mid accent with **ink** text (`--rse-brand-ink`, 4.8–10:1) — that is how the rede's six
   hues reach a page (decision D3). Never white text on an accent (2.3–3.3:1), never a `-dark`
   accent or mid `--rse-brand-purple` as a band (they fail with both white and ink), no gradients, one
   band colour per section.
5. Rhythm: `--rse-section-y-md` (96px) between major blocks, `--rse-container-xl` (1200px) for page width,
   `--rse-container-prose` (66ch) for anything text-heavy.
6. Copy: short declarative sentences, second person ("você"), verbs of transformation (acolhe,
   forma, transforma). The slogan is **"Aprender para a vida acontecer"**. Full voice guidance is
   in [readme.md](readme.md#content-fundamentals).

Details and worked examples: [docs/recipes.md](docs/recipes.md).

## Building artwork

Decks, posters, social cards and print pieces are static HTML — no React needed unless you want
the components.

- Deck: copy `templates/institutional-deck/` (1920×1080 slides, print/PPTX-ready via `deck-stage.js`).
- Poster / print piece: `starters/poster.html` (A3 at 300dpi-equivalent scale, print CSS included).
- Any static page: `starters/page.html`.

Artwork rules on top of the non-negotiables: flat colour fields only — no gradients, no textures,
no drop shadows beyond `--rse-shadow-sm/md/lg`, no photographic full-bleeds until real photography
exists. `BrandMotif` renders the official *cubo impossível* constructions (rule 10): one
construction per composition; if you use the purple, orange or yellow `hue`, tell the user those
are derived, not supplied.

## Changing a component

A component is these files. They move together:

```
components/<group>/Name.css        the CSS contract: .rse-name, BEM elements, --modifiers. Look and
                                   state live here (:hover, :focus-visible, :checked, [aria-*]).
components/<group>/Name.jsx        React wrapper that renders the contract (createElement form, no JSX)
components/<group>/Name.d.ts       props + one-line doc comment
components/<group>/Name.prompt.md  when to use it, a pt-BR example, and the plain-HTML markup
showcase/demos.js                  a demo for the showcase gallery (step 4 of docs/authoring-components.md)
```

**The CSS contract is the component; React is a convenience.** A CMS, the enrollment portal or a
static page uses the classes directly, so nothing visual may live only in JavaScript: no inline
style objects, no hover held in state. Wrappers forward `ref`, pass every other prop to the main
element (`...rest`), merge `className`, and build ids with `React.useId`. Twelve components are on
the contract (`npm run audit` → `componentsOnCssContract`; IconButton is styled in `Button.css`, so
that is 11 `.css` files); moving the rest is roadmap P2.

Then:

```bash
npm run sync     # rebuilds tokens, dist/rse.js, brand.json and the generated docs
npm run check    # must pass
```

Rules:

- **`React.createElement` form, not JSX.** The bundle is a copy, not a compile; `build-bundle`
  rejects JSX. This is what lets static pages load components with no build step.
- A **new** component must also be registered in `rse.manifest.json` under `components` (name +
  sourcePath) and exported from `index.js`. `npm run check` fails until both are true.
- **Calls a hook? Line 1 is `'use client';`**, above the React import. `index.js` is a flat barrel,
  so a React Server Components host (Next.js App Router) pulls every component into the server
  graph on any import from it, and a hook without the directive fails *their* build. `npm run check`
  fails without it. The directive never reaches `dist/rse.js` — `build-bundle` strips it, so
  static pages are unaffected.
- Props are strings, arrays and plain objects wherever possible — templates mount components
  through `<x-import>` with HTML attributes, so exotic prop shapes don't survive the trip.
- **New components start on the contract** (a `.css` file first). The scope freeze of roadmap P0.3
  ended with P2.1; still check for an existing component with a prop before adding one.
- Don't add a component that duplicates an existing one with a prop. Check
  [docs/components.md](docs/components.md) and the gallery in `showcase/index.html` first.

Full checklist: [docs/authoring-components.md](docs/authoring-components.md).

## Changing tokens

1. Edit `tokens/src/*.tokens.json` — `brand` (tier 1, the palette), `color` (tier 2 roles),
   `typography`, `layout`, `effects`. The CSS name is the path: `rse.color.text-body` →
   `--rse-color-text-body`. An alias is `"{rse.brand.purple-dark}"`.
2. A role that differs per theme carries `$extensions.rse.modes.dark` / `.contrast`. **Brand values
   never change per theme** — only tier 2 re-maps. Aliases are followed for you: a token that points
   at a themed token is re-declared in each theme block automatically.
3. Text on a new surface? Add the pair to `scripts/contrast-pairs.mjs`.
4. `npm run sync`, then `npm run check`.

A component that reads a raw hex instead of a token is invisible to theming — that is exactly how
this system's chips ended up light-on-light in dark mode before the tint tokens existed.

---

## Accessibility floor

Every generated surface must clear this. It is not optional polish; the audience includes
students, families and Sesc staff across the whole country.

- **Contrast** ≥ 4.5:1 for body text, ≥ 3:1 for large text and UI borders. `npm run check` measures
  every pair listed in `scripts/contrast-pairs.mjs` in all three themes and fails below the floor.
  Pale accent tints (`--rse-color-tint-*`) carry their paired `--rse-color-tint-*-ink` foreground. Status colours have
  three roles: `--rse-color-danger-surface` (background), `--rse-color-danger-text` (words), `--rse-color-danger` (dots, borders,
  icons only). Text on `--rse-color-surface-primary-tint` is `--rse-color-text-on-primary-tint`. The official `-dark`
  tones never carry small text — they sit at 3.4–4.1:1 against white *and* ink.
- **Focus is always visible.** The global `:focus-visible` ring is in `tokens/base-runtime.css`. Never set
  `outline: none` without an equally visible replacement.
- **Native control, hidden visually — never `display:none`.** A native input styled behind custom
  chrome uses `className="rse-control-input"` (see `tokens/base-runtime.css`); `display:none` removes it
  from the tab order and the accessibility tree. `npm run check` fails on this.
- **Keyboard**: everything interactive reachable with Tab, operable with Enter/Space. Tabs move
  with arrow keys, menus and dialogs close with Escape, dialogs trap focus and return it to the
  trigger.
- **Hit targets** ≥ `--rse-hit-target-min` (44px) on touch surfaces.
- **Motion** stays inside `--rse-duration-fast/base/slow` with standard easing. `prefers-reduced-motion`
  is already honoured globally — don't reintroduce animation that ignores it.
- **Images** carry real `alt` text in pt-BR, or `alt=""` when decorative. `<image-slot>` placeholders
  describe the shot needed.
- Full rules: [docs/guidelines.md](docs/guidelines.md#accessibility).

## Commands

```bash
npm run check    # integrity, generated-file freshness, contrast gate, debt ratchet — must pass
npm run sync     # after editing tokens, components, icons or motifs — regenerates everything
npm run audit    # quality scorecard: contrast of rendered pairs, component/page debt, doc drift
npm run audit -- --update-baseline   # after lowering a debt count, lock it in (same PR)
npm run icons    # rebuild Icon.jsx after vendoring a new Lucide SVG
npm run motifs   # rebuild BrandMotif.jsx from assets/motifs/cubes-official.svg
npm run pack     # build the static kit dist/static/rse-<version>/ (CMS and offline use)
```

Generated, never edited by hand: `tokens/tokens.css`, `dist/*`, `brand.json`, `docs/components.md`,
`docs/tokens.md`, `showcase/showcase-data.js`, `Icon.jsx`, `BrandMotif.jsx`. `build-brand.mjs`
cross-checks the palette hex and CMYK in `tokens/src/brand.tokens.json` against the manual's
published table and warns on any drift — the guard against re-sampling colour from artwork.

**Releasing.** Bump `version` in `package.json`, add a `## <version>` section to `CHANGELOG.md`,
then push a `v<version>` tag, or run the `release` workflow by hand on main (it creates the tag). `.github/workflows/release.yml` checks, publishes to GitHub
Packages and attaches the static kit to a GitHub Release. Breaking a token or prop name is a major.

## Definition of done

- [ ] `npm run check` passes — it includes the contrast gate and the debt ratchet (`npm run audit`).
- [ ] Lowered a debt count? `npm run audit -- --update-baseline` in the same change.
- [ ] No raw hex, font stack, radius, shadow or duration outside `tokens/`.
- [ ] Copy is pt-BR, sentence case, no emoji, no invented Sesc figures.
- [ ] Keyboard path walked end to end; focus visible at every stop.
- [ ] Looks right with `data-rse-theme="dark"` and `"contrast"`, not just light, and at 360 px wide.
- [ ] Placeholder content (imagery, figures, addresses) is flagged to the user, not left to pass as real.

## Known gaps

Open caveats in the source material — not bugs to fix silently, but things to say out loud when
they matter (photography, Pantone, the Sab.IA URL, derived motif hues, layout being system work,
icons, favicon rasters, never re-sampling colour). The list lives in one place:
[docs/known-gaps.md](docs/known-gaps.md).
