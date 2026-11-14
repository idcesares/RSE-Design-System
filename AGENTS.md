# AGENTS.md — working in the Rede Sesc de Educação design system

This repo is the brand + UI source of truth for the **Rede Sesc de Educação**, Sesc's national
network of schools and educational programmes in Brazil. It exists to be *consumed*: agents and
designers use it to generate marketing sites, program pages, enrollment flows, decks and print
artwork that all look like one institution.

This file is the rules and the routing. The detail lives in the doc each row points to.

| Task | Start at |
| --- | --- |
| Build a page, site or prototype | [Building a page](#building-a-page) |
| Build a deck, pitch, poster, social card or other artwork, in any stack | [DESIGN.md](DESIGN.md), then [Building artwork](#building-artwork) |
| Build something ambitious: interactive, animated, data-rich or 3D, a showpiece, a diagram | [Creative latitude](#creative-latitude) |
| Add or change a component | [Changing a component](#changing-a-component) |
| Change tokens / brand foundations | [Changing tokens](#changing-tokens) |
| Put this system into another project | [docs/integration.md](docs/integration.md) |
| Find a file, or pick static HTML vs React vs non-browser | [docs/repo-map.md](docs/repo-map.md) |
| Improve the system itself (roadmap work) | [docs/roadmap/roadmap.md](docs/roadmap/roadmap.md) |

Before you ship anything, run `npm run check`.

---

## Non-negotiables

The invariants: everything not listed here is craft, and craft is yours. Each rule names what
enforces it; "review" means no script can, so you are the check. Full wording and reasoning:
[docs/non-negotiables.md](docs/non-negotiables.md).

1. **Tokens only.** No raw hex, font stack, radius, shadow or duration in a component or page:
   `var(--rse-…)`. `--rse-color-*` are roles; `--rse-brand-*` is the palette, for artwork and the
   token source only. *Check:* `check-ds` (raw hex in components, every `var()` defined),
   `build-css` (raw colour in component CSS), `audit` ratchet (component and page debt).
2. **The name says the category**: `--rse-<category>-<role>`, everything prefixed `--rse-` /
   `.rse-` / `data-rse-theme` so it never collides with a host. *Check:* `check-ds` (token scheme,
   no pre-2.0 names, one name one meaning, class contract).
3. **Montserrat only**, 400–900. Headings ExtraBold 800, tight tracking. Eyebrows Bold, uppercase
   (`.rse-eyebrow`) — the only uppercase in the system. *Check:* `check-ds` (font stacks); review.
4. **pt-BR for everything a person reads; English for everything the system is made of** (files,
   tokens, props, script output, these docs). `<html lang="pt-BR">`, sentence case. *Check:* axe
   (`lang`), `check-composition` (exemplars); copy is review.
5. **No emoji, no hand-drawn icons.** Every glyph is `Icon` (vendored Lucide, `npm run icons`).
   Diagrams and illustrations from palette geometry are craft. *Check:* `audit`
   (`componentGlyphIcons`), `check-composition` (emoji), `build-icons --check`.
6. **Never invent Sesc facts** — counts, addresses, fees, dates, testimonials are examples: keep
   them visibly placeholder and tell the user what needs verification. *Check:* review.
7. **Never invent imagery.** No real photography exists yet: `<image-slot>` with a `placeholder`
   shot brief. *Check:* review.
8. **Accessibility is part of done** — [the floor](#accessibility-floor). *Check:* contrast gate,
   axe, keyboard tests.
9. **The selo**: three versions, fixed geometry, palette colours only, clearspace X, minimum
   150 px / 45 mm, never locked up with the Sesc signature. *Check:* review against
   [docs/brand-manual.md](docs/brand-manual.md) and `assets/logos/README.md`.
10. **The motif**: the six signature constructions keep their supplied geometry; generated shapes
    come only from the motif engine. One focal construction per composition, at most 25 %, about
    0.3 opacity behind content, never text on cells; patterns are flat fields. Purple, orange and
    yellow signature artwork and every generated shape are derived — say so. *Check:*
    `build-motifs`/`build-patterns --check`, `test-motif-engine`, `check-motif-contrast`.
11. **Sab.IA is the platform, the Rede is the network.** Learning lives in Sab.IA; enrollment in the
    TOTVS portal. Link with `PlatformEntry` ([docs/sabia-platform.md](docs/sabia-platform.md)).
    *Check:* review.

---

## Creative latitude

Inside the invariants you are expected to **design**, not fill in a template: choose the concept,
structure, motion and interaction that make *this* piece excellent. Subtle palette gradients and
depth are welcome in artwork, artifacts and page heroes or bands (contrast at the worst stop; never
on the selo or the constructions; UI component CSS stays flat). Dense is fine when the job is dense.
Pick the profile and tools in [docs/composition/creative-latitude.md](docs/composition/creative-latitude.md);
the how-to is [docs/composition/artifact-craft.md](docs/composition/artifact-craft.md). Look at it
running before you hand it over, and say what is placeholder, derived or new.

---

## Consuming the system

- **Static HTML** (decks, mocks, artifacts — the default): link `styles.css`, load React 18 UMD from
  `assets/vendor/`, then `dist/rse.js`; components are on `window.RSE`. Start from `starters/`.
- **React**: `import { Button } from '@idcesares/rse-design-system'` and its `styles.css`. Never
  import a component file directly (`check-ds` forbids it).
- **Not a browser**: `brand.json` (palette with CMYK, rules, assets) or `dist/tokens.json`.
- **Tools and agents**: `dist/components.json` lists every component's props, values and classes.

`dist/rse.js` is a copy of the component sources: edit a component without `npm run sync` and every
static page runs the old code (`npm run check` catches it). Map of every file: [docs/repo-map.md](docs/repo-map.md).

---

## Building a page

1. Start from the closest template — `templates/landing-page/`, `templates/program-page/`,
   `templates/enrollment-form/` — or `starters/page.html`. Copy the folder and edit the one `base`
   line in its `ds-base.js`; templates render with `templates/runtime.js`.
2. Compose from the 43 components before writing markup ([docs/components.md](docs/components.md)),
   and lay out with the primitives: `.rse-container`, `.rse-section`, `.rse-stack`, `.rse-cluster`,
   `.rse-grid`, `.rse-eyebrow`.
3. Cream page, white cards. A band is purple or indigo with white text, or a light/mid accent with
   ink text — never white on an accent, never a `-dark` accent as a band; one band colour per section.
4. Copy: short declarative sentences, "você", the slogan **"Aprender para a vida acontecer"**.

Full checklist: [docs/recipes.md](docs/recipes.md#building-a-page--the-checklist).

## Building artwork

Start at [DESIGN.md](DESIGN.md), written for any stack. In this repo: decks from
`templates/institutional-deck/`, posters from `starters/poster.html`. Palette colour only, no stock
or generated photography, one focal construction. Details: [docs/recipes.md](docs/recipes.md#building-artwork-in-html).

## Changing a component

A component is `Name.css` (the contract: look and every state), `Name.js` (a React wrapper in
`createElement` form, no JSX), `Name.d.ts` (one prop per line, a doc comment on each), `Name.prompt.md`
(usage, pt-BR example, plain-HTML markup) and a demo in `showcase/demos.js`. Nothing visual lives
only in JavaScript. A new one is registered in `rse.manifest.json` and `index.js`; a hook means
`'use client'` on line 1. Re-skin points are component tokens (`--rse-button-*`, `--rse-input-*`,
`--rse-card-*`). Then `npm run sync && npm run check`. Full rules:
[docs/authoring-components.md](docs/authoring-components.md).

## Changing tokens

Edit `tokens/src/*.tokens.json` (DTCG) and nothing else: `brand` (tier 1), `color`, `typography`,
`layout`, `effects` (tier 2), `component` (tier 3, aliases of tier 2). Brand values never change per
theme. Text on a new surface goes in `scripts/contrast-pairs.mjs`. Then `npm run sync && npm run check`.
Details: [docs/authoring-components.md](docs/authoring-components.md#changing-tokens).

---

## Accessibility floor

- **Contrast** ≥ 4.5:1 body text, ≥ 3:1 large text and control borders — gated in three themes.
  Tints carry their `-ink` foreground; status colours have surface / text / indicator roles.
- **Focus always visible**; never `outline: none` without an equal replacement.
- **Native control, visually hidden** (`rse-control-input`) — never `display:none`.
- **Keyboard**: Tab reaches everything, Enter/Space operates it, tabs use arrows, Escape closes
  menus and dialogs, dialogs trap and return focus. **Hit targets** ≥ 44 px.
- **Motion** honours `data-rse-motion`: UI within 360 ms; artwork has a freer tier with a reduced
  form, a final frame, a pause control and no flashing.
- **Images**: real pt-BR `alt`, or `alt=""` when decorative.

Full checklist: [docs/guidelines.md](docs/guidelines.md#accessibility-floor).

---

## Commands

```bash
npm run check             # integrity, freshness, contrast gate, class contract, debt ratchet — must pass
npm run sync              # after editing tokens, components, icons or motifs — regenerates everything
npm run audit             # quality scorecard (-- --update-baseline after lowering a debt count)
npm run test:pages        # every page in Chromium: errors, axe, 360 px overflow (needs playwright, axe-core)
npm run test:motion       # the motion contract in a browser
npm run test:contracts    # component forwarding, keyboard, container queries
npm run test:applications # template filters, slides, print output
npm run test:consumer     # npm pack → scratch project → import and server-render (needs react)
npm run test:types        # public .d.ts under strict, with misuse that must fail (needs typescript)
npm run icons | motifs | patterns | pack
```

Generated, never edited by hand: `tokens/tokens.css`, `dist/*`, `brand.json`, `docs/components.md`,
`docs/tokens.md`, `showcase/showcase-data.js`, `Icon.js`, `BrandMotif.js`. **Releasing**: bump
`package.json`, add `## <version>` to `CHANGELOG.md`, push `v<version>` (or run the `release`
workflow on main). Breaking a token or prop name is a major.

## Definition of done

- [ ] `npm run check` passes (contrast gate and debt ratchet included).
- [ ] Touched motion? `npm run test:motion`. Touched a component? `npm run test:contracts`.
- [ ] Lowered a debt count? `npm run audit -- --update-baseline` in the same change.
- [ ] No raw hex, font stack, radius, shadow or duration outside `tokens/`.
- [ ] Copy is pt-BR, sentence case, no emoji, no invented Sesc figures.
- [ ] Keyboard path walked end to end; focus visible at every stop.
- [ ] Right in `data-rse-theme="dark"` and `"contrast"`, and at 360 px wide.
- [ ] Placeholder content (imagery, figures, addresses) is flagged to the user.

## Known gaps

Open caveats to say out loud when they matter — photography, Pantone, the Sab.IA URL, derived motif
hues, layout being system work, icons, favicon rasters, never re-sampling colour:
[docs/known-gaps.md](docs/known-gaps.md).
