#!/usr/bin/env node
// Re-mirrors component sources into _ds_bundle.js and refreshes its source hashes.
//
//   node scripts/sync-bundle.mjs          # write
//   node scripts/sync-bundle.mjs --check  # report drift, change nothing (exit 1 if stale)
//
// Why this exists: every static page, template and card loads _ds_bundle.js, NOT the
// .jsx files. A component edit that is not mirrored here simply does not take effect.
//
// The mirror is a copy, not a compile: components in this system are written in
// React.createElement form on purpose, so no JSX transform is needed. A component
// written with JSX tags is rejected — rewrite it in createElement form.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const checkOnly = process.argv.includes('--check');
const BUNDLE = join(ROOT, '_ds_bundle.js');

let bundle = readFileSync(BUNDLE, 'utf8');
const metaMatch = bundle.match(/^\/\* @ds-bundle: (.*?) \*\//s);
const meta = JSON.parse(metaMatch[1]);
const manifest = JSON.parse(readFileSync(join(ROOT, '_ds_manifest.json'), 'utf8'));

const hasJsx = (src) =>
  src.split('\n').some((l) => /^\s*(return\s*\(|<[A-Z])/.test(l) && /<[A-Za-z][\w.]*[\s/>]/.test(l));

const toBundleForm = (src) =>
  src.replace(/^import React from 'react';\n/, '').replace(/^export (function|const) /gm, '$1 ').trimEnd();

const stale = [];
for (const c of manifest.components) {
  const path = c.sourcePath;
  const file = join(ROOT, path);
  if (!existsSync(file)) { console.error(`missing source ${path}`); process.exitCode = 1; continue; }
  const src = readFileSync(file, 'utf8');
  if (hasJsx(src)) {
    console.error(`${path}: written with JSX — this system uses React.createElement form. Rewrite it.`);
    process.exitCode = 1;
    continue;
  }
  const name = basename(path).replace(/\.jsx$/, '');
  const start = `// ${path}\ntry { (() => {\n`;
  const end = `\nObject.assign(__ds_scope, { ${name}`;
  let i = bundle.indexOf(start);
  let j = i < 0 ? -1 : bundle.indexOf(end, i);
  if (i < 0) {
    // New component: splice an empty block in before the namespace exports, so the rest of
    // this function can fill it like any other.
    const anchor = bundle.indexOf('\n__ds_ns.');
    if (anchor < 0) { console.error(`${path}: cannot find where to insert a new block`); process.exitCode = 1; continue; }
    if (checkOnly) { stale.push(`${path} (not in bundle yet)`); continue; }
    const block = `${start}\nObject.assign(__ds_scope, { ${name} });\n})(); } catch (e) { __ds_ns.__errors.push({ path: ${JSON.stringify(path)}, error: String((e && e.message) || e) }); }\n`;
    bundle = bundle.slice(0, anchor + 1) + block + bundle.slice(anchor + 1);
    const exportLine = `\n__ds_ns.${name} = __ds_scope.${name};\n`;
    const lastExport = bundle.lastIndexOf('__ds_ns.');
    const lineEnd = bundle.indexOf('\n', lastExport);
    bundle = bundle.slice(0, lineEnd + 1) + exportLine + bundle.slice(lineEnd + 1);
    console.log(`inserted new block for ${path}`);
    i = bundle.indexOf(start);
    j = bundle.indexOf(end, i);
  }
  if (j < 0) { console.error(`${path}: no block found in _ds_bundle.js`); process.exitCode = 1; continue; }
  const current = bundle.slice(i + start.length, j);
  const next = toBundleForm(src);
  const hash = createHash('sha256').update(readFileSync(file)).digest('hex').slice(0, 12);
  if (meta.sourceHashes[path] !== hash || current !== next) {
    stale.push(path);
    if (!checkOnly) {
      bundle = bundle.slice(0, i + start.length) + next + bundle.slice(j);
      meta.sourceHashes[path] = hash;
    }
  }
}

// Non-component sources the bundle also inlines (ui kit screens) only need hashes refreshed.
for (const path of Object.keys(meta.sourceHashes)) {
  if (manifest.components.some((c) => c.sourcePath === path)) continue;
  if (!existsSync(join(ROOT, path))) {
    // The source was renamed or removed. Left in place, the stale entry fails check-ds on every
    // later run with no way to clear it but hand-editing a generated file — so drop it here and
    // say so. The inlined block itself is not touched: if it is now orphaned, check-ds will say.
    stale.push(path + ' (removed — source no longer exists)');
    if (!checkOnly) delete meta.sourceHashes[path];
    continue;
  }
  const hash = createHash('sha256').update(readFileSync(join(ROOT, path))).digest('hex').slice(0, 12);
  if (meta.sourceHashes[path] !== hash) {
    stale.push(path + ' (hash only — edit the block in _ds_bundle.js by hand if behaviour changed)');
    if (!checkOnly) meta.sourceHashes[path] = hash;
  }
}

if (!stale.length) { console.log('bundle already in sync'); process.exit(process.exitCode ?? 0); }

if (checkOnly) {
  console.log(`stale (${stale.length}):`);
  for (const s of stale) console.log(`  ${s}`);
  process.exit(1);
}

bundle = `/* @ds-bundle: ${JSON.stringify(meta)} */` + bundle.slice(metaMatch[0].length);
writeFileSync(BUNDLE, bundle);
console.log(`synced ${stale.length} source(s) into _ds_bundle.js:`);
for (const s of stale) console.log(`  ${s}`);
