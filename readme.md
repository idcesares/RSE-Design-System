# Rede Sesc de Educação — Design System

## Sources
- Brand brief (pasted by user): purpose, positioning, slogan, tone of voice, keywords, color palette, typography.
- **Official vector artwork** (`assets/logos/source/`, `assets/motifs/`, `assets/patterns/`): the Rede Sesc de Educação lockups in black, white, outline and full colour; the Plataforma Sesc Sab.IA lockups; the *cubo impossível* constructions; four cube pattern backgrounds. **These are the authority for the palette and the marks.**
- **Plataforma Sesc Sab.IA institutional reference document** — purpose, ecosystem, functionality, governance. Summarised in [docs/sabia-platform.md](docs/sabia-platform.md).
- Screenshot of the current Sab.IA login screen (pre-redesign reference).
- `uploads/REDE_SESC_selo.pdf`, `uploads/REDE_SESC_selo_COR.pdf` — the original rasterised selo PDFs, now superseded by the vectors.
- `uploads/pasted-*.png` — reference screenshots pasted by the user.
- No Figma file or production codebase was attached — the components and UI kit remain original work sized to the brand.

## What is the Rede Sesc de Educação?
The Rede Sesc de Educação is Sesc's (Serviço Social do Comércio) national network of schools, projects, and educational initiatives across Brazil. It exists to consolidate the perception of a single, integrated national system — not a loose collection of local schools — that shares one educational vision while respecting each region's specifics.

**Purpose:** consolidate the Rede as an integrated national presence, reinforcing education as central to Sesc's mission and showing the real impact of education on people's lives.

**Positioning:** the integration of tradição (tradition), acolhimento (welcome/care), and resultado (results). Education is close, relevant, and consistent — it welcomes in order to develop, and develops in order to produce real outcomes. The student is the protagonist.

**Slogan:** "Aprender para a vida acontecer" ("Learning for life to happen") — echoes the institutional Sesc concept "A vida acontece com o Sesc."

**Audience:** commerce/services/tourism workers and their dependents (Sesc's core constituency), plus students, families, Sesc staff, sector employers, and the general public.

**Brand attributes:** Tradição, Acolhimento, Resultado.

## Components (36 built — brand-guidelines-only, so a standard primitive set sized to an educational marketing site)
Core: **Button**, **IconButton**, **Icon**, **Badge**, **Tag**, **Card**, **Avatar**, **Divider**
Brand: **BrandMotif**
Forms: **Input**, **Textarea**, **Select**, **Checkbox**, **Radio**, **Switch**, **Stepper**, **FilterChips**, **FileUpload**, **DateField**
Navigation: **Tabs**, **Breadcrumb**, **Pagination**, **Navbar**, **Footer**, **Menu**
Feedback: **Toast**, **Tooltip**, **Alert**, **Spinner**, **ProgressBar**, **Skeleton**
Data: **DataTable**, **Stat**
Disclosure: **Accordion**
Overlay: **Modal**

### Intentional additions
No component source (Figma/codebase) was provided, so this is a from-scratch standard set chosen for the network's marketing/enrollment use case. `Card` was prioritized for program/school listings; `Tabs` for filtering program levels; `Toast`/`Tooltip` included for completeness even though not yet seen in any real Sesc screen — treat these as a reasonable starting point, not a verified recreation.

**Second pass additions:** `Avatar`, `Divider`, `Alert` (persistent inline banner, vs. `Toast`'s transient float), `Spinner`, `ProgressBar`, `Modal`, `Breadcrumb`, `Pagination`, and reusable `Navbar`/`Footer` primitives (the ui kit's bespoke `SiteHeader`/`SiteFooter` were one-off compositions; these are the promoted, string/array-prop primitives behind that same visual pattern, meant for reuse in new pages/templates).

**Third pass (audit) additions:** **Accordion** (FAQ / progressive disclosure — the most-needed missing pattern for an education site), **DataTable** (turmas, schedules, unit and fee listings), **Stat** (impact figures, the "resultado" pillar made visible), **Stepper** (enrollment / document-upload flow progress), **Textarea** (long-answer enrollment and contact fields), **Skeleton** (loading states that keep layout stable). Foundations gained `tokens/layout.css` (breakpoints, container widths incl. `--container-prose`, 12-col grid, section rhythm, z-index scale, 44px hit-target), semantic tint surfaces + a 6-step data-viz sequence + state layers in `tokens/colors.css`, and global `:focus-visible`, `::selection`, `prefers-reduced-motion` and print handling in `tokens/base.css`. New guideline cards: **Layout, containers & z-index**, **Motion & interaction**, **System audit & roadmap**.

**Fourth pass (completion) additions:** **Menu** (dropdown for national + regional navigation and row actions), **FilterChips** (program/unit search filters), **FileUpload** (enrollment documents, drag-and-drop + keyboard), **DateField** (birth dates and enrollment deadlines), **BrandMotif** (geometric placeholder for the brief's "cubo impossível"). Foundations gained `tokens/themes.css` — a `[data-theme="dark"]` and `[data-theme="contrast"]` layer that re-maps semantic tokens only (brand hexes never change). New cards: **Cubo impossível motif**, **Photography & imagery**, **Theming: dark & high contrast**, **Menu**, **FilterChips/FileUpload/DateField**. Three new templates: institutional deck, program detail page, printable A4 enrollment form.

## UI Kit
`ui_kits/site/` — a 3-screen recreation of a plausible Rede Sesc de Educação marketing site (Home, Programas, Unidades), built from the components above: sticky header, hero, stats, program cards, testimonial, enrollment dialog, unit finder, footer. This is an **original composition** (no real Sesc site was provided as source) using the brand's colors, type, slogan, and selo — not a copy of an existing site.

## Templates
All four load the system through a sibling `ds-base.js`; edit its one `base` line when copying into a consuming project.
- `templates/institutional-deck/` — 9-slide institutional presentation (1920×1080, print/PPTX-ready via `deck-stage.js`): cover, agenda, positioning, three pillars, national reach, programs, testimonial, enrollment steps, closing.
- `templates/program-page/` — program/unit detail page: sticky header, hero with enrollment window, stat band, program detail, turmas table, filter chips, FAQ accordion, unit block with inline enrollment stepper, footer.
- `templates/enrollment-form/` — printable two-page A4 matrícula form (`doc-page.js`): student and guardian data, category, document checklist, health/accessibility notes, LGPD terms and signatures.
- `templates/landing-page/` — a starting-point marketing landing page (announcement bar, hero, stats band, 3-up program cards, CTA band, footer) built entirely from the components above via `<x-import>`, so consuming projects get a working page in one copy instead of assembling primitives from scratch.

## Foundations
- `tokens/themes.css` — `[data-theme="dark"]` and `[data-theme="contrast"]` semantic overrides.
- `tokens/layout.css` — breakpoints, container widths, grid, section rhythm, z-index scale, hit-target minimum.
- `tokens/colors.css` — 20 official brand hex values (cream, indigo, and 6 accent families × light/mid/dark) plus semantic aliases and neutrals.
- `tokens/typography.css` — Montserrat type scale, weights, tracking. Body **size** is `--text-body-md`; `--text-body` is the body **colour** (they used to collide — see `CHANGELOG.md`).
- `tokens/spacing.css`, `tokens/effects.css` — spacing scale, radii, shadows, easing/duration.
- `tokens/fonts.css` — Montserrat variable webfont `@font-face`.
- `styles.css` — root import manifest (do not add rules here directly).

## Assets
`assets/logos/` — **official vector lockups**: `wordmark-purple/black/white.svg`, `badge-solid.svg`, `badge-outline.svg`, and the Sab.IA set (`sabia-wordmark-purple/cream.svg`, `sabia-horizontal-colour.svg`). Originals and the approved colour sheets are kept in `assets/logos/source/`. See `assets/logos/README.md`.
`assets/motifs/` — the official *cubo impossível* artwork plus its six constructions, split by `scripts/build-motifs.mjs`.
`assets/patterns/` — four full-bleed cube pattern backgrounds (blue, green, orange, pink).
`assets/icons/lucide/` — the vendored Lucide icon set (ISC) that `components/core/Icon.jsx` is generated from. See `assets/icons/README.md`.
`assets/logo-*.png` — the superseded raster extractions, kept only so older pages keep rendering.
`assets/favicon.png`, `assets/og-image.png` — favicon and social-share image, composited from the existing official lockups (no new marks invented) — swap in production if Sesc has approved dedicated favicon/OG artwork.
`assets/fonts/` — Montserrat variable webfonts (Google Fonts substitute, see Caveats).

## Index
- `AGENTS.md` — **start here when building anything**: rules, repo map, recipes, commands, definition of done.
- `readme.md` — this file: brand brief, voice, visual foundations, caveats.
- `docs/` — `components.md` and `tokens.md` (both generated — run `npm run docs`), plus `recipes.md`, `authoring-components.md`, `quality-checklist.md`.
- `index.js` / `index.d.ts` — public import surface for React consumers.
- `starters/` — blank starting points: static page, React page, A3 poster.
- `scripts/` — `check-ds.mjs` (integrity), `sync-bundle.mjs`, `sync-tokens.mjs`, `gen-docs.mjs`. Run `npm run check` before handing work over.
- `CHANGELOG.md` — what changed and why, including the defects fixed in the 1.1.0 soundness pass.
- `tokens/` — CSS custom properties.
- `guidelines/*.card.html` — foundation specimen cards (Colors, Type, Spacing, Brand, Accessibility).
- `components/{brand,core,data,disclosure,feedback,forms,navigation,overlay}/` — 36 React primitives, each with `.jsx` + `.d.ts` + `.prompt.md`, plus one or more `*.card.html` per directory.
- `templates/{institutional-deck,program-page,enrollment-form,landing-page}/` — four starting points (deck, detail page, printable form, landing page).
- `ui_kits/site/` — marketing site recreation (`index.html`, `app.js`, `SiteHeader.js`, `SiteFooter.js`, `EnrollDialog.js`).
- `showcase/index.html` — **the system presented as one page**, for showing to leadership or onboarding someone new. Opens by double-click, no build. Live components from `_ds_bundle.js`, palette and CMYK from `brand.json`, contrast ratios measured from the live DOM, and the four templates running in frames. See `showcase/README.md`.
- `templates/landing-page/` — reusable landing-page starting point (`LandingPage.dc.html` + `ds-base.js`).
- `thumbnail.html` — homepage tile.
- `SKILL.md` — Claude Code / Agent Skills portable version of this system.

## Content fundamentals
**Voice:** Clara (clear, no unnecessary complexity), Próxima (close to people's everyday lives), Consistente (aligned to the national Rede and Sesc positioning), Relevante (tied to real life and current challenges), Confiável (backed by Sesc's institutional credibility).

**Person:** speaks directly to the reader/family ("você", implied second person) about their life and choices — not a distant institutional "we announce." The slogan itself frames education as something that happens *to and with* the student's life ("para a vida acontecer").

**Casing:** sentence case for headlines and body; short, upper-case tracked-out eyebrows (e.g. "REDE SESC DE EDUCAÇÃO") as a section label above headlines — the one place all-caps is used.

**Emoji:** none. This is an institutional, credibility-driven brand; emoji would undercut Tradição and Confiável.

**Vibe:** warm but not cute; confident but not promotional. Reads like a respected national institution talking about real outcomes in real students' lives — not a startup, not a government form.

**Example headline pattern:** "Aprender para a vida acontecer" (slogan) / "Educação que acolhe, forma e transforma" (supporting line) — short declarative phrases, verbs of transformation (acolhe, forma, transforma, desenvolve), never hedged or vague.

**Avoid:** excessive technical/pedagogical jargon, distant or impersonal tone, generic undifferentiated messaging, promotional exaggeration, promises the network can't back up in practice.

**Keywords to draw on:** educação, rede, acolhimento, resultado, tradição, protagonismo, inovação, formação integral, oportunidades, excelência, cidadania, futuro, colaboração, acessibilidade, inclusão, tecnologia, transformação, diversidade, integração, identidade, conexão, pluralidade, possibilidades.

## Visual foundations
**Color:** Primary is brand purple `#6c62c4` (the selo's ink colour), paired with deep indigo `#4c549e` as a secondary/deep accent. Six accent hue families (pink, orange, yellow, green, blue, purple) each ship 3 shades (light/mid/dark) for tags, illustration, and data — this is the "rede" palette representing the plurality of programs/territories, not a single-accent brand. Page background is warm cream `#f2f4e4`, never pure white — cards sit on white (`--surface-card`) for contrast. Feature/CTA bands are brand purple or indigo with white text, or a light or mid accent with ink text (`--color-ink`) — never white text on an accent, never a `-dark` accent or mid purple as a band. Small text on tints uses the derived `--color-<hue>-ink` steps, never the `-dark` tones (see `docs/roadmap/assessment.md`, F2).

**Type:** Montserrat only, all weights 400–900. Headings are Extrabold (800) with slightly tight tracking (`-0.02em`); eyebrows are Bold (700), uppercase, wide-tracked (`0.14em`) — the only uppercase usage. Body copy is Regular/Medium at generous line-height (1.6) for legibility.

**Spacing:** 4px base scale (4/8/12/16/24/32/48/64/96/128). Section rhythm is generous (48–96px between major blocks) reflecting an institutional, unhurried pace rather than a dense product-UI feel.

**Backgrounds:** flat colour fields (cream page, solid purple feature bands) — no gradients, no drop shadows beyond the shadow tokens. For **pages**, bands follow the ink-on-colour rule above, one band colour per section. For **print and social artwork** the manual does sanction full-bleed accent colour fields carrying the selo in negative, and full-bleed cube patterns from `assets/patterns/`.

**Photography:** the manual's own plates set the direction — documentary, natural light, real classrooms, candid, wide or overhead framing, students in Sesc uniform, visibly plural and inclusive, no filters or gradients. No usable photographs exist for this repo, so the UI kit uses `<image-slot>` placeholders whose `placeholder` text is the shot brief, per the "never invent imagery" rule.

**Animation:** none specified in the source. Components use short, standard-ease transitions only (hover/press state changes at 150–220ms, `cubic-bezier(.4,0,.2,1)`) — no bounces, no scroll-triggered motion.

**Hover/press states:** hover shifts to a slightly darker/tinted variant of the same color (never a totally different hue); press states scale buttons down subtly (0.97) rather than changing color further. Cards lift (translateY + shadow increase) on hover rather than changing background.

**Borders & shadows:** borders are thin (1–1.5px) and subtle (`--border-subtle`/`--border-default`), used mostly on form fields and card outlines rather than as a primary structuring device. Shadows are soft and low-contrast (`--shadow-sm/md/lg`), reserved for cards and modals — no hard drop shadows, no neumorphism, no colored shadows.

**Corner radii:** pill (999px) for buttons/badges/tags — reflects a friendly, approachable read; medium (14px) for inputs/toasts; large (24–32px) for cards and hero imagery. No sharp 0px corners anywhere in UI chrome.

**Cards:** white surface on the cream page, 24px radius, subtle border + soft shadow, image at 16:10, content padded generously (24px), optional colored Tag chip above an uppercase eyebrow and a bold title.

**Transparency/blur:** used sparingly — the sticky header uses a translucent cream background with light backdrop-blur so content scrolls beneath it without fully obscuring it. No modal-glass or oversized blur elsewhere.

**3D/impossible-cube motif:** the brief calls for a "cubo impossível" (impossible cube) motif suggesting reach, expansion, flexibility, and lateral thinking. **The official artwork is now in the system** (`assets/motifs/`, `components/brand/BrandMotif.jsx`) as six constructions — cube, interlock, bar, frame, chain, hollow — in the green, blue and pink face-shaded families. The geometry is never redrawn, rotated or distorted, and the motif does not re-map per theme, exactly like the logo. Its **hue** does alternate: `BrandMotif` takes a `hue` prop that restates a construction in any of the six palette families, so purple, orange and yellow are reachable without new artwork. Ramps come from the manual's published palette (never sampled off the artwork) and preserve each face's luminance rank, which is what keeps the impossible cube reading as a solid. Full-bleed cube fields use `assets/patterns/`.

## Iconography
No official Sesc icon set was supplied, so the system adopts **[Lucide](https://lucide.dev) (ISC licence)** — chosen because its drawing spec (24×24 grid, 2px stroke, `currentColor`) is exactly the spec this system already required, so nothing had to be restyled. 97 glyphs covering education, enrollment, units, results and the Sab.IA platform are vendored in `assets/icons/lucide/`, and `components/core/Icon.jsx` is generated from them by `scripts/build-icons.mjs`. Pass an `<Icon>` to `Button`/`IconButton` via their `icon` prop. **No emoji, no unicode-as-icon usage, and never a hand-drawn one-off SVG** — vendor the glyph and regenerate. See `assets/icons/README.md`.

## Caveats & asks

The official brand manual (*Manual da Rede Sesc de Educação*, Sesc DN 2026, 98pp) has now been
supplied and is extracted in **[docs/brand-manual.md](docs/brand-manual.md)** — settle any brand
question there first.

**Closed by the manual**

1. **Print colour.** CMYK is published for all 20 palette values and is recorded alongside each token in `tokens/colors.css`. Print work can now be colour-managed. Pantone numbers are still absent — the manual defers to Formula Guide comparison, so ask before a spot-colour job.
2. **Palette accuracy.** Every brand hex is now the manual's published value. The earlier pass corrected them against the supplied vectors, which was the wrong authority: those vectors sit 1–3 points below the spec. **Never re-sample colour from artwork.**
3. **Selo rules.** Three sanctioned versions, clearspace of X on all sides (X = height of the E stem), minimum 45 mm print / 150 px digital, ~25 sanctioned colour combinations, and a required distance from the Sesc signature. See `assets/logos/README.md`.
4. **Sab.IA.** The manual publishes the platform's palette (three colours, all Rede values) and real login, header and footer screens. See [docs/sabia-platform.md](docs/sabia-platform.md). Its chrome is **blue**, not purple.

**Still open**

5. **Photography.** No usable photographs exist for this repo; every layout uses `<image-slot>` placeholders labelled with the shot needed. The manual does establish a photographic *direction* — documentary, natural light, real classrooms, candid, wide or overhead, students in Sesc uniform, visibly plural and inclusive, no filters. Write shot briefs to that direction. The manual's own plates are photographs of identifiable children with unknown usage rights: do not extract them, and never generate synthetic children in their place.
6. **The manual covers brand, not layout.** It has no column grid, margins, baseline, type scale, icon set, component specs, accessibility floor or dark mode. Everything in this repo at that level is original system work — say so when it matters.
7. **Sab.IA platform URL is unknown.** `PlatformEntry` links to `#` until Sesc supplies the production URL, and whether it should land on the public home or on login.
8. **Motif hue families.** Sesc supplied the six *constructions* in green, blue and pink only. Purple, orange and yellow are now produced by `BrandMotif`'s `hue` prop from the manual's published palette — authorised by the design owner. Present those three as *derived*, not supplied; official artwork should still replace them if Sesc produces it. (The full-bleed *patterns* are a separate set and do include orange.)
9. **Font substitution.** The manual specifies Montserrat but no font files were attached — this system uses the official Montserrat variable webfont from Google Fonts. If Sesc licenses a specific build/hinting, swap `assets/fonts/`.
10. **Icon system.** Lucide (ISC) is adopted, vendored and generated; the manual has no iconography at all. If Sesc supplies an official set, replace the vendored SVGs and re-run `npm run icons` — no component or page changes needed.
11. **No Sesc digital product beyond Sab.IA.** The components and UI kit are original, standard-pattern designs sized to the brand. If a Rede site or app exists, attach it so the UI kit can become a true recreation.
12. **Content placeholders in templates.** All figures, unit names, addresses and testimonials are marked examples. Verify every number against official Sesc data before presenting or publishing.
13. **favicon.png / og-image.png** are still composited from the old rasters — regenerate them from the vectors before launch.
