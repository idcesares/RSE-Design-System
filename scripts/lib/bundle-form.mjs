// The source transform shared by scripts/build-bundle.mjs and scripts/lib/load-motif-engine.mjs,
// so the bundle and the node loader evaluate a component exactly the same way and cannot drift.
//
// Only `export function` and `export const` are recognised. `export async function`, `export let`,
// `export default` and `export { … }` are not: the bundle would not put them on window.RSE, so a
// component (and the motif engine) must not use them.

// A component may import another (Modal uses Icon): `import { Icon } from '../core/Icon.jsx'`
// becomes a read from the shared scope, and blocks are ordered so dependencies come first.
export const INTERNAL_IMPORT = /^import \{([^}]+)\} from '\.\.?\/(?:[a-z]+\/)?([A-Za-z]+)\.jsx';\r?\n/gm;

// The names a source exports, in source order.
export const EXPORT_DECL = /^export (?:function|const) ([A-Za-z_$][\w$]*)/gm;
export const exportedNames = (src) => [...src.matchAll(EXPORT_DECL)].map((m) => m[1]);

// 'use client' must sit above the imports in the source (Next.js App Router); inside the bundle's
// IIFE it is meaningless and a bare `import` is a syntax error, so both go.
export const toBundleForm = (src) =>
  src
    .replace(/^(['"])use client\1;?\r?\n/, '')
    .replace(/^import React from 'react';\n/, '')
    .replace(INTERNAL_IMPORT, (_, names) => `const {${names}} = scope;\n`)
    .replace(/^export (function|const) /gm, '$1 ')
    .trimEnd();
