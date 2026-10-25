// Node cannot import .jsx, so evaluate the motif sources the way build-bundle.mjs does: the same
// transform (lib/bundle-form.mjs: strip the module syntax, turn `import { x } from './Name.jsx'`
// into a read from the shared scope), each file in its own function scope, exports published on
// one shared `scope` object. React is a stub whose createElement returns a plain, comparable tree.
//
// Only `export function` / `export const` are seen (see lib/bundle-form.mjs); the engine sources
// must not use `export async function` or any other export form.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { exportedNames, toBundleForm } from './bundle-form.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

// Evaluated in this order: a file may import what the files before it export.
const SOURCES = ['components/brand/BrandMotif.jsx', 'components/brand/MotifEngine.jsx', 'components/feedback/MotifLoader.jsx', 'components/core/Icon.jsx', 'components/brand/MotifPattern.jsx'];

const React = {
  createElement: (type, props, ...children) => ({ type, props, children }),
  // A forwardRef component is its render function: tests call it as (props, ref).
  forwardRef: (render) => render,
  // Hooks for a render outside React: state never changes, memo runs once, and effects are recorded
  // (React.effects) so a test can run them against a fake window.
  effects: [],
  useState: (init) => [typeof init === 'function' ? init() : init, () => {}],
  useRef: (init = null) => ({ current: init }),
  useMemo: (fn) => fn(),
  useCallback: (fn) => fn,
  useEffect: (fn) => { React.effects.push(fn); },
};

export async function loadMotifEngine() {
  const scope = {};
  for (const path of SOURCES) {
    const src = readFileSync(join(ROOT, path), 'utf8');
    const names = exportedNames(src);
    const factory = new Function('React', 'scope', `${toBundleForm(src)}\nreturn { ${names.join(', ')} };`);
    Object.assign(scope, factory(React, scope));
  }
  scope.React = React;
  return scope;
}
