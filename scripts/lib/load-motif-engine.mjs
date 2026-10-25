// Node cannot import .jsx, so evaluate the motif sources the way build-bundle.mjs does: strip
// the module syntax (see toBundleForm there), then run them in one shared scope with a stub
// React whose createElement returns a plain, comparable tree.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

// Evaluated in this order, in one scope: a file may use what the files before it export.
const SOURCES = ['components/brand/BrandMotif.jsx'];

const EXPORT_DECL = /^export (?:function|const) (\w+)/gm;

const toEvalForm = (src) =>
  src
    .replace(/^(['"])use client\1;?\r?\n/, '')
    .replace(/^import React from 'react';\n/, '')
    .replace(/^export (function|const) /gm, '$1 ')
    .trimEnd();

const React = {
  createElement: (type, props, ...children) => ({ type, props, children }),
};

export async function loadMotifEngine() {
  const names = [];
  let body = '';
  for (const path of SOURCES) {
    const src = readFileSync(join(ROOT, path), 'utf8');
    for (const m of src.matchAll(EXPORT_DECL)) names.push(m[1]);
    body += `${toEvalForm(src)}\n`;
  }
  return new Function('React', `${body}\nreturn { ${names.join(', ')} };`)(React);
}
