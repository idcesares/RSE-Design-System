### What and why

### Checks
<!-- AGENTS.md, definition of done. Tick what applies; say why when something does not. -->
- [ ] `npm run check` passes (contrast gate, class contract, debt ratchet)
- [ ] Touched motion: `npm run test:motion` · touched a component: `npm run test:contracts`
- [ ] Lowered a debt count: `npm run audit -- --update-baseline` in this change
- [ ] Copy is pt-BR, sentence case, no emoji, no invented Sesc figures
- [ ] Keyboard path walked; focus visible at every stop
- [ ] Checked in `data-rse-theme="dark"` and `"contrast"`, and at 360 px
- [ ] Placeholder content (imagery, figures, addresses) is flagged
- [ ] `CHANGELOG.md` has a line under `## Unreleased`
