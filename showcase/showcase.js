/* ─────────────────────────────────────────────────────────────────────────────
   showcase.js — renders showcase/index.html.

   Nothing here is transcribed: components come from dist/rse.js, palette and scales
   from brand.json, tokens per theme from dist/tokens.json, quality from the same
   baselines CI gates on (all folded into showcase-data.js by build-showcase.mjs), and
   every contrast ratio is measured from the colours the browser is painting right now.

   React.createElement form, no JSX — the page runs with no build step.
   ───────────────────────────────────────────────────────────────────────────── */
(() => {
  'use strict';

  const DS = window.RSE;
  const D = window.SHOWCASE_DATA;
  if (!DS || !D || !window.React) {
    document.body.insertAdjacentHTML('afterbegin',
      '<p style="padding:24px;font-family:sans-serif">Não foi possível carregar o design system. Abra esta página a partir da pasta <code>showcase/</code>, com <code>assets/</code> e <code>dist/</code> ao lado.</p>');
    return;
  }
  const h = React.createElement;
  const F = React.Fragment;
  const { GLOSS, DEMOS } = window.SC_DEMOS(DS);
  const icon = (name, size) => h(DS.Icon, { name, size: size || 20 });

  /* ── Helpers ──────────────────────────────────────────────────────────────── */

  const roots = new Map();
  const mount = (id, element) => {
    const node = document.getElementById(id);
    if (!node) return;
    let root = roots.get(id);
    if (!root) { root = ReactDOM.createRoot(node); roots.set(id, root); }
    root.render(element);
  };

  const resolveColor = (token, host) => {
    const probe = document.createElement('span');
    probe.style.cssText = 'position:absolute;opacity:0;pointer-events:none';
    probe.style.color = `var(${token})`;
    (host || document.body).appendChild(probe);
    const value = getComputedStyle(probe).color;
    probe.remove();
    return value;
  };
  const toRgb = (value) => {
    if (value.startsWith('#')) {
      const x = value.slice(1);
      return [0, 2, 4].map((i) => parseInt(x.slice(i, i + 2), 16));
    }
    const m = value.match(/-?[\d.]+/g);
    return m ? m.slice(0, 3).map(Number) : [0, 0, 0];
  };
  const toHex = (value) => '#' + toRgb(value).map((n) => Math.round(n).toString(16).padStart(2, '0')).join('');
  const luminance = (rgb) => {
    const [r, g, b] = rgb.map((c) => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const ratio = (a, b) => {
    const la = luminance(toRgb(a)); const lb = luminance(toRgb(b));
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
  };
  const fmt = (n) => Number(n).toLocaleString('pt-BR');
  const fmtRatio = (r) => r.toFixed(2).replace('.', ',') + ':1';

  const INK = D.tokens['--rse-brand-ink'].value;
  const WHITE = D.tokens['--rse-brand-white'].value;
  const HUE_PT = { purple: 'Roxo', pink: 'Rosa', orange: 'Laranja', yellow: 'Amarelo', green: 'Verde', blue: 'Azul', indigo: 'Índigo', cream: 'Creme', black: 'Preto' };
  const TONE_PT = { light: 'claro', base: 'médio', dark: 'escuro', ink: 'tinta' };

  /* ── Copy with feedback through the system's own Toast ───────────────────── */

  const toastRoot = ReactDOM.createRoot(document.getElementById('sc-toast-host'));
  let toastTimer = null;
  const showToast = (title, message) => {
    const close = () => toastRoot.render(null);
    toastRoot.render(h(DS.Toast, { tone: 'success', title, message, onClose: close }));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(close, 2600);
  };
  const copy = (text, label) => {
    const done = () => showToast('Copiado', `${label} está na área de transferência.`);
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, () => fallbackCopy(text, done));
    else fallbackCopy(text, done);
  };
  const fallbackCopy = (text, done) => {
    const field = document.createElement('textarea');
    field.value = text; field.setAttribute('readonly', ''); field.style.cssText = 'position:fixed;top:-1000px';
    document.body.appendChild(field); field.select();
    try { document.execCommand('copy'); done(); } catch (e) { /* nothing else to try */ }
    field.remove();
  };

  /* ── Chrome: theme, chapter spy, text that comes from data ───────────────── */

  const themeButtons = Array.from(document.querySelectorAll('[data-theme-set]'));
  const setTheme = (name) => {
    if (name === 'light') document.documentElement.removeAttribute('data-rse-theme');
    else document.documentElement.setAttribute('data-rse-theme', name);
    themeButtons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.themeSet === name)));
    requestAnimationFrame(renderMeasured);
  };
  themeButtons.forEach((b) => b.addEventListener('click', () => setTheme(b.dataset.themeSet)));

  const chapterIds = ['marca', 'fundamentos', 'componentes', 'aplicacoes', 'uso'];
  const chapterEls = chapterIds.map((id) => document.getElementById(id));
  const spyLinks = Array.from(document.querySelectorAll('[data-spy]'));
  let spyQueued = false;
  const spy = () => {
    spyQueued = false;
    let current = null;
    chapterEls.forEach((el, i) => { if (el && el.getBoundingClientRect().top < 140) current = chapterIds[i]; });
    spyLinks.forEach((a) => { if (a.dataset.spy === current) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  };
  window.addEventListener('scroll', () => { if (!spyQueued) { spyQueued = true; requestAnimationFrame(spy); } }, { passive: true });
  spy();

  document.getElementById('sc-version').textContent = `Design system ${D.version}`;
  document.getElementById('sc-footer-slogan').textContent = D.slogan + '.';
  document.getElementById('sc-footer-version').textContent = `${D.package}@${D.version}`;
  document.getElementById('sc-icons-lede').textContent =
    `${D.counts.icons} ícones de linha, grade de 24 px, traço de 2 px, herdando a cor do texto. Todo glifo do sistema vem daqui — nunca um emoji, nunca um desenho avulso. Busque e clique para copiar o nome.`;
  document.getElementById('sc-components-lede').textContent =
    `${D.counts.components} componentes, todos funcionando nesta página. ${D.contractComponents.length} deles já seguem o contrato CSS: funcionam com HTML puro, sem JavaScript, em qualquer site, CMS ou portal — e a aba "HTML" mostra exatamente a marcação que produzem.`;

  /* ── Capa ─────────────────────────────────────────────────────────────────── */

  const MOSAIC = [
    ['purple', 'interlock'], ['green', 'cube'], ['blue', 'hollow'],
    ['pink', 'frame'], ['orange', 'bar'], ['yellow', 'chain'],
  ];
  // Chapter art: one official construction per chapter, recoloured to the chapter's hue.
  document.querySelectorAll('.sc-chapter-art').forEach((node) => {
    ReactDOM.createRoot(node).render(h(DS.BrandMotif, { variant: node.dataset.motif, hue: node.dataset.hue, size: 416 }));
  });

  mount('mount-mosaic', h(F, null, MOSAIC.map(([hue, variant]) =>
    h('div', { key: hue, className: 'sc-tile', style: { background: `var(--rse-brand-${hue}-light)` } },
      h(DS.BrandMotif, { variant, hue, size: 200 }),
      h('span', { className: 'sc-tile-label', 'aria-hidden': 'true' }, HUE_PT[hue])
    ))));

  const Figures = () => {
    const pairs = D.contrastPairs.length;
    const items = [
      [D.counts.components, 'componentes reais, nesta página'],
      [D.counts.tokens, 'tokens, de uma fonte só'],
      [20, 'cores oficiais, com CMYK'],
      [pairs, 'pares de contraste verificados a cada mudança'],
      [D.quality.axeViolations, `violações WCAG em ${D.quality.pagesTested} páginas testadas`],
      [D.counts.themes, 'temas, mais o automático'],
    ];
    return h(F, null, items.map(([n, l], i) =>
      h('div', { className: 'sc-figure', key: i }, h('div', { className: 'n' }, fmt(n)), h('div', { className: 'l' }, l))));
  };
  mount('mount-figures', h(Figures));

  const PERSONAS = [
    { hue: 'purple', icon: 'trending-up', who: 'Liderança', what: 'O que o sistema resolve, como se mede e o caminho de adoção para todo o ecossistema.', href: '#por-que', go: 'Ver o argumento' },
    { hue: 'pink', icon: 'pencil', who: 'Design', what: 'Selo, paleta, tipografia, cubo impossível e as escalas que sustentam cada tela.', href: '#marca', go: 'Abrir a marca' },
    { hue: 'blue', icon: 'layout-dashboard', who: 'Desenvolvimento', what: 'Componentes vivos, o HTML que produzem, tokens tipados e as três rotas de instalação.', href: '#componentes', go: 'Ver componentes' },
    { hue: 'orange', icon: 'message-square', who: 'Comunicação', what: 'A voz da Rede, os slogans, as faixas de cor e as peças prontas para copiar.', href: '#voz', go: 'Ler a voz' },
    { hue: 'green', icon: 'bot', who: 'Agentes de IA', what: 'Regras escritas para máquinas e uma verificação que diz se o resultado respeita a marca.', href: '#agentes', go: 'Ver os arquivos' },
  ];
  mount('mount-personas', h(F, null, PERSONAS.map((p) =>
    h('a', { key: p.who, className: 'sc-persona', href: p.href, style: { background: `var(--rse-brand-${p.hue}-light)` } },
      h('span', { className: 'sc-persona-icon', 'aria-hidden': 'true' }, icon(p.icon, 22)),
      h('b', null, p.who),
      h('p', null, p.what),
      h('span', { className: 'go' }, p.go, icon('arrow-right', 16))
    ))));

  /* ── Por que: the same page, without and with the system ─────────────────── */

  const PLAIN_PAGE = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"><title>Sem sistema</title></head><body>
<h3>Rede Sesc de Educação</h3>
<h1>Aprender para a vida acontecer</h1>
<p>Educação que acolhe, forma e transforma — em unidades por todo o Brasil.</p>
<p><button>Quero me inscrever</button> <button>Conheça os programas</button></p>
<hr><h2>Programas</h2>
<p><b>Educação Infantil</b><br>Cuidar e educar juntos, com o brincar como método.</p>
<p><b>Ensino Fundamental</b><br>Base sólida em leitura, matemática e convivência.</p>
<p><b>Ensino Médio</b><br>Formação integral com projeto de vida no centro.</p>
<hr><p><label>Nome completo <input></label></p>
<p><label>Unidade <select><option>Selecione</option></select></label></p>
<p><button>Enviar inscrição</button></p></body></html>`;

  function ComparedWithSystem() {
    const [tab, setTab] = React.useState('infantil');
    const PROGRAMS = {
      infantil: { title: 'Educação Infantil', desc: 'Cuidar e educar juntos, com o brincar como método.', color: 'green' },
      fundamental: { title: 'Ensino Fundamental', desc: 'Base sólida em leitura, matemática e convivência.', color: 'blue' },
      medio: { title: 'Ensino Médio', desc: 'Formação integral com projeto de vida no centro.', color: 'orange' },
    };
    const current = PROGRAMS[tab];
    return h('div', { className: 'sc-compare-body', style: { display: 'flex', flexDirection: 'column', gap: 'var(--rse-space-5)', background: 'var(--rse-color-surface-page)' } },
      h('p', { className: 'sc-eyebrow', style: { margin: 0 } }, 'Rede Sesc de Educação'),
      h('h3', { style: { fontSize: 'var(--rse-font-size-h1)', margin: 0 } }, 'Aprender para a vida acontecer'),
      h('p', { style: { margin: 0, color: 'var(--rse-color-text-muted)', lineHeight: 'var(--rse-line-height-body)' } }, 'Educação que acolhe, forma e transforma — em unidades por todo o Brasil.'),
      h('div', { style: { display: 'flex', gap: 'var(--rse-space-3)', flexWrap: 'wrap' } },
        h(DS.Button, { icon: icon('graduation-cap') }, 'Quero me inscrever'),
        h(DS.Button, { variant: 'ghost' }, 'Conheça os programas')),
      h(DS.Divider, null),
      h(DS.Tabs, { tabs: [{ id: 'infantil', label: 'Infantil' }, { id: 'fundamental', label: 'Fundamental' }, { id: 'medio', label: 'Médio' }], activeId: tab, onChange: setTab, label: 'Níveis de ensino' }),
      h(DS.Card, { tag: h(DS.Tag, { color: current.color }, current.title), eyebrow: 'Programa', title: current.title, description: current.desc, headingLevel: 4 }),
      h(DS.Input, { label: 'Nome completo', placeholder: 'Como está no documento' }),
      h(DS.Select, { label: 'Unidade', placeholder: 'Selecione uma unidade', options: [{ label: 'Unidade A', value: 'a' }, { label: 'Unidade B', value: 'b' }] }),
      h('div', null, h(DS.Button, null, 'Enviar inscrição')));
  }
  mount('mount-compare', h(F, null,
    h('div', { className: 'sc-compare-col' },
      h('p', { className: 'sc-compare-label' }, icon('circle-x', 16), 'Sem sistema — o padrão do navegador'),
      h('div', { className: 'sc-compare-frame' }, h('iframe', { srcDoc: PLAIN_PAGE, title: 'A mesma página sem nenhum sistema de design' }))),
    h('div', { className: 'sc-compare-col' },
      h('p', { className: 'sc-compare-label is-good' }, icon('circle-check', 16), 'Com o sistema — componentes reais'),
      h('div', { className: 'sc-compare-frame' }, h(ComparedWithSystem)))));

  /* ── 01 Marca: selo ──────────────────────────────────────────────────────── */

  const LOGO = (id) => `../assets/logos/${id}.svg`;
  mount('mount-logo-versions', h(F, null, [
    { id: 'badge-solid', stage: 'is-cream is-clearspace', name: 'Principal', note: 'A preferida. A linha tracejada é o esquema da área de proteção: X livre em todos os lados.' },
    { id: 'badge-outline', stage: 'is-cream', name: 'Secundária', note: 'Contorno, para onde o sólido pesaria demais.' },
    { id: 'wordmark-white', stage: 'is-purple', name: 'Simplificada', note: 'Abaixo do tamanho mínimo, em positivo ou negativo.' },
  ].map((v) =>
    h('figure', { key: v.id, className: 'sc-logo-card', style: { margin: 0 } },
      h('div', { className: `sc-logo-stage ${v.stage}` }, h('img', { src: LOGO(v.id), alt: `Selo da Rede Sesc de Educação — versão ${v.name.toLowerCase()}` })),
      h('figcaption', { className: 'sc-logo-meta' }, h('b', null, v.name), h('span', null, v.note)))
  )));

  const LogoSize = () => {
    const [px, setPx] = React.useState(200);
    const simplified = px < 150;
    return h(F, null,
      h('div', { className: 'sc-size-stage' },
        h('img', { src: LOGO(simplified ? 'wordmark-purple' : 'badge-solid'), style: { width: px + 'px' }, alt: simplified ? 'Selo — versão simplificada' : 'Selo — versão principal' })),
      h('div', { className: 'sc-size-readout', 'aria-live': 'polite' },
        h('span', null, h('b', null, `${px} px`), ' de largura'),
        h('span', null, simplified ? 'versão simplificada — abaixo de 150 px' : 'versão principal')),
      h('input', { type: 'range', className: 'sc-range', min: 70, max: 300, step: 5, value: px, onChange: (e) => setPx(Number(e.target.value)), 'aria-label': 'Largura do selo em pixels' }));
  };
  mount('mount-logo-size', h(LogoSize));

  const MISUSE = [
    ['Girar', { transform: 'rotate(-14deg)' }],
    ['Esticar', { transform: 'scaleX(1.45)' }],
    ['Distorcer', { transform: 'skewX(-16deg)' }],
    ['Aplicar efeitos', { filter: 'drop-shadow(0 6px 4px var(--rse-brand-gray-500))' }],
    ['Cor fora da paleta', { filter: 'hue-rotate(150deg) saturate(3) invert(.2)' }],
    ['Contraste insuficiente', { opacity: 0.18 }],
  ];
  mount('mount-logo-misuse', h(F, null, MISUSE.map(([label, style]) =>
    h('figure', { key: label },
      h('div', { className: 'stage' },
        h('img', { src: LOGO('badge-solid'), alt: '', style }),
        h('span', { className: 'no', 'aria-hidden': 'true' }, icon('x', 14))),
      h('figcaption', null, 'Não: ', label.toLowerCase())))));

  /* ── 01 Marca: paleta ────────────────────────────────────────────────────── */

  // Which ink a field carries, decided by the measured ratio — the band rule, applied.
  const bestText = (bg) => {
    const ink = ratio(INK, bg); const white = ratio(WHITE, bg);
    const useInk = ink >= white;
    const best = Math.max(ink, white);
    return { color: useInk ? INK : WHITE, which: useInk ? 'tinta' : 'branco', best, ink, white,
      grade: best >= 4.5 ? 'AA' : best >= 3 ? 'AA grande' : 'sem texto' };
  };
  const FAMILIES = ['purple', 'pink', 'orange', 'yellow', 'green', 'blue'];
  const byFamily = (f) => D.palette.filter((c) => c.family === f);
  // Below 4.5:1 the swatch keeps its colour and the words sit on a plate, so nothing on the page
  // is written in a pairing the system itself would refuse.
  const Chip = ({ hex, label, sub, token, isInk }) => {
    const t = bestText(hex);
    const plated = t.best < 4.5;
    return h('button', {
      type: 'button', className: `sc-chip${isInk ? ' is-ink' : ''}${plated ? ' is-plated' : ''}`, style: { background: hex, color: plated ? undefined : t.color },
      onClick: () => copy(hex, hex.toUpperCase()), title: `${token} — copiar ${hex.toUpperCase()}`,
    },
      h('span', { className: 'top' }, h('span', { className: 'tone' }, label), h('span', { className: 'ratio' }, `${t.grade} ${fmtRatio(t.best)}`)),
      h('span', null, h('span', { className: 'hex' }, hex.toUpperCase()), sub ? h('span', { className: 'cmyk', style: { display: 'block' } }, sub) : null));
  };
  const cmyk = (c) => (c ? `C${c.c} M${c.m} Y${c.y} K${c.k}` : null);
  const Palette = () => h(F, null,
    h('div', { className: 'sc-palette' }, FAMILIES.map((f) => {
      const colors = ['light', 'base', 'dark'].map((tone) => byFamily(f).find((c) => c.tone === tone)).filter(Boolean);
      const ink = D.tokens[`--rse-brand-${f}-ink`];
      return h('div', { className: 'sc-family', key: f },
        h('p', { className: 'sc-family-name' }, HUE_PT[f]),
        colors.map((c) => h(Chip, { key: c.token, hex: c.hex, label: TONE_PT[c.tone], sub: cmyk(c.cmyk), token: c.token })),
        ink ? h(Chip, { hex: ink.value, label: 'tinta', sub: 'derivada, para texto', token: `--rse-brand-${f}-ink`, isInk: true }) : null);
    })),
    h('div', { className: 'sc-palette-anchors' },
      ['cream', 'indigo', 'black'].map((f) => {
        const c = D.palette.find((x) => x.family === f);
        return c ? h(Chip, { key: f, hex: c.hex, label: f === 'black' ? 'Preto da marca' : HUE_PT[f], sub: cmyk(c.cmyk), token: c.token }) : null;
      })));
  mount('mount-palette', h(Palette));
  (() => {
    const official = D.palette.filter((c) => c.cmyk && c.family !== 'black');
    const inkOk = official.filter((c) => ratio(INK, c.hex) >= 4.5).length;
    const whiteOk = official.filter((c) => ratio(WHITE, c.hex) >= 4.5).length;
    document.getElementById('mount-palette-note').textContent =
      `Medido agora: das ${official.length} cores oficiais, ${inkOk} carregam texto em tinta escura com 4,5:1 ou mais; só ${whiteOk} carregam branco. É por isso que a Rede escreve em tinta sobre as suas cores — e por que os tons escuros, que não sustentam nem uma nem outra, ganharam uma "tinta" derivada para o texto.`;
  })();

  /* ── 01 Marca: tipografia ────────────────────────────────────────────────── */

  const WEIGHT_ROLE = {
    400: 'Regular — corpo de texto.', 500: 'Medium — rótulos e apoios.', 600: 'Semibold — botões e links.',
    700: 'Bold — eyebrows e destaques.', 800: 'Extrabold — todos os títulos.', 900: 'Black — números de impacto e peças grandes.',
  };
  const TypeLab = () => {
    const [w, setW] = React.useState(800);
    const snapped = Math.round(w / 100) * 100;
    return h(F, null,
      h('p', { className: 'sc-type-specimen', style: { fontWeight: w } }, D.slogan),
      h('div', { className: 'sc-type-controls' },
        h('div', { className: 'sc-type-weight', 'aria-live': 'polite' }, w),
        h('div', { className: 'sc-type-role' }, WEIGHT_ROLE[snapped] || ''),
        h('input', { type: 'range', className: 'sc-range', min: 400, max: 900, step: 10, value: w, onChange: (e) => setW(Number(e.target.value)), 'aria-label': 'Peso da fonte' })));
  };
  mount('mount-type-lab', h(TypeLab));

  const TYPE_ROWS = [
    ['display-1', 'Display 1', 'Aprender para a vida acontecer', 'black'],
    ['h1', 'Título 1', 'Educação que acolhe, forma e transforma', 'extrabold'],
    ['h2', 'Título 2', 'Uma trajetória completa', 'extrabold'],
    ['h3', 'Título 3', 'Ensino fundamental', 'extrabold'],
    ['h4', 'Título 4', 'Matrículas abertas', 'bold'],
    ['body-lg', 'Corpo grande', 'A Rede reúne escolas e programas educacionais do Sesc em todo o país.', 'regular'],
    ['body-md', 'Corpo', 'A Rede reúne escolas e programas educacionais do Sesc em todo o país.', 'regular'],
    ['caption', 'Legenda', 'Fonte a verificar com o Sesc', 'regular'],
    ['eyebrow', 'Eyebrow', 'Rede Sesc de Educação', 'bold'],
  ];
  mount('mount-type-scale', h(F, null, TYPE_ROWS.map(([size, label, sample, weight]) =>
    h('div', { className: 'sc-type-row', key: size },
      h('div', { className: 'sc-type-meta' }, h('b', null, label), h('code', null, `--rse-font-size-${size}`), D.scales.type.sizes[size]),
      h('div', { className: 'sc-type-sample', style: {
        fontSize: `var(--rse-font-size-${size})`, fontWeight: `var(--rse-font-weight-${weight})`,
        letterSpacing: size === 'eyebrow' ? 'var(--rse-letter-spacing-eyebrow)' : weight === 'regular' ? 'normal' : 'var(--rse-letter-spacing-tight)',
        textTransform: size === 'eyebrow' ? 'uppercase' : 'none',
        lineHeight: weight === 'regular' ? 'var(--rse-line-height-body)' : 'var(--rse-line-height-heading)',
        color: size === 'eyebrow' ? 'var(--rse-color-text-on-primary-tint)' : 'var(--rse-color-text-heading)',
      } }, sample)))));

  /* ── 01 Marca: cubo impossível e padrões ─────────────────────────────────── */

  const MOTIF_PT = {
    cube: 'O cubo sólido', interlock: 'Dois cubos atravessados', bar: 'Cubo e barra impossível',
    frame: 'Moldura com dois vazios', chain: 'Corrente em ziguezague', hollow: 'Cubo aberto, centro vazio',
  };
  const MotifGallery = () => {
    const [hue, setHue] = React.useState(null);
    const options = [null, 'purple', 'green', 'blue', 'pink', 'orange', 'yellow'];
    return h(F, null,
      h('div', { className: 'sc-hue-switch', role: 'group', 'aria-label': 'Cor das construções' },
        options.map((id) => h('button', { key: id || 'original', type: 'button', 'aria-pressed': String(hue === id), onClick: () => setHue(id) },
          id ? h('span', { className: 'dot', style: { background: `var(--rse-brand-${id})` } }) : null,
          id ? HUE_PT[id] : 'Original'))),
      h('div', { className: 'sc-motifs' }, D.assets.motifs.map((m) =>
        h('figure', { className: 'sc-motif', key: m.id },
          h(DS.BrandMotif, { variant: m.variant, size: 140, hue: hue || undefined }),
          h('figcaption', null, h('b', null, MOTIF_PT[m.variant] || m.variant),
            hue && hue !== m.hue ? `${HUE_PT[hue].toLowerCase()} — derivada` : `${(HUE_PT[m.hue] || m.hue).toLowerCase()} — oficial`)))));
  };
  mount('mount-motifs', h(MotifGallery));
  mount('mount-patterns', h(F, null, D.assets.patterns.map((p) =>
    h('figure', { className: 'sc-pattern', key: p.id },
      h('div', { className: 'art', role: 'img', 'aria-label': `Padrão de cubos, família ${(HUE_PT[p.hue] || p.hue).toLowerCase()}`, style: { backgroundImage: `url(../${p.path})` } }),
      h('figcaption', null, `${HUE_PT[p.hue] || p.hue} · ${p.id}${p.id === 'cubes-pattern-4' ? ' — campo liso' : ''}`)))));

  /* ── 01 Marca: voz (from docs/brand-manual.md) ───────────────────────────── */

  const Voice = () => h(F, null,
    h('div', { className: 'sc-slogan-block' },
      h('p', { className: 'sc-slogan' }, D.slogan, h('small', null, 'Dialoga com o conceito institucional "A vida acontece com o Sesc".')),
      h('ul', { className: 'sc-extensions', 'aria-label': 'Extensões sancionadas do slogan' },
        ['crescer com confiança', 'ampliar horizontes', 'a vida acontecer em cada fase'].map((x) =>
          h('li', { key: x }, h('span', null, 'Aprender para '), x)))),
    h('div', { className: 'sc-tone' },
      h('div', { className: 'sc-panel' }, h('h3', { className: 'sc-h3' }, 'Somos'),
        h('ul', { className: 'yes' }, [
          ['Claros', 'sem complexidade desnecessária.'], ['Próximos', 'da vida e das escolhas de quem lê.'],
          ['Consistentes', 'com a Rede nacional e o Sesc.'], ['Relevantes', 'ligados à vida real e aos desafios de agora.'],
          ['Confiáveis', 'com a credibilidade institucional do Sesc.'],
        ].map(([b, t]) => h('li', { key: b }, icon('circle-check', 18), h('span', null, h('b', null, b), ' — ', t))))),
      h('div', { className: 'sc-panel' }, h('h3', { className: 'sc-h3' }, 'Evitamos'),
        h('ul', { className: 'no' }, [
          ['Técnico em excesso', 'jargão pedagógico que afasta.'], ['Distante', 'o "nós anunciamos" impessoal.'],
          ['Genérico', 'a mensagem que serviria a qualquer escola.'], ['Promocional demais', 'promessas que a Rede não sustenta.'],
          ['Emoji', 'nunca: é uma marca institucional.'],
        ].map(([b, t]) => h('li', { key: b }, icon('circle-x', 18), h('span', null, h('b', null, b), ' — ', t)))))),
    h('div', { className: 'sc-segments' }, [
      ['green', 'Educação Infantil', ['acolhimento', 'formação integral', 'protagonismo'], 'Linguagem sensível e próxima.'],
      ['blue', 'Ensino Fundamental', ['acolhimento', 'protagonismo', 'formação integral'], 'Equilíbrio entre proximidade e clareza.'],
      ['orange', 'Ensino Médio', ['resultado', 'inovação', 'protagonismo'], 'Direta e objetiva: futuro e decisões.'],
      ['purple', 'EJA', ['acolhimento', 'resultado', 'acessibilidade'], 'Direta e respeitosa, sem infantilizar.'],
    ].map(([hue, title, chips, tone]) =>
      h('div', { key: title, className: 'sc-segment', style: { background: `var(--rse-brand-${hue}-light)` } },
        h('b', null, title), h('div', { className: 'chips' }, chips.map((c) => h('span', { key: c }, c))), h('p', null, tone)))));
  mount('mount-voice', h(Voice));

  mount('mount-photos', h(F, null, [
    ['foto-sala', 'estudantes do ensino fundamental em atividade em grupo, sala de aula real, luz natural da janela, plano aberto, sem pose, uniforme Sesc visível', 'Pauta: atividade em grupo, plano aberto, luz natural.'],
    ['foto-zenital', 'vista de cima de mesa com mãos de crianças montando um projeto, materiais coloridos, luz natural, sem rostos identificáveis', 'Pauta: zenital, mãos e materiais.'],
    ['foto-inclusao', 'estudante usuário de cadeira de rodas participando de atividade com colegas, ambiente escolar real, enquadramento respeitoso e natural', 'Pauta: plural e inclusiva, sem encenação.'],
  ].map(([id, brief, caption]) =>
    h('figure', { key: id, className: 'sc-photo' },
      h('image-slot', { id: `sc-${id}`, shape: 'rounded', radius: '24', placeholder: brief }),
      h('figcaption', null, caption)))));

  /* ── 02 Fundamentos: token explorer ──────────────────────────────────────── */

  const ROLE_GROUPS = [
    ['Texto', /^--rse-color-text-/], ['Superfície', /^--rse-color-surface-/], ['Borda', /^--rse-color-border-/],
    ['Ação e foco', /^--rse-color-(primary|focus)/], ['Estado', /^--rse-color-(success|warning|danger|info)/],
    ['Etiquetas', /^--rse-color-tint-/], ['Sab.IA', /^--rse-color-sabia-/], ['Dados e outros', /^--rse-color-/],
  ];
  const roleNames = Object.keys(D.tokenTable).filter((n) => n.startsWith('--rse-color-'));
  const groupedRoles = ROLE_GROUPS.map(([label, re]) => [label, roleNames.filter((n) => re.test(n))]);
  { const seen = new Set(); groupedRoles.forEach((g) => { g[1] = g[1].filter((n) => !seen.has(n) && seen.add(n)); }); }
  const aliasOf = (raw) => { const m = raw && raw.match(/var\((--[a-z0-9-]+)\)/); return m ? m[1] : null; };
  const MODES = [['light', 'Claro'], ['dark', 'Escuro'], ['contrast', 'Alto contraste']];

  const TokenExplorer = () => {
    const [sel, setSel] = React.useState('--rse-color-text-link');
    const row = D.tokenTable[sel];
    return h(F, null,
      h('div', { className: 'sc-panel sc-panel--flush' },
        h('div', { className: 'sc-role-list', role: 'group', 'aria-label': 'Papéis de cor', tabIndex: 0 },
          groupedRoles.filter(([, list]) => list.length).map(([label, list]) => h(F, { key: label },
            h('p', { className: 'sc-role-group' }, label),
            list.map((n) => h('button', { key: n, type: 'button', className: 'sc-role', 'aria-pressed': String(n === sel), onClick: () => setSel(n) },
              h('i', { style: { background: D.tokenTable[n].modes.light.value } }), n.replace('--rse-color-', '')))))) ),
      h('div', { className: 'sc-panel' },
        h('h3', { className: 'sc-chain-title' }, h('code', null, sel)),
        h('p', { className: 'sc-chain-desc' }, row.description || 'Papel de cor da camada 2: componentes e páginas leem este nome, nunca o valor.'),
        h('div', { className: 'sc-chain-modes' }, MODES.map(([mode, label]) => {
          const m = row.modes[mode];
          const alias = aliasOf(m.raw);
          return h('div', { className: 'sc-chain-mode', key: mode },
            h('div', { className: 'sw', style: { background: m.value } }),
            h('div', { className: 'info' }, h('b', null, label), h('code', null, m.value),
              alias ? h('span', null, '← ', h('code', null, alias)) : h('span', null, 'valor próprio deste tema')));
        })),
        h('div', { className: 'sc-tiers', 'aria-label': 'Camadas' },
          h('span', { className: 'sc-tier' }, 'Marca: --rse-brand-*'), icon('arrow-right', 16),
          h('span', { className: 'sc-tier' }, 'Papel: --rse-color-*'), icon('arrow-right', 16),
          h('span', { className: 'sc-tier' }, 'Componente: .rse-*'))));
  };
  mount('mount-token-explorer', h(TokenExplorer));

  /* ── 02 Fundamentos: escalas, movimento, layout ──────────────────────────── */

  mount('mount-space', h(F, null, Object.entries(D.scales.spacing).map(([n, v]) =>
    h('div', { className: 'sc-space-row', key: n },
      h('code', null, `--rse-space-${n}`), h('i', { className: 'sc-space-bar', style: { width: `var(--rse-space-${n})` } }), h('span', null, v)))));
  mount('mount-radius', h(F, null, Object.entries(D.scales.radius).map(([r, v]) =>
    h('div', { key: r }, h('div', { className: 'sc-specimen', style: { borderRadius: `var(--rse-radius-${r})` } }), h('p', { className: 'sc-scale-label' }, r, h('br'), v)))));
  mount('mount-shadow', h(F, null, Object.keys(D.scales.shadow).map((s) =>
    h('div', { key: s }, h('div', { className: 'sc-shadow-box', style: { boxShadow: `var(--rse-shadow-${s})` } }), h('p', { className: 'sc-scale-label' }, `--rse-shadow-${s}`)))));

  const Motion = () => {
    const [on, setOn] = React.useState(false);
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return h(F, null,
      h('h3', { className: 'sc-h3' }, 'Movimento'),
      h('p', { className: 'sc-note' }, reduced ? 'Seu sistema pede menos movimento: aqui, como em todo o sistema, as transições são instantâneas.' : 'Curva padrão, três durações. Nada de quicar, nada disparado pela rolagem.'),
      ['fast', 'base', 'slow'].map((d) => h('div', { className: 'sc-motion-row', key: d },
        h('code', null, `${d} · ${D.tokens[`--rse-duration-${d}`].value}`),
        h('div', { className: `sc-motion-track${on ? ' is-on' : ''}` }, h('span', { className: 'sc-motion-dot', style: { transitionDuration: `var(--rse-duration-${d})` } })))),
      h(DS.Button, { variant: 'secondary', size: 'sm', icon: icon(on ? 'refresh-cw' : 'play', 16), onClick: () => setOn(!on) }, on ? 'Voltar' : 'Reproduzir'));
  };
  mount('mount-motion', h(Motion));

  const Layout = () => {
    const bps = Object.entries(D.scales.breakpoints || {});
    const max = 1440;
    const containers = Object.entries(D.scales.layout).filter(([k]) => /^container-(sm|md|lg|xl)$/.test(k)).sort((a, b) => parseInt(a[1], 10) - parseInt(b[1], 10));
    return h(F, null,
      h('h3', { className: 'sc-h3' }, 'Pontos de quebra e contêineres'),
      h('p', { className: 'sc-note' }, 'Da tela de um celular à de um monitor. O conteúdo de leitura para em 66 caracteres por linha.'),
      h('div', { className: 'sc-bp', role: 'img', 'aria-label': 'Régua de pontos de quebra: ' + bps.map(([k, v]) => `${k} ${v}`).join(', ') },
        bps.map(([k, v]) => h('div', { key: k, className: 'sc-bp-mark', style: { left: `${(parseInt(v, 10) / max) * 100}%`, display: parseInt(v, 10) >= max ? 'none' : 'block' } },
          h('span', null, k), h('em', null, v)))),
      h('div', { className: 'sc-containers' }, containers.map(([k, v]) =>
        h('div', { key: k, className: 'sc-container-bar', style: { width: `${(parseInt(v, 10) / max) * 100}%` } }, `${k.replace('container-', '')} · ${v}`))));
  };
  mount('mount-layout', h(Layout));

  /* ── 02 Fundamentos: temas ───────────────────────────────────────────────── */

  const ThemePreview = ({ theme, label }) =>
    h('div', { className: 'sc-theme-preview', 'data-rse-theme': theme || undefined },
      h('div', { className: 'head' }, label),
      h('div', { className: 'body' },
        h('div', { style: { display: 'flex', gap: 'var(--rse-space-2)', flexWrap: 'wrap' } }, h(DS.Tag, { color: 'green' }, 'Educação Infantil'), h(DS.Badge, { tone: 'success' }, 'Vagas abertas')),
        h('h3', { style: { fontSize: 'var(--rse-font-size-h3)', margin: 0, color: 'var(--rse-color-text-heading)' } }, 'Primeiros passos'),
        h('p', { style: { fontSize: 'var(--rse-font-size-body-sm)', color: 'var(--rse-color-text-muted)', margin: 0, lineHeight: 'var(--rse-line-height-body)' } }, 'Acolhimento e descoberta para crianças de 0 a 5 anos.'),
        h(DS.Input, { label: 'E-mail do responsável', placeholder: 'nome@exemplo.com' }),
        h('div', { style: { display: 'flex', gap: 'var(--rse-space-2)', flexWrap: 'wrap' } }, h(DS.Button, { size: 'sm' }, 'Quero me inscrever'), h(DS.Button, { size: 'sm', variant: 'ghost' }, 'Saiba mais')),
        h(DS.Alert, { tone: 'info', message: 'Matrículas abertas nas unidades participantes.' })));
  mount('mount-themes', h(F, null, [['light', 'Claro — o padrão'], ['dark', 'Escuro'], ['contrast', 'Alto contraste']].map(([theme, label]) =>
    h(ThemePreview, { key: label, theme, label }))));

  /* ── 02 Fundamentos: acessibilidade ──────────────────────────────────────── */

  const ContrastTable = () => {
    const rows = D.contrastPairs.map((p) => {
      const front = resolveColor(p.fg); const back = resolveColor(p.bg); const r = ratio(front, back);
      return { ...p, front, back, r, pass: r >= p.floor };
    });
    const failing = rows.filter((x) => !x.pass).length;
    return h(F, null,
      h('caption', { style: { color: failing ? 'var(--rse-color-danger-text)' : 'var(--rse-color-success-text)' } },
        failing ? `${rows.length - failing} de ${rows.length} combinações passam neste tema.` : `As ${rows.length} combinações passam neste tema.`),
      h('thead', null, h('tr', null, h('th', null, 'Combinação'), h('th', null, 'Amostra'), h('th', null, 'Razão'), h('th', { className: 'hide-sm' }, 'Mínimo'), h('th', null, 'Resultado'))),
      h('tbody', null, rows.map((x) => h('tr', { key: x.label },
        h('td', null, x.label),
        h('td', null, x.floor < 4.5
          ? h('span', { className: 'sc-contrast-sample is-graphic', 'aria-hidden': 'true', style: { background: x.back, boxShadow: `inset 0 0 0 3px ${x.front}` } })
          : h('span', { className: 'sc-contrast-sample', style: { color: x.front, background: x.back } }, 'Aprender')),
        h('td', null, h('span', { className: 'sc-ratio' }, fmtRatio(x.r))),
        h('td', { className: 'hide-sm' }, `${String(x.floor).replace('.', ',')}:1`),
        h('td', null, h('span', { className: `sc-verdict ${x.pass ? 'pass' : 'fail'}` }, icon(x.pass ? 'circle-check' : 'triangle-alert', 14), x.pass ? 'Passa' : 'Reprova'))))));
  };

  const KeyboardDemo = () => {
    const [tab, setTab] = React.useState('a');
    const [checked, setChecked] = React.useState(false);
    return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--rse-space-4)' } },
      h(DS.Input, { label: 'Comece aqui', placeholder: 'e pressione Tab' }),
      h(DS.Tabs, { tabs: [{ id: 'a', label: 'Uma' }, { id: 'b', label: 'Duas' }, { id: 'c', label: 'Três' }], activeId: tab, onChange: setTab, label: 'Demonstração de teclado' }),
      h(DS.Checkbox, { label: 'Marque com a barra de espaço', checked, onChange: (e) => setChecked(e.target.checked) }),
      h('div', null, h(DS.Button, { variant: 'ghost', size: 'sm' }, 'Última parada')));
  };
  mount('mount-a11y-demo', h(KeyboardDemo));
  mount('mount-a11y-facts', h(F, null,
    h('h3', { className: 'sc-h3' }, 'Garantido, e verificado'),
    h('ul', { className: 'sc-facts' }, [
      [`${fmt(D.quality.axeViolations)} violações WCAG 2.2 AA`, ` nas ${D.quality.pagesTested} páginas que o CI abre no Chromium a cada mudança.`],
      ['Foco sempre visível', ' — nenhum elemento perde o anel ao receber o foco.'],
      ['Tudo pelo teclado', ' — abas com as setas, menus e diálogos fecham com Esc.'],
      ['Alvo de toque de 44 px', ' nas ações principais.'],
      ['Menos movimento', ' para quem pede isso ao sistema operacional, automaticamente.'],
    ].map(([b, t]) => h('li', { key: b }, icon('circle-check', 18), h('span', null, h('b', null, b), t))))));

  /* ── 02 Fundamentos: ícones ──────────────────────────────────────────────── */

  const Icons = () => {
    const [q, setQ] = React.useState('');
    const names = (D.assets.icons.names || []).filter((n) => !q || n.includes(q.trim().toLowerCase()));
    return h(F, null,
      h('div', { className: 'sc-icon-tools' },
        h(DS.Input, { label: 'Buscar ícone', placeholder: 'calendar, school, user…', value: q, onChange: (e) => setQ(e.target.value) }),
        h('span', { className: 'sc-note', style: { margin: 0 } }, `${names.length} de ${D.assets.icons.names.length} · Lucide (ISC)`)),
      h('div', { className: 'sc-icon-grid' }, names.map((n) =>
        h('button', { key: n, type: 'button', className: 'sc-icon', onClick: () => copy(n, `O nome "${n}"`), 'aria-label': `Copiar o nome do ícone ${n}` },
          icon(n, 24), h('span', { 'aria-hidden': 'true' }, n)))));
  };
  mount('mount-icons', h(Icons));

  /* ── 03 Componentes: the gallery ─────────────────────────────────────────── */

  const GROUPS = [];
  D.components.forEach((c) => { if (!GROUPS.some((g) => g.id === c.group)) GROUPS.push({ id: c.group, label: c.groupLabel }); });
  const isContract = (name) => D.contractComponents.includes(name);

  // Pretty-print the markup a demo produced: what a CMS author would paste.
  const prettyHtml = (html) => {
    const VOID = /^<(area|br|col|hr|img|input|link|meta|source|wbr)\b/;
    const flat = html.replace(/<svg[\s\S]*?<\/svg>/g, '<svg>…</svg>').replace(/>\s+</g, '><');
    const tokens = flat.split(/(?=<)|(?<=>)/).filter((t) => t.trim());
    let depth = 0; const out = [];
    for (const t of tokens) {
      if (t.startsWith('</')) depth = Math.max(0, depth - 1);
      out.push('  '.repeat(depth) + t);
      if (t.startsWith('<') && !t.startsWith('</') && !t.endsWith('/>') && !VOID.test(t)) depth++;
    }
    // An element with only text stays on one line: <p>Texto</p>
    return out.join('\n').replace(/^( *)(<[^/][^>]*>)\n *([^<\n]+)\n *(<\/[^>]+>)/gm, '$1$2$3$4').replace(/<svg>\n *…\n *<\/svg>/g, '<svg>…</svg>');
  };
  // The demo's own layout wrapper (an unclassed div with inline style) is not part of the component.
  const componentMarkup = (stage) => {
    const isLayout = (el) => el.tagName === 'DIV' && !el.className && el.hasAttribute('style');
    const unwrap = (el) => [...el.children].map((c) => (isLayout(c) ? unwrap(c) : c.outerHTML)).join('');
    return unwrap(stage);
  };

  const DemoCard = ({ component }) => {
    const demo = DEMOS[component.name];
    const contract = isContract(component.name);
    const [tab, setTab] = React.useState(null);
    const stageRef = React.useRef(null);
    const tabs = [['props', 'Props'], ...(contract ? [['html', 'HTML']] : []), ['use', 'Usar']];
    const panel = () => {
      if (tab === 'props') return component.props.length
        ? h('table', { className: 'sc-props' }, h('thead', null, h('tr', null, h('th', null, 'prop'), h('th', null, 'tipo'), h('th', null, 'nota'))),
            h('tbody', null, component.props.map((p) => h('tr', { key: p.name }, h('td', null, h('code', null, p.name), p.required ? h('span', { className: 'req' }, ' *') : null), h('td', null, h('code', null, p.type)), h('td', null, p.notes || '—')))))
        : h('p', { className: 'sc-note' }, 'Sem props declaradas.');
      if (tab === 'html') {
        const html = stageRef.current ? prettyHtml(componentMarkup(stageRef.current)) : '';
        return h(F, null,
          h('p', { className: 'sc-note' }, 'A marcação que este componente acabou de produzir. Com o CSS do sistema, ela funciona igual sem React — cole num CMS ou no portal.'),
          h('pre', { className: 'sc-code', tabIndex: 0, 'aria-label': `HTML gerado por ${component.name}` }, html),
          h('div', { className: 'sc-copy-row' }, h(DS.Button, { size: 'sm', variant: 'secondary', icon: icon('download', 16), onClick: () => copy(html, `O HTML de ${component.name}`) }, 'Copiar HTML')));
      }
      if (tab === 'use') {
        const snippet = `// React\nimport { ${component.name} } from '${D.package}';\n\n// Página estática, depois do React 18\nconst { ${component.name} } = window.RSE;`;
        return h(F, null, h('pre', { className: 'sc-code', tabIndex: 0, 'aria-label': `Como importar ${component.name}` }, snippet),
          h('p', { className: 'sc-note', style: { margin: 'var(--rse-space-3) 0 0' } }, component.sourcePath));
      }
      return null;
    };
    return h('article', { className: 'sc-demo', id: `componente-${component.name.toLowerCase()}` },
      h('div', { className: 'sc-demo-head' },
        h('h3', { className: 'sc-demo-name' }, component.name,
          h('span', { className: 'sc-demo-tag' }, component.groupLabel),
          contract ? h('span', { className: 'sc-demo-tag is-contract' }, 'Contrato CSS') : null),
        h('p', { className: 'sc-demo-desc' }, GLOSS[component.name] || component.summary)),
      h('div', { className: `sc-demo-stage${demo && demo.block ? ' is-block' : ''}`, ref: stageRef },
        demo ? demo.render() : h('p', { className: 'sc-note', style: { margin: 0 } }, 'Sem demonstração nesta página.')),
      h('div', { className: 'sc-demo-tabs', role: 'tablist', 'aria-label': `Detalhes de ${component.name}` },
        tabs.map(([id, label]) => h('button', { key: id, type: 'button', role: 'tab', 'aria-selected': String(tab === id), onClick: () => setTab(tab === id ? null : id) }, label))),
      tab ? h('div', { className: 'sc-demo-panel', role: 'tabpanel' }, panel()) : null);
  };

  const Gallery = () => {
    const [query, setQuery] = React.useState('');
    const [groups, setGroups] = React.useState([]);
    const [onlyContract, setOnlyContract] = React.useState(false);
    const q = query.trim().toLowerCase();
    const visible = D.components.filter((c) =>
      (groups.length === 0 || groups.includes(c.group)) && (!onlyContract || isContract(c.name)) &&
      (!q || c.name.toLowerCase().includes(q) || (GLOSS[c.name] || '').toLowerCase().includes(q) || c.summary.toLowerCase().includes(q)));
    return h(F, null,
      ReactDOM.createPortal(h(F, null,
        h('div', { className: 'sc-gallery-search' }, h(DS.Input, { label: 'Buscar componente', placeholder: 'botão, tabela, matrícula…', value: query, onChange: (e) => setQuery(e.target.value) })),
        h('div', { style: { flex: '1 1 24rem' } }, h(DS.FilterChips, {
          label: 'Grupo', value: groups, onChange: setGroups, showClear: true,
          options: GROUPS.map((g) => ({ id: g.id, label: g.label, count: D.components.filter((c) => c.group === g.id).length })) })),
        h(DS.Switch, { label: 'Só contrato CSS', checked: onlyContract, onChange: (e) => setOnlyContract(e.target.checked) }),
        h('span', { className: 'sc-gallery-count', 'aria-live': 'polite' }, `${visible.length} de ${D.components.length}`)),
      document.getElementById('mount-gallery-controls')),
      visible.length
        ? h('div', { className: 'sc-demos' }, visible.map((c) => h(DemoCard, { component: c, key: c.name })))
        : h('div', { className: 'sc-empty' }, 'Nenhum componente corresponde a essa busca.'));
  };
  mount('mount-gallery', h(Gallery));

  /* ── 04 Aplicações: band lab ─────────────────────────────────────────────── */

  const BAND_OPTIONS = [];
  FAMILIES.forEach((f) => ['light', 'base', 'dark'].forEach((tone) => {
    const c = D.palette.find((x) => x.family === f && x.tone === tone);
    if (c) BAND_OPTIONS.push({ id: c.token, hex: c.hex, label: `${HUE_PT[f]} ${TONE_PT[tone]}` });
  }));
  const indigo = D.palette.find((x) => x.family === 'indigo');
  if (indigo) BAND_OPTIONS.push({ id: indigo.token, hex: indigo.hex, label: 'Índigo' });

  const BandLab = () => {
    const [sel, setSel] = React.useState('--rse-brand-green');
    const [title, setTitle] = React.useState('Matrículas abertas para 2027');
    const opt = BAND_OPTIONS.find((o) => o.id === sel);
    const t = bestText(opt.hex);
    const ok = t.best >= 4.5;
    return h(F, null,
      h('div', { className: 'sc-panel' },
        h('h3', { className: 'sc-h3' }, 'Cor da faixa'),
        h('div', { className: 'sc-band-swatches', role: 'group', 'aria-label': 'Cor da faixa' },
          BAND_OPTIONS.map((o) => {
            const refused = bestText(o.hex).best < 4.5;
            return h('button', { key: o.id, type: 'button', className: `sc-band-swatch${refused ? ' is-refused' : ''}`, style: { background: o.hex },
              'aria-pressed': String(o.id === sel), 'aria-label': `${o.label}${refused ? ' — não sustenta texto' : ''}`, title: o.label, onClick: () => setSel(o.id) });
          })),
        h(DS.Input, { label: 'Título da faixa', value: title, onChange: (e) => setTitle(e.target.value), maxLength: 80 }),
        h('div', { className: 'sc-band-verdict' },
          h(DS.Badge, { tone: t.ink >= 4.5 ? 'success' : 'danger' }, `Tinta ${fmtRatio(t.ink)}`),
          h(DS.Badge, { tone: t.white >= 4.5 ? 'success' : 'danger' }, `Branco ${fmtRatio(t.white)}`))),
      ok
        ? h('div', { className: 'sc-band-preview', style: { background: opt.hex, color: t.color }, 'aria-live': 'polite' },
            h('p', { className: 'eyebrow' }, `${opt.label} · texto em ${t.which} · ${fmtRatio(t.best)}`),
            h('h3', null, title || 'Escreva um título'),
            h('p', null, 'Inscrições nas unidades participantes até o fim do mês. Exemplo de conteúdo — verifique datas com o Sesc.'),
            h('div', null, h(DS.Button, { variant: 'secondary', icon: icon('graduation-cap', 18) }, 'Quero me inscrever')))
        : h('div', { className: 'sc-band-refused', role: 'status' },
            icon('triangle-alert', 28),
            h('b', null, `${opt.label} não sustenta texto`),
            h('p', { style: { margin: 0 } }, `Tinta chega a ${fmtRatio(t.ink)} e branco a ${fmtRatio(t.white)} — ambos abaixo de 4,5:1. Use o tom claro ou médio desta família como faixa; o tom escuro fica para ilustração e para a arte.`)));
  };
  mount('mount-band-lab', h(BandLab));

  /* ── 04 Aplicações: templates, live, at three widths ─────────────────────── */

  const TEMPLATE_PT = {
    'Landing Page': ['Página de campanha', 'Aviso, hero, números, programas em abas, depoimento, busca de unidades e formulário de interesse.'],
    'Program detail page': ['Página de programa', 'Janela de matrícula, tabela de turmas, filtros, perguntas frequentes e inscrição em etapas.'],
    'Institutional deck': ['Apresentação institucional', 'Nove slides em 1920×1080, para projeção, PDF ou PowerPoint.'],
    'Enrollment form (print)': ['Ficha de matrícula', 'Formulário A4 de duas páginas: dados, documentos, termos e assinaturas.'],
  };
  const VIEW = {
    'Landing Page': { width: 1280, height: 1500, web: true },
    'Program detail page': { width: 1280, height: 1500, web: true },
    'Institutional deck': { width: 1280, height: 720 },
    'Enrollment form (print)': { width: 880, height: 1240, paper: true },
  };
  const ARTEFACTS = [
    ...D.templates.map((t) => ({ key: t.name, title: (TEMPLATE_PT[t.name] || [t.name])[0], desc: (TEMPLATE_PT[t.name] || [])[1] || t.description, src: `../${t.entryPath}`, ...(VIEW[t.name] || { width: 1280, height: 1400 }) })),
    { key: 'poster', title: 'Cartaz A3', desc: 'Ponto de partida para peça impressa, com o CSS de impressão resolvido.', src: '../starters/poster.html', width: 1170, height: 1660, paper: true },
  ];
  const DEVICES = [[360, 'Celular', 'phone'], [834, 'Tablet', 'layout-dashboard'], [1280, 'Desktop', 'globe']];

  const Artefact = ({ item }) => {
    const stageRef = React.useRef(null);
    const [avail, setAvail] = React.useState(560);
    const [device, setDevice] = React.useState(item.width);
    React.useEffect(() => {
      const node = stageRef.current; if (!node) return;
      const measure = () => setAvail(node.clientWidth);
      measure();
      const ro = new ResizeObserver(measure); ro.observe(node);
      return () => ro.disconnect();
    }, []);
    const width = item.web ? device : item.width;
    const scale = Math.min(1, (avail - (item.paper ? 32 : 0)) / width);
    const frameHeight = item.web && device < 834 ? 1500 : item.height;
    const visible = Math.round(Math.min(frameHeight * scale, 640));
    return h('div', { className: 'sc-artefact' },
      h('div', { className: 'sc-artefact-head' },
        h('div', null, h('h3', { className: 'sc-artefact-title' }, item.title), h('p', { className: 'sc-artefact-desc' }, item.desc)),
        item.web ? h('div', { className: 'sc-device', role: 'group', 'aria-label': `Largura de ${item.title}` },
          DEVICES.map(([w, label, ic]) => h('button', { key: w, type: 'button', 'aria-pressed': String(device === w), onClick: () => setDevice(w) }, icon(ic, 14), label))) : null),
      h('div', { className: `sc-viewport${item.paper ? ' is-paper' : ''}` },
        item.paper ? null : h('div', { className: 'chrome', 'aria-hidden': 'true' }, h('i'), h('i'), h('i')),
        h('div', { className: 'stage', ref: stageRef, style: { height: `${visible}px` } },
          h('iframe', { src: item.src, title: `${item.title} — ${width} px`, tabIndex: -1, 'aria-hidden': 'true',
            style: { width: `${width}px`, height: `${frameHeight}px`, transform: `scale(${scale})` } }))),
      h('a', { className: 'sc-open', href: item.src, target: '_blank', rel: 'noopener' }, icon('external-link', 16), `Abrir ${item.title.toLowerCase()} em tamanho real`));
  };
  mount('mount-artefacts', h(F, null, ARTEFACTS.map((item) => h(Artefact, { item, key: item.key }))));

  /* ── 04 Aplicações: Sab.IA (docs/sabia-platform.md) ──────────────────────── */

  const SABIA_NAV = ['Social', 'Conteúdos', 'Biblioteca', 'Plano de aula', 'Atividades', 'Relatórios', 'Agendamento', 'Suporte'];
  const SABIA_CARDS = [
    ['purple', 'book-open', 'Plano de aula', 'Monte a sequência da semana com sugestões alinhadas ao material autoral.'],
    ['orange', 'clipboard-check', 'Atividades', 'Acompanhe entregas e devolutivas da turma em um só lugar.'],
    ['blue', 'folder', 'Biblioteca', 'Conteúdos da Rede organizados por segmento e componente curricular.'],
    ['green', 'chart-column', 'Relatórios', 'Trilhas personalizadas e o avanço de cada estudante.'],
  ];
  mount('mount-sabia', h(F, null,
    h('div', { className: 'sc-sabia', 'data-rse-theme': 'light', role: 'img', 'aria-label': 'Esquema do cabeçalho, da navegação e do rodapé da Plataforma Sesc Sab.IA' },
      h('div', { className: 'sc-sabia-bar' },
        h('img', { src: LOGO('sabia-horizontal-colour'), alt: '' }),
        h('span', { className: 'sc-sabia-context' }, 'Educação · Rede de ensino (DN)'),
        h('span', { className: 'sc-sabia-user' }, h(DS.Avatar, { initials: 'AR', size: 'sm' }), 'Ana R.')),
      h('div', { className: 'sc-sabia-nav' }, SABIA_NAV.map((n) => h('span', { key: n, 'aria-current': n === 'Conteúdos' ? 'page' : undefined }, n))),
      h('div', { className: 'sc-sabia-body' },
        h('h3', null, 'Olá, Ana. Continue de onde parou.'),
        h('div', { className: 'sc-sabia-cards' }, SABIA_CARDS.map(([hue, ic, title, text]) =>
          h('div', { key: title, className: 'sc-sabia-card' },
            h('i', { style: { background: `var(--rse-color-tint-${hue})`, color: `var(--rse-brand-${hue}-ink)` } }, icon(ic, 22)),
            h('b', null, title), h('p', null, text))))),
      h('div', { className: 'sc-sabia-foot' }, 'Suporte · (00) 0000-0000 · segunda a sexta — exemplo de preenchimento')),
    h('div', { className: 'sc-sabia-palette' },
      [['--rse-color-sabia-blue', 'Azul — cromo da plataforma'], ['--rse-color-sabia-purple', 'Roxo — acento'], ['--rse-color-sabia-orange', 'Laranja — acento']].map(([tok, label]) =>
        h('span', { key: tok }, h('i', { style: { background: `var(${tok})` } }), label))),
    h('div', { className: 'sc-sabia-entry' }, h(DS.PlatformEntry, null))));

  /* ── 05 Uso ──────────────────────────────────────────────────────────────── */

  const ROUTES = [
    ['HTML e CSS', 'Sites em CMS, o portal de matrícula, peças entregues como arquivo. Um kit versionado, hospedado num caminho fixo; os componentes viram classes.',
      `<link rel="stylesheet" href="/rse/${D.version}/styles.css">\n\n<a class="rse-button" href="/matricula">\n  Quero me inscrever\n</a>\n<span class="rse-badge rse-badge--success">\n  Vagas abertas\n</span>`],
    ['React', 'Código de produção. Um pacote versionado no GitHub Packages, com tipos; os componentes renderizam as mesmas classes do HTML.',
      `npm install ${D.package}\n\nimport '${D.package}/styles.css';\nimport { Button, Card } from '${D.package}';\n\n<Button href="/matricula">Quero me inscrever</Button>`],
    ['Fora do navegador', 'Geradores em Python, fluxos de impressão, ferramentas de design. A marca inteira em dados: paleta com CMYK, escalas, regras.',
      'import json\nbrand = json.load(open("brand.json"))\n\nroxo = brand["palette"][0]\nroxo["hex"], roxo["cmyk"]\nbrand["rules"]["logo"]["minSize"]'],
  ];
  mount('mount-routes', h(F, null, ROUTES.map(([title, who, code]) =>
    h('div', { key: title, className: 'sc-panel sc-route' },
      h('h3', { className: 'sc-h3' }, title), h('p', { className: 'who' }, who),
      h('pre', { className: 'sc-code', tabIndex: 0, 'aria-label': `Exemplo: ${title}` }, code),
      h('div', null, h(DS.Button, { size: 'sm', variant: 'secondary', onClick: () => copy(code, `O exemplo de ${title}`) }, 'Copiar'))))));

  const LEVELS = [
    ['is-bronze', 'Bronze', 'Parece a Rede', ['Carrega os tokens do sistema', 'Montserrat, paleta e selo pelas regras do manual', 'Texto em pt-BR, na voz da Rede']],
    ['is-silver', 'Prata', 'Funciona como a Rede', ['Bronze, mais componentes do sistema em todo o cromo', 'WCAG 2.2 AA nas jornadas principais', 'Responsivo de 360 a 1440 px']],
    ['is-gold', 'Ouro', 'É a Rede', ['Prata, mais seções montadas com os padrões', 'Temas claro, escuro e alto contraste', 'No máximo uma versão atrás da mais recente']],
  ];
  mount('mount-levels', h(F, null, LEVELS.map(([cls, name, tag, items]) =>
    h('div', { key: name, className: `sc-level ${cls}` }, h('b', null, name), h('span', { className: 'tag' }, tag), h('ul', null, items.map((x) => h('li', { key: x }, x)))))));

  const AGENT_FILES = [
    ['bot', 'AGENTS.md', 'O guia de trabalho: regras inegociáveis, mapa do repositório, receitas e definição de pronto.'],
    ['shield-check', 'RULES.md', 'As regras curtas que viajam dentro do pacote, para qualquer projeto que consuma o sistema.'],
    ['file-text', 'brand.json', 'A marca em dados: paleta com CMYK, tokens por tema, ativos por papel e regras verificáveis.'],
    ['sliders-horizontal', 'dist/tokens.json', 'Cada token resolvido nos três temas, com tipo e descrição — também como módulo tipado.'],
    ['book-open', 'components/*/*.prompt.md', 'Quando usar cada componente, com exemplo em pt-BR e a marcação HTML.'],
    ['clipboard-check', 'npm run check', 'A verificação: contraste, débito, arquivos gerados — o agente sabe se acertou.'],
  ];
  mount('mount-agent-files', h(F, null, AGENT_FILES.map(([ic, file, text]) =>
    h('div', { key: file, className: 'sc-agent-file' }, h('i', { 'aria-hidden': 'true' }, icon(ic, 22)),
      h('div', null, h('code', null, file), h('p', null, text))))));
  document.getElementById('mount-agent-rules').textContent = JSON.stringify({ colour: D.rules.colour, logo: D.rules.logo, accessibility: D.rules.accessibility }, null, 2);

  const Quality = () => {
    const q = D.quality;
    const pct = Math.round((q.componentsOnCssContract / q.componentsTotal) * 100);
    const live = D.contrastPairs.filter((p) => ratio(resolveColor(p.fg), resolveColor(p.bg)) >= p.floor).length;
    const metrics = [
      [fmt(q.axeViolations), null, 'violações WCAG 2.2 AA', `em ${q.pagesTested} páginas abertas no Chromium, a 1280 e a 360 px, em cada mudança.`],
      [`${live}`, `/${D.contrastPairs.length}`, 'pares de contraste passando', 'medidos agora, neste tema. O build é recusado se um deles cair.'],
      [`${q.componentsOnCssContract}`, `/${q.componentsTotal}`, 'componentes no contrato CSS', null, pct],
      [fmt(q.componentGlyphIcons ?? 0), null, 'ícones improvisados', 'nenhum caractere fazendo papel de ícone em componente.'],
      [fmt(q.componentPxLiterals ?? 0), null, 'medidas fixas em componentes', 'só pode diminuir: a linha de base recusa qualquer aumento.'],
      [fmt(q.pagesOverflowingOnPhone), null, 'páginas ainda rolam de lado a 360 px', 'templates e espécimes à espera da etapa responsiva — à vista, não escondidas.'],
    ];
    return h(F, null, metrics.map(([big, small, label, text, progress]) =>
      h('div', { key: label, className: 'sc-metric' },
        h('div', { className: 'big' }, big, small ? h('small', null, small) : null),
        h('b', null, label),
        progress !== undefined ? h(DS.ProgressBar, { value: progress, ariaLabel: `${progress}% dos componentes no contrato CSS` }) : null,
        text ? h('p', null, text) : h('p', null, `${progress}% — os demais seguem na próxima etapa do roteiro.`))));
  };

  /* ── Everything measured from the DOM, re-measured on theme change ───────── */

  function renderMeasured() {
    mount('mount-contrast', h(ContrastTable));
    mount('mount-quality', h(Quality));
  }
  renderMeasured();
})();
