#!/usr/bin/env node
// Mutation test for scripts/check-composition.mjs: plants one defect at a time in a scratch copy
// of the repo and requires the validator to fail and name it. A validator that passes a broken
// composition layer is worse than none, so every rule it claims to enforce has a mutation here.
//
//   node scripts/test-composition.mjs

import { cpSync, readFileSync, writeFileSync, mkdtempSync, rmSync, copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const TMP = mkdtempSync(join(tmpdir(), 'rse-composition-'));
cpSync(ROOT, TMP, { recursive: true, filter: (p) => !/[\\/](\.git|node_modules|\.superpowers)([\\/]|$)/.test(p) });

const EX = 'docs/composition/exemplars';
const SLIDE = `${EX}/src/institutional-deck.html`;
const PITCH = `${EX}/src/pitch-deck.html`;
const validate = () => {
  const r = spawnSync('node', [join(ROOT, 'scripts/check-composition.mjs')], { env: { ...process.env, COMPOSITION_ROOT: TMP }, encoding: 'utf8' });
  return { code: r.status, out: r.stdout + r.stderr };
};
const rd = (f) => readFileSync(join(TMP, f), 'utf8');
const wr = (f, s) => writeFileSync(join(TMP, f), s);
const swap = (a, b) => (s) => { if (!s.includes(a)) throw new Error(`mutation anchor not found: ${a.slice(0, 50)}`); return s.replace(a, b); };
const swapRe = (re, b) => (s) => { if (!re.test(s)) throw new Error(`mutation anchor not found: ${re}`); return s.replace(re, b); };
const inFirstSlide = (frag) => (s) => s.replace(/<\/section>/, `${frag}</section>`);
const json = (fn) => (s) => { const o = JSON.parse(s); fn(o); return JSON.stringify(o, null, 2); };
const fmt = (id, o) => o.formats.find((f) => f.id === id);

const mutations = [
  ['caption below minText', 'docs/composition/formats.json', json((o) => { const t = fmt('social-4x5', o).type; t.caption = 0.01; t.eyebrow = 0.01; }), /type\.caption must be at least minText/],
  ['exemplar.css out of step with formats.json', `${EX}/src/exemplar.css`, swap('--t-body: calc(var(--S) * .028);', '--t-body: calc(var(--S) * .03);'), /exemplar\.css.*body/],
  ['a later headline is too long', SLIDE, inFirstSlide(`<h2 class="h1">${'Um título muito longo '.repeat(4)}</h2>`), /headline is \d+ characters/],
  ['a second motif with extra classes', SLIDE, inFirstSlide('<img class="motif big" src="../../../../assets/motifs/cube-bar.svg" alt="">'), /more than one cube motif/],
  ['two focal motifs plus a pattern', `${EX}/src/social-card.html`, inFirstSlide('<div class="rse-motif-pattern" aria-hidden="true"></div><img class="motif" src="../../../../assets/motifs/cube-bar.svg" alt="">'), /more than one cube motif/],
  ['rgb() colour', PITCH, inFirstSlide('<p style="color:rgb(255,0,0)">x</p>'), /rgb|hsl/],
  ['literal px font size', PITCH, inFirstSlide('<p style="font-size:12px">x</p>'), /literal px font-size/],
  ['font size that is not a type role', PITCH, inFirstSlide('<p style="font-size:calc(var(--S) * .036)">x</p>'), /not a type role/],
  ['star emoji', PITCH, inFirstSlide('<p>⭐</p>'), /emoji/],
  ['dead anchor', 'DESIGN.md', swap('AGENTS.md#non-negotiables', 'AGENTS.md#does-not-exist'), /anchor/],
  ['provenance word without the rule', 'DESIGN.md', swapRe(/Never\s+fill a gap/, 'Do not guess a gap'), /provenance rule/],
  ['chart cap above the data colours', 'docs/composition/modules.md', swap('Maximum series: 4', 'Maximum series: 7'), /series.*data colours/],
  ['social headline too long', `${EX}/src/social-card.html`, swap('Venha conhecer a nossa escola', 'Venha conhecer a nossa escola, hoje mesmo'), /headline is \d+ characters/],
  ['poster display headline too long', `${EX}/src/poster-a3.html`, swap('Aprender para a vida acontecer', 'Aprender para a vida acontecer todos os dias'), /display headline is \d+ characters/],
  ['grid is not twelve columns', 'docs/composition/formats.json', json((o) => { fmt('print-a4', o).gridColumns = 6; }), /gridColumns/],
  ['safeArea is not defined', 'docs/composition/formats.json', json((o) => { delete o.definitions; }), /definitions\.safeArea/],
  ['print format without bleed', 'docs/composition/formats.json', json((o) => { delete fmt('print-a3', o).bleed; }), /bleed/],
  ['font recipe without static weights', 'DESIGN.md', (s) => s.replaceAll('instantiateVariableFont', 'x'), /static weights/],
  ['principles stop naming the primary purple', 'docs/composition/principles.md', (s) => s.replaceAll('--rse-color-primary', '--x'), /principles\.md.*--rse-color-primary/],
  ['text that invites redrawing the artwork', 'DESIGN.md', (s) => `${s}\nYou can also draw them yourself.\n`, /redraw/],
  ['report route promises an exemplar that does not exist', 'DESIGN.md', swap('No report exemplar', 'A report exemplar'), /report exemplar/],
  ['rubric R4 forgets bleed', 'docs/composition/rubric.md', (s) => s.replaceAll('bleed', 'run'), /R4/],
];

let failed = 0;
const base = validate();
if (base.code !== 0) { console.log(`FAIL baseline: the unmodified copy does not pass\n${base.out}`); failed++; }
else console.log('ok   baseline passes');

for (const [name, file, mutate, expect] of mutations) {
  const original = rd(file);
  try {
    wr(file, mutate(original));
    const r = validate();
    if (r.code === 0) { console.log(`FAIL ${name}: the validator still passes`); failed++; }
    else if (!expect.test(r.out)) { console.log(`FAIL ${name}: it failed, but not with ${expect}\n${r.out.split('\n').filter((l) => l.startsWith('ERROR')).join('\n')}`); failed++; }
    else console.log(`ok   ${name}`);
  } catch (e) { console.log(`FAIL ${name}: ${e.message}`); failed++; }
  finally { wr(file, original); }
}

// An exemplar with no format mapping would skip every density check silently.
{
  copyFileSync(join(TMP, `${EX}/src/social-card.html`), join(TMP, `${EX}/src/extra.html`));
  copyFileSync(join(TMP, `${EX}/social-card.md`), join(TMP, `${EX}/extra.md`));
  copyFileSync(join(TMP, `${EX}/social-card.png`), join(TMP, `${EX}/extra.png`));
  const r = validate();
  if (r.code !== 0 && /no format mapping/.test(r.out)) console.log('ok   an exemplar with no format mapping');
  else { console.log('FAIL an exemplar with no format mapping: not reported'); failed++; }
  for (const f of [`${EX}/src/extra.html`, `${EX}/extra.md`, `${EX}/extra.png`]) rmSync(join(TMP, f));
}

// A pattern is a field and the loader is transient, so neither counts as a focal motif: a slide
// with one motif plus a pattern and a loader must still pass (positive control for the matcher).
{
  const f = `${EX}/src/social-card.html`;
  const original = rd(f);
  wr(f, inFirstSlide('<div class="rse-motif-pattern" aria-hidden="true"></div><span class="rse-motif-loader"></span><div class="rse-motif-pattern rse-motif-pattern--blue"></div>')(original));
  const r = validate();
  if (r.code === 0) console.log('ok   one motif plus a pattern and a loader passes');
  else { console.log(`FAIL one motif plus a pattern and a loader passes: miscounted\n${r.out.split('\n').filter((l) => l.startsWith('ERROR')).join('\n')}`); failed++; }
  wr(f, original);
}

rmSync(TMP, { recursive: true, force: true });
console.log(failed ? `\n${failed} FAILED` : `\nall ${mutations.length + 3} checks behave`);
process.exit(failed ? 1 : 0);
