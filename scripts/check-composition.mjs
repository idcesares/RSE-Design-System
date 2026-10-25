#!/usr/bin/env node
// Integrity check for the composition layer (DESIGN.md + docs/composition/).
//
//   node scripts/check-composition.mjs          # report
//   node scripts/check-composition.mjs --quiet  # only problems
//
// Exits 1 on any ERROR. The layer is stack-agnostic prose and data; this script keeps the data
// internally consistent and the prose's cross-references alive. See docs/composition/.

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = process.env.COMPOSITION_ROOT ?? join(dirname(fileURLToPath(import.meta.url)), '..');
const quiet = process.argv.includes('--quiet');
const errors = [];
const err = (m) => errors.push(m);
const exists = (p) => existsSync(join(ROOT, p));
const read = (p) => readFileSync(join(ROOT, p), 'utf8');

const FORMAT_IDS = ['slide-16x9', 'slide-4x3', 'print-a4', 'print-a3', 'social-1x1', 'social-4x5', 'report-cover'];
const TYPE_ROLES = ['display', 'h1', 'h2', 'body', 'caption', 'eyebrow'];
const MEDIA = ['screen', 'print', 'social'];

// ─── formats.json ──────────────────────────────────────────────────────────
const FORMATS = 'docs/composition/formats.json';
let formats = [];
let formatsDefs = {};
if (!exists(FORMATS)) {
  err(`${FORMATS} missing`);
} else {
  try {
    const doc = JSON.parse(read(FORMATS));
    formats = doc.formats ?? [];
    formatsDefs = doc.definitions ?? {};
  } catch (e) {
    err(`${FORMATS} does not parse: ${e.message}`);
  }
}

const isPosInt = (n) => Number.isInteger(n) && n > 0;
const seen = new Set();
for (const f of formats) {
  const id = f.id ?? '(no id)';
  const bad = (m) => err(`${FORMATS}: ${id}: ${m}`);
  if (seen.has(id)) bad('duplicate id');
  seen.add(id);
  if (!Array.isArray(f.aspect) || f.aspect.length !== 2 || !f.aspect.every(isPosInt)) bad('aspect must be two positive integers');
  if (!MEDIA.includes(f.medium)) bad(`medium must be one of ${MEDIA.join(', ')}`);
  if (!(f.margin >= 0.04 && f.margin <= 0.12)) bad('margin must be between 0.04 and 0.12');
  if (f.gridColumns !== 12) bad('gridColumns must be 12: the archetypes are written on twelve columns');
  const t = f.type ?? {};
  for (const r of TYPE_ROLES) if (!(t[r] > 0)) bad(`type.${r} must be a positive fraction`);
  if (TYPE_ROLES.every((r) => t[r] > 0)) {
    if (t.h1 / t.body < 3) bad(`type.h1 / type.body is ${(t.h1 / t.body).toFixed(2)}; the scale jump must be at least 3`);
    if (t.display < t.h1 || t.h1 < t.h2 || t.h2 < t.body || t.body < t.caption) bad('type scale must descend: display ≥ h1 ≥ h2 ≥ body ≥ caption');
    if (!(f.minText > 0) || t.body < f.minText) bad('type.body must be at least minText');
    if (t.eyebrow > t.body) bad('type.eyebrow must not exceed type.body');
    for (const r of ['caption', 'eyebrow']) if (t[r] < f.minText) bad(`type.${r} must be at least minText`);
  }
  if (!(f.safeArea > 0) || f.safeArea > f.margin) bad('safeArea must be positive and no larger than margin');
  if (!isPosInt(f.maxWords)) bad('maxWords must be a positive integer');
  if (!isPosInt(f.maxHeadlineChars)) bad('maxHeadlineChars must be a positive integer');
  if (!isPosInt(f.maxDisplayChars) || f.maxDisplayChars > f.maxHeadlineChars) bad('maxDisplayChars must be a positive integer no larger than maxHeadlineChars');
  if (f.medium === 'print' && !(f.bleed > 0)) bad('print formats need a bleed (a positive fraction of the short side)');
  if (!f.note || typeof f.note !== 'string') bad('note (why these numbers fit the medium) is required');
}
if (formats.length) {
  for (const k of ['safeArea', 'bleed', 'maxHeadlineChars', 'maxDisplayChars', 'gridColumns']) {
    if (!formatsDefs[k]) err(`${FORMATS}: definitions.${k} missing`);
  }
  for (const id of FORMAT_IDS) if (!seen.has(id)) err(`${FORMATS}: missing format "${id}"`);
}

// ─── prose: entry point, links, rubric ─────────────────────────────────────
const INTENTS = ['deck', 'pitch', 'report', 'poster', 'social', 'one-pager', 'web page'];
const DESIGN_HEADINGS = ['Brief', 'Hard rules', 'Route by intent', 'Fonts and fallbacks', 'When asked for something the brand forbids'];
const COMPOSITION_DOCS = ['principles', 'modules', 'archetypes', 'rubric'].map((n) => `docs/composition/${n}.md`);

// Every relative markdown link in a doc must resolve (anchors and URLs are skipped).
function checkLinks(file) {
  if (!exists(file)) return;
  const dir = dirname(file);
  for (const m of read(file).matchAll(/\]\(([^)\s]+)\)/g)) {
    const href = m[1];
    if (/^(https?:|mailto:|#)/.test(href)) continue;
    const target = href.split('#')[0];
    if (target && !existsSync(join(ROOT, dir, target))) { err(`${file}: broken link "${href}"`); continue; }
    const frag = href.split('#')[1];
    if (target && frag && target.endsWith('.md')) {
      const slugs = new Set(readFileSync(join(ROOT, dir, target), 'utf8').split('\n').filter((l) => /^#{1,6}\s/.test(l)).map((l) => l.replace(/^#{1,6}\s+/, '').trim().toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu, '').replace(/\s/g, '-')));
      if (!slugs.has(frag)) err(`${file}: anchor "#${frag}" not found in ${target}`);
    }
  }
}

if (!exists('DESIGN.md')) {
  err('DESIGN.md missing');
} else {
  const design = read('DESIGN.md');
  for (const h of DESIGN_HEADINGS) if (!new RegExp(`^## ${h}\\s*$`, 'm').test(design)) err(`DESIGN.md: missing "## ${h}" section`);
  const route = design.match(/^## Route by intent\s*$([\s\S]*?)(?=^## |\s*$(?![\s\S]))/m)?.[1] ?? '';
  for (const intent of INTENTS) {
    const row = route.split('\n').find((l) => l.startsWith('|') && l.split('|')[1]?.trim().toLowerCase() === intent);
    if (!row) { err(`DESIGN.md: route table has no row for "${intent}"`); continue; }
    const links = [...row.matchAll(/\]\(([^)\s]+)\)/g)].length;
    if (links < 1 || links > 4) err(`DESIGN.md: route row "${intent}" has ${links} links; expected 1–4`);
  }
  // A URL-only agent has no npm: any command must be marked optional on its own line.
  for (const line of design.split('\n')) {
    if (/\bnpm\s+(run|install)\b/.test(line) && !/optional/i.test(line)) err(`DESIGN.md: npm command not marked optional: "${line.trim().slice(0, 60)}"`);
  }
  // Review Focus 1, 3, 5: the three behaviours an agent must not have to guess.
  const section = (h) => design.match(new RegExp(`^## ${h}\\s*$([\\s\\S]*?)(?=^## |(?![\\s\\S]))`, 'm'))?.[1] ?? '';
  if (!/assets\/fonts\//.test(section('Fonts and fallbacks'))) err('DESIGN.md: "Fonts and fallbacks" must say where Montserrat lives (assets/fonts/)');
  if (!/instantiateVariableFont/.test(section('Fonts and fallbacks')) || !/Thin/.test(section('Fonts and fallbacks'))) err('DESIGN.md: "Fonts and fallbacks" must show how to make static weights (instantiateVariableFont) and warn that the variable file defaults to Thin');
  if (/draw (them|it) yourself/i.test(design)) err('DESIGN.md: invites you to redraw official artwork; say to rasterise the path data unchanged');
  if (!/No report exemplar/.test(design)) err('DESIGN.md: must say plainly that no report exemplar exists yet');
  if (!/geometric sans/i.test(section('Fonts and fallbacks'))) err('DESIGN.md: "Fonts and fallbacks" must name the allowed fallback (a geometric sans)');
  if (!/provenance/i.test(design) || !/never\s+fill/i.test(design)) err('DESIGN.md: missing the figures provenance rule (use the user\'s numbers, label them, never fill gaps)');
  for (const word of ['gradient', 'stock photo', 'emoji']) {
    if (!new RegExp(word, 'i').test(section('When asked for something the brand forbids'))) err(`DESIGN.md: forbidden-request section must cover "${word}"`);
  }
}
for (const f of ['DESIGN.md', ...COMPOSITION_DOCS]) checkLinks(f);
for (const f of COMPOSITION_DOCS) if (!exists(f)) err(`${f} missing`);

if (exists('docs/composition/principles.md') && !/--rse-color-primary/.test(read('docs/composition/principles.md'))) err('principles.md: must name --rse-color-primary as the brand purple band');
if (exists('docs/composition/rubric.md')) {
  const rubric = read('docs/composition/rubric.md');
  const r4 = rubric.match(/^## R4\s*$([\s\S]*?)(?=^## |(?![\s\S]))/m)?.[1] ?? '';
  if (!/bleed/.test(r4)) err('rubric.md: R4 must say which elements may bleed into the safe area');
  const ids = [...rubric.matchAll(/^## R(\d+)\b/gm)].map((m) => Number(m[1]));
  if (ids.join() !== Array.from({ length: 12 }, (_, i) => i + 1).join()) err(`rubric.md: expected checks R1–R12 in order, found [${ids.join(', ')}]`);
}

// ─── modules and archetypes ────────────────────────────────────────────────
const MODULE_IDS = ['headline', 'bignumber', 'quote', 'figure', 'list', 'comparison', 'table', 'chart', 'timeline', 'callout', 'folio', 'imageslot'];
const GROUPS = ['Open', 'Argue', 'Prove', 'Compare', 'Show', 'Close'];

// Split a doc into { id, body } blocks at every "## <prefix>-<id>" heading.
function blocks(file, prefix) {
  if (!exists(file)) return [];
  const parts = read(file).split(/^(?=## )/m);
  return parts
    .map((p) => ({ m: p.match(new RegExp(`^## ${prefix}-([a-z0-9-]+)\\s*$`, 'm')), body: p }))
    .filter((p) => p.m)
    .map((p) => ({ id: p.m[1], body: p.body }));
}
const hasLine = (body, label) => new RegExp(`^${label}:\\s*\\S`, 'm').test(body);

const modules = blocks('docs/composition/modules.md', 'M');
const moduleIds = new Set(modules.map((m) => m.id));
for (const id of MODULE_IDS) if (!moduleIds.has(id)) err(`modules.md: missing "## M-${id}"`);
for (const m of modules) {
  if (!MODULE_IDS.includes(m.id)) err(`modules.md: unknown module "M-${m.id}"`);
  if (!hasLine(m.body, 'Variants')) err(`modules.md: M-${m.id} has no "Variants:" line`);
  else {
    const n = m.body.match(/^Variants:\s*(.+)$/m)[1].split(',').length;
    if (n < 2 || n > 3) err(`modules.md: M-${m.id} lists ${n} variants; expected 2–3`);
  }
  if (!hasLine(m.body, 'Fails when')) err(`modules.md: M-${m.id} has no "Fails when:" line`);
}
// Review Focus 2: a chart may not have more series than the palette can tell apart.
const chart = modules.find((m) => m.id === 'chart');
if (chart) {
  const cap = Number(chart.body.match(/^Maximum series:\s*(\d+)/m)?.[1]);
  const dataColours = Object.keys(JSON.parse(read('brand.json')).tokens).filter((k) => /^--rse-color-data-\d+$/.test(k)).length;
  if (!cap) err('modules.md: M-chart has no "Maximum series: <n>" line');
  else if (cap > dataColours) err(`modules.md: M-chart allows ${cap} series but the system defines only ${dataColours} data colours`);
  if (chart && !/Outros/.test(chart.body)) err('modules.md: M-chart must say what to do beyond the cap (group the rest as "Outros" or split the chart)');
}

const archetypes = blocks('docs/composition/archetypes.md', 'A');
const archetypeIds = new Set(archetypes.map((a) => a.id));
if (exists('docs/composition/archetypes.md')) {
  const text = read('docs/composition/archetypes.md');
  for (const g of GROUPS) if (!new RegExp(`^# ${g}\\s*$`, 'm').test(text)) err(`archetypes.md: missing group "# ${g}"`);
  if (archetypes.length < 12 || archetypes.length > 16) err(`archetypes.md: ${archetypes.length} archetypes; expected 12–16`);
  for (const a of archetypes) {
    for (const label of ['Modules', 'Grid', 'Colour', 'Fails when']) {
      if (!hasLine(a.body, label)) err(`archetypes.md: A-${a.id} has no "${label}:" line`);
    }
    const used = (a.body.match(/^Modules:\s*(.+)$/m)?.[1] ?? '').split(',').map((s) => s.trim()).filter(Boolean);
    for (const u of used) if (!moduleIds.has(u)) err(`archetypes.md: A-${a.id} uses unknown module "${u}"`);
  }
  // Each group must hold at least one archetype: groups are the "# " headings, archetypes follow them.
  const byGroup = text.split(/^(?=# )/m).filter((s) => /^# (Open|Argue|Prove|Compare|Show|Close)\s*$/m.test(s.split('\n')[0]));
  for (const s of byGroup) if (!/^## A-/m.test(s)) err(`archetypes.md: group "${s.split('\n')[0].slice(2)}" has no archetype`);
}

// ─── exemplars ─────────────────────────────────────────────────────────────
// Each exemplar X is exemplars/src/X.html (the source), exemplars/X.png (the render) and
// exemplars/X.md (why it works, the spec, the rubric result, the placeholders to replace).
const EX = 'docs/composition/exemplars';
const EX_SECTIONS = ['Why it works', 'Spec', 'Rubric', 'Placeholders'];
const exemplarNames = exists(`${EX}/src`) ? readdirSync(join(ROOT, EX, 'src')).filter((f) => f.endsWith('.html')).map((f) => f.replace(/\.html$/, '')) : [];
const EMOJI = /\p{Extended_Pictographic}|[\u{1F1E6}-\u{1F1FF}]/u;
const RAW_HEX = /[:"'(,\s]#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?(?:[0-9a-fA-F]{2})?(?![\w-])/;

for (const name of exemplarNames) {
  const src = `${EX}/src/${name}.html`;
  if (!exists(`${EX}/${name}.png`)) err(`${EX}/${name}.png missing — render it with node scripts/render-exemplars.mjs ${name}`);
  if (!exists(`${EX}/${name}.md`)) { err(`${EX}/${name}.md missing`); }
  else {
    const doc = read(`${EX}/${name}.md`);
    for (const h of EX_SECTIONS) if (!new RegExp(`^## ${h}\\s*$`, 'm').test(doc)) err(`${EX}/${name}.md: missing "## ${h}"`);
    const rub = doc.match(/^## Rubric\s*$([\s\S]*?)(?=^## |(?![\s\S]))/m)?.[1] ?? '';
    for (let i = 1; i <= 12; i++) {
      const line = rub.split('\n').find((l) => new RegExp(`^-\\s*R${i}:`).test(l));
      if (!line) { err(`${EX}/${name}.md: rubric has no line for R${i}`); continue; }
      if (!/^-\s*R\d+:\s*(yes|no)\s*[—-]\s*\S/i.test(line)) err(`${EX}/${name}.md: R${i} must read "R${i}: yes — reason" or "no — reason"`);
      if (/^-\s*R\d+:\s*no/i.test(line)) err(`${EX}/${name}.md: R${i} is "no" — fix the exemplar, do not document the failure`);
    }
    checkLinks(`${EX}/${name}.md`);
  }
  const html = read(src);
  if (RAW_HEX.test(html)) err(`${src}: raw hex colour — use --rse-* tokens`);
  if (/gradient\(/i.test(html)) err(`${src}: gradient — the brand is flat colour`);
  if (/\b(?:rgba?|hsla?)\(/i.test(html)) err(`${src}: rgb()/hsl() colour — use --rse-* tokens`);
  if (EMOJI.test(html)) err(`${src}: emoji`);
  if (!/<meta\s+name="canvas"\s+content="\d+x\d+"/.test(html)) err(`${src}: missing <meta name="canvas" content="WxH">`);
}

// Which format each exemplar is built to. The specimen sheet is a contact sheet, not a format.
const EXEMPLAR_FORMAT = { 'institutional-deck': 'slide-16x9', 'pitch-deck': 'slide-16x9', 'poster-a3': 'print-a3', 'social-card': 'social-4x5' };
// Grows as the plan lands each exemplar; every one listed must exist.
const REQUIRED_EXEMPLARS = ['specimen-sheet', 'institutional-deck', 'pitch-deck', 'poster-a3', 'social-card'];
for (const n of REQUIRED_EXEMPLARS) if (!exemplarNames.includes(n)) err(`${EX}/src/${n}.html missing — required exemplar`);

const groupOf = new Map();
if (exists('docs/composition/archetypes.md')) {
  let group = null;
  for (const line of read('docs/composition/archetypes.md').split('\n')) {
    const g = line.match(/^# (\w+)\s*$/); if (g) group = g[1];
    const a = line.match(/^## A-([a-z0-9-]+)\s*$/); if (a && group) groupOf.set(a[1], group);
  }
}
const textOf = (h) => h.replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();

for (const name of exemplarNames) {
  const fmt = formats.find((f) => f.id === EXEMPLAR_FORMAT[name]);
  if (!fmt && name !== 'specimen-sheet') err(`${EX}/src/${name}.html: no format mapping — add it to EXEMPLAR_FORMAT so its density is checked`);
  if (!fmt) continue;
  const html = read(`${EX}/src/${name}.html`);
  const slides = [...html.matchAll(/<section\b[^>]*data-slide[^>]*>([\s\S]*?)<\/section>/g)];
  if (!slides.length) { err(`${EX}/src/${name}.html: no <section data-slide> found`); continue; }
  const seenGroups = new Set();
  slides.forEach((m, i) => {
    const at = `${name} slide ${i + 1}`;
    const arch = m[0].match(/data-archetype="([^"]+)"/)?.[1];
    if (!arch) err(`${at}: no data-archetype`);
    else if (!archetypeIds.has(arch)) err(`${at}: unknown archetype "${arch}"`);
    else seenGroups.add(groupOf.get(arch));
    if ((m[0].match(/class="[^"]*\bmotif\b[^"]*"/g) ?? []).length > 1) err(`${at}: more than one cube motif — one per composition`);
    const words = textOf(m[1]).split(' ').filter(Boolean).length;
    if (words > fmt.maxWords) err(`${at}: ${words} words; ${fmt.id} allows ${fmt.maxWords}`);
    for (const h of m[1].matchAll(/<(\w+)\b[^>]*\bclass="([^"]*\b(?:display|h1)\b[^"]*)"[^>]*>([\s\S]*?)<\/\1>/g)) {
      const display = /\bdisplay\b/.test(h[2]);
      const max = display ? fmt.maxDisplayChars : fmt.maxHeadlineChars;
      const n = textOf(h[3]).length;
      if (n > max) err(`${at}: ${display ? 'display ' : ''}headline is ${n} characters; ${fmt.id} allows ${max}${display ? ' at display size' : ''}`);
    }
    if (/font-size:\s*[\d.]+px/.test(m[0])) err(`${at}: literal px font-size — use one of the format's type roles`);
    const roles = Object.values(fmt.type);
    for (const f of m[1].matchAll(/font-size:\s*calc\(var\(--S\)\s*\*\s*(\.\d+)\)/g)) {
      const v = Number(f[1]);
      if (v <= fmt.type.display && !roles.some((r) => Math.abs(r - v) < 1e-9)) err(`${at}: font-size ${f[1]} of the short side is not a type role of ${fmt.id}`);
    }
  });
  if (name === 'pitch-deck') {
    const used = (n) => new Set([...read(`${EX}/src/${n}.html`).matchAll(/data-archetype="([^"]+)"/g)].map((x) => x[1]));
    const other = exemplarNames.includes('institutional-deck') ? used('institutional-deck') : new Set();
    const fresh = [...used(name)].filter((a) => !other.has(a));
    if (fresh.length < 3) err(`${name}: only ${fresh.length} archetypes not used by institutional-deck; expected at least 3`);
  }
  if (name === 'institutional-deck') for (const g of GROUPS) if (!seenGroups.has(g)) err(`${name}: no archetype from the "${g}" group`);
}

for (const f of exists(`${EX}/src`) ? readdirSync(join(ROOT, EX, 'src')).filter((n) => n.endsWith('.css')) : []) {
  const css = read(`${EX}/src/${f}`);
  if (RAW_HEX.test(css)) err(`${EX}/src/${f}: raw hex colour — use --rse-* tokens`);
  if (/gradient\(/i.test(css)) err(`${EX}/src/${f}: gradient — the brand is flat colour`);
}

if (exists(`${EX}/src/exemplar.css`) && formats.length) {
  const css = read(`${EX}/src/exemplar.css`);
  const wanted = [['slide-16x9', /^\.slide\s*\{([\s\S]*?)\n\}/m], ['print-a3', /^\.slide\.fmt-a3\s*\{([\s\S]*?)\}/m], ['social-4x5', /^\.slide\.fmt-social45\s*\{([\s\S]*?)\}/m]];
  for (const [id, re] of wanted) {
    const f = formats.find((x) => x.id === id);
    const body = css.match(re)?.[1];
    if (!f || !body) { err(`${EX}/src/exemplar.css: no block for ${id}`); continue; }
    for (const r of TYPE_ROLES) {
      const got = body.match(new RegExp(`--t-${r}:\\s*calc\\(var\\(--S\\)\\s*\\*\\s*(\\.\\d+)\\)`))?.[1];
      if (!got || Math.abs(Number(got) - f.type[r]) > 1e-9) err(`${EX}/src/exemplar.css: --t-${r} for ${id} is ${got}; formats.json says ${f.type[r]}`);
    }
  }
}

// ─── link-up ───────────────────────────────────────────────────────────────
// One route in: the docs an agent or a person lands on all point at DESIGN.md, DESIGN.md reaches
// every exemplar, and the changelog carries the package version.
for (const f of ['SKILL.md', 'AGENTS.md', 'readme.md', 'docs/recipes.md']) {
  if (exists(f) && !/\]\((?:\.\.\/)?DESIGN\.md(?:#[^)]*)?\)/.test(read(f))) err(`${f}: does not link to DESIGN.md`);
}
if (exists('DESIGN.md')) {
  const design = read('DESIGN.md');
  for (const n of ['specimen-sheet', ...Object.keys(EXEMPLAR_FORMAT)]) {
    if (exists(`${EX}/${n}.md`) && !design.includes(`docs/composition/exemplars/${n}.md`)) err(`DESIGN.md: does not link to the ${n} exemplar`);
  }
}
{
  const version = JSON.parse(read('package.json')).version;
  if (!new RegExp(`^## ${version.replace(/\./g, '\\.')}\\b`, 'm').test(read('CHANGELOG.md'))) err(`CHANGELOG.md: no "## ${version}" section for the package version`);
}

// ─── report ────────────────────────────────────────────────────────────────
if (!quiet) console.log(`formats     ${formats.length}`);
for (const e of errors) console.log(`ERROR  ${e}`);
console.log(errors.length ? `FAILED — ${errors.length} error(s)` : 'OK — 0 errors');
process.exit(errors.length ? 1 : 0);
