# Quality checklist

Walk this before handing anything over — a page, a deck, a poster, a component, a whole site.
`npm run check` covers the mechanical half; the rest needs eyes.

## Mechanical

```bash
npm run check
```

- [ ] Passes with 0 errors.
- [ ] No raw hex, `font-family`, radius, shadow or duration outside `tokens/`.
- [ ] `dist/rse.js` in sync (`npm run sync` after any component edit).
- [ ] Generated docs regenerated, not hand-edited.

## Brand

- [ ] Page background is cream (`--rse-color-surface-page`), content on white cards. At most two background
      colours in the composition — cream plus one purple band.
- [ ] Accent hues appear only in tags, chips, dots and data — never as a section background.
- [ ] Headings Extrabold with tight tracking; exactly one uppercase style in play (the eyebrow).
- [ ] Radii follow the system: pill for buttons/badges/tags, `--rse-radius-md` for fields,
      `--rse-radius-lg/xl` for cards and media. No square corners in UI chrome.
- [ ] Logo unmodified, correct lockup for the background, clearspace respected.
- [ ] Motion is limited to hover/press state changes at `--rse-duration-fast/base`. No scroll-triggered
      animation, no bounce.

## Content

- [ ] Copy is pt-BR, sentence case, second person ("você").
- [ ] No emoji anywhere.
- [ ] Headlines are short and declarative, using verbs of transformation (acolhe, forma,
      transforma, desenvolve). No hedging, no promotional exaggeration.
- [ ] Every figure, unit name, address, date and testimonial is either verified against official
      Sesc data or **explicitly flagged to the user as placeholder**.
- [ ] Image placeholders describe the shot needed, in pt-BR. No invented photography.

## Accessibility

- [ ] `<html lang="pt-BR">`.
- [ ] Tab through the whole surface: everything interactive is reachable, in a sensible order, and
      the focus ring is visible at every stop.
- [ ] Enter/Space activate buttons; Escape closes menus, dialogs and tooltips; arrow keys move
      between tabs.
- [ ] A dialog moves focus in on open and returns it to the trigger on close.
- [ ] Body text ≥ 4.5:1 contrast; large text and UI borders ≥ 3:1. Check any text sitting on an
      accent tint or a purple band.
- [ ] Touch targets ≥ 44px.
- [ ] Every image has pt-BR `alt`, or `alt=""` if decorative.
- [ ] Headings form a real outline (one `h1`, no skipped levels) — screen readers navigate by it.
- [ ] Form fields have visible labels, not placeholder-as-label; errors are text, not colour alone.
- [ ] Nothing conveys meaning by colour alone (status badges carry a dot and a word).

## Themes and responsiveness

- [ ] Renders correctly with `data-rse-theme="dark"` and `data-rse-theme="contrast"` on `<html>`.
- [ ] Reflows at 375px, 834px and 1440px without horizontal scroll.
- [ ] Wide content (tables, deck stages) scrolls inside its own container, not the page body.
- [ ] `prefers-reduced-motion` still calms everything — no animation added outside the token system.

## Print (decks, forms, posters)

- [ ] Prints on the intended paper size with correct margins.
- [ ] Backgrounds and brand colour survive the print dialog, or the piece is designed to work
      without them.
- [ ] Shadows removed; links legible without hover.
- [ ] Nothing important sits in the last 10mm of the page.

## Handover

- [ ] Told the user which content is placeholder and needs verification.
- [ ] Named any open caveat the work depends on (motif artwork, vector logos, photography — see
      [../AGENTS.md](../AGENTS.md#known-gaps--say-these-out-loud-when-they-matter)).
- [ ] Said plainly what was not done, if anything was left out.
