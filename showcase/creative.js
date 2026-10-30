/* ─────────────────────────────────────────────────────────────────────────────
   creative.js — chapter 06 of the showcase: the range the brand leaves to craft.

   Five small pieces built with plain DOM, CSS and SVG, no library, to show that the
   brand fixes a few invariants and leaves layout, structure, depth, motion and
   interaction to the maker. An agent is free to reach for Three.js, canvas, D3 or
   anything else; the invariants and the reduced-motion form are what stay.

   The rules shown here are read from brand.json (rules.creativeLatitude) and the
   gradient lab measures contrast from the palette in showcase-data.js.
   ───────────────────────────────────────────────────────────────────────────── */
(() => {
  'use strict';

  const D = window.SHOWCASE_DATA;
  const stage = document.getElementById('cr-stage');
  if (!D || !stage) return;

  const $ = (sel, root) => (root || document).querySelector(sel);
  const el = (tag, props, ...kids) => {
    const node = document.createElement(tag);
    Object.entries(props || {}).forEach(([k, v]) => {
      if (k === 'class') node.className = v;
      else if (k === 'text') node.textContent = v;
      else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
      else if (v === true) node.setAttribute(k, '');
      else if (v !== false && v != null) node.setAttribute(k, v);
    });
    kids.flat().forEach((c) => c != null && node.append(c));
    return node;
  };

  /* The motion setting, as documented in docs/composition/artifact-craft.md. */
  const motionReduced = (node = stage) => {
    const set = node.closest('[data-rse-motion]')?.getAttribute('data-rse-motion');
    return set ? set === 'reduced' : matchMedia('(prefers-reduced-motion: reduce)').matches;
  };
  const motionListeners = [];
  const onMotion = (fn) => motionListeners.push(fn);

  /* ── The rules, read now from brand.json ─────────────────────────────────── */
  const rules = $('#cr-rules');
  if (rules && D.rules && D.rules.creativeLatitude) {
    rules.textContent = JSON.stringify({ gradients: D.rules.colour.gradients, creativeLatitude: D.rules.creativeLatitude }, null, 2);
  }

  /* ── Motion switch (nests on the stage, like data-rse-theme) ─────────────── */
  const motionButtons = Array.from(document.querySelectorAll('[data-cr-motion]'));
  const syncMotionButtons = () => {
    const reduced = motionReduced();
    motionButtons.forEach((b) => b.setAttribute('aria-pressed', String((b.dataset.crMotion === 'reduced') === reduced)));
  };
  motionButtons.forEach((b) => b.addEventListener('click', () => {
    stage.setAttribute('data-rse-motion', b.dataset.crMotion);
    syncMotionButtons();
    motionListeners.forEach((fn) => fn(motionReduced()));
  }));
  syncMotionButtons();

  /* ── A. Structure: an organisation that opens ────────────────────────────── */
  const ORG = [
    ['Pedagógico', 'Nome Sobrenome', ['Currículo', 'Formação docente'], 'Exemplo: define o currículo e acompanha as turmas.'],
    ['Unidades', 'Nome Sobrenome', ['Escolas', 'Programas'], 'Exemplo: reúne as unidades que oferecem cada programa.'],
    ['Tecnologia', 'Nome Sobrenome', ['Plataforma', 'Dados'], 'Exemplo: mantém a plataforma de aprendizagem.'],
    ['Relacionamento', 'Nome Sobrenome', ['Famílias', 'Comunidade'], 'Exemplo: cuida do contato com famílias e comunidade.'],
  ];
  const orgMount = $('#cr-org');
  if (orgMount) {
    const detail = el('p', { class: 'cr-org-detail', 'aria-live': 'polite', text: 'Escolha uma área para abrir. Nomes e cargos são exemplos.' });
    const branches = ORG.map(([area, person, leaves, text]) => {
      const leavesId = `cr-leaves-${area.toLowerCase()}`;
      const btn = el('button', { type: 'button', class: 'cr-node', 'aria-expanded': 'false', 'aria-controls': leavesId },
        el('b', { text: area }), el('span', { text: person }));
      const wrap = el('div', { class: 'cr-branch' }, btn,
        el('div', { class: 'cr-leaves', id: leavesId, role: 'group', 'aria-label': `Equipes de ${area}` },
          el('div', null, leaves.map((l) => el('span', { class: 'cr-leaf', text: l })))));
      btn.addEventListener('click', () => {
        const open = btn.getAttribute('aria-expanded') !== 'true';
        btn.setAttribute('aria-expanded', String(open));
        wrap.classList.toggle('is-open', open);
        wrap.querySelectorAll('.cr-leaf').forEach((l) => { l.hidden = !open; });
        detail.textContent = open ? text : 'Escolha uma área para abrir. Nomes e cargos são exemplos.';
      });
      wrap.querySelectorAll('.cr-leaf').forEach((l) => { l.hidden = true; });
      return wrap;
    });
    orgMount.append(
      el('div', { class: 'cr-node cr-node--root', role: 'group', 'aria-label': 'Direção da Rede' }, el('b', { text: 'Direção da Rede' }), el('span', { text: 'Nome Sobrenome · Cargo' })),
      el('div', { class: 'cr-branches' }, branches),
      detail);
  }

  /* ── B. Study cards: a flip that is a button ─────────────────────────────── */
  const CARDS = [
    ['Qual é o resultado de 7 × 8?', '56'],
    ['Que figura de linguagem é “o tempo voa”?', 'Metáfora'],
    ['Qual é a capital da Bahia?', 'Salvador'],
    ['Quantas unidades da federação o Brasil tem?', '26 estados e o Distrito Federal'],
    ['Qual é a fórmula da água?', 'H₂O'],
  ];
  const deckMount = $('#cr-deck');
  if (deckMount) {
    let index = 0; let known = 0; let review = 0;
    const front = el('div', { class: 'cr-flip__face cr-flip__front' }, el('small', { text: 'Pergunta' }), el('b'));
    const back = el('div', { class: 'cr-flip__face cr-flip__back', 'aria-hidden': 'true' }, el('small', { text: 'Resposta' }), el('b'));
    const flip = el('button', { type: 'button', class: 'cr-flip', 'aria-pressed': 'false', 'aria-label': 'Virar o cartão' }, el('span', { class: 'cr-flip__inner' }, front, back));
    const burst = el('span', { class: 'cr-burst', 'aria-hidden': 'true' });
    const count = el('span', { 'aria-live': 'polite' });
    const bar = el('span', { class: 'cr-progress__bar' });
    const knew = el('button', { type: 'button', class: 'cr-button cr-button--solid', text: 'Eu sabia' });
    const again = el('button', { type: 'button', class: 'cr-button', text: 'Revisar depois' });
    const restart = el('button', { type: 'button', class: 'cr-button cr-button--solid', text: 'Recomeçar', hidden: true });
    const done = el('p', { class: 'cr-org-detail', hidden: true, 'aria-live': 'polite' });

    const setFlipped = (on) => {
      flip.setAttribute('aria-pressed', String(on));
      front.setAttribute('aria-hidden', String(on)); back.setAttribute('aria-hidden', String(!on));
    };
    const render = () => {
      if (index >= CARDS.length) {
        flip.hidden = true; knew.hidden = true; again.hidden = true; restart.hidden = false; done.hidden = false;
        done.textContent = `Fim do baralho: ${known} sabidas e ${review} para revisar. Exemplos de demonstração.`;
        count.textContent = `${CARDS.length} de ${CARDS.length}`; bar.style.width = '100%';
        return;
      }
      flip.hidden = false; knew.hidden = false; again.hidden = false; restart.hidden = true; done.hidden = true;
      setFlipped(false);
      front.lastChild.textContent = CARDS[index][0]; back.lastChild.textContent = CARDS[index][1];
      count.textContent = `Cartão ${index + 1} de ${CARDS.length}`;
      bar.style.width = `${(index / CARDS.length) * 100}%`;
    };
    const celebrate = () => {
      if (motionReduced()) return;
      const hues = ['green', 'blue', 'pink', 'orange', 'yellow', 'purple'];
      burst.replaceChildren(...hues.flatMap((hue, i) => [0, 1].map((k) => {
        const a = ((i * 2 + k) / 12) * Math.PI * 2; const r = 70 + k * 36;
        const dot = el('i'); dot.style.background = `var(--rse-brand-${hue}-light)`;
        dot.style.setProperty('--dx', `${Math.cos(a) * r}px`); dot.style.setProperty('--dy', `${Math.sin(a) * r}px`);
        return dot;
      })));
      setTimeout(() => burst.replaceChildren(), 1000);
    };
    const advance = (wasKnown) => { if (wasKnown) { known += 1; celebrate(); } else review += 1; index += 1; render(); };
    flip.addEventListener('click', () => setFlipped(flip.getAttribute('aria-pressed') !== 'true'));
    knew.addEventListener('click', () => advance(true));
    again.addEventListener('click', () => advance(false));
    restart.addEventListener('click', () => { index = 0; known = 0; review = 0; render(); flip.focus(); });
    deckMount.addEventListener('keydown', (e) => {
      if (index >= CARDS.length) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); advance(false); }
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { e.preventDefault(); setFlipped(flip.getAttribute('aria-pressed') !== 'true'); }
    });
    deckMount.append(
      el('div', { class: 'cr-deck-stage' }, flip, burst),
      done,
      el('div', { class: 'cr-progress' }, count, el('span', { class: 'cr-progress__rail' }, bar)),
      el('div', { class: 'cr-row' }, knew, again, restart),
      el('p', { class: 'cr-tech', text: 'Clique ou use Enter para virar. Setas para cima e para baixo viram, seta para a direita passa.' }));
    render();
  }

  /* ── C. A data story: count-up and bars, finishing at the true number ────── */
  const storyMount = $('#cr-story');
  if (storyMount) {
    const TARGET = 72;
    const BARS = [['Unidade A', 72], ['Unidade B', 64], ['Unidade C', 58], ['Unidade D', 49]];
    const out = el('output', { 'aria-label': `${TARGET} por cento, exemplo` , text: '0%' });
    const bars = BARS.map(([label, value]) => {
      const fill = el('span', { class: 'cr-bar__fill' }); fill.dataset.v = value;
      return el('div', { class: 'cr-bar' }, el('span', { text: label }), el('span', { class: 'cr-bar__rail' }, fill), el('output', { text: `${value}%` }));
    });
    const play = () => {
      const fills = bars.map((b) => $('.cr-bar__fill', b));
      if (motionReduced()) { out.textContent = `${TARGET}%`; fills.forEach((f) => { f.style.width = `${f.dataset.v}%`; }); return; }
      fills.forEach((f) => { f.style.width = '0'; });
      out.textContent = '0%';
      requestAnimationFrame(() => requestAnimationFrame(() => fills.forEach((f) => { f.style.width = `${f.dataset.v}%`; })));
      const t0 = performance.now(); const dur = 1200;
      const tick = (t) => {
        const p = Math.min(1, (t - t0) / dur); const eased = 1 - Math.pow(1 - p, 3);
        out.textContent = `${Math.round(TARGET * eased)}%`;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    storyMount.append(
      el('div', { class: 'cr-story' },
        el('p', { class: 'sc-eyebrow', text: 'Uma história em um número' }),
        el('div', { class: 'cr-story__big' }, out, el('span', { text: 'dos estudantes com a meta cumprida no trimestre' })),
        el('div', { class: 'cr-bars', role: 'list', 'aria-label': 'Comparação entre unidades, em porcentagem' }, bars),
        el('p', { class: 'cr-story__note', text: 'Exemplo ilustrativo: números de demonstração, não são dados do Sesc.' })),
      el('div', { class: 'cr-row' }, el('button', { type: 'button', class: 'cr-button', text: 'Tocar de novo', onclick: play })));
    bars.forEach((b) => b.setAttribute('role', 'listitem'));
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => { if (entries.some((e) => e.isIntersecting)) { play(); io.disconnect(); } }, { threshold: 0.4 });
      io.observe(storyMount);
    } else play();
    onMotion(() => play());
  }

  /* ── D. Depth without a library: CSS 3D that answers to pointer and keys ─── */
  const sceneMount = $('#cr-scene');
  if (sceneMount) {
    const LAYERS = ['Acolher', 'Formar', 'Transformar', 'Aprender'];
    const stack = el('div', { class: 'cr-scene__stack' }, LAYERS.map((name, i) => {
      const plane = el('div', { class: `cr-plane cr-plane--${i}`, 'aria-hidden': 'true' }, el('span', { text: name }));
      plane.style.setProperty('--i', i);
      return plane;
    }));
    const scene = el('div', { class: 'cr-scene', tabindex: '0', role: 'group',
      'aria-label': 'Cena em profundidade com quatro camadas: acolher, formar, transformar, aprender. Arraste, passe o ponteiro ou use as setas para inclinar.' },
      stack, el('p', { class: 'cr-scene__hint', 'aria-hidden': 'true', text: 'Arraste ou use as setas · Esc recompõe' }));
    let rx = 58; let rz = -32; let drift = true; let dragging = false; let last = null;
    const apply = () => { stack.style.setProperty('--rx', `${rx}deg`); stack.style.setProperty('--rz', `${rz}deg`); };
    const reset = () => { rx = 58; rz = -32; apply(); };
    scene.addEventListener('pointerdown', (e) => { dragging = true; last = [e.clientX, e.clientY]; scene.setPointerCapture(e.pointerId); scene.style.cursor = 'grabbing'; });
    scene.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      rz += (e.clientX - last[0]) * 0.5; rx = Math.max(20, Math.min(80, rx - (e.clientY - last[1]) * 0.4)); last = [e.clientX, e.clientY]; apply();
    });
    const stop = () => { dragging = false; scene.style.cursor = ''; };
    scene.addEventListener('pointerup', stop); scene.addEventListener('pointercancel', stop);
    scene.addEventListener('keydown', (e) => {
      const step = 8;
      if (e.key === 'ArrowLeft') rz -= step; else if (e.key === 'ArrowRight') rz += step;
      else if (e.key === 'ArrowUp') rx = Math.min(80, rx + step); else if (e.key === 'ArrowDown') rx = Math.max(20, rx - step);
      else if (e.key === 'Escape') reset(); else return;
      e.preventDefault(); apply();
    });
    const toggle = el('button', { type: 'button', class: 'cr-button', 'aria-pressed': 'true', text: 'Pausar movimento' });
    toggle.addEventListener('click', () => {
      drift = !drift; toggle.setAttribute('aria-pressed', String(drift)); toggle.textContent = drift ? 'Pausar movimento' : 'Retomar movimento';
    });
    let visible = true;
    if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(scene);
    const loop = () => {
      if (drift && visible && !dragging && !motionReduced() && !document.hidden) { rz += 0.12; apply(); }
      requestAnimationFrame(loop);
    };
    apply(); requestAnimationFrame(loop);
    sceneMount.append(scene, el('div', { class: 'cr-row' }, toggle, el('button', { type: 'button', class: 'cr-button', text: 'Recompor', onclick: reset })));
  }

  /* ── E. Gradient lab: palette stops, measured at the worst point ─────────── */
  const labMount = $('#cr-lab');
  if (labMount) {
    const HUE_PT = { purple: 'Roxo', pink: 'Rosa', orange: 'Laranja', yellow: 'Amarelo', green: 'Verde', blue: 'Azul', indigo: 'Índigo', cream: 'Creme', black: 'Preto', ink: 'Tinta', white: 'Branco' };
    const TONE_PT = { light: 'claro', base: 'médio', dark: 'escuro', ink: '', white: '' };
    const options = D.palette.filter((c) => /^#/.test(c.hex)).map((c) => ({ token: c.token, hex: c.hex, label: `${HUE_PT[c.family] || c.family}${TONE_PT[c.tone] ? ' ' + TONE_PT[c.tone] : ''}` }));
    const byToken = (t) => options.find((o) => o.token === t) || options[0];
    const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
    const lum = (c) => { const [r, g, b] = c.map((v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
    const ratio = (a, b) => { const la = lum(a); const lb = lum(b); return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05); };
    const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
    const fmtRatio = (r) => r.toFixed(2).replace('.', ',') + ':1';
    const INK = rgb(D.tokens['--rse-brand-ink'].value); const WHITE = rgb(D.tokens['--rse-brand-white'].value);

    const select = (id, label, token) => {
      const s = el('select', { id }, options.map((o) => el('option', { value: o.token, text: o.label })));
      s.value = token;
      return [el('label', { class: 'cr-field', for: id }, label, s), s];
    };
    const [fromField, from] = select('cr-from', 'Cor inicial', '--rse-brand-purple-dark');
    const [toField, to] = select('cr-to', 'Cor final', '--rse-brand-indigo');
    const angle = el('input', { id: 'cr-angle', type: 'range', min: '0', max: '360', step: '5', value: '155' });
    const angleField = el('label', { class: 'cr-field', for: 'cr-angle', text: 'Ângulo' }, angle);
    const verdict = el('div', { class: 'cr-verdict', 'aria-live': 'polite' });
    const result = el('div');

    const update = () => {
      const a = byToken(from.value); const b = byToken(to.value);
      const samples = Array.from({ length: 9 }, (_, i) => mix(rgb(a.hex), rgb(b.hex), i / 8));
      const worst = (text) => Math.min(...samples.map((s) => ratio(s, text)));
      const w = worst(WHITE); const k = worst(INK);
      const best = Math.max(w, k); const useInk = k >= w;
      const badge = (name, v) => el('span', { style: `padding:2px 10px;border-radius:var(--rse-radius-pill);font-size:var(--rse-font-size-caption);font-weight:var(--rse-font-weight-bold);background:${v >= 4.5 ? 'var(--rse-color-success-surface)' : 'var(--rse-color-danger-surface)'};color:var(--rse-color-text-body)`, text: `${name} ${fmtRatio(v)} no pior ponto` });
      verdict.replaceChildren(badge('Tinta', k), badge('Branco', w));
      const bg = `linear-gradient(${angle.value}deg, var(${a.token}), var(${b.token}))`;
      if (best >= 4.5) {
        const p = el('div', { class: 'cr-preview', style: `background:${bg};color:${useInk ? 'var(--rse-brand-ink)' : 'var(--rse-brand-white)'}` },
          el('h3', { text: 'Aprender para a vida acontecer' }),
          el('p', { text: `Texto em ${useInk ? 'tinta' : 'branco'}, ${fmtRatio(best)} no pior ponto do degradê. Exemplo de composição.` }));
        result.replaceChildren(p);
      } else {
        result.replaceChildren(el('div', { class: 'cr-refused', role: 'status' },
          el('b', { text: `${a.label} → ${b.label} não sustenta texto` }),
          el('p', { text: `Nenhuma tinta chega a 4,5:1 em todo o degradê (melhor: ${fmtRatio(best)}). Aproxime os dois tons, ou deixe o texto fora do degradê, sobre um painel sólido.` })));
      }
    };
    [from, to, angle].forEach((c) => c.addEventListener('input', update));
    labMount.append(el('div', { class: 'cr-lab' },
      el('div', { class: 'sc-panel cr-fields' }, fromField, toField, angleField, verdict,
        el('p', { class: 'cr-tech', text: 'Só cores da paleta. O que vale é o pior ponto sob o texto, não a média.' })),
      result));
    update();
  }
})();
