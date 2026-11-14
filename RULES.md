# Rede Sesc de Educação — rules for anything built with this design system

This file ships inside the package and the static kit. It is the short version of the rules for
people and agents working in a project that **consumes** the system. The full guide, the
reasoning and the brand manual extract live in the design system repository (`AGENTS.md`,
`docs/brand-manual.md`). `brand.json` → `rules` is the machine-readable form.

## Use it, don't copy it

- Install `@idcesares/rse-design-system`, or link a versioned static kit (`rse-<version>/`). Never
  edit the files you received: fix things upstream and update the version.
- Link `styles.css` for a page that should look like the Rede out of the box. Inside a site that
  already has its own base styles, link `tokens/tokens-only.css`, and for the components add
  `tokens/base-runtime.css` + `dist/components.css`.
- Components exist twice with one look: React (`import { Button } from '@idcesares/rse-design-system'`)
  and plain HTML classes (`<button class="rse-button rse-button--secondary">`). Use the classes in
  a CMS or portal; each component's `.prompt.md` shows the markup, and `dist/components.json`
  lists every component's props, allowed values and classes.
- Page structure uses the layout primitives (`.rse-container`, `.rse-section`, `.rse-stack`,
  `.rse-cluster`, `.rse-grid`, `.rse-eyebrow`), not a per-page container or stack.
- Themes: set `data-rse-theme="dark" | "contrast" | "auto"` on `<html>` or on any section; `"light"` brings the default back inside another theme.

## Non-negotiables

1. **Tokens only.** No raw hex, font stack, radius, shadow or duration. Read `var(--rse-color-*)`
   and the scales (`--rse-space-*`, `--rse-font-size-*`, `--rse-radius-*`…). `--rse-brand-*` is the
   palette — for brand artwork only, never for UI.
2. **Text colour has a role.** Words on a status surface use `--rse-color-<status>-text`; the bare
   `--rse-color-<status>` is for dots, borders and icons. Text on a tint uses its
   `--rse-color-tint-<hue>-ink`. Text on the pale purple uses `--rse-color-text-on-primary-tint`.
3. **Colour bands carry the right ink.** Page is cream, content on white cards. A feature or CTA
   band is brand purple or indigo with white text, or a light or mid accent with ink text
   (`--rse-brand-ink`). Never white text on an accent; never a `-dark` accent or mid purple as a
   band. Subtle palette gradients are fine on heroes, bands and artwork (palette stops only,
   contrast measured at the worst stop); never off-palette, never on the selo.
4. **Montserrat only**, 400–900. Headings 800, tight tracking. Eyebrows 700 uppercase — the only
   uppercase. Sentence case everywhere else.
5. **pt-BR** for everything a person reads; English for identifiers. `<html lang="pt-BR">`.
6. **No emoji, no hand-drawn icons.** Icons come from the `Icon` component (Lucide). Diagrams and
   illustrations drawn from palette geometry are fine.
7. **Never invent Sesc facts or imagery.** Figures, addresses, fees, dates and testimonials must be
   verified; images are `<image-slot>` placeholders with a shot brief until licensed photography
   exists. Never generate synthetic photos of students.
8. **The selo** has three versions (principal, secundária, simplificada below 150 px / 45 mm), a
   clearspace of X on every side, palette colours only, never rotated, distorted, outlined or locked
   up with the Sesc signature — it sits at a distance from it.
9. **The motif** (*cubo impossível*): the six signature constructions preserve the supplied geometry
   (never redraw, rotate, stretch or distort); generated shapes and motion come only from the motif
   engine (`MotifLoader`, `MotifPattern`); any of the six palette families, ramps from the palette
   only; one focal construction per composition (a pattern is a field, the loader is exempt); flat
   colour fields only; purple, orange, yellow and all generated shapes are derived, not supplied.
10. **Sab.IA is the platform, the Rede is the network.** Platform chrome is blue with ink text.
    Enrollment lives in the TOTVS portal, not in the platform.
11. **Creative latitude.** The rules above are the invariants; everything else is craft. Artifacts,
    decks and showpiece pages may be ambitious: custom layouts, diagrams, subtle gradients and
    depth, choreographed motion, interaction, Three.js or other WebGL. Keep reduced motion, a complete
    final frame, keyboard paths and text alternatives. See `docs/composition/creative-latitude.md`.
12. **Accessibility is part of done.** Contrast ≥ 4.5:1 text, ≥ 3:1 large text and control borders;
    focus always visible; keyboard path complete; hit targets ≥ 44 px; works at 360 px wide.


Signature colour defaults: BrandMotif assigns cube/purple, interlock/blue, bar/green, frame/pink,
chain/orange and hollow/yellow. These are derived palette remaps; `hue="original"` preserves the
supplied fills. Geometry never changes. MotifLoader is the primary loading component (inline and
section modes); Spinner remains a compatibility adapter for inline mode.
