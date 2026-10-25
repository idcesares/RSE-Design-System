#!/usr/bin/env node
// check-motion: enforces the motion contract in CSS.
//   (a) no infinite animation with a resolved cycle under 334 ms (3 flashes per second), whether
//       written as the `animation` shorthand or as longhands (animation-duration +
//       animation-iteration-count: infinite) in one rule block;
//   (b) every translate in an rse-motif* @keyframes goes through var(--rse-motion-travel;
//   (c) a component CSS file that declares rse-motif animations has .rse-motion-managed in its .jsx.
// `--selftest` runs the three rules against inline fixtures and exits 1 unless each one fires.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const MIN_CYCLE_MS = 334;

const stripComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '');

// Balanced-brace block starting at the "{" at index `open`; returns the inner text and end index.
function block(css, open) {
  let depth = 0;
  for (let i = open; i < css.length; i++) {
    if (css[i] === '{') depth++;
    else if (css[i] === '}' && --depth === 0) return { body: css.slice(open + 1, i), end: i };
  }
  return { body: css.slice(open + 1), end: css.length };
}

function keyframes(css) {
  const out = [];
  const re = /@keyframes\s+([\w-]+)\s*\{/g;
  let m;
  while ((m = re.exec(css))) {
    const open = m.index + m[0].length - 1;
    const { body, end } = block(css, open);
    out.push({ name: m[1], body });
    re.lastIndex = end;
  }
  return out;
}

const toMs = (v, unit) => (unit === 's' ? parseFloat(v) * 1000 : parseFloat(v));

function resolveTime(token, durations) {
  const t = token.trim();
  const v = t.match(/^var\(\s*(--rse-duration-[\w-]+)\s*\)$/);
  if (v) return durations[v[1]] ?? null;
  const n = t.match(/^(-?[\d.]+)(ms|s)$/);
  return n ? toMs(n[1], n[2]) : null;
}

// Every `animation` / `animation-name` declaration: the first time value is the duration.
function animations(css) {
  const out = [];
  const re = /(?:^|[;{\s])animation\s*:\s*([^;}]+)/g;
  let m;
  while ((m = re.exec(css))) {
    const value = m[1];
    const parts = value.split(/,(?![^(]*\))/);
    for (const part of parts) {
      const tokens = part.trim().split(/\s+(?![^(]*\))/);
      const time = tokens.find((t) => /^(-?[\d.]+(ms|s)|var\(\s*--rse-duration-[\w-]+\s*\))$/.test(t));
      const name = tokens.find((t) => /^rse-[\w-]+$/.test(t) || (/^[a-zA-Z_][\w-]*$/.test(t) && !/^(infinite|linear|ease|ease-in|ease-out|ease-in-out|both|forwards|backwards|none|normal|reverse|alternate|alternate-reverse|running|paused)$/.test(t)));
      out.push({ name, time, infinite: tokens.includes('infinite') });
    }
  }
  return out;
}

// (a) infinite animations whose cycle is under the floor.
export function ruleCycle(css, durations, label = '') {
  const errors = [];
  const list = (v) => v.split(/,(?![^(]*\))/).map((x) => x.trim());
  // Longhands: within each innermost block, pair iteration-count and duration by list index.
  for (const [, body] of stripComments(css).matchAll(/\{([^{}]*)\}/g)) {
    const decl = (prop) => body.match(new RegExp('(?:^|[;\\s])' + prop + '\\s*:\\s*([^;}]+)'))?.[1];
    const iter = decl('animation-iteration-count');
    if (!iter) continue;
    const iters = list(iter), times = list(decl('animation-duration') ?? ''), names = list(decl('animation-name') ?? '');
    iters.forEach((it, i) => {
      if (it !== 'infinite') return;
      const t = times[i % times.length], n = names[i % names.length] || '?';
      const ms = t ? resolveTime(t, durations) : null;
      if (ms === null) errors.push(`${label}: infinite animation "${n}" has an unresolvable duration (${t || 'none'})`);
      else if (ms < MIN_CYCLE_MS) errors.push(`${label}: infinite animation "${n}" cycles in ${ms} ms, under ${MIN_CYCLE_MS} ms`);
    });
  }
  for (const a of animations(stripComments(css))) {
    if (!a.infinite) continue;
    const ms = a.time ? resolveTime(a.time, durations) : null;
    if (ms === null) errors.push(`${label}: infinite animation "${a.name ?? '?'}" has an unresolvable duration (${a.time ?? 'none'})`);
    else if (ms < MIN_CYCLE_MS) errors.push(`${label}: infinite animation "${a.name ?? '?'}" cycles in ${ms} ms, under ${MIN_CYCLE_MS} ms`);
  }
  return errors;
}

// (b) literal translate in a motif keyframe.
export function ruleTravel(css, label = '') {
  const errors = [];
  for (const k of keyframes(stripComments(css))) {
    if (!k.name.startsWith('rse-motif')) continue;
    const re = /translate(?:X|Y)?\(([^)]*(?:\([^)]*\)[^)]*)*)\)/g;
    let m;
    while ((m = re.exec(k.body))) {
      if (!m[1].includes('var(--rse-motion-travel')) errors.push(`${label}: @keyframes ${k.name} has ${m[0]} without var(--rse-motion-travel)`);
    }
  }
  return errors;
}

// (c) motif animations require .rse-motion-managed in the matching .jsx.
export function ruleManaged(css, jsx, label = '') {
  const declares = keyframes(stripComments(css)).some((k) => k.name.startsWith('rse-motif'))
    || /animation(?:-name)?\s*:[^;}]*\brse-motif/.test(stripComments(css));
  if (declares && !(jsx ?? '').includes('rse-motion-managed')) return [`${label}: declares rse-motif animations but its .jsx never uses .rse-motion-managed`];
  return [];
}

// ─── Selftest ───────────────────────────────────────────────────────────────
if (process.argv.includes('--selftest')) {
  const durations = { '--rse-duration-fast': 150, '--rse-duration-base': 220, '--rse-duration-slow': 360 };
  const cases = [
    ['cycle', ruleCycle('@keyframes x{to{opacity:0}} .a{animation:x 200ms linear infinite}', durations, 'self')],
    ['cycle (token)', ruleCycle('.a{animation:x var(--rse-duration-base) linear infinite}', durations, 'self')],
    ['cycle (longhand)', ruleCycle('.a{animation-name:x;animation-duration:100ms;animation-iteration-count:infinite}', durations, 'self')],
    ['cycle (longhand token)', ruleCycle('.a{animation-duration:var(--rse-duration-fast);animation-iteration-count:infinite}', durations, 'self')],
    ['travel', ruleTravel('@keyframes rse-motif-drift{from{transform:translate(8px, 0)}to{transform:none}}', 'self')],
    ['managed', ruleManaged('@keyframes rse-motif-drift{to{opacity:1}}', "createElement('div', { className: 'x' })", 'self')],
  ];
  const clean = [
    ['cycle ok', ruleCycle('.a{animation:x 1.4s linear infinite}', durations, 'self')],
    ['cycle ok (longhand)', ruleCycle('.a{animation-name:x;animation-duration:1.4s;animation-iteration-count:infinite}.b{animation-duration:var(--rse-duration-slow);animation-iteration-count:infinite}', durations, 'self')],
    ['travel ok', ruleTravel('@keyframes rse-motif-drift{to{transform:translate(calc(8px * var(--rse-motion-travel)), 0)}}', 'self')],
    ['managed ok', ruleManaged('@keyframes rse-motif-drift{to{opacity:1}}', "className: 'rse-motion-managed'", 'self')],
  ];
  let bad = 0;
  for (const [n, e] of cases) if (!e.length) { console.error(`check-motion selftest: rule "${n}" did not fire`); bad++; }
  for (const [n, e] of clean) if (e.length) { console.error(`check-motion selftest: rule "${n}" fired on clean input: ${e[0]}`); bad++; }
  if (bad) process.exit(1);
  console.log('check-motion selftest: ok');
  process.exit(0);
}

// ─── Real run ───────────────────────────────────────────────────────────────
const walk = (dir, out = []) => {
  for (const n of readdirSync(join(ROOT, dir))) {
    const p = join(dir, n);
    statSync(join(ROOT, p)).isDirectory() ? walk(p, out) : out.push(p.split(sep).join('/'));
  }
  return out;
};

const tokens = readFileSync(join(ROOT, 'tokens/tokens.css'), 'utf8');
const durations = {};
for (const m of tokens.matchAll(/(--rse-duration-[\w-]+)\s*:\s*(-?[\d.]+)(ms|s)\s*;/g)) durations[m[1]] ??= toMs(m[2], m[3]);

const cssFiles = [...walk('components').filter((f) => f.endsWith('.css')), 'tokens/base-runtime.css'];
const errors = [];
for (const f of cssFiles) {
  const css = readFileSync(join(ROOT, f), 'utf8');
  errors.push(...ruleCycle(css, durations, f));
  if (f.startsWith('components/')) {
    errors.push(...ruleTravel(css, f));
    const jsxPath = join(ROOT, f.replace(/\.css$/, '.jsx'));
    errors.push(...ruleManaged(css, existsSync(jsxPath) ? readFileSync(jsxPath, 'utf8') : '', f));
  }
}
if (errors.length) {
  console.error('check-motion: FAILED\n' + errors.map((e) => '  ' + e).join('\n'));
  process.exit(1);
}
console.log(`check-motion: ok (${cssFiles.length} stylesheets)`);
