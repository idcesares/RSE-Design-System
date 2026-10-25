#!/usr/bin/env node
// check-motif-contrast: MotifLoader paints the hue's base palette colour (and the engine's other
// shades, which are lighter or darker). Where that colour cannot reach 3:1 (WCAG 1.4.11, non-text
// graphics) against the surface the loader sits on, the loader's prompt must say so.
//   - for each of the six hues, the contrast of its `base` colour against the page surface, the
//     card surface, the ink surface and the dark-theme page surface;
//   - every failing (hue, surface) pair must appear in components/feedback/MotifLoader.prompt.md
//     as a line `Evite: <hue> sobre <surface>`; a documented pair that does not fail is an error
//     too, so the docs stay honest.
// Colours come from brand.json (the generated contract that audit.mjs and contrast-pairs.mjs read).
// `--selftest` runs the comparison against inline fixtures and exits 1 unless each fault is caught.
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const FLOOR = 3;
export const HUES = ['green', 'blue', 'pink', 'purple', 'orange', 'yellow'];
// Surface id (as written in the prompt) -> where its colour comes from.
export const SURFACES = {
  page: { token: '--rse-color-surface-page', theme: 'light' },
  card: { token: '--rse-color-surface-card', theme: 'light' },
  ink: { token: '--rse-brand-ink', theme: 'light' },
  'dark-page': { token: '--rse-color-surface-page', theme: 'dark' },
};

const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
export const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};

// Every (hue, surface) combination with its ratio.
export function combinations(brand) {
  const base = Object.fromEntries(Object.entries(brand.tokens).map(([k, v]) => [k, v.value]));
  const dark = { ...base, ...Object.fromEntries(Object.entries(brand.themes.dark.overrides).map(([k, v]) => [k, v.value])) };
  const out = [];
  for (const hue of HUES) {
    const fg = base[`--rse-brand-${hue}`];
    if (!fg) throw new Error(`check-motif-contrast: brand.json has no --rse-brand-${hue}`);
    for (const [surface, { token, theme }] of Object.entries(SURFACES)) {
      const bg = (theme === 'dark' ? dark : base)[token];
      if (!bg) throw new Error(`check-motif-contrast: no colour for ${token} (${theme})`);
      const r = ratio(fg, bg);
      out.push({ hue, surface, ratio: r, fails: r < FLOOR });
    }
  }
  return out;
}

// Compare the failing set with the `Evite:` lines of the prompt.
export function compare(combos, prompt, label = 'MotifLoader.prompt.md') {
  const errors = [];
  const documented = new Set([...prompt.matchAll(/^Evite: ([a-z]+) sobre ([a-z-]+)/gm)].map((m) => `${m[1]}|${m[2]}`));
  const known = new Set(combos.map((c) => `${c.hue}|${c.surface}`));
  for (const c of combos) {
    const key = `${c.hue}|${c.surface}`;
    if (c.fails && !documented.has(key)) errors.push(`${label}: missing "Evite: ${c.hue} sobre ${c.surface}" (${c.ratio.toFixed(2)}:1 < ${FLOOR})`);
    if (!c.fails && documented.has(key)) errors.push(`${label}: documents "Evite: ${c.hue} sobre ${c.surface}" but it passes (${c.ratio.toFixed(2)}:1)`);
  }
  for (const key of documented) if (!known.has(key)) errors.push(`${label}: "Evite: ${key.replace('|', ' sobre ')}" names an unknown hue or surface`);
  return errors;
}

if (process.argv.includes('--selftest')) {
  const brand = { tokens: { '--rse-color-surface-page': { value: '#ffffff' }, '--rse-color-surface-card': { value: '#ffffff' }, '--rse-brand-ink': { value: '#000000' },
    ...Object.fromEntries(HUES.map((h) => [`--rse-brand-${h}`, { value: h === 'yellow' ? '#ffff00' : '#000000' }])) },
    themes: { dark: { overrides: { '--rse-color-surface-page': { value: '#000000' } } } } };
  const combos = combinations(brand); // yellow on white fails; black on white passes; black on black fails
  const failing = combos.filter((c) => c.fails).map((c) => `Evite: ${c.hue} sobre ${c.surface}`);
  const full = failing.join('\n');
  let bad = 0;
  const expect = (name, errs, want) => { if (!!errs.length !== want) { console.error(`check-motif-contrast selftest: "${name}" ${want ? 'did not fire' : 'fired: ' + errs[0]}`); bad++; } };
  expect('complete docs are clean', compare(combos, full), false);
  expect('missing line is caught', compare(combos, failing.slice(1).join('\n')), true);
  expect('extra line for a passing pair is caught', compare(combos, full + '\nEvite: green sobre page'), true);
  expect('unknown surface is caught', compare(combos, full + '\nEvite: green sobre moon'), true);
  expect('failing set is non-empty', failing.length ? [] : ['x'], false);
  if (bad) process.exit(1);
  console.log('check-motif-contrast selftest: ok');
  process.exit(0);
}

const brand = JSON.parse(readFileSync(join(ROOT, 'brand.json'), 'utf8'));
const prompt = readFileSync(join(ROOT, 'components/feedback/MotifLoader.prompt.md'), 'utf8');
const combos = combinations(brand);
const errors = compare(combos, prompt);
if (errors.length) {
  console.error('check-motif-contrast: FAILED\n' + errors.map((e) => '  ' + e).join('\n'));
  process.exit(1);
}
console.log(`check-motif-contrast: ok (${combos.length} combinations, ${combos.filter((c) => c.fails).length} documented)`);
