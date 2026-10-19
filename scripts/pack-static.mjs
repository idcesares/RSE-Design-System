#!/usr/bin/env node
// Builds the static kit: a self-contained, versioned folder for any site that cannot `npm install`
// — a WordPress or Liferay theme, the enrollment portal, a deck handed over as a file.
//
//   node scripts/pack-static.mjs        # → dist/static/rse-<version>/
//
// Upload the folder as-is to a versioned path you control (e.g. /rse/2.2.0/) and link
// rse-<version>/styles.css. The release workflow zips it and attaches it to the GitHub Release.
// The layout mirrors the repo, so every relative path in it (fonts, starters, bundle) still works.

import { readFileSync, existsSync, rmSync, mkdirSync, cpSync, writeFileSync, statSync } from 'node:fs';
import { join, dirname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const name = `rse-${pkg.version}`;
const OUT = join(ROOT, 'dist', 'static', name);

const INCLUDE = [
  'styles.css', 'tokens', 'dist/rse.js', 'dist/tokens.json', 'dist/tokens.js', 'dist/tokens.d.ts',
  'brand.json', 'image-slot.js', 'assets', 'starters', 'RULES.md', 'LICENSE',
];
// Reference artboards are not assets to place in a layout (assets/logos/README.md).
const EXCLUDE = [/^assets\/logos\/source\//];

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
let files = 0;
for (const entry of INCLUDE) {
  const from = join(ROOT, entry);
  if (!existsSync(from)) { console.error(`pack-static: missing ${entry} — run \`npm run sync\` first`); process.exit(1); }
  cpSync(from, join(OUT, entry), {
    recursive: true,
    filter: (src) => {
      const rel = relative(ROOT, src).split(sep).join('/');
      if (EXCLUDE.some((re) => re.test(rel))) return false;
      if (statSync(src).isFile()) files++;
      return true;
    },
  });
}
writeFileSync(join(OUT, 'VERSION'), `${pkg.name}@${pkg.version}\n`);
console.log(`dist/static/${name}/ — ${files} files. Link ${name}/styles.css; components: ${name}/dist/rse.js after React 18 UMD.`);
