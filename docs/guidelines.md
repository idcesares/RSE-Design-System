# Guidelines: imagery, motion, theming, accessibility

The written rules for the parts of the system that tokens alone cannot carry. The showcase
(`showcase/index.html`) shows each of them working; this file is what a person or an agent checks
a piece against. Brand facts (palette, selo, clearspace, voice) live in
[brand-manual.md](brand-manual.md); this file is the system's own layer on top of it, and it says
so where it goes beyond the manual.

## Imagery

The manual shows six photographic plates and no written rules. Everything below is read off those
plates or is this system's own convention.

**Direction**

- Documentary, in situ: real classrooms, real students, natural light. Open or overhead framing —
  the whole scene, Sesc uniform visible.
- Warm tones that sit beside the cream page; skin tones true and unfiltered.
- The student is the protagonist: action and attention, not posed rows.
- Visible plurality: ages, regions, abilities, body types, skin tones.
- Room in the frame for a headline when the image runs full-bleed.

**Never**

- Stock-looking staged shots, thumbs-up, groups smiling at the camera.
- Filters, duotones, purple washes, gradient overlays.
- Text baked into the image — captions and headlines stay in HTML.
- AI-generated or illustrated people, anywhere.
- A photo as a section background behind body copy.

**Crops and radii** (system convention)

| Use | Ratio | Radius |
| --- | --- | --- |
| Hero and feature bands | 16:9 | `--rse-radius-xl` |
| Programme and unit cards | 16:10 | `--rse-radius-lg` |
| Portraits (testimonials, educators) | 1:1 | `--rse-radius-pill` |

**Text on a photo.** One ink scrim in one direction (`--rse-brand-ink` from 70% to 0%) — never a
purple tint, never a blur — and at least 4.5:1 on the darkest part behind the text.

**Alt text and consent.** Alt text says what is happening, in pt-BR, not "foto de aluno". Credit and
image release (including for minors) are requirements.

**Until the licensed library exists**, use `<image-slot>` with the shot brief as its text
(`estudantes do ensino fundamental em atividade em grupo, luz natural`). Never fill a layout with
stock or generated imagery; an honest placeholder is a brief for the photographer.

## Motion

| Token | Duration | For |
| --- | --- | --- |
| `--rse-duration-fast` | 150 ms | press, focus, colour swaps |
| `--rse-duration-base` | 220 ms | hover, open/close, accordions |
| `--rse-duration-slow` | 360 ms | modals, page-level reveals — nothing slower |

- `--rse-ease-standard` for state changes, `--rse-ease-out` for anything entering. No spring, bounce
  or overshoot: the brand reads institutional, not playful.
- Hover moves to a darker shade of the same hue, never to another colour. Press scales to 0.97.
  Cards lift; they never change background.
- Animate `transform`, `opacity`, `background-color` and `box-shadow` only — never layout.
- No scroll-triggered motion, parallax or autoplaying decoration. Motion carries meaning (state,
  progress, arrival) or it is removed.
- `prefers-reduced-motion: reduce` is honoured globally in `tokens/base-runtime.css`; never add
  motion inline in a way that escapes it.

## Theming

- Themes remap role tokens only (surfaces, text, borders, primary, status). Brand values never
  change, so components need no theme code.
- `data-rse-theme="dark" | "contrast" | "auto"` on `<html>` or on any section; `"light"` brings the
  default back inside a section that set another theme. Themes nest in any order.
- Dark is for product and logged-in surfaces (the Sab.IA platform, internal tools), not the public
  site — the cream page is a brand signal.
- High contrast raises text and borders and drops shadows. It is the accessibility fallback, not a
  style.
- A surface whose colour is fixed (a brand band, the Sab.IA chrome) takes a fixed text colour too —
  `--rse-brand-ink` or `--rse-brand-white`, whichever the contrast table allows — never a role
  token that flips with the theme.

## Accessibility

The floor is WCAG 2.2 AA, measured: `scripts/contrast-pairs.mjs` in three themes on every
`npm run check`, axe-core on every page in CI (`npm run test:pages`).

- Body text uses `--rse-color-text-body` on page or card surfaces. Muted text stays on white and
  cream — never on an accent. On purple or ink fills, use `--rse-color-text-on-primary` or
  `--rse-color-text-on-ink`, never grey.
- Every interactive element shows `--rse-color-focus-ring` on `:focus-visible`; a border-colour
  change alone is not a focus state.
- Native elements first (`<button>`, `<dialog>`, `<details>`); tabs move with the arrow keys; menus
  and dialogs close on Escape.
- A region that scrolls sideways is focusable (`tabindex="0"` plus a label), so a keyboard user can
  scroll it.
- Primary actions are at least 44 px tall (`--rse-hit-target-min`).
