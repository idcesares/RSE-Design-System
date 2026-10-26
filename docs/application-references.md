# Application references

The shipped applications are working implementations of the current system. Use them to learn
composition and behavior, then copy the closest folder. The artwork exemplars in
[`composition/exemplars/`](composition/exemplars/institutional-deck.md) remain the cross-stack
editorial reference; these applications show how to implement that direction in the browser.

| Application | Entry point | What it demonstrates |
| --- | --- | --- |
| Campaign | [LandingPage.dc.html](../templates/landing-page/LandingPage.dc.html) | Navbar, Hero, StatBand/Stat, keyboard-operated program Tabs, filterable Cards, one signature motif, Stepper, PlatformEntry, CtaBand and Footer |
| Program | [ProgramPage.dc.html](../templates/program-page/ProgramPage.dc.html) | Breadcrumb, Hero, editorial overview, actual turn filtering through FilterChips/DataTable, Accordion, enrollment guidance and a separate Sab.IA entry |
| Institutional deck | [InstitutionalDeck.dc.html](../templates/institutional-deck/InstitutionalDeck.dc.html) | Ten 1920×1080 canvases, one idea per slide, format-derived type, generous whitespace, signature geometry, honest proof/testimonial placeholders and keyboard/print navigation |
| Enrollment form | [EnrollmentForm.dc.html](../templates/enrollment-form/EnrollmentForm.dc.html) | Two A4 sheets, tokenized type, usable writing areas, document checklist and explicit placeholders for approved terms |

## Run and adapt

From the repository root, `python -m http.server 8000` serves the files locally. Open an entry
path above through `http://localhost:8000/`. No external CDN or network account is required.
The runtime may probe an optional `.image-slots.state.json` sidecar; its absence means no saved
photography, not a failed application.

Copy a whole application folder. Its one `base` line in `ds-base.js` points at the design-system
root. That bootstrap loads the stylesheet, motion setting, bundled React/DOM, components, image
slots and local runtime in order. Asset URLs derive from the same base. Keep the folder's local
composition stylesheet and scaffold files beside its HTML.

- Web composition belongs in `reference.css`; component appearance belongs in the system CSS
  contracts. The examples deliberately do not restyle Button, Card, Hero or form controls.
- `deck.css` derives typography and margins from the `slide-16x9` fractions in
  [`composition/formats.json`](composition/formats.json). Canvas geometry is fixed; the stage fits
  it to the screen and prints one page per slide. The two focal motifs use current BrandMotif
  palette defaults and retain supplied geometry.
- `form.css` uses A4 writing geometry with system type and role tokens. Paper explicitly stays in
  the light theme. The writing lines are printable areas, not interactive input controls.
- Navbar receives both purple and white official wordmarks. Its CSS selects the appropriate
  asset for light, dark, contrast and nested theme sections; the logo is never filtered.
- There are no ornamental loading loops. MotifLoader belongs on an actual pending operation,
  as shown in the component gallery, rather than on static application content.

## Behaviors and content boundaries

The campaign's program tabs change the visible cards. The program's turn filters change the
actual table rows, including multi-selection and clear. Focus, keyboard navigation and live
result messages use the component contracts.

Final enrollment buttons stay disabled until the Rede supplies the official TOTVS URL. Sab.IA
links lead to local access guidance while its URL remains unknown. Neither example collects
personal data or simulates a successful enrollment.

Before public use, validate program descriptions, availability, counts, dates, contacts, service
conditions and document requirements. Replace image slots with real authorized photography.
Replace the deck's numeric/testimonial/contact markers and the form's authorization placeholder
with approved content. These are implementation references, not verified institutional records.

## Validation and previews

```bash
npm run check
npm run test:pages -- --only=templates --themes=all
npm run test:applications
```

The page suite checks runtime errors, axe and phone overflow in three themes. Fixed slide and
paper canvases are intentionally excluded from the phone overflow rule. Application tests also
block external dependencies, exercise the actual filters, check deck text bounds and word
limits, and require ten deck PDF pages and two unclipped A4 form pages.

After inspecting the rendered applications, `npm run test:applications -- --update-previews`
refreshes the four `.thumbnail` files used by the manifest. The showcase embeds the live entry
files, so its applications chapter stays connected to the implementation.
