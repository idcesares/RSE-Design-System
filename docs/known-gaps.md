# Known gaps — say these out loud when they matter

These are open caveats in the source material, not bugs to fix silently. The brand manual has since
been supplied and is extracted in [brand-manual.md](brand-manual.md) — check there before
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
   Everything else about the platform is now specified — see [sabia-platform.md](sabia-platform.md).
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
