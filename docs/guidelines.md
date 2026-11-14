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

UI state changes stay capped at 360 ms. Brand motion has its own tier, and artwork and artifacts have a
freer one (see the end of this section).

| Token | Duration | For |
| --- | --- | --- |
| `--rse-duration-fast` | 150 ms | press, focus, colour swaps |
| `--rse-duration-base` | 220 ms | hover, open/close, accordions |
| `--rse-duration-slow` | 360 ms | modals, page-level reveals — nothing slower for state changes |

**Brand motion**

| Token | Duration | For |
| --- | --- | --- |
| `--rse-duration-reveal` | 600 ms | reveals: a motif or block arriving |
| `--rse-duration-loop` | 2.4 s | loaders and ambient loops |

- Four categories of motion: **state** (hover, press, focus, open/close), **reveal** (arrival),
  **loading** (progress) and **ambient** (decorative loops). Motion carries meaning or it is removed.
- `--rse-ease-standard` and `--rse-ease-out` for state changes; `--rse-ease-assemble` and
  `--rse-ease-settle` for brand motion. No spring, bounce or overshoot: the brand reads
  institutional, not playful.
- Scroll-triggered reveals are allowed: opacity plus a small travel, played once. Autoplaying
  ambient loops are allowed but need a pause control (WCAG 2.2.2). **In UI components parallax stays banned** (artifacts may use it, below).
- Hover moves to a darker shade of the same hue, never to another colour. Press scales to 0.97.
  Cards lift; they never change background.
- Animate `transform`, `opacity`, `background-color` and `box-shadow` only — never layout. `fill`
  and `stroke` may be animated on SVG artwork only.
- Motion setting: `data-rse-motion="full" | "reduced"` on `<html>` or on any section; it nests like
  `data-rse-theme`. The initial value is the stored choice (`RSE.motion`, key `rse-motion`), else
  the OS `prefers-reduced-motion`, else `full`. Reduced keeps opacity and colour changes and drops
  travel, spinning, looping and parallax (the one exception is `MotifLoader`, which keeps looping as a
  slowed, opacity-only fade; ambient `MotifPattern` becomes static).
- Components that implement both forms carry `.rse-motion-managed`. Everything else is flattened
  in the reduced state by the safety net in `tokens/base-runtime.css`; never add unmanaged motion
  inline in a way that escapes it.

**Artwork and artifact motion**

Decks, pitches, showpiece pages, explainers, interactive and 3D artifacts are not UI state. They may
choreograph: staggered entrances, flips, scroll-linked and pinned scenes, parallax, canvas and WebGL,
longer durations, custom easing and tasteful springs. Fixed in every case: the reduced form (finished
state, no travel, loop or drift), a complete final frame, a visible pause for autoplay beyond five
seconds, nothing flashing more than three times a second, nothing essential only in motion. The craft
and the code are in [composition/artifact-craft.md](composition/artifact-craft.md).

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

## Accessibility floor

The checklist every generated surface must clear, in full. `AGENTS.md` keeps the short form.

Every generated surface must clear this. It is not optional polish; the audience includes
students, families and Sesc staff across the whole country.

- **Contrast** ≥ 4.5:1 for body text, ≥ 3:1 for large text and UI borders. `npm run check` measures
  every pair listed in `scripts/contrast-pairs.mjs` in all three themes and fails below the floor.
  Pale accent tints (`--rse-color-tint-*`) carry their paired `--rse-color-tint-*-ink` foreground. Status colours have
  three roles: `--rse-color-danger-surface` (background), `--rse-color-danger-text` (words), `--rse-color-danger` (dots, borders,
  icons only). Text on `--rse-color-surface-primary-tint` is `--rse-color-text-on-primary-tint`. The official `-dark`
  tones never carry small text — they sit at 3.4–4.1:1 against white *and* ink.
- **Focus is always visible.** The global `:focus-visible` ring is in `tokens/base-runtime.css`. Never set
  `outline: none` without an equally visible replacement.
- **Native control, hidden visually — never `display:none`.** A native input styled behind custom
  chrome uses `className="rse-control-input"` (see `tokens/base-runtime.css`); `display:none` removes it
  from the tab order and the accessibility tree. `npm run check` fails on this.
- **Keyboard**: everything interactive reachable with Tab, operable with Enter/Space. Tabs move
  with arrow keys, menus and dialogs close with Escape, dialogs trap focus and return it to the
  trigger.
- **Hit targets** ≥ `--rse-hit-target-min` (44px) on touch surfaces.
- **Motion**: UI state changes (components) stay inside `--rse-duration-fast/base/slow` (360 ms cap)
  with standard easing; brand motion uses `--rse-duration-reveal/loop` with assemble/settle easing.
  **Artwork and artifacts have their own, freer tier**: choreographed sequences, longer durations,
  tasteful springs, scroll-linked and 3D motion, as long as the reduced form, a complete final
  frame, a pause control for long autoplay and no flashing are in place
  ([creative latitude](composition/creative-latitude.md)). The
  `data-rse-motion` setting (stored choice, else OS, else `full`) decides full or reduced; managed
  components (`.rse-motion-managed`) implement both forms, and the safety net flattens the rest —
  don't add unmanaged animation *inside UI components*. An artifact's own motion reads the setting
  itself ([how](composition/artifact-craft.md#reading-the-motion-setting)).
- **Images** carry real `alt` text in pt-BR, or `alt=""` when decorative. `<image-slot>` placeholders
  describe the shot needed.
- The design rules behind it: [Accessibility](#accessibility), above.
