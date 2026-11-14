#!/usr/bin/env node
// Installs the package the way a consumer does — from the tarball `npm pack` produces — into a
// scratch project, then proves the public surface works outside this repo, in plain Node:
//
//   1. every subpath in package.json `exports` resolves to a file that is in the tarball;
//   2. the JS entries (`.`, `./tokens`, `./motion`) import with no bundler and no transform;
//   3. every component exported from the package root server-renders (react-dom/server);
//   4. every local url() / @import inside the shipped CSS resolves inside the tarball.
//
// This is the test for "works in Next.js / Vite SSR / Jest", which all hand package code to Node
// untranspiled. It catches a missing `files` entry, a broken `exports` path, a non-JS extension
// and a component that throws on the server.
//
//   node scripts/test-consumer.mjs
//
// Needs `react` and `react-dom` (>=18). The repo keeps zero dependencies, so CI installs them for
// this step only:  npm i --no-save react@18.3.1 react-dom@18.3.1
// REACT_PATH=<dir containing react and react-dom> overrides the lookup.

import { mkdtempSync, mkdirSync, existsSync, readFileSync, writeFileSync, symlinkSync, rmSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, resolve, relative, sep } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execFileSync, execSync } from 'node:child_process';
import { createRequire } from 'node:module';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const failures = [];
const fail = (m) => { failures.push(m); console.log(`FAIL ${m}`); };
const ok = (m) => console.log(`ok   ${m}`);

// ─── React, from wherever it is installed ───────────────────────────────────
const require = createRequire(import.meta.url);
const findPkgDir = (name) => {
  const roots = [process.env.REACT_PATH, ROOT, process.cwd()].filter(Boolean);
  try { roots.push(execSync('npm root -g', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()); } catch {}
  for (const r of roots) {
    for (const base of [r, join(r, 'node_modules')]) {
      if (existsSync(join(base, name, 'package.json'))) return join(base, name);
    }
  }
  try { return dirname(require.resolve(`${name}/package.json`, { paths: roots })); } catch { return null; }
};
const reactDir = findPkgDir('react');
const reactDomDir = findPkgDir('react-dom');
if (!reactDir || !reactDomDir) {
  console.error('test-consumer: needs react and react-dom — npm i --no-save react@18.3.1 react-dom@18.3.1');
  process.exit(2);
}

// ─── Pack and install into a scratch project ────────────────────────────────
const work = mkdtempSync(join(tmpdir(), 'rse-consumer-'));
try {
  const packOut = execFileSync('npm', ['pack', '--silent', '--pack-destination', work], { cwd: ROOT }).toString().trim().split('\n').pop();
  const tarball = join(work, packOut);
  const pkgDir = join(work, 'node_modules', ...pkg.name.split('/'));
  mkdirSync(pkgDir, { recursive: true });
  execFileSync('tar', ['-xzf', tarball, '-C', pkgDir, '--strip-components=1']);
  symlinkSync(reactDir, join(work, 'node_modules', 'react'), 'dir');
  symlinkSync(reactDomDir, join(work, 'node_modules', 'react-dom'), 'dir');
  writeFileSync(join(work, 'package.json'), JSON.stringify({ name: 'rse-consumer', private: true, type: 'module' }));
  ok(`packed ${packOut} and installed it into a scratch project`);

  // 1. exports → files in the tarball
  const exportTargets = [];
  for (const [key, value] of Object.entries(pkg.exports)) {
    const targets = typeof value === 'string' ? [value] : Object.values(value);
    for (const t of targets) {
      if (t.includes('*')) {
        const dir = join(pkgDir, t.slice(0, t.indexOf('*')));
        if (!existsSync(dir) || readdirSync(dir).length === 0) fail(`exports["${key}"] → ${t}: nothing in the tarball`);
        continue;
      }
      if (!existsSync(join(pkgDir, t))) fail(`exports["${key}"] → ${t}: missing from the tarball (check package.json "files")`);
      else exportTargets.push([key, t]);
    }
  }
  ok(`${Object.keys(pkg.exports).length} export subpaths checked`);

  // 2 + 3. import and render, in a child process rooted in the scratch project
  const probe = `
    import * as RSE from ${JSON.stringify(pkg.name)};
    import * as tokens from ${JSON.stringify(pkg.name + '/tokens')};
    import * as motion from ${JSON.stringify(pkg.name + '/motion')};
    import React from 'react';
    import { renderToString } from 'react-dom/server';
    const fixtures = JSON.parse(process.argv[2]);
    const out = { exports: Object.keys(RSE).length, tokens: Object.keys(tokens).length, motion: Object.keys(motion).length, rendered: [], failed: [] };
    const isComponent = (name, v) => /^[A-Z]/.test(name) && (typeof v === 'function' || (v && typeof v === 'object' && v.$$typeof));
    for (const [name, C] of Object.entries(RSE)) {
      if (!isComponent(name, C) || fixtures.skip.includes(name)) continue;
      const props = fixtures.props[name] ?? {};
      try {
        const html = renderToString(React.createElement(C, props, props.children));
        if (!html) throw new Error('rendered nothing');
        out.rendered.push(name);
      } catch (e) { out.failed.push(name + ': ' + String(e && e.message || e).split('\\n')[0]); }
    }
    console.log(JSON.stringify(out));
  `;
  writeFileSync(join(work, 'probe.mjs'), probe);
  const fixtures = JSON.parse(readFileSync(join(ROOT, 'scripts/fixtures/consumer-props.json'), 'utf8'));
  let result;
  try {
    const raw = execFileSync(process.execPath, ['probe.mjs', JSON.stringify(fixtures)], { cwd: work, stdio: ['ignore', 'pipe', 'pipe'] }).toString();
    result = JSON.parse(raw.trim().split('\n').pop());
  } catch (e) {
    fail(`the package does not import in plain Node: ${(e.stderr || e.message).toString().split('\n').find((l) => /Error/.test(l)) || e.message}`);
  }
  if (result) {
    ok(`imported "${pkg.name}" (${result.exports} exports), "/tokens" (${result.tokens}), "/motion" (${result.motion}) in plain Node`);
    for (const f of result.failed) fail(`server render: ${f}`);
    ok(`${result.rendered.length} components server-rendered with react-dom/server`);
    const manifest = JSON.parse(readFileSync(join(ROOT, 'rse.manifest.json'), 'utf8'));
    const libs = new Set(fixtures.skip);
    const missing = manifest.components.map((c) => c.name).filter((n) => !libs.has(n) && !result.rendered.includes(n) && !result.failed.some((f) => f.startsWith(n + ':')));
    for (const n of missing) fail(`${n} is in the manifest but is not a component export of the package root`);
  }

  // 4. CSS references stay inside the tarball
  const cssFiles = [];
  const walk = (d) => { for (const n of readdirSync(d)) { const p = join(d, n); statSync(p).isDirectory() ? walk(p) : p.endsWith('.css') && cssFiles.push(p); } };
  walk(pkgDir);
  let refs = 0;
  for (const f of cssFiles) {
    const css = readFileSync(f, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
    for (const m of css.matchAll(/(?:url\(\s*['"]?|@import\s+['"])([^'")]+)['"]?/g)) {
      const ref = m[1].trim();
      if (/^(data:|https?:|#|\/\/)/.test(ref)) continue;
      refs++;
      const target = resolve(dirname(f), ref.split(/[?#]/)[0]);
      if (!target.startsWith(pkgDir) || !existsSync(target)) fail(`${relative(pkgDir, f).split(sep).join('/')}: ${ref} does not resolve inside the package`);
    }
  }
  ok(`${refs} url()/@import references in ${cssFiles.length} shipped stylesheets resolve`);
} finally {
  rmSync(work, { recursive: true, force: true });
}

if (failures.length) { console.log(`\ntest-consumer: ${failures.length} failure(s)`); process.exit(1); }
console.log('test-consumer: ok');
