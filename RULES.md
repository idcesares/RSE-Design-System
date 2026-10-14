# Rede Sesc de Educação — rules for anything built with this design system

This file ships inside the package and the static kit. It is the short version of the rules for
people and agents working in a project that **consumes** the system. The full guide, the
reasoning and the brand manual extract live in the design system repository (`AGENTS.md`,
`docs/brand-manual.md`). `brand.json` → `rules` is the machine-readable form.

## Use it, don't copy it

- Install `@idcesares/rse-design-system`, or link a versioned static kit (`rse-<version>/`). Never
  edit the files you received: fix things upstream and update the version.
- Link `styles.css` for a page that should look like the Rede out of the box. Inside a site that
  already has its own base styles, link `tokens/tokens-only.css` (+ `tokens/base-runtime.css` if
  you use the components).
- Themes: set `data-rse-theme="dark" | "contrast" | "auto"` on `<html>` or on any section.

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
   band; no gradients.
4. **Montserrat only**, 400–900. Headings 800, tight tracking. Eyebrows 700 uppercase — the only
   uppercase. Sentence case everywhere else.
5. **pt-BR** for everything a person reads; English for identifiers. `<html lang="pt-BR">`.
6. **No emoji, no hand-drawn icons.** Icons come from the `Icon` component (Lucide).
7. **Never invent Sesc facts or imagery.** Figures, addresses, fees, dates and testimonials must be
   verified; images are `<image-slot>` placeholders with a shot brief until licensed photography
   exists. Never generate synthetic photos of students.
8. **The selo** has three versions (principal, secundária, simplificada below 150 px / 45 mm), a
   clearspace of X on every side, palette colours only, never rotated, distorted, outlined or locked
   up with the Sesc signature — it sits at a distance from it.
9. **The motif** (*cubo impossível*) is artwork: never redraw or distort it; one construction per
   composition; change its hue only through `BrandMotif`'s `hue` prop.
10. **Sab.IA is the platform, the Rede is the network.** Platform chrome is blue with ink text.
    Enrollment lives in the TOTVS portal, not in the platform.
11. **Accessibility is part of done.** Contrast ≥ 4.5:1 text, ≥ 3:1 large text and control borders;
    focus always visible; keyboard path complete; hit targets ≥ 44 px; works at 360 px wide.
