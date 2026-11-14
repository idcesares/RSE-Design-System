// Shared stylesheet ownership: some wrappers render another component's contract.
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const shared = {
  'components/core/IconButton.js': 'components/core/Button.css',
  'components/forms/DateField.js': 'components/forms/Input.css',
};

export function cssContractPath(root, sourcePath) {
  const path = shared[sourcePath] || sourcePath.replace(/\.js$/, '.css');
  return existsSync(join(root, path)) ? path : null;
}

// Classes a component emits on purpose without a rule of its own: stable hooks for host CSS,
// animation and tests. Every other rse-* class a component emits must be defined in CSS
// (check-ds.mjs, "class contract"). Add a class here only with the reason.
export const HOOK_CLASSES = {
  'rse-motif__piece': 'MotifEngine SVG group per piece; carries --i/--ax/--ay for host or loader animation',
  'rse-motif-pattern__cells': 'MotifEngine SVG group of pattern cells; carries the opacity attribute',
};

// Stylesheets on the contract that no React wrapper owns: plain classes, used as className.
// build-css puts them first in dist/components.css, so a component's own rules win.
export const CONTRACT_ONLY = ['components/layout/layout.css'];

// What a component's source renders, read statically (check-ds and build-catalog share this).
/** Every literal rse-* class in the source's string literals. */
export const emittedClasses = (src) => {
  const out = new Set();
  for (const lit of src.matchAll(/(['"`])((?:(?!\1).)*)\1/g)) {
    for (const cls of lit[2].split(/\s+/)) if (/^rse-[a-z0-9_-]*[a-z0-9]$/.test(cls)) out.add(cls);
  }
  return out;
};
/** Modifiers built from a prop: 'rse-x--' + tone → { prefix: 'rse-x--', prop: 'tone', fallback }. */
export const dynamicModifiers = (src) => [...src.matchAll(/'(rse-[a-z0-9-]+--)'\s*\+\s*([A-Za-z_]\w*)\b(?!\s*[.(\[])/g)].map(([, prefix, prop]) => ({
  prefix, prop, fallback: src.match(new RegExp(`[{,]\\s*${prop}\\s*=\\s*'([^']+)'`))?.[1] ?? null,
}));
