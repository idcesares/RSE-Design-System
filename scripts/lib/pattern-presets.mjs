// The baked pattern presets: one table, shared by scripts/build-patterns.mjs (which writes them)
// and scripts/test-motif-engine.mjs (which checks the files against a fresh render).
//
// Every preset is 1920x1080 and static. Single-hue presets are named <shape>-<layout>-<hue>.
// `spectrum` is the one multi-hue piece: artwork only (rule R4), never a page background behind
// content. Cells are large where the shape is busy (tower, twin) so the field stays calm.

const SIZE = { width: 1920, height: 1080, animate: 'none' };

export const PRESETS = [
  { name: 'triangle-brick-purple', options: { ...SIZE, shape: 'triangle', hue: 'purple', layout: 'brick', cell: 144, gap: 18, fill: 0.8, seed: 3 } },
  { name: 'stair-grid-blue', options: { ...SIZE, shape: 'stair', hue: 'blue', layout: 'grid', cell: 144, gap: 22, fill: 1, seed: 5 } },
  { name: 'loop-isometric-green', options: { ...SIZE, shape: 'loop', hue: 'green', layout: 'isometric', cell: 150, gap: 12, fill: 0.7, seed: 11 } },
  { name: 'tower-grid-pink', options: { ...SIZE, shape: 'tower', hue: 'pink', layout: 'grid', cell: 216, gap: 28, fill: 0.85, seed: 7 } },
  { name: 'twin-brick-orange', options: { ...SIZE, shape: 'twin', hue: 'orange', layout: 'brick', cell: 216, gap: 28, fill: 1, seed: 9 } },
  { name: 'cube-isometric-yellow', options: { ...SIZE, shape: 'cube', hue: 'yellow', layout: 'isometric', cell: 144, gap: 12, fill: 0.75, seed: 4 } },
  { name: 'spectrum', options: { ...SIZE, shape: 'cube', hues: ['purple', 'blue', 'green', 'yellow', 'orange', 'pink'], sequence: 'diagonal', layout: 'isometric', cell: 132, gap: 4, fill: 1, seed: 1 } },
];

export const presetFileName = (preset) => `${preset.name}.svg`;

const XML_DECLARATION = '<?xml version="1.0" encoding="UTF-8"?>\n';

/** The complete standalone file: XML declaration, then the renderer's SVG, then a newline. */
export function presetSvgFile(engine, preset) {
  const svg = engine.renderMotifPattern(preset.options);
  if (!svg) throw new Error(`preset ${preset.name} rendered nothing`);
  return `${XML_DECLARATION}${svg}\n`;
}
