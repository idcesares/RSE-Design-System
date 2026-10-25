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

// ─── report ────────────────────────────────────────────────────────────────
if (!quiet) console.log(`formats     ${formats.length}`);
for (const e of errors) console.log(`ERROR  ${e}`);
console.log(errors.length ? `FAILED — ${errors.length} error(s)` : 'OK — 0 errors');
process.exit(errors.length ? 1 : 0);
