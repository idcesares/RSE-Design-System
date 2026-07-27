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

Before you ship anything, run:

```bash
npm run check
```

---

## Non-negotiables

These hold for every output, in every mode. They are what makes generated work look like the Rede
and not like a generic template.

1. **Tokens only.** Never write a raw hex colour, font stack, radius, shadow or duration into a
   component or page. Use `var(--token)`. The full list is [docs/tokens.md](docs/tokens.md).
   Spacing may use literal px only when it is layout geometry that has no token (e.g. a 16:10
   media box); colour, type, radius, shadow and motion never may.
2. **One name, one meaning.** `--text-body` is the body text *colour*. The body text *size* is
   `--text-body-md`. Never define a token name twice with different meanings — `npm run check`
   fails on it.
3. **Montserrat only**, weights 400–900. Headings Extrabold (800) with `--letter-spacing-tight`.
   Eyebrows Bold (700), uppercase, `--letter-spacing-eyebrow` — the *only* uppercase in the system.
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
   `guidelines/brand-clearspace.card.html`, `assets/logos/README.md`.
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
readme.md                 Brand brief, voice, visual foundations, open caveats. Read this first.
SKILL.md                  Claude Skill entry point (this system as a portable skill).
AGENTS.md                 You are here.
index.js / index.d.ts     Public import surface for React consumers.
brand.json                GENERATED. The language-agnostic contract: palette with CMYK, resolved
                          tokens, scales, assets by role, machine-readable rules. What a Python or
                          print consumer reads. See docs/integration.md.
styles.css                Imports every token file, in order. The one stylesheet to link.
tokens/*.css              Colours, type, spacing, layout, effects, themes, base reset.
tokens/tokens-only.css    Custom properties and @font-face only, no element selectors. Link this
                          instead of styles.css inside a site that has its own base styles.
                          tokens/base.css = base-runtime.css (required) + base-reset.css (opt-in).
components/<group>/       36 components: Name.jsx + Name.d.ts + Name.prompt.md (+ *.card.html specimens).
                          Icon.jsx and BrandMotif.jsx are GENERATED — edit their sources, not them.
guidelines/*.card.html    Rendered specimens: colour, type, spacing, motion, imagery, theming, a11y, audit.
templates/                Four ready-made starting points (deck, program page, enrollment form, landing page).
starters/                 Blank, dependency-free HTML starting points for pages and print artwork.
ui_kits/site/             3-screen marketing site recreation. Sources are React.createElement like
                          everything else; the page loads vendored React + _ds_bundle.js and
                          nothing from a network. No JSX, no Babel — see its index.html comment.
showcase/index.html       The system presented as one self-contained page — for leadership and
                          newcomers. Live components, measured contrast, the artefacts running in
                          frames. GENERATED data in showcase/showcase-data.js. See its README.
docs/brand-manual.md      What the official brand manual actually specifies. Settle brand questions here.
docs/integration.md       How to put this system into a project that is not this repo.
docs/examples/            Worked consumers. social_post.py renders a post from brand.json alone.
docs/                     Generated component + token reference, recipes, authoring guide, QA checklist.
scripts/                  check-ds, build-icons, build-motifs, sync-bundle, sync-tokens, build-brand,
                          gen-docs, build-showcase, bind.
_ds_bundle.js             Browser build of every component. What static pages actually execute.
_ds_manifest.json         Machine index of components, cards, templates, tokens, themes, fonts.
_adherence.oxlintrc.json  Lint rules encoding the token/import/prop constraints above.
assets/logos/             Official vector lockups (Rede + Sab.IA); originals in source/. Read its README.
assets/motifs/            Official cubo impossível artwork and its six constructions.
assets/patterns/          Four full-bleed cube pattern backgrounds.
assets/icons/lucide/      Vendored Lucide set (ISC) that Icon.jsx is generated from.
assets/                   Fonts, favicon, OG image, and the superseded raster logos.
uploads/                  Original source material (selo PDFs, reference screenshots). Read-only.
```

## The three consumption modes

**Static HTML (decks, mocks, artwork, anything you hand the user as a file).** Link `styles.css`,
load `_ds_bundle.js`, and read components off the global namespace
`window.RedeSescDeEducaODesignSystem_2167ce`. No build step, no npm install. This is the default
for artifacts. Start from [starters/](starters/).

**React project (production code).** Import from `index.js`:

```jsx
import { Button, Card, Stat, Tabs } from './index.js';
```

Never import a component file directly — `_adherence.oxlintrc.json` forbids it, so that a
component can be re-pathed or re-implemented without breaking consumers.

**Anything that is not a browser** (a Python generator, a print pipeline, a design tool, another
language entirely). Read [`brand.json`](brand.json): every colour resolved to a literal hex with
its CMYK, the type and spacing scales, every logo, motif, pattern and icon indexed by role, and
the brand rules in machine-readable form. It is generated from `tokens/*.css` and
`docs/brand-manual.md` — a summary of them, never a second spec. Worked example:
[docs/examples/social_post.py](docs/examples/social_post.py), a 1080×1080 social post rendered
with the Python standard library and nothing else.

To put any of these into a project that is not this repo, see
[docs/integration.md](docs/integration.md) — `npm run bind ../their-project` copies a stamped,
self-contained `_ds/` folder and the rules that travel with it.

> `_ds_bundle.js` is a **mirror of the component sources, not a second implementation**. Editing a
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
4. Structure: page background is cream (`--surface-page`), content sits on white cards
   (`--surface-card`). At most **two** background colours per composition — cream, plus brand
   purple for one feature/CTA band. Accent hues live in tags, chips and dots only, never as a
   full-bleed section background.
5. Rhythm: `--section-y` (96px) between major blocks, `--container-max` (1200px) for page width,
   `--container-prose` (66ch) for anything text-heavy.
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
no drop shadows beyond `--shadow-sm/md/lg`, no photographic full-bleeds until real photography
exists. The `BrandMotif` component (the brief's *cubo impossível*) is an explicit **placeholder**:
use it as a geometric accent, and tell the user it must be replaced with the official artwork.

## Changing a component

Every component is four files. All four move together:

```
components/<group>/Name.jsx        source (React.createElement form — no JSX, see below)
components/<group>/Name.d.ts       props + one-line doc comment
components/<group>/Name.prompt.md  when to use it, with a realistic pt-BR example
components/<group>/*.card.html     specimen card (one per group, add your component to it)
```

Then:

```bash
npm run sync     # mirrors sources into _ds_bundle.js, refreshes tokens + generated docs
npm run check    # must pass
```

Rules:

- **`React.createElement` form, not JSX.** The bundle is a copy, not a compile; `sync-bundle`
  rejects JSX. This is what lets static pages load components with no build step.
- A **new** component must also be registered in `_ds_manifest.json` under `components` (name +
  sourcePath) and exported from `index.js`. `npm run check` fails until both are true.
- **Calls a hook? Line 1 is `'use client';`**, above the React import. `index.js` is a flat barrel,
  so a React Server Components host (Next.js App Router) pulls every component into the server
  graph on any import from it, and a hook without the directive fails *their* build. `npm run check`
  fails without it. The directive never reaches `_ds_bundle.js` — `sync-bundle` strips it, so
  static pages are unaffected.
- Props are strings, arrays and plain objects wherever possible — templates mount components
  through `<x-import>` with HTML attributes, so exotic prop shapes don't survive the trip.
- Don't add a component that duplicates an existing one with a prop. Check
  [docs/components.md](docs/components.md) and `guidelines/system-audit.card.html` first.

Full checklist: [docs/authoring-components.md](docs/authoring-components.md).

## Changing tokens

1. Edit the right file in `tokens/` (`colors`, `typography`, `spacing`, `layout`, `effects`,
   `themes`, `base`).
2. If the token is semantic (a surface, text, border or tint role), add its `[data-theme="dark"]`
   and `[data-theme="contrast"]` counterparts in `tokens/themes.css`. **Brand hex values never
   change per theme** — only the semantic layer re-maps.
3. `npm run sync` to register it in the manifest and regenerate `docs/tokens.md`.

A component that reads a raw hex instead of a token is invisible to theming — that is exactly how
this system's chips ended up light-on-light in dark mode before the tint tokens existed.

---

## Accessibility floor

Every generated surface must clear this. It is not optional polish; the audience includes
students, families and Sesc staff across the whole country.

- **Contrast** ≥ 4.5:1 for body text, ≥ 3:1 for large text and UI borders. Pale accent tints
  (`--tint-*`) carry their paired `--tint-*-ink` foreground — never mix a tint with an arbitrary
  accent colour.
- **Focus is always visible.** The global `:focus-visible` ring is in `tokens/base.css`. Never set
  `outline: none` without an equally visible replacement.
- **Native control, hidden visually — never `display:none`.** A native input styled behind custom
  chrome uses `className="rede-control-input"` (see `tokens/base.css`); `display:none` removes it
  from the tab order and the accessibility tree. `npm run check` fails on this.
- **Keyboard**: everything interactive reachable with Tab, operable with Enter/Space. Tabs move
  with arrow keys, menus and dialogs close with Escape, dialogs trap focus and return it to the
  trigger.
- **Hit targets** ≥ `--hit-target-min` (44px) on touch surfaces.
- **Motion** stays inside `--duration-fast/base/slow` with standard easing. `prefers-reduced-motion`
  is already honoured globally — don't reintroduce animation that ignores it.
- **Images** carry real `alt` text in pt-BR, or `alt=""` when decorative. `<image-slot>` placeholders
  describe the shot needed.
- Reference card: `guidelines/accessibility.card.html`.

## Commands

```bash
npm run check    # integrity: files, manifest, bundle + brand.json freshness, token collisions, a11y
npm run sync     # after editing components, tokens, icons or motifs — regenerates everything
npm run icons    # rebuild Icon.jsx after vendoring a new Lucide SVG
npm run docs     # regenerate docs/components.md and docs/tokens.md only
npm run bind ../their-project              # copy the system into a consuming project
npm run bind ../their-project -- --check   # is their bound copy current?
```

`docs/components.md`, `docs/tokens.md` and `brand.json` are **generated**. Edit the `.d.ts`,
`tokens/*.css` and `docs/brand-manual.md` they come from, never the output. `build-brand.mjs`
cross-checks the palette hex and CMYK in `tokens/colors.css` against the manual's published table
and warns on any drift — that guard is the reason known gap 9 cannot happen twice.

## Definition of done

- [ ] `npm run check` passes.
- [ ] No raw hex, font stack, radius, shadow or duration outside `tokens/`.
- [ ] Copy is pt-BR, sentence case, no emoji, no invented Sesc figures.
- [ ] Keyboard path walked end to end; focus visible at every stop.
- [ ] Looks right in `[data-theme="dark"]` and `[data-theme="contrast"]`, not just light.
- [ ] Placeholder content (imagery, figures, addresses) is flagged to the user, not left to pass as real.

## Known gaps — say these out loud when they matter

These are open caveats in the source material, not bugs to fix silently. The brand manual has since
been supplied and is extracted in [docs/brand-manual.md](docs/brand-manual.md) — check there before
repeating any of these to a user.

1. **No photography is available to this repo** — every image is still an `<image-slot>` placeholder
   with a shot brief. The manual *does* contain six full-bleed documentary plates, so a photographic
   direction now exists (see `docs/brand-manual.md`): real classrooms, natural light, candid, wide
   or overhead, students in Sesc uniform, visibly plural and inclusive, no filters or gradients.
   Follow that direction in shot briefs. The plates themselves are photographs of identifiable
   children with unknown usage rights — do not extract them into this repo, and never generate
   synthetic imagery in their place.
2. **Print colour is solved** — the manual publishes CMYK for all 20 palette values
   (`docs/brand-manual.md`). Pantone numbers are still absent; the manual defers to Formula Guide
   comparison, so ask before committing to a spot-colour job.
3. **The Sab.IA platform URL is unknown** — `PlatformEntry` links to `#` until Sesc supplies it.
   Everything else about the platform is now specified — see [docs/sabia-platform.md](docs/sabia-platform.md).
4. **Sesc supplied the motif in three hue families only** (green, blue, pink). Purple, orange and
   yellow are now reached by `BrandMotif`'s `hue` prop, which restates a construction using the
   manual's published palette — the design owner authorised this rather than waiting for new
   artwork. Say so when it matters: those three are *derived*, not supplied, and official artwork
   should still replace them if Sesc produces it. The full-bleed **patterns** are a different set
   and come in four hues: blue, green, orange, pink.
5. **The manual covers brand, not layout** — it specifies the selo, palette, typeface, motif, voice
   and digital presence. It contains **no** column grid, margins, baseline, type scale, icon set,
   component specs, accessibility floor or dark mode. Everything in this repo at that level is
   original system work; say so when it matters.
6. **Icons are Lucide, not an official Sesc set** — the manual has no iconography at all. If a set
   exists, swap the vendored SVGs and re-run `npm run icons`; no page changes needed.
7. **The only real Sesc product surface available is Sab.IA** — its login, header and footer are
   published in the manual and documented in `docs/sabia-platform.md`. The rest of the components
   and the UI kit remain original standard patterns sized to the brand, not a recreation.
8. **favicon.png / og-image.png are still composited from the old rasters** — regenerate them from
   the vectors before launch.
9. **Never re-sample colour from the artwork files.** The supplied vectors and
   `uploads/REDE_SESC_selo_COR.pdf` sit 1–3 points below the manual's published hex. The manual
   wins. This drift is what put the palette off-spec once already.

Full list with context: [readme.md](readme.md#caveats--asks).
