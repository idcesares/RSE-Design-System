#!/usr/bin/env node
// Copies this design system into a consuming project as a self-contained `_ds/` folder.
//
//   node scripts/bind.mjs ../my-site                 # full: brand + web + React
//   node scripts/bind.mjs ../my-generator --tier=brand   # brand.json + tokens + assets, no JS
//   node scripts/bind.mjs ../my-site --check         # is the bound copy still current?
//   node scripts/bind.mjs ../my-site --force         # overwrite a folder we did not stamp
//
// There is no registry and no build step: binding is a copy plus a stamp. The stamp
// (_ds/BIND.json) records the version and a hash per file, so --check can tell a consumer
// whether their copy is stale or has been edited in place. Re-run bind to update.
//
// See docs/integration.md for what a consumer does with the result.

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync, mkdirSync, cpSync, rmSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname, resolve as resolvePath, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith('--')));
const tier = (args.find((a) => a.startsWith('--tier=')) ?? '--tier=full').split('=')[1];
const targetArg = args.find((a) => !a.startsWith('--'));

if (!targetArg) {
  console.error('usage: node scripts/bind.mjs <target-project-dir> [--tier=full|brand] [--check] [--force]');
  process.exit(2);
}
if (!['full', 'brand'].includes(tier)) {
  console.error(`unknown tier "${tier}" — expected "full" or "brand"`);
  process.exit(2);
}

const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const targetRoot = resolvePath(process.cwd(), targetArg);
const dest = join(targetRoot, '_ds');
const stampPath = join(dest, 'BIND.json');

// ─── What travels ───────────────────────────────────────────────────────────
// `brand` is everything a non-web generator needs: the contract, the tokens as CSS, and
// the artwork. `full` adds the browser bundle and the React entry on top.
const BRAND_TIER = ['brand.json', 'tokens', 'assets'];
const FULL_TIER = [...BRAND_TIER, 'styles.css', '_ds_bundle.js', '_ds_manifest.json', 'image-slot.js', 'index.js', 'index.d.ts', 'components'];

// Reference artboards and superseded rasters are not assets to place in a layout
// (assets/logos/README.md), so they do not travel.
const EXCLUDE = [/^assets[/\\]logos[/\\]source[/\\]/, /^assets[/\\]logo-[a-z-]+\.png$/, /\.card\.html$/];
const excluded = (rel) => EXCLUDE.some((re) => re.test(rel));

// Written by bind rather than copied, so they have no counterpart under ROOT.
const GENERATED = ['AGENTS.md', 'check.mjs'];

const sources = tier === 'brand' ? BRAND_TIER : FULL_TIER;

function filesUnder(rel, out = []) {
  const abs = join(ROOT, rel);
  if (!existsSync(abs)) return out;
  if (statSync(abs).isDirectory()) {
    for (const name of readdirSync(abs).sort()) filesUnder(join(rel, name), out);
  } else if (!excluded(rel)) {
    out.push(rel.split(sep).join('/'));
  }
  return out;
}

const manifestFiles = sources.flatMap((s) => filesUnder(s));
const hashOf = (abs) => createHash('sha256').update(readFileSync(abs)).digest('hex').slice(0, 16);

// ─── The rules stub that travels with the copy ──────────────────────────────
// Without this, an agent working in the consuming repo has no idea the constraints exist
// and reaches for a raw hex within minutes.
function agentsStub(brand) {
  const p = (t) => brand.palette.find((c) => c.token === t)?.hex ?? '';
  return `# Rede Sesc de Educação — bound design system

This folder is a **copy** of the Rede Sesc de Educação design system, v${brand.version}, placed here
by \`npm run bind\` in the design system repo. Do not edit anything in it: re-run bind to update,
or the next update silently overwrites your changes. Run \`node _ds/check.mjs\` to see whether this
copy is current.

**\`brand.json\` is the contract.** Every colour resolved to a literal hex with its CMYK, the full
type and spacing scales, every logo, motif, pattern and icon indexed by role, and the brand rules in
machine-readable form. Anything that can parse JSON can consume the brand from it — no CSS, no React.

## The rules that matter most

1. **Tokens only.** Never a raw hex, font stack, radius, shadow or duration. In CSS use
   \`var(--token)\`; elsewhere read \`brand.json\`.
2. **Montserrat**, weights 400–900. Headings 800. Eyebrows 700 uppercase — the only uppercase.
   Sentence case everywhere else.
3. **pt-BR** for everything a person reads (copy, labels, alt text, errors). English for everything
   the system is made of (file, token, component and prop names). \`<html lang="pt-BR">\`.
4. **No emoji, no one-off SVG icons.** Icons come from the Lucide set in \`assets/icons/lucide/\`.
5. **Never invent Sesc facts** — student counts, addresses, fees, dates and enrollment windows are
   examples. Keep them visibly placeholder-ish and say what needs verifying.
6. **Never invent imagery.** No photography exists. Use a placeholder carrying a pt-BR shot brief.
7. **The selo is fixed geometry.** Clearspace X on all sides (X = height of the stem of the E),
   minimum 45 mm print / 150 px digital, below that switch to the wordmark. Never rotate, stretch,
   distort, add effects to or redraw it. Palette colours only, never a gradient.
8. **The motif is artwork, not decoration.** One construction per composition, never recoloured.
9. **Accessibility is part of done.** Contrast ≥ 4.5:1 body / ≥ 3:1 large text and UI borders,
   focus always visible, hit targets ≥ ${brand.rules.accessibility.hitTargetMin}, keyboard path complete.
10. **At most two background colours per composition** — cream (\`${p('--color-cream')}\`) plus one
    brand-purple (\`${p('--color-purple-dark')}\`) band. Accent hues live in tags and chips only.

The full reasoning, the component reference and the brand manual extract live in the design system
repo, not here. \`brand.json\` → \`rules\` carries the machine-checkable summary; where the two ever
disagree, the repo wins.

## Wiring

| You are building | Load |
| --- | --- |
| A page that should look like the Rede | \`_ds/styles.css\` |
| Something inside a site that has its own styles | \`_ds/tokens/tokens-only.css\` (+ \`tokens/base-runtime.css\` if you use the components) |
| Static HTML with components | the above, plus \`_ds/_ds_bundle.js\` → \`window.${brand.namespace}\` |
| React | \`import { Button } from './_ds/index.js'\` — never from a component file directly |
| A poster, a social post, a PDF, anything not a browser | read \`_ds/brand.json\` |

\`assets/\` must stay a sibling of \`tokens/\`: \`tokens/fonts.css\` reaches for \`../assets/fonts/\` and
falls back silently to a system font if that layout breaks.
`;
}

// The freshness checker travels too, so a consumer never needs this repo to answer
// "is my copy current?".
const CHECK_SCRIPT = `#!/usr/bin/env node
// Reports whether this bound copy of the design system is current and unmodified.
//   node _ds/check.mjs
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const stamp = JSON.parse(readFileSync(join(HERE, 'BIND.json'), 'utf8'));
const modified = [], missing = [];
for (const [rel, hash] of Object.entries(stamp.files)) {
  const abs = join(HERE, rel);
  if (!existsSync(abs)) { missing.push(rel); continue; }
  const actual = createHash('sha256').update(readFileSync(abs)).digest('hex').slice(0, 16);
  if (actual !== hash) modified.push(rel);
}
console.log(\`design system v\${stamp.version} (tier \${stamp.tier}), bound from \${stamp.boundFrom}\`);
console.log(\`\${Object.keys(stamp.files).length} files\`);
for (const m of missing) console.log(\`MISSING   \${m}\`);
for (const m of modified) console.log(\`MODIFIED  \${m}  — edited in place; re-bind will overwrite it\`);
console.log(missing.length || modified.length
  ? \`\\nnot clean — \${missing.length} missing, \${modified.length} modified. Re-run bind from the design system repo.\`
  : '\\nclean — matches the version it was bound from.');
process.exit(missing.length || modified.length ? 1 : 0);
`;

// ─── --check ────────────────────────────────────────────────────────────────
if (flags.has('--check')) {
  if (!existsSync(stampPath)) {
    console.log(`no bind stamp at ${relative(process.cwd(), stampPath)} — nothing bound here yet`);
    process.exit(1);
  }
  const stamp = JSON.parse(readFileSync(stampPath, 'utf8'));
  const problems = [];
  if (stamp.version !== pkg.version) problems.push(`bound at v${stamp.version}, design system is now v${pkg.version}`);
  for (const rel of manifestFiles) {
    const there = join(dest, rel);
    if (!existsSync(there)) { problems.push(`missing in target: ${rel}`); continue; }
    if (hashOf(there) !== hashOf(join(ROOT, rel))) problems.push(`differs from source: ${rel}`);
  }
  // GENERATED files have no counterpart under ROOT — compare them against what bind would
  // write today, so a changed rules stub shows up as stale like any other drift.
  const wouldWrite = {
    'AGENTS.md': agentsStub(JSON.parse(readFileSync(join(ROOT, 'brand.json'), 'utf8'))),
    'check.mjs': CHECK_SCRIPT,
  };
  for (const [rel, expected] of Object.entries(wouldWrite)) {
    const there = join(dest, rel);
    if (!existsSync(there)) problems.push(`missing in target: ${rel}`);
    else if (readFileSync(there, 'utf8') !== expected) problems.push(`differs from source: ${rel}`);
  }
  for (const rel of Object.keys(stamp.files)) {
    if (GENERATED.includes(rel)) continue;
    if (!manifestFiles.includes(rel) && existsSync(join(dest, rel))) problems.push(`no longer part of the system: ${rel}`);
  }
  console.log(`${relative(process.cwd(), dest)} — bound v${stamp.version}, tier ${stamp.tier}, ${Object.keys(stamp.files).length} files`);
  for (const p of problems.slice(0, 40)) console.log(`  ${p}`);
  if (problems.length > 40) console.log(`  … and ${problems.length - 40} more`);
  console.log(problems.length ? `\nSTALE — re-run: node scripts/bind.mjs ${targetArg}` : '\nup to date');
  process.exit(problems.length ? 1 : 0);
}

// ─── write ──────────────────────────────────────────────────────────────────
if (!existsSync(targetRoot)) {
  console.error(`target does not exist: ${targetRoot}`);
  process.exit(2);
}
if (existsSync(dest) && !existsSync(stampPath) && !flags.has('--force')) {
  console.error(`${relative(process.cwd(), dest)} exists but was not created by bind (no BIND.json).`);
  console.error('Refusing to overwrite it. Move it aside, or pass --force if you are sure.');
  process.exit(2);
}

// Clear only what a previous bind put there, so anything else in the folder survives.
if (existsSync(stampPath)) {
  const prior = JSON.parse(readFileSync(stampPath, 'utf8'));
  for (const rel of Object.keys(prior.files)) rmSync(join(dest, rel), { force: true });
}

mkdirSync(dest, { recursive: true });
for (const rel of manifestFiles) {
  const to = join(dest, rel);
  mkdirSync(dirname(to), { recursive: true });
  cpSync(join(ROOT, rel), to);
}

const brand = JSON.parse(readFileSync(join(dest, 'brand.json'), 'utf8'));
writeFileSync(join(dest, 'AGENTS.md'), agentsStub(brand));
writeFileSync(join(dest, 'check.mjs'), CHECK_SCRIPT);

const files = Object.fromEntries([
  ...manifestFiles.map((rel) => [rel, hashOf(join(dest, rel))]),
  ['AGENTS.md', hashOf(join(dest, 'AGENTS.md'))],
  ['check.mjs', hashOf(join(dest, 'check.mjs'))],
]);

writeFileSync(
  stampPath,
  JSON.stringify(
    {
      $comment: 'Written by scripts/bind.mjs in the design system repo. Do not edit anything in _ds/ — re-bind to update. Run `node _ds/check.mjs` to verify.',
      name: pkg.name,
      version: pkg.version,
      contract: brand.contract,
      tier,
      boundFrom: pkg.name,
      files,
    },
    null,
    2
  ) + '\n'
);

const bytes = manifestFiles.reduce((n, rel) => n + statSync(join(dest, rel)).size, 0);
console.log(`bound v${pkg.version} (tier ${tier}) → ${relative(process.cwd(), dest).split(sep).join('/')}`);
console.log(`${Object.keys(files).length} files, ${(bytes / 1024).toFixed(0)} KB`);
console.log('');
console.log('Next, in the consuming project:');
console.log(tier === 'brand'
  ? '  read _ds/brand.json — palette (hex + CMYK), scales, assets, rules'
  : '  <link rel="stylesheet" href="_ds/styles.css">   or   import { Button } from "./_ds/index.js"');
console.log('  _ds/AGENTS.md carries the rules for agents working in this repo.');
