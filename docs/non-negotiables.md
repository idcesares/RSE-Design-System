# Non-negotiables — the long form

`AGENTS.md` states each rule in a line or two and names the check that enforces it. This file
carries the full wording and the reasoning; when the two seem to disagree, this one has the detail
and `AGENTS.md` has the routing. Settle brand questions in [brand-manual.md](brand-manual.md).

These hold for every output, in every mode. They are what makes generated work look like the Rede
and not like a generic template. They are the **invariants**: everything *not* listed here is craft,
and craft is yours ([creative latitude](composition/creative-latitude.md)).

1. **Tokens only.** Never write a raw hex colour, font stack, radius, shadow or duration into a
   component or page. Use `var(--rse-…)`: `--rse-color-*` for colour roles and the scales
   (`--rse-space-*`, `--rse-font-size-*`, `--rse-radius-*`…). `--rse-brand-*` is the palette — for
   brand artwork and the token source only. The full list is [tokens.md](tokens.md).
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
   glyph comes from `components/core/Icon.js` (Lucide, ISC, vendored in `assets/icons/lucide/`).
   Missing an icon? Vendor it and run `npm run icons` — never paste a one-off SVG into a page,
   never a unicode glyph standing in for an icon. This is about *icons*: diagrams, org charts,
   charts, maps and illustrations drawn from palette geometry are craft and are encouraged.
6. **Never invent Sesc facts.** Student counts, unit addresses, fees, dates, testimonials and
   enrollment windows in this repo are *examples*. Keep them visibly placeholder-ish, and tell the
   user which numbers need verification before anything goes public.
7. **Never invent imagery.** No real photography exists yet. Use `<image-slot>` (see
   [image-slot.js](../image-slot.js)) with a `placeholder` describing the shot needed, e.g.
   `placeholder="estudantes em sala, luz natural, estilo documental"`. Do not generate or
   describe fake photos of real students.
8. **Accessibility is part of "done"** — see [the accessibility floor](guidelines.md#accessibility-floor).
9. **The selo has three versions and a fixed geometry.** Principal (`badge-solid.svg`), secundária
   (`badge-outline.svg`), simplificada (`wordmark-*.svg`, below the minimum size). Never rotate,
   stretch, distort, add effects to, or redraw it. It **may** carry any of the ~25 colour
   combinations the manual sanctions — palette colours only, contrast good enough to read the
   lettering, never a gradient, never outlined lettering. Clearspace is **X on all sides**, X being
   the height of the stem of the E; minimum size 45 mm print / 150 px digital. Never lock it up with
   the Sesc signature — they sit at a distance. Details:
   [brand-manual.md](brand-manual.md), `assets/logos/README.md`.
10. **The motif has two kinds of artwork: signature constructions and generated shapes.** The six
   SIGNATURE constructions (`BrandMotif`, `assets/motifs/`, the four official `assets/patterns/`)
   preserve the supplied geometry — never redraw, rotate, stretch or distort one, and they never re-map
   per theme. GENERATED shapes and motion come only from the motif engine (`MotifEngine`, through
   `MotifLoader` and `MotifPattern`, and the baked presets in `assets/patterns/generated/`); never
   hand-draw one. Any of the six palette families may be used (`BrandMotif` takes a `hue`, the
   engine takes a hue), with ramps from the palette only, never sampled from the artwork (see known
   gap 9); the remap keeps each shade's luminance rank, and reordering those stops the impossible
   cube reading as a solid. Purple, orange and yellow signature artwork and ALL generated shapes
   are derived, not supplied by Sesc — say so when it matters. One FOCAL construction per
   composition, at most 25% of it, about 0.3 opacity when it sits behind content (clear of any text it is the picture and may run at full strength: at 0.3 over purple the supplied green reads as grey), no text on faces or cells. A
   pattern is a FIELD, not a construction, and the loader is exempt (transient). Patterns are flat
   colour fields (the pattern itself has no gradients, glows or noise; it may sit on a gradient). A multi-hue pattern is allowed only as the artwork
   itself (a hero field or a standalone spectrum piece); page text and bands stay in one hue. Text
   never sits directly on pattern cells — use a solid panel. Full-bleed cube fields come from
   `assets/patterns/` or `MotifPattern`. Sanctioned treatments, per the manual: small, blown up, in
   outline, or tiled as a pattern.
11. **Sab.IA is the platform, the Rede is the network.** Learning lives in Sab.IA; enrollment and
   records live in the TOTVS portal. Never route an enrollment task to the platform. Link to it
   with `PlatformEntry` — see [docs/sabia-platform.md](sabia-platform.md).
