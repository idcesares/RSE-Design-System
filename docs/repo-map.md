# Repo map and consumption modes

Where everything lives, and the three ways the system is consumed. Routing and rules are in
[AGENTS.md](../AGENTS.md); putting the system into another project is [integration.md](integration.md).

## Repo map


```
AGENTS.md                 You are here: rules, routing, recipes, definition of done.
DESIGN.md                 Entry for decks, pitches, posters, social cards and other non-web artwork, in any
                          stack. Routes by intent to docs/composition/ (creative-latitude, artifact-craft,
                          principles, modules, archetypes, formats.json, rubric, exemplars).
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
components/layout/        Layout primitives, plain classes with no React wrapper: .rse-container,
                          .rse-section, .rse-stack, .rse-cluster, .rse-grid, .rse-eyebrow.
dist/components.css       GENERATED. All of them in @layer rse.components.
styles.css                Everything above. The one stylesheet for a page that should look like the Rede.
dist/                     GENERATED. rse.js (every component on window.RSE), tokens.json (resolved
                          per theme), tokens.js + tokens.d.ts (typed module), components.json (the
                          component catalog: props with their values, classes, files — read this
                          instead of four files per component).
brand.json                GENERATED. The brand contract for non-browser consumers: palette with
                          CMYK, tokens per theme, scales, assets by role, machine-readable rules.
index.js / index.d.ts     React entry. Import components from here, never from a component file.
components/<group>/       43 components: Name.js + Name.d.ts + Name.prompt.md (+ Name.css on the contract).
                          Icon.js and BrandMotif.js are GENERATED — edit their sources.
                          MotifEngine.js is a function library (motif geometry to SVG), no markup.
templates/                Four starting points (deck, program page, enrollment form, landing page). Working
                          HTML starters; the quality reference for artwork is docs/composition/exemplars/.
starters/                 Blank, dependency-free starting points: page, React page, A3 poster.
showcase/index.html       The system as one page, for leadership and newcomers. Opens offline.
docs/brand-manual.md      What the official manual specifies. Settle brand questions here.
docs/guidelines.md        The system's own rules for imagery, motion, theming and accessibility.
docs/integration.md       How a project that is not this repo uses the system.
docs/known-gaps.md        Open caveats to say out loud.
docs/roadmap/             The assessment and the plan; read before improving the system itself.
docs/                     Generated component + token references, recipes, authoring, QA checklist.
scripts/                  build-tokens, build-icons, build-motifs, build-bundle, build-brand, build-catalog, gen-docs,
                          build-showcase, check-ds, check-composition (+ test-composition), render-exemplars (author tool),
                          audit (+ contrast-pairs), pack-static, test-* (browser, consumer, types).
rse.manifest.json         Machine index: components, the showcase card, templates, tokens, themes, fonts.
assets/logos/             Official vector lockups (Rede + Sab.IA); originals in source/. Read its README.
assets/motifs/            Official cubo impossível artwork and its six constructions.
assets/patterns/          Four full-bleed cube pattern backgrounds.
assets/icons/lucide/      Vendored Lucide set (ISC) that Icon.js is generated from.
assets/vendor/            React 18 UMD, so static pages run offline.
uploads/                  Original source material (selo PDFs, reference screenshots). Read-only.
```

## The three consumption modes
**Static HTML (decks, mocks, artwork, anything you hand the user as a file).** Link `styles.css`,
load React 18 UMD from `assets/vendor/` and then `dist/rse.js`, and read components off
`window.RSE`. No build step. This is the default for artifacts. Start from [starters/](../starters/). An
artifact that needs a library (Three.js, D3, GSAP) loads it from a pinned CDN version or vendors it;
see [artifact craft](composition/artifact-craft.md).

**React project (production code).** Install `@idcesares/rse-design-system` and import from the
package root:

```jsx
import { Button, Card, Stat, Tabs } from '@idcesares/rse-design-system';
import '@idcesares/rse-design-system/styles.css';
```

Never import a component file directly — `npm run check` forbids it inside this repo, so that a
component can be re-implemented (roadmap P2) without breaking consumers.

**Anything that is not a browser** (a Python generator, a print pipeline, a design tool). Read
[`brand.json`](../brand.json) for the brand (palette with CMYK, rules, assets by role) or
`dist/tokens.json` for every token resolved per theme. Both are generated. Worked example:
[examples/social_post.py](examples/social_post.py), a 1080×1080 social post rendered with
the Python standard library and nothing else.

Putting the system into another project — npm, the static kit for CMSs, Python: see
[integration.md](integration.md).

> `dist/rse.js` is a **copy of the component sources, not a second implementation**. Editing a
> component `.js` without running `npm run sync` means every static page keeps running the old code.
> `npm run check` catches this.
