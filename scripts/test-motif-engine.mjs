// Unit tests for the motif engine. Run: node --test scripts/test-motif-engine.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadMotifEngine } from './lib/load-motif-engine.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const engine = await loadMotifEngine();
const luminance = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

test('motifRamp returns 3 palette hexes per hue and null for unknown', () => {
  assert.equal(typeof engine.motifRamp, 'function');
  for (const hue of engine.motifHues) {
    const ramp = engine.motifRamp(hue, 3);
    assert.equal(ramp.length, 3, hue);
    for (const c of ramp) assert.match(c, /^#[0-9a-f]{6}$/, hue);
  }
  assert.equal(engine.motifRamp('chartreuse', 3), null);
  assert.equal(engine.motifRamp(undefined, 3), null);
});

test('motifRamp is lightest first by luminance for all six hues', () => {
  assert.equal(engine.motifHues.length, 6);
  for (const hue of engine.motifHues) {
    const [a, b, c] = engine.motifRamp(hue, 3).map(luminance);
    assert.ok(a > b && b > c, `${hue}: ${a} > ${b} > ${c}`);
  }
});

test('BrandMotif output unchanged', () => {
  const snapshot = JSON.parse(readFileSync(join(HERE, 'fixtures', 'brandmotif-snapshot.json'), 'utf8'));
  assert.deepEqual(Object.keys(snapshot), engine.motifVariants);
  for (const variant of engine.motifVariants) {
    const actual = {
      default: engine.BrandMotif({ variant }),
      purple: engine.BrandMotif({ variant, hue: 'purple' }),
    };
    assert.deepEqual(JSON.parse(JSON.stringify(actual)), snapshot[variant], variant);
  }
});
