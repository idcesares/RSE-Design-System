# Brand manual — extracted reference

Source: **`manual_redesesc_Atualizado.pdf`** — *Manual da Rede Sesc de Educação*, Sesc Departamento
Nacional, 2026. 98 pages, five sections: Introdução, Verbal, Visual, Presença digital, Plataforma
de aprendizagem.

This page records what the manual *actually specifies*, so the system can be checked against it
instead of against inference. Citations are `manual p.N` = the printed folio, `pdf N` = the page in
the file (the folio runs ~3 behind the file page).

> This is a reference extract, not a replacement for the manual. Where this system deliberately
> departs from the manual, that is noted inline as **[system departs]** with the reason.

---

## Colour — the authoritative palette

`manual p.59 / pdf 62`. **Eight colours** compose the applications of the selo; **six of them** are
worked as a monochromatic ramp (base + two darker tones). Cream and indigo are flat, with no ramp.

The manual publishes RGB, CMYK **and** hex for all 20 values. For other colour systems it directs
comparison against the **Pantone Formula Guide** — it does not publish Pantone numbers.

| Token | Hex | RGB | CMYK |
| --- | --- | --- | --- |
| `--rse-brand-cream` | `#f2f4e4` | 242 244 228 | C7 M2 Y14 K0 |
| `--rse-brand-indigo` | `#4c549e` | 76 84 158 | C82 M76 Y4 K0 |
| `--rse-brand-green-light` | `#a3d864` | 163 216 100 | C40 M0 Y79 K0 |
| `--rse-brand-green` | `#85b73d` | 133 183 61 | C54 M7 Y100 K0 |
| `--rse-brand-green-dark` | `#658e1e` | 101 142 30 | C65 M25 Y100 K8 |
| `--rse-brand-yellow-light` | `#ffd67b` | 255 214 123 | C0 M16 Y61 K0 |
| `--rse-brand-yellow` | `#f4bf2a` | 244 191 42 | C4 M25 Y96 K0 |
| `--rse-brand-yellow-dark` | `#d39f2b` | 211 159 43 | C19 M38 Y100 K0 |
| `--rse-brand-orange-light` | `#fc9b59` | 252 155 89 | C0 M47 Y71 K0 |
| `--rse-brand-orange` | `#e17f38` | 255 127 56 | C9 M60 Y90 K0 |
| `--rse-brand-orange-dark` | `#c6621e` | 198 98 30 | C17 M71 Y100 K5 |
| `--rse-brand-purple-light` | `#ad98ea` | 173 152 234 | C34 M41 Y0 K0 |
| `--rse-brand-purple` | `#8e82d8` | 142 130 216 | C47 M51 Y0 K0 |
| `--rse-brand-purple-dark` | `#6c62c4` | 108 98 196 | C67 M68 Y0 K0 |
| `--rse-brand-pink-light` | `#f78f94` | 247 143 148 | C0 M55 Y28 K0 |
| `--rse-brand-pink` | `#e27879` | 226 120 121 | C8 M65 Y43 K0 |
| `--rse-brand-pink-dark` | `#cc646a` | 204 100 106 | C17 M73 Y50 K1 |
| `--rse-brand-blue-light` | `#92c4e6` | 146 196 230 | C40 M11 Y2 K0 |
| `--rse-brand-blue` | `#76b3dd` | 118 179 221 | C51 M16 Y2 K0 |
| `--rse-brand-blue-dark` | `#4f85b2` | 79 133 178 | C72 M41 Y13 K0 |

Notes:

- The manual's RGB and hex disagree for `orange` (RGB 255 127 56 = `#ff7f38`, published hex
  `#e17f38`) and `green-dark` (RGB 101 142 30 = `#658e1e`, matching). Where they disagree, the
  **hex** is what the digital system uses.
- `purple`, `yellow-dark` and `orange-dark` are **official**, not derived.
- The system's grays, tints, semantic roles, state layers and data-viz ramp are **not** in the
  manual. They are system-built on top of it and remain a legitimate extension.

## Typography

`manual p.60 / pdf 63`. **Montserrat** is the support typeface for content and language around the
selo, to be applied across all pieces with consistency and legibility, prioritising information
hierarchy.

The manual displays and authorises **all available weights**: Thin, ExtraLight, Light, Regular,
Bold, ExtraBold, Black.

**[system departs]** This system restricts itself to **400–900** and reserves 800 for headings.
Weights 100–300 are authorised by the manual but excluded here: below 400 Montserrat fails the
contrast and legibility floor at body sizes on cream. Keep the restriction; it is a tightening of
the manual, not a contradiction.

## The selo

- **Proportions** (`p.50 / pdf 51`) — the elements sit in a fixed proportional grid. The constant
  measurement unit is **X = the height of the stem of the letter E**. Published measures: 4X, 5X,
  13X, 23X.
- **Minimum size** (`p.51 / pdf 52`) — **45 mm wide** in print, **150 px** digital. Below that,
  integrity and legibility are not guaranteed.
- **Clearspace** (`p.52 / pdf 53`) — a protection area of **X on every side**, X being the same
  module as above. No graphic, text, photograph or illustration may enter it. A larger reserve than
  the minimum is recommended wherever possible.
- **Monochrome** (`p.53 / pdf 54`) — positive and negative outline versions, respecting the stroke
  weight exactly. Where the original colour cannot be used, the selo goes **white or black**.
- **Simplified version** (`p.54 / pdf 57`) — below the minimum size, use the lettering version in
  the monochrome variants of p.53.
- **Colour combinations** (`p. / pdf 55–56`) — the selo has a **sanctioned system of colour
  combinations**, positive and negative: fill, border and the two lettering colours may each take a
  different palette colour. ~25 combinations are published. The constraints are: **palette colours
  only**, and contrast sufficient for the lettering to stay fully legible.
- **Misuse** (`p.57 / pdf 60`) — no shadows, lines, outlines or effects; no added elements; no
  resizing or repositioning of the internal elements; no rotation; no colour changes **outside the
  sanctioned combinations** and no gradients; no outline-only use; no distortion; no palette colour
  whose contrast with the lettering harms reading.
- **On backgrounds and photography** (`p.55–56 / pdf 58–59`) — prefer the principal version. On
  low-contrast backgrounds use monochrome positive or negative. On photographs, find the point of
  least interference, aiming for contrast that favours the selo's contour.

### Co-branding with the Sesc signature

`p.58 / pdf 61`. So that signatures do not accumulate and the selo is not mistaken for a brand, the
selo must always be applied **at a distance from the Sesc signature** on both digital and printed
pieces. The published examples place the selo in one corner and the Sesc lockup
(*A vida acontece com o Sesc* + Sesc Fecomércio Senac) in the opposite corner or the opposite end
of the piece — never adjacent, never locked up together.

Those examples also show the selo reversed in white/outline over **full-bleed accent colour fields**
(pink, purple). For print and social artwork this is sanctioned, and since decision D3 pages may use
accent bands too — with **ink** text, not the white the manual's pieces show. **[system departs]**
White on a light or mid accent is 1.4–3.3:1; ink is 4.8–10:1. See `AGENTS.md` → Building a page.

## Graphic elements — the cubo impossível

`p.61 / pdf 64`. The visual language is inspired by the figure of an **impossible cube**. The
three-dimensional elements evoke *abrangência, pensar fora da caixa, expansão, capilaridade e
flexibilidade*.

Sanctioned uses: **small, blown-up (estourada), in outline, or forming patterns.**

The manual publishes **six constructions in three hue families only — green, pink, blue**
(`pdf 64`), and four full-bleed line-pattern fields (`pdf 65–69`); the supplied pattern SVGs in
`assets/patterns/` are blue, green, orange and pink. Purple, orange and yellow *constructions* do
not exist in the supplied artwork. The design owner has since authorised deriving them through
`BrandMotif`'s `hue` prop from the published palette (`AGENTS.md` rule 10) — present those three as
**derived**, and replace them with official artwork if Sesc produces it.

## Verbal

- **Slogan**: *Aprender para a vida acontecer* (`p.41 / pdf 41`), dialoguing with the institutional
  concept *A vida acontece com o Sesc*. Sanctioned extensions are listed at `p.42 / pdf 42`
  (*Aprender para crescer com confiança*, *…para ampliar horizontes*, *…para a vida acontecer em
  cada fase*, and ten more). Extensions must keep the structure of meaning and the link to real life.
- **Three axes**: **tradição** (credibility, consistency) → **acolhimento** (proximity, bond) →
  **resultado** (impact, value). The differentiator is integrating all three, never one alone.
- **Attributes**: essenciais (unicidade, institucionalidade) · relacionais (acolhimento,
  protagonismo dos estudantes) · funcionais (resultado, inovação, formação integral).
- **Tone** (`p.33 / pdf 33`) — be: claros, próximos, consistentes, relevantes, confiáveis. Avoid:
  técnicos em excesso, distantes, genéricos, promocionais demais.
- **Per segment** (`p.35–39 / pdf 35–39`) — emphasis shifts, positioning does not:
  - *Educação Infantil* — acolhimento, formação integral, protagonismo; sensitive, close language.
  - *Ensino Fundamental* — acolhimento, protagonismo, formação integral; balance closeness and clarity.
  - *Ensino Médio* — resultado, inovação, protagonismo; direct and objective, future and decisions.
  - *EJA* — acolhimento, resultado, acessibilidade; direct, respectful, **without infantilising**.
- **Audiences** (`p.13–16 / pdf 13–16`) — trabalhadores do comércio de bens, serviços e turismo;
  funcionários do Sesc; empresários; sociedade em geral. Plus three dimensions: interna
  (alinhamento e pertencimento), mercadológica (decisão e acesso), institucional (credibilidade).
- **Named differentiators** (`p.46–47 / pdf 46–47`) — plataforma adaptativa com IA (Sab.IA),
  material didático autoral, Sistema de Avaliação, Desafio Sesc do Conhecimento, Programa de
  Excelência de Gestão Escolar.

## Digital presence

`p.68–84 / pdf 71–88`. Principles: act as a national network even in local communication; connect
to the Sesc; put people at the centre; show education in practice; keep consistency; value the
Sesc's differentiators; balance the three codes.

- **Institutional site** — education must have a dedicated area on every regional site, which must
  indicate belonging to the Rede, **use the selo**, and reinforce the national dimension. Suggested
  structure (`p.83 / pdf 86`): visão geral, proposta pedagógica, estrutura das escolas, projetos e
  iniciativas, histórias e experiências, informações de acesso e contato. Clear objective text;
  avoid excessively institutional language; contextualise results; update regularly.
- **Social profiles** — dedicated education profiles are optional per Regional; when they exist they
  must indicate the link to the Sesc, identify belonging to the Rede, use the selo, and complement
  rather than replace the institutional channels. Per-channel roles are set out for Instagram,
  Facebook, TikTok, YouTube and LinkedIn (`pdf 80–84`).
- **Roles** — the Departamento Nacional defines guidelines and national campaigns; the Departamento
  Regional implements in territory and adapts national campaigns locally.

## Sab.IA — the learning platform

`p.87–100 / pdf 90–96`.

- **Definition** — adaptive learning platform using generative AI to build personalised paths,
  integrating Brazilian culture, humanised technology and educational data to support educators and
  students. The name references the bird *sabiá* and the term *IA*.
- **Palette** (`p.90 / pdf 93`) — "inspired by the colours of the Rede Sesc de Educação", **three
  colours only**, all of them exact Rede palette values:
  `#76b3dd` (blue) · `#6c62c4` (purple) · `#e17f38` (orange).
  There is **no separate Sab.IA cream** in the manual — `--rse-color-sabia-surface` `#eef0da` in
  `tokens/src/color.tokens.json` (`--rse-color-sabia-surface`) is a system invention and should be treated as such.
- **Product UI** (`pdf 94–96`) — real screens are published, so this is no longer unknown territory:
  - *Login* — flat blue plane carrying a full-bleed outlined cube field; title "Plataforma de
    Aprendizagem da Rede Sesc de Educação" reversed on it; white card with Sab.IA lockup endorsed
    by the Sesc Educação selo; fields **Usuário/E-mail** and **Código de acesso**; primary button
    **ACESSAR**; secondary **Acessar com e-mail institucional**; **Redefinir Senha** link; PT/EN
    language flags; Sesc CNC Senac lockup bottom-left.
  - *Header* — light-blue bar: Sab.IA lockup + Sesc Educação endorsement, context label
    (*Educação / REDE DE ENSINO (DN)*), utility icons, language selector, avatar + user name.
    Below it a text nav: Social, Conteúdos, Biblioteca, Plano de aula, Atividades, Relatórios,
    Agendamento, Administração, Chatbot, Suporte. Content starts with an H1, a rule, then a
    carousel banner and a row of feature cards with pale tinted icon circles.
  - *Footer* — full-width light-blue bar, centred support line (*Suporte* + phone + WhatsApp icon,
    opening hours beneath), Sesc CNC Senac lockup at the right.
  - The platform chrome is **blue**, not purple. Purple is the Rede's primary; do not assume the
    platform inherits it for chrome.
- Still unknown: the **platform URL**. `PlatformEntry` continues to link to `#`.

## Photography

The manual has **no written photography section**, but it carries **six full-bleed photographic
plates** (`pdf 2, 8, 24, 27, 30, 69`) which establish the direction by example. What they show,
consistently:

- **Documentary and in-situ** — real Sesc schools, real students, no studio, no staging.
- **Natural light**, unfiltered. No duotones, no purple washes, no gradient overlays.
- **Wide or overhead framing** — the whole scene rather than a tight portrait. Several plates are
  shot directly from above.
- **Candid** — students absorbed in an activity, mostly not looking at camera.
- **Sesc uniform visible**, situating the image institutionally.
- **Visibly plural and inclusive** — a range of ages and skin tones; one plate centres a student who
  uses a wheelchair, in front of a mural depicting a wheelchair-using child.
- **Full-bleed, edge to edge**, carrying no text; headlines stay off the image.

**These plates are not usable assets for this repo.** They are photographs of identifiable children
whose usage rights are unknown. Do not extract them, do not reuse them, and never generate synthetic
imagery in their place. Use `<image-slot>` with a shot brief written to the direction above, and ask
Sesc for the licensed photo library.

## What the manual does *not* contain

Checked and absent — these remain open asks, and inference in this system stays flagged as inference:

1. **A photo library or written imagery rules** — the direction above is read off six plates, not
   stated. Crops, radii, scrim and alt-text rules in `guidelines/imagery.card.html` are ours.
2. **Pantone numbers** — CMYK yes, Pantone no; the manual defers to Formula Guide comparison.
3. **Layout grid** — no column grid, margin or baseline specification for print or web.
4. **Iconography** — no icon set, no icon style rules. Lucide remains a system choice.
5. **UI component specs** — beyond the Sab.IA screens, no buttons, forms, states, spacing scale,
   radii, elevation or motion. The whole component layer is original work sized to the brand.
6. **Type scale** — Montserrat is named, sizes and line heights are not.
7. **Accessibility** — no contrast, focus, keyboard or target-size requirements. This system's
   accessibility floor is stricter than the manual by design.
8. **Dark mode / theming** — not addressed.
