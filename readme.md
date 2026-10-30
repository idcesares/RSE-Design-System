# Rede Sesc de Educação — design system

The brand and UI foundation of the **Rede Sesc de Educação** and its learning platform, the
**Plataforma Sesc Sab.IA**: tokens, components, templates and rules for building sites, platforms,
print and social pieces that all read as one national network.

All 40 audited UI wrappers use a CSS class contract, with native attributes and refs forwarded by
React. The 43 manifest entries also include the generated Icon/BrandMotif wrappers and the
MotifEngine library. Plain HTML can use the same styles; interactive behavior needs a host
controller as documented in each component guide.

| You are… | Start at |
| --- | --- |
| Building something in this repo, or an agent | [AGENTS.md](AGENTS.md) |
| Making a deck, pitch, report, poster or social card, in any stack | [DESIGN.md](DESIGN.md) |
| Using the system from another project | [docs/integration.md](docs/integration.md) and [RULES.md](RULES.md) |
| Settling a brand question | [docs/brand-manual.md](docs/brand-manual.md) |
| Showing the system to someone | [showcase/index.html](showcase/index.html) (opens offline) |
| Improving the system itself | [docs/roadmap/](docs/roadmap/) |
| Learning from complete implementations | [docs/application-references.md](docs/application-references.md) |

```bash
npm install @idcesares/rse-design-system   # GitHub Packages; see docs/integration.md
```

**Sources.** The official *Manual da Rede Sesc de Educação* (Sesc DN, 2026), extracted with page
citations in [docs/brand-manual.md](docs/brand-manual.md); the official vector artwork in
`assets/`; the Sab.IA institutional reference ([docs/sabia-platform.md](docs/sabia-platform.md)).
The manual covers brand, not layout: the type scale, spacing, components, accessibility floor and
themes are original system work. Open caveats: [docs/known-gaps.md](docs/known-gaps.md).

## What the Rede is
The Rede Sesc de Educação is Sesc's (Serviço Social do Comércio) national network of schools, projects, and educational initiatives across Brazil. It exists to consolidate the perception of a single, integrated national system — not a loose collection of local schools — that shares one educational vision while respecting each region's specifics.

**Purpose:** consolidate the Rede as an integrated national presence, reinforcing education as central to Sesc's mission and showing the real impact of education on people's lives.

**Positioning:** the integration of tradição (tradition), acolhimento (welcome/care), and resultado (results). Education is close, relevant, and consistent — it welcomes in order to develop, and develops in order to produce real outcomes. The student is the protagonist.

**Slogan:** "Aprender para a vida acontecer" ("Learning for life to happen") — echoes the institutional Sesc concept "A vida acontece com o Sesc."

**Audience:** commerce/services/tourism workers and their dependents (Sesc's core constituency), plus students, families, Sesc staff, sector employers, and the general public.

**Brand attributes:** Tradição, Acolhimento, Resultado.

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
**Color:** Primary is brand purple `#6c62c4` (the selo's ink colour), paired with deep indigo `#4c549e` as a secondary/deep accent. Six accent hue families (pink, orange, yellow, green, blue, purple) each ship 3 shades (light/mid/dark) for tags, illustration, and data — this is the "rede" palette representing the plurality of programs/territories, not a single-accent brand. Page background is warm cream `#f2f4e4`, never pure white — cards sit on white (`--rse-color-surface-card`) for contrast. Feature/CTA bands are brand purple or indigo with white text, or a light or mid accent with ink text (`--rse-brand-ink`) — never white text on an accent, never a `-dark` accent or mid purple as a band. Small text on tints uses the derived `--rse-brand-<hue>-ink` steps (through `--rse-color-tint-<hue>-ink` and the `-text` roles), never the `-dark` tones (see `docs/roadmap/assessment.md`, F2).

**Type:** Montserrat only, all weights 400–900. Headings are Extrabold (800) with slightly tight tracking (`-0.02em`); eyebrows are Bold (700), uppercase, wide-tracked (`0.14em`) — the only uppercase usage. Body copy is Regular/Medium at generous line-height (1.6) for legibility.

**Spacing:** 4px base scale (4/8/12/16/24/32/48/64/96/128). Section rhythm is generous (48–96px between major blocks) reflecting an institutional, unhurried pace rather than a dense product-UI feel.

**Backgrounds:** cream page and solid purple feature bands by default; subtle palette gradients and depth are allowed on heroes, bands and artwork (palette stops only, contrast measured at the worst stop, never on the selo), no drop shadows beyond the shadow tokens in UI. For **pages**, bands follow the ink-on-colour rule above, one band colour per section. For **print and social artwork** the manual does sanction full-bleed accent colour fields carrying the selo in negative, and full-bleed cube patterns from `assets/patterns/`.

**Photography:** the manual's own plates set the direction — documentary, natural light, real classrooms, candid, wide or overhead framing, students in Sesc uniform, visibly plural and inclusive, no filters or gradients. No usable photographs exist for this repo, so the UI kit uses `<image-slot>` placeholders whose `placeholder` text is the shot brief, per the "never invent imagery" rule.

**Animation:** none specified in the source. UI state changes use short, standard-ease transitions (150–360ms, `--rse-ease-*`); brand motion (reveals 600ms, loaders and ambient loops 2.4s) uses `--rse-duration-reveal/loop` with assemble/settle easing. In UI components: no bounces and no parallax; scroll-triggered reveals play once, and ambient loops carry a pause control. Artwork and artifacts have a freer tier (choreography, longer timings, 3D) that still honours the reduced form. The `data-rse-motion` setting switches everything to a reduced form.

**Hover/press states:** hover shifts to a slightly darker/tinted variant of the same color (never a totally different hue); press states scale buttons down subtly (0.97) rather than changing color further. Cards lift (translateY + shadow increase) on hover rather than changing background.

**Borders & shadows:** borders are thin (1–1.5px) and subtle (`--rse-color-border-subtle`/`--rse-color-border-default`), used mostly on form fields and card outlines rather than as a primary structuring device. Shadows are soft and low-contrast (`--rse-shadow-sm/md/lg`), reserved for cards and modals — no hard drop shadows, no neumorphism, no colored shadows.

**Corner radii:** pill (999px) for buttons/badges/tags — reflects a friendly, approachable read; medium (14px) for inputs/toasts; large (24–32px) for cards and hero imagery. No sharp 0px corners anywhere in UI chrome.

**Cards:** white surface on the cream page, 24px radius, subtle border + soft shadow, image at 16:10, content padded generously (24px), optional colored Tag chip above an uppercase eyebrow and a bold title.

**Transparency/blur:** used sparingly — the sticky header uses a translucent cream background with light backdrop-blur so content scrolls beneath it without fully obscuring it. No modal-glass or oversized blur elsewhere.

**3D/impossible-cube motif:** the brief calls for a "cubo impossível" (impossible cube) motif suggesting reach, expansion, flexibility, and lateral thinking. **The official artwork is now in the system** (`assets/motifs/`, `components/brand/BrandMotif.jsx`) as six constructions — cube, interlock, bar, frame, chain, hollow — in the green, blue and pink face-shaded families. The six signature constructions preserve the supplied geometry: never redrawn, rotated or distorted, and they do not re-map per theme, exactly like the logo. **Generated shapes and motion** (six shapes, patterns, a loader) come only from the motif engine (`MotifEngine`, through `MotifPattern` and `MotifLoader`); they are system work, derived, not supplied by Sesc. Patterns are flat colour fields; one focal construction per composition, a pattern is a field and the loader is exempt. The signature **hue** can alternate: `BrandMotif` takes a `hue` prop that restates a construction in any of the six palette families, so purple, orange and yellow are reachable without new artwork. Ramps come from the manual's published palette (never sampled off the artwork) and preserve each face's luminance rank, which is what keeps the impossible cube reading as a solid. Full-bleed cube fields use `assets/patterns/`. By default each construction has a distinct brand family (see `motifDefaultHues`); these palette remaps are derived. Use `hue="original"` for the exact supplied fills.

## Iconography
No official Sesc icon set was supplied, so the system adopts **[Lucide](https://lucide.dev) (ISC licence)** — chosen because its drawing spec (24×24 grid, 2px stroke, `currentColor`) is exactly the spec this system already required, so nothing had to be restyled. 97 glyphs covering education, enrollment, units, results and the Sab.IA platform are vendored in `assets/icons/lucide/`, and `components/core/Icon.jsx` is generated from them by `scripts/build-icons.mjs`. Pass an `<Icon>` to `Button`/`IconButton` via their `icon` prop. **No emoji, no unicode-as-icon usage, and never a hand-drawn one-off SVG** — vendor the glyph and regenerate. See `assets/icons/README.md`.
