# Plataforma Sesc Sab.IA

The Rede Sesc de Educação is the network; **Sab.IA is its platform**. Anything this design system
generates for the Rede eventually points at it, and the platform itself is expected to adopt the
same design language. This page is the working summary — the full brief is the institutional
reference document supplied by Sesc.

## What it is

Sab.IA is the Rede's adaptive-learning platform, built with **eduCAT**, acting as the national core
for educational intelligence: assessment, pedagogical personalisation and evidence-based decisions.
Its stated purpose is **high educational performance with equity** — every student in the Rede
getting real learning opportunities, followed by continuous diagnosis and personalised paths.

Its own formulation of that: *transformar dados em decisões, decisões em práticas e práticas em
aprendizagem real.*

## The one distinction to never get wrong

| | Sab.IA (eduCAT) | Portal do Aluno TOTVS (SGE) |
| --- | --- | --- |
| Owns | learning: assessment, adaptive paths, pedagogical follow-up | administration: matrícula, secretaria, finance, legal records |
| Send someone here for | seeing how a student is doing, doing an assessment, following a trilha | enrolling, documents, payments, official records |

The two systems sync automatically (classes, curricular components, calendars, consolidated
grades). **Never route an enrollment task to Sab.IA, and never route a learning task to TOTVS.**

## What lives inside it

- **Assessment** — Prova Sesc Brasil (diagnóstica, Sesc 1, Sesc 2), Prova Sesc Brasil EJA, ENEM
  simulations and redação; online, offline and printed; instruments adapted for NEE.
- **Psychometrics and reporting** — the eduCAT scale aligned to SAEB and ENEM; reports by student,
  class, school, regional and network; the analytic base of the **IDE-Sesc**.
- **Adaptive teaching** — diagnose → identify undeveloped skills → generate trilhas → teacher
  validates → student works → reports drive human intervention.
- **Teacher assistant (AI)** — data-driven lesson planning, intervention plans, assessment and
  trilha creation, a WhatsApp assistant.
- **Content** — 44,000+ educational items, authored adaptive material, socioeconomic and school
  context questionnaires.
- **Engagement** — the national engagement programme and the **Selos Sab.IA**.
- **IDE-Sesc** — the network's educational development indicator: performance, proficiency, flow.

Governance sits across GED (pedagogical direction), GSE (system operation), GFPD (research and data
intelligence) and the Polos Educacionais (experimentation and scaling).

## Designing for it

**Sub-brand, not a separate brand.** The brand manual (p.90) gives Sab.IA a palette of exactly
**three colours**, and all three are unchanged Rede values — the sub-brand adds no colour of its own:

| Token | Value | Manual |
| --- | --- | --- |
| `--sabia-blue` | `#76b3dd` | C51 M16 Y2 K0 |
| `--sabia-purple` | `#6c62c4` | C67 M68 Y0 K0 |
| `--sabia-orange` | `#e17f38` | C9 M60 Y90 K0 |

`--sabia-cream` `#eef0da` is **not in the manual** — it is a system tone kept because platform
surfaces need a page background and the manual supplies none. Treat it as ours, not the brand's.

**The platform's chrome is blue, not purple.** This is the easiest thing to get wrong: purple is the
Rede's primary, but every published Sab.IA surface — login plane, header bar, footer bar — is
`--sabia-blue`. Purple stays an accent on platform surfaces.

**Text on the blue chrome is ink, not white.** White on `--sabia-blue` is 2.27:1; use
`--sabia-on-blue` (`--color-ink`, 6.17:1). The manual's screens show white titles on the login plane —
this system departs from that on purpose, for the same reason as every accent band (decision D3).

Everything else — Montserrat, the spacing scale, radii, motion, the accessibility floor — is
unchanged.

**Lockups.** `assets/logos/sabia-wordmark-purple.svg` on cream and white,
`sabia-wordmark-cream.svg` on purple and ink, `sabia-horizontal-colour.svg` where the Sab.IA and
Rede marks appear together.

**The cube field is the platform's signature.** The login screen uses a full-bleed isometric field
of *outlined* cubes over a flat blue plane. That is the same *cubo impossível* language as
`assets/motifs/` — the patterns in `assets/patterns/` are the sanctioned way to reproduce it. Keep
the field behind the composition with content on a calm surface, the way the login screen does.

## The published screens

The manual publishes real product screens (p.100), so these are observations, not proposals. Match
them when building anything platform-facing.

**Login.** Flat blue plane carrying the full-bleed outlined cube field. Title reversed on it, upper
left: *Plataforma de Aprendizagem da Rede Sesc de Educação*. A white card, lower right, holds: the
Sab.IA lockup endorsed by the Sesc Educação selo · field **Usuário/E-mail** · field **Código de
acesso** · primary button **ACESSAR** (filled blue, full width) · secondary button **Acessar com
e-mail institucional** (outlined, full width) · **Redefinir Senha** text link · PT/EN language flags.
The Sesc CNC Senac lockup sits bottom-left on the plane, reversed.

**Header.** A blue bar: Sab.IA lockup with the Sesc Educação endorsement at the left, then a context
label in two lines (*Educação* / *REDE DE ENSINO (DN)*); at the right, utility icons, a language
selector, and an avatar with the user's name. Below the bar, a plain text nav wrapping over two
rows: Social · Conteúdos · Biblioteca · Plano de aula · Atividades · Relatórios · Agendamento ·
Administração · Chatbot · Suporte. Page content then opens with an H1, a hairline rule, a carousel
banner, and a row of feature cards — each card a pale tinted icon circle, a short bold title and two
lines of supporting copy.

**Footer.** Full-width blue bar. Centred: *Suporte*, the phone number with a WhatsApp icon, and the
opening hours on a second line. The Sesc CNC Senac lockup sits at the right.

Note the tinted icon circles and the pale yellow list rows in the published screens map onto this
system's `--tint-*` tokens — use those rather than inventing new pale backgrounds.

**Voice.** Talk about what the student gets, not the machinery. "Acompanhamento contínuo da
aprendizagem", not "motor adaptativo com IA". The technology is the means; equity and real learning
are the point.

## Linking from a Rede page

Use `PlatformEntry` — a co-branded band that takes a visitor from a marketing or programme page to
the platform in one click:

```jsx
<PlatformEntry
  href="https://…"
  logoSrc="assets/logos/sabia-wordmark-cream.svg"
  title="Aprendizagem que acompanha cada estudante"
  ctaLabel="Acessar a plataforma"
  note="Acesso para estudantes, famílias e educadores da Rede."
/>
```

Once per page, near the end. The header CTA stays on enrollment ("Quero me inscrever"); the platform
entry is a separate, quieter promise.

## Open question

**The platform URL is not in this repo.** `PlatformEntry` defaults `href` to `#`. Ask Sesc for the
production URL (and whether the link should land on the public home or straight on login) before
anything ships.
