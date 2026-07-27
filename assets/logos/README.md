# Logos

Official vector artwork. **Never redraw, rotate, stretch, distort or add effects to these marks**,
and never recolour them outside the sanctioned combinations below.
Clearspace and misuse rules: `guidelines/brand-clearspace.card.html`. Full spec, with manual page
references: [docs/brand-manual.md](../../docs/brand-manual.md).

## The three sanctioned versions

The manual (p.49, 50, 54) defines three, and they are not interchangeable:

| Version | What it is | Use when |
| --- | --- | --- |
| **Principal** (`badge-solid.svg`) | solid badge, lettering reversed out | the default, everywhere it fits |
| **Secundária** (`badge-outline.svg`) | outlined badge, solid lettering, no fill | a solid badge would be too heavy |
| **Simplificada** (`wordmark-*.svg`) | lettering only, no badge, monochrome | below the minimum size |

## Size and spacing

- **X** is the height of the stem of the letter E. It is the module for everything else.
- **Clearspace**: at least X free on all four sides. Nothing enters it. More than X is preferred.
- **Minimum size**: 45 mm wide in print, 150 px digital. Below that, switch to `wordmark-*.svg`.
- **Co-branding**: the selo never locks up with the Sesc signature. Put them at a distance —
  opposite corners or opposite ends of the piece — so signatures do not accumulate and the selo is
  not read as a brand of its own.

## Recolouring — what is actually allowed

The manual publishes ~25 sanctioned colour combinations (p.55–56): the badge fill, the badge border
and the two lettering colours may each take a different palette colour, positive or negative. The
constraints are **palette colours only** and **enough contrast for the lettering to stay legible**.
The colour sheets in `source/` are the reference for which combinations are approved.

Never: gradients, colours outside the palette, outlined lettering, or any combination where the
lettering contrast harms reading.

## Use these (web-ready: transparent background, tight viewBox)

| File | Mark | Put it on |
| --- | --- | --- |
| `wordmark-purple.svg` | Rede Sesc de Educação wordmark, brand purple | cream and white surfaces — the default |
| `wordmark-black.svg` | Wordmark, official black `#1d1d1b` | light surfaces where colour would compete; print in one ink |
| `wordmark-white.svg` | Wordmark, white | purple, ink and photographic surfaces |
| `badge-solid.svg` | Selo — white mark inside the solid badge shape | as a stamp on light surfaces |
| `badge-outline.svg` | Selo — outlined badge, no fill | where a solid badge would be too heavy |
| `sabia-wordmark-purple.svg` | Plataforma Sesc Sab.IA, purple | cream and white surfaces |
| `sabia-wordmark-cream.svg` | Plataforma Sesc Sab.IA, cream | purple and ink surfaces |
| `sabia-horizontal-colour.svg` | Sab.IA horizontal lockup with the Rede badge | co-branded headers, platform entry points |

`assets/favicon.png` and `assets/og-image.png` are still composited from the older raster
extractions — regenerate them from these vectors before any public launch.

## `source/`

The files exactly as supplied, untouched: black, black-outline, white-on-black and white-badge
lockups, the two Sab.IA lockups with their background plates, and the two **colour sheets**
(`*-colour-sheet.svg`, `*-colour-outline-sheet.svg`) showing the full set of approved colour
lockups. Those sheets are the reference for which colour combinations are sanctioned — they are
reference artboards, not assets to place in a layout.

## How the web-ready files were derived

- Tight `viewBox`: the supplied artboards are 1190×850 with the mark occupying a fraction of the
  canvas. Each viewBox was recomputed to the mark's real bounding box plus 2–4% breathing room.
  **No path data was altered.**
- `wordmark-white.svg`: the supplied white lockup with its full-bleed black backdrop rectangle
  removed, so the mark can sit on any dark surface.
- `sabia-wordmark-*.svg`: same treatment — the background plate removed from each Sab.IA lockup.
- `wordmark-purple.svg`: the official black lockup geometry filled with the brand purple. Geometry
  untouched.
- **Colour values come from the manual, not from these files.** The supplied vectors (and
  `uploads/REDE_SESC_selo_COR.pdf`) draw the palette 1–3 points below the manual's published hex —
  the selo PDF uses `#6b62c2` where the manual publishes `#6c62c4`. Every fill here has been aligned
  to the manual. Do not "correct" them back by sampling the artwork.

The legacy raster extractions (`assets/logo-*.png`) are superseded by these files and kept only so
older pages keep rendering. New work uses the SVGs.
