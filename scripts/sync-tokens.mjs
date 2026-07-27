#!/usr/bin/env node
// Rebuilds the `tokens` array in _ds_manifest.json from the CSS in tokens/.
//
//   node scripts/sync-tokens.mjs          # write
//   node scripts/sync-tokens.mjs --check  # report drift only (exit 1 if out of date)
//
// The manifest is what design tooling reads to list the system's tokens. Adding a
// custom property to tokens/*.css without running this leaves the token invisible
// there. Kinds already recorded in the manifest are preserved; new tokens are
// classified by their `/* @kind x */` annotation, then by name, then by value.

import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const checkOnly = process.argv.includes('--check');
const manifestPath = join(ROOT, '_ds_manifest.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

const files = (manifest.globalCssPaths ?? []).filter((p) => p.startsWith('tokens/') && p !== 'tokens/fonts.css');

const known = new Map();
for (const t of manifest.tokens ?? []) known.set(`${t.name}|${t.definedIn}|${t.scope ?? ''}`, t);

// Value first, name second: --text-body is a colour and --text-body-md is a size,
// so the name alone never settles it.
const classify = (name, value, annotation) => {
  if (annotation) return annotation;
  if (/^--shadow-/.test(name)) return 'shadow';
  if (/^#|^rgba?\(|^hsla?\(|^(white|black|transparent)$/i.test(value)) return 'color';
  if (/^var\(--(color|gray|tint|surface|text|border|success|warning|danger|info|focus)/.test(value)) return 'color';
  if (/^--radius-/.test(name)) return 'radius';
  if (/^--(space|container|grid-gutter|section-y|header-height|hit-target)/.test(name)) return 'spacing';
  if (/^--(font|text|line-height|letter-spacing)/.test(name)) return 'font';
  return 'other';
};

const tokens = [];
for (const file of files) {
  const raw = readFileSync(join(ROOT, file), 'utf8');
  // `/* @kind x */` annotations are meaningful; every other comment is prose that
  // can contain token-shaped text, so keep the annotations and drop the rest.
  const cleaned = raw.replace(/\/\*(?!\s*@kind\b)[\s\S]*?\*\//g, '');
  // walk blocks so each declaration keeps its selector scope
  for (const block of cleaned.matchAll(/([^{}]+)\{([^}]*)\}/g)) {
    const selector = block[1].trim();
    if (!selector || selector.startsWith('@')) continue;
    for (const decl of block[2].matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);?(\s*\/\*\s*@kind\s+(\w+)\s*\*\/)?/gi)) {
      const name = decl[1];
      const value = decl[2].trim();
      if (!value) continue;
      const scope = selector === ':root' ? undefined : selector;
      const prior = known.get(`${name}|${file}|${scope ?? ''}`);
      const entry = { name, value, kind: classify(name, value, decl[4]), definedIn: file };
      if (scope) entry.scope = scope;
      if (prior?.annotation) entry.annotation = prior.annotation;
      else if (decl[4]) entry.annotation = decl[4];
      tokens.push(entry);
    }
  }
}

const before = JSON.stringify(manifest.tokens);
const after = JSON.stringify(tokens);
if (before === after) { console.log(`tokens already in sync (${tokens.length})`); process.exit(0); }

const names = (list) => new Set(list.map((t) => `${t.name}|${t.definedIn}|${t.scope ?? ''}`));
const added = [...names(tokens)].filter((k) => !names(manifest.tokens ?? []).has(k));
const removed = [...names(manifest.tokens ?? [])].filter((k) => !names(tokens).has(k));

if (checkOnly) {
  console.log(`manifest tokens are out of date (${manifest.tokens?.length ?? 0} recorded, ${tokens.length} in CSS)`);
  for (const a of added) console.log(`  + ${a}`);
  for (const r of removed) console.log(`  - ${r}`);
  process.exit(1);
}

manifest.tokens = tokens;
writeFileSync(manifestPath, JSON.stringify(manifest));
console.log(`wrote ${tokens.length} tokens (${added.length} added, ${removed.length} removed)`);
for (const a of added) console.log(`  + ${a}`);
for (const r of removed) console.log(`  - ${r}`);
