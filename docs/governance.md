# Governance — how the system grows and how adoption is tracked

The process side of the roadmap ([Phase 4](roadmap/roadmap.md)). The mechanics are in the repo;
the commitments (who reviews, release cadence) are decisions for the DS lead and are marked as
such.

## Conformance levels

Every system that uses the design system sits at one level. Each is a checklist a script or a
reviewer can verify.

| Level | What the system does | How it is verified |
| --- | --- | --- |
| **Bronze** — looks like the Rede | Tokens (the package, the static kit or an [adapter](../adapters/README.md)); Montserrat; the selo per the manual; palette only; pt-BR copy in the brand voice. | Token usage; selo checklist ([brand-manual.md](brand-manual.md)); review by DN comunicação. |
| **Silver** — works like the Rede | Bronze, plus the system's components for all chrome (header, footer, forms, feedback); WCAG 2.2 AA on audited pages; responsive from 360 px. | axe with zero violations on the key flows (the method of `npm run test:pages`). |
| **Gold** — is the Rede | Silver, plus every page section from patterns; light, dark and contrast themes; within one minor of the latest release; fixes contributed upstream. | `npm run audit` clean on the consumer; version in `ecosystem.json`. |

The roadmap proposes Silver as the requirement for new builds (decision for the DS lead).

## The adoption tracker — `ecosystem.json`

One entry per system:

```json
{ "name": "…", "owner": "team or person", "level": "bronze | silver | gold | none",
  "route": "npm | static-kit | wordpress-adapter | other", "version": "2.4.0", "updated": "2026-11-14" }
```

`npm run check` validates the shape and warns when a system runs more than one minor behind the
current release and was last confirmed over 90 days ago. The list starts empty on purpose: an
entry is a fact about a Sesc system, added only with the owning team's confirmation.

## Proposing a component or pattern — the RFC

Open an issue from the **Component or pattern RFC** template (`.github/ISSUE_TEMPLATE/`). It asks
for the problem, **evidence from at least two systems**, why existing components do not cover it
(check `dist/components.json` and `site/` first), the CSS contract, the accessibility contract, a
pt-BR example and the acceptance commands. One system's need is a page-level composition, not a
system component. An accepted RFC is built by [authoring-components.md](authoring-components.md).

Friction met while adopting the system goes in an **Adoption friction** issue (label `adoption`),
so it can be triaged and the workaround removed.

## Releases

Releasing is mechanical (`AGENTS.md`, commands): bump `package.json`, add the `CHANGELOG.md`
section, tag. The roadmap proposes a monthly release and patching any accessibility defect within
a week across consumers through the registry (decision for the DS lead). Breaking a token, class or
prop name is a major.
