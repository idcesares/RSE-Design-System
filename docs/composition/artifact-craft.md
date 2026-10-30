# Artifact craft — how to build the ambitious thing well

[creative-latitude.md](creative-latitude.md) says what you may do. This page is the how: the
parts that are easy to get wrong when a piece is interactive, animated, diagrammatic or 3D. The
snippets are starting points, tested in a browser; adapt them, do not paste them unchanged.

Contents: [colour](#colour-in-a-standalone-artifact) · [motion setting](#reading-the-motion-setting)
· [flip cards and flashcards](#flip-cards-and-flashcards) · [diagrams and structures](#diagrams-and-organisational-structures)
· [dashboards and data](#dashboards-and-data-stories) · [3D and immersive scenes](#3d-and-immersive-scenes) ·
[performance](#performance) · [verify](#verify-before-you-hand-over)

## Colour in a standalone artifact

On a page that links `styles.css`, colour is `var(--rse-…)` and the page themes for free. A
standalone artifact (one HTML file, a canvas, a WebGL scene) often cannot link the system. Then:

- Declare the palette **once**, at the top of the file, as `--rse-*` custom properties copied from
  [brand.json](../../brand.json) (`palette`) and the roles you use. Everything else, CSS, SVG and
  JavaScript, reads those variables. No other hex appears in the file.
- JavaScript and WebGL read the variables at run time, so a theme or palette change flows through:

```js
const root = getComputedStyle(document.documentElement);
const token = (name) => root.getPropertyValue(name).trim();
// canvas 2D:   ctx.fillStyle = token('--rse-brand-purple-dark');
// Three.js:    new THREE.Color(token('--rse-brand-blue'));
```

- Gradients are palette stops: `linear-gradient(160deg, var(--rse-brand-purple-dark), var(--rse-brand-indigo))`.
  Check text contrast at the worst stop ([gradient rules](creative-latitude.md#gradients)).
- Where several hues encode categories (a chart, a legend, a journey), use the palette hues and
  also encode with a label, shape or position. Colour alone never carries meaning.

## Reading the motion setting

Honour the system's motion setting in every artifact that moves. `data-rse-motion` wins; otherwise
the operating system decides.

```js
const motionReduced = (el = document.documentElement) => {
  const set = el.closest('[data-rse-motion]')?.getAttribute('data-rse-motion');
  return set ? set === 'reduced' : matchMedia('(prefers-reduced-motion: reduce)').matches;
};
```

Use it to choose the form, not to switch the piece off. Reduced means: show the finished state, no
travel, no looping, no camera drift, no parallax; fades and colour changes stay. In CSS, put your
motion inside a guard so the reduced form is the default:

```css
@media (prefers-reduced-motion: no-preference) {
  :root:not([data-rse-motion="reduced"]) .reveal { animation: rise 900ms var(--rse-ease-settle) both; }
}
```

If the artifact has autoplaying motion longer than five seconds, add a visible pause control.

## Flip cards and flashcards

A flashcard is a **button** that reveals its other side, with a real transition, real states and a
keyboard path. It should feel tactile (depth, light, a satisfying turn) and be organised (a clear
front/back, a progress indicator, a way to mark known/unknown, a way to shuffle or reset). Here is
the accessible core; the design on top of it is yours.

```html
<button class="flip" type="button" aria-pressed="false" aria-label="Virar o cartão">
  <span class="flip__inner">
    <span class="flip__face flip__front">Pergunta aqui</span>
    <span class="flip__face flip__back" aria-hidden="true">Resposta aqui</span>
  </span>
</button>
<script>
  document.querySelectorAll('.flip').forEach((b) => b.addEventListener('click', () => {
    const on = b.getAttribute('aria-pressed') !== 'true';
    b.setAttribute('aria-pressed', on);
    b.querySelector('.flip__front').setAttribute('aria-hidden', on);
    b.querySelector('.flip__back').setAttribute('aria-hidden', !on);
  }));
</script>
<style>
  .flip { perspective: 1200px; border: 0; background: none; padding: 0; cursor: pointer; }
  .flip__inner { display: grid; transform-style: preserve-3d; transition: transform 640ms var(--rse-ease-settle); }
  .flip[aria-pressed="true"] .flip__inner { transform: rotateY(180deg); }
  .flip__face { grid-area: 1 / 1; backface-visibility: hidden; padding: 2rem; border-radius: var(--rse-radius-xl); }
  .flip__back { transform: rotateY(180deg); }
  @media (prefers-reduced-motion: reduce) { .flip__inner { transition: none; } }
</style>
```

Design on top of this: gradient faces, a light sweep on hover, a stack of cards behind the front
card, a swipe or arrow-key gesture to go next, a streak or progress ring, a gentle confetti-like
burst of palette shapes on "knew it", a deck summary at the end. Keep the focus ring visible and
the button at least 44 px in both directions.

## Diagrams and organisational structures

Draw them. Org charts, networks, trees, journeys, layer cakes, orbit maps, swimlanes, matrices,
funnels, rings and timelines all beat a bulleted list. Build them in inline SVG or HTML+CSS with
palette geometry.

- Choose the form from the relation: **hierarchy** → tree or nested layers; **flow** → path or
  swimlane; **network** → force or radial layout; **share** → ring or stacked bar; **sequence** →
  timeline or staircase; **comparison** → matrix or small multiples; **place** → a schematic map.
- Make the **current/selected node** obvious (size, position, colour), and the rest quieter.
- Label directly on the elements, not in a distant legend. Lines are at least 1.5 px; text at least
  the format's minimum; connections never run behind labels.
- Let it be interactive when it helps: expand a branch, hover a node for detail, filter by hue,
  step through a process. Give nodes `tabindex="0"` or make them buttons, and show the same detail on
  focus as on hover.
- Animate to **explain**: draw the path, grow a branch from its parent, pulse the node the speaker
  is on. Respect the [motion setting](#reading-the-motion-setting).
- The people in an org chart are placeholders ("Nome Sobrenome", "Cargo") unless the user supplied
  them. No portraits; use initials in a circle or an `<image-slot>`.

## Dashboards and data stories

A dashboard-style pitch or deck is welcome when the content is data. Make it a *story*, not a wall
of tiles.

- Lead with the one number or comparison that matters, at display size, then support it. Group by
  question ("quantos?", "onde?", "como evoluiu?"), not by chart type.
- Use charts when the comparison is the point; follow [modules → chart](modules.md#m-chart) for
  honesty (zero baselines for bars, direct labels, a takeaway headline, a source line).
- Add depth with restraint: soft panels, gradient surfaces, sparklines inside stats, a live-feeling
  count-up on load (finishing at the true number, instant when motion is reduced).
- Filters, tabs and drill-downs are real controls with every state and a keyboard path.
- Figures are the user's or visible placeholders (`000`, `00%`) labelled "exemplo".
- For the chart specifics (colour formula, marks, axes, tooltips) load the `dataviz` skill if your
  harness has it.

## 3D and immersive scenes

The choice of tool is yours: CSS 3D (the showcase's depth piece uses it, with no library), canvas 2D,
SVG, Three.js, a shader, or anything else that serves the idea. Three.js is the worked example below
because it is the common case; nothing in the brand requires it, and nothing forbids another route.
Immersive pieces are welcome where they carry the idea: an explorable structure, a data landscape,
a rotating object, a hero scene, an animated explainer. Keep to one controlled, beautiful moment
rather than a tech demo.

**Loading.** Pin an exact version from a CDN the host allows (for a hosted Artifact: cdnjs, jsdelivr
or unpkg), or vendor the file next to the artifact if it must work offline. Never `three@latest`.

```html
<script type="importmap">
  { "imports": { "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js" } }
</script>
```

**A scene skeleton** with palette colours from tokens, reduced motion, visibility pause, a DPR cap
and a text alternative:

```html
<canvas id="stage" role="img"
        aria-label="Cena tridimensional: camadas de formas que representam as etapas da formação. Descrição completa abaixo."></canvas>
<p id="stage-desc">Descrição em texto do que a cena mostra e do que ela comunica.</p>
<script type="module">
  import * as THREE from 'three';

  const root = getComputedStyle(document.documentElement);
  const color = (name) => new THREE.Color(root.getPropertyValue(name).trim());
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    || document.documentElement.getAttribute('data-rse-motion') === 'reduced';

  const canvas = document.getElementById('stage');
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); }
  catch { canvas.replaceWith(document.getElementById('stage-desc')); /* show the text/SVG fallback */ }

  if (renderer) {
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 2.2, 7.5);
    camera.lookAt(0, 0.55, 0);

    const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(3, 4, 5); scene.add(key);
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));

    const group = new THREE.Group(); scene.add(group);
    ['--rse-brand-purple-dark', '--rse-brand-blue', '--rse-brand-green'].forEach((name, i) => {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(2.4 - i * 0.5, 0.4, 2.4 - i * 0.5),
        new THREE.MeshStandardMaterial({ color: color(name), roughness: 0.45, metalness: 0.1 }),
      );
      mesh.position.y = i * 0.55; group.add(mesh);
    });

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = canvas;
      renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    };
    new ResizeObserver(resize).observe(canvas); resize();

    let visible = true, raf = 0;
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !reduced) loop(); }).observe(canvas);
    const loop = () => {
      if (!visible) return;
      group.rotation.y += 0.004;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    reduced ? renderer.render(scene, camera) : loop();   // reduced: one finished frame, no drift
  }
</script>
```

The light colours (`0xffffff`) are physical light, not brand colour; surface colours always come
from the palette. Beyond the skeleton:

- **Interaction.** If the viewer can orbit or click, make it keyboard-operable (arrow keys rotate,
  `+`/`-` zoom, Esc resets), show a hint, and offer a "Redefinir vista" button. Never trap scroll
  on a page-length scene without a clear way out.
- **Look.** Palette materials, soft key light, subtle fog toward a palette colour, generous negative
  space around the object. Post-processing (bloom, depth of field) is fine when it is gentle.
- **No lookalikes.** Do not model the cubo impossível or its constructions in 3D; the geometry is
  supplied artwork. Use abstract geometry of your own and say it is new.
- **Fallback.** If WebGL is unavailable or `reduced` is set and the scene depends on motion to make
  sense, show a static SVG or PNG poster of the scene plus the text description.
- **Text.** Any copy over the scene sits on a solid or gradient panel that meets contrast at its
  worst point. Don't render essential text as WebGL only.
- **Clean-up.** Dispose geometries, materials and the renderer when the scene is removed.

## Performance

Beautiful pieces stay smooth on a mid-range phone and an old laptop.

- Cap the device pixel ratio at 2. Prefer a few well-lit objects to thousands of particles; use
  instancing for repeated meshes. Pause rendering when the canvas is off-screen or the tab is hidden.
- Animate `transform` and `opacity`; avoid animating layout, large `filter: blur()` areas or
  `box-shadow` on many elements at once. Use `will-change` only on the element in motion.
- Load fonts with `font-display: swap`; reserve space (aspect-ratio, fixed heights) so nothing jumps.
- A page that needs a library should still show its content before the library arrives.
- Keep the file small: inline what is tiny, defer what is large, never ship an unused library.

## Verify before you hand over

Look at it running. A render is not a screenshot of the code in your head.

- Open it in a browser (Playwright is pre-installed where this repo is worked on remotely). Capture
  the first frame, the awe moment, a mid-animation frame and the final frame. Check each against the
  [creative review](creative-latitude.md#creative-review).
- Resize to 360 px and to a wide desktop. Tab through everything. Turn motion to reduced
  (`data-rse-motion="reduced"` or emulate `prefers-reduced-motion: reduce`) and confirm the finished
  state is complete.
- Check the console for errors, and that no request fails with the network blocked, apart from the
  one CDN script you chose.
- Measure contrast where text meets a gradient, image slot or moving background, at the worst point.
- Then say what is placeholder, derived or new.
