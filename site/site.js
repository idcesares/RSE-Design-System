// Reference site: mounts the showcase demo (showcase/demos.js) for the component on this page,
// with the real components from dist/rse.js, and fills in its pt-BR gloss. Hand-written.
(function () {
  'use strict';
  const stage = document.querySelector('[data-component]');
  if (!stage || !window.React || !window.ReactDOM || !window.RSE || !window.SC_DEMOS) return;
  const name = stage.getAttribute('data-component');
  const { GLOSS, DEMOS } = window.SC_DEMOS(window.RSE);
  const gloss = document.querySelector('[data-gloss]');
  if (gloss && GLOSS[name]) gloss.textContent = GLOSS[name];
  const demo = DEMOS[name];
  if (!demo) { stage.querySelector('p').textContent = 'No live example for this component yet; the usage below shows it.'; return; }
  if (demo.block) stage.classList.add('is-block');
  stage.textContent = '';
  window.ReactDOM.createRoot(stage).render(demo.render());
})();
