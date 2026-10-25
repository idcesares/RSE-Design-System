#!/usr/bin/env node
// Integrity check for the composition layer (DESIGN.md + docs/composition/).
//
//   node scripts/check-composition.mjs          # report
//   node scripts/check-composition.mjs --quiet  # only problems
//
// Exits 1 on any ERROR. The layer is stack-agnostic prose and data; this script keeps the data
// internally consistent and the prose's cross-references alive. See docs/composition/.

import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
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
if (!exists(FORMATS)) {
  err(`${FORMATS} missing`);
} else {
  try {
    formats = JSON.parse(read(FORMATS)).formats ?? [];
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
  if (!isPosInt(f.gridColumns)) bad('gridColumns must be a positive integer');
  const t = f.type ?? {};
  for (const r of TYPE_ROLES) if (!(t[r] > 0)) bad(`type.${r} must be a positive fraction`);
  if (TYPE_ROLES.every((r) => t[r] > 0)) {
    if (t.h1 / t.body < 3) bad(`type.h1 / type.body is ${(t.h1 / t.body).toFixed(2)}; the scale jump must be at least 3`);
    if (t.display < t.h1 || t.h1 < t.h2 || t.h2 < t.body || t.body < t.caption) bad('type scale must descend: display ≥ h1 ≥ h2 ≥ body ≥ caption');
    if (!(f.minText > 0) || t.body < f.minText) bad('type.body must be at least minText');
    if (t.eyebrow > t.body) bad('type.eyebrow must not exceed type.body');
  }
  if (!(f.safeArea > 0) || f.safeArea > f.margin) bad('safeArea must be positive and no larger than margin');
  if (!isPosInt(f.maxWords)) bad('maxWords must be a positive integer');
  if (!isPosInt(f.maxHeadlineChars)) bad('maxHeadlineChars must be a positive integer');
  if (!f.note || typeof f.note !== 'string') bad('note (why these numbers fit the medium) is required');
}
if (formats.length) {
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
    if (target && !existsSync(join(ROOT, dir, target))) err(`${file}: broken link "${href}"`);
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
  if (!/geometric sans/i.test(section('Fonts and fallbacks'))) err('DESIGN.md: "Fonts and fallbacks" must name the allowed fallback (a geometric sans)');
  if (!/provenance|label.*as (theirs|the user)|never fill/i.test(design)) err('DESIGN.md: missing the figures provenance rule (use the user\'s numbers, label them, never fill gaps)');
  for (const word of ['gradient', 'stock photo', 'emoji']) {
    if (!new RegExp(word, 'i').test(section('When asked for something the brand forbids'))) err(`DESIGN.md: forbidden-request section must cover "${word}"`);
  }
}
for (const f of ['DESIGN.md', ...COMPOSITION_DOCS]) checkLinks(f);
for (const f of COMPOSITION_DOCS) if (!exists(f)) err(`${f} missing`);

if (exists('docs/composition/rubric.md')) {
  const rubric = read('docs/composition/rubric.md');
  const ids = [...rubric.matchAll(/^## R(\d+)\b/gm)].map((m) => Number(m[1]));
  if (ids.join() !== Array.from({ length: 12 }, (_, i) => i + 1).join()) err(`rubric.md: expected checks R1–R12 in order, found [${ids.join(', ')}]`);
}

// ─── report ────────────────────────────────────────────────────────────────
if (!quiet) console.log(`formats     ${formats.length}`);
for (const e of errors) console.log(`ERROR  ${e}`);
console.log(errors.length ? `FAILED — ${errors.length} error(s)` : 'OK — 0 errors');
process.exit(errors.length ? 1 : 0);
