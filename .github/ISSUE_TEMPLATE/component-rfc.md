---
name: Component or pattern RFC
about: Propose a new component, pattern or token (roadmap P4.4). Read docs/governance.md first.
title: "RFC: "
labels: rfc
---

<!-- One RFC per component or pattern. An RFC is ready for review when every section is filled.
     Check dist/components.json and site/ first: a "missing" component is often an existing one
     with a prop you have not read yet. -->

### Problem
What a user of which system cannot do today, in one paragraph.

### Evidence from at least two systems
Screens, URLs or issues from two or more Rede systems that need this. One system's need is a
page-level composition, not a system component.

| System | Where | What it needs |
| --- | --- | --- |
| | | |

### Why an existing component does not cover it
Which components and props you tried (`dist/components.json`), and where they fall short.

### Proposed contract
- CSS classes (`.rse-name`, elements, modifiers) and the states they cover:
- Props (strings, arrays and plain objects; enumerations as unions):
- Component tokens it reads, if any (`--rse-name-*`, aliases of role tokens):

### Accessibility contract
Role and semantics, keyboard map, focus behaviour, what is announced, contrast pairs to add to
`scripts/contrast-pairs.mjs`, hit targets, reduced-motion form.

### pt-BR example
The component with real-looking, visibly placeholder copy (no invented Sesc facts).

### Acceptance
The commands whose output proves it: `npm run check`, `test:contracts` cases, `test:pages`.
