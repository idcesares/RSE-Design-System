/* ─────────────────────────────────────────────────────────────────────────────
   showcase.js — renders the showcase document.

   Everything visible here is read from the system itself:
     · components come from dist/rse.js (the same file the templates execute)
     · palette, scales and counts come from showcase-data.js (generated)
     · semantic colours and contrast ratios are measured from the live DOM, so
       they re-derive whenever the theme changes instead of being transcribed.

   React.createElement form, no JSX — same reason the bundle uses it: this file
   runs in the browser with no build step.
   ───────────────────────────────────────────────────────────────────────────── */
(() => {
  'use strict';

  const DS = window.RSE;
  const D = window.SHOWCASE_DATA;
  const h = React.createElement;
  const F = React.Fragment;

  if (!DS || !D) {
    document.body.insertAdjacentHTML(
      'afterbegin',
      '<p style="padding:24px;font-family:sans-serif">Não foi possível carregar o design system. ' +
        'Abra esta página a partir da pasta <code>showcase/</code> do repositório, com a pasta ' +
        '<code>assets/</code> e o arquivo <code>dist/rse.js</code> ao lado.</p>'
    );
    return;
  }
  if (DS.__errors && DS.__errors.length) console.error('design system load errors', DS.__errors);

  /* ── Small helpers ───────────────────────────────────────────────────────── */

  const roots = new Map();
  const mount = (id, element) => {
    const node = document.getElementById(id);
    if (!node) return;
    let root = roots.get(id);
    if (!root) { root = ReactDOM.createRoot(node); roots.set(id, root); }
    root.render(element);
  };

  /** Resolve a token to a concrete rgb() by letting the browser compute it. */
  const resolveColor = (token, host) => {
    const probe = document.createElement('span');
    probe.style.cssText = 'position:absolute;opacity:0;pointer-events:none';
    probe.style.color = `var(${token})`;
    (host || document.body).appendChild(probe);
    const value = getComputedStyle(probe).color;
    probe.remove();
    return value;
  };

  const rgbToArray = (value) => {
    const m = value.match(/-?[\d.]+/g);
    return m ? m.slice(0, 3).map(Number) : [0, 0, 0];
  };

  const toHex = (value) =>
    '#' + rgbToArray(value).map((n) => Math.round(n).toString(16).padStart(2, '0')).join('');

  /** WCAG 2.1 relative luminance and contrast ratio. */
  const luminance = (rgb) => {
    const [r, g, b] = rgb.map((c) => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const contrastRatio = (a, b) => {
    const la = luminance(rgbToArray(a));
    const lb = luminance(rgbToArray(b));
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
  };

  const fmt = (n) => n.toLocaleString('pt-BR');

  /* ── Copy feedback, using the system's own Toast ─────────────────────────── */

  const toastHost = document.getElementById('sc-toast-host');
  const toastRoot = ReactDOM.createRoot(toastHost);
  let toastTimer = null;

  const showToast = (title, message) => {
    const close = () => toastRoot.render(null);
    toastRoot.render(h(DS.Toast, { tone: 'success', title, message, onClose: close }));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(close, 2600);
  };

  const copy = (text, label) => {
    const done = () => showToast('Copiado', `${label} está na área de transferência.`);
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, () => fallbackCopy(text, done));
    } else {
      fallbackCopy(text, done);
    }
  };
  const fallbackCopy = (text, done) => {
    // file:// pages are not a secure context, so the async clipboard API is unavailable.
    const field = document.createElement('textarea');
    field.value = text;
    field.setAttribute('readonly', '');
    field.style.cssText = 'position:fixed;top:-1000px';
    document.body.appendChild(field);
    field.select();
    try { document.execCommand('copy'); done(); } catch (e) { /* nothing else to try */ }
    field.remove();
  };

  /* ── Theme switch ────────────────────────────────────────────────────────── */

  const themeButtons = Array.from(document.querySelectorAll('[data-rse-theme-set]'));
  const setTheme = (name) => {
    if (name === 'light') document.documentElement.removeAttribute('data-rse-theme');
    else document.documentElement.setAttribute('data-rse-theme', name);
    themeButtons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.themeSet === name)));
    // Anything measured from the DOM has to be measured again.
    requestAnimationFrame(renderMeasured);
  };
  themeButtons.forEach((b) => b.addEventListener('click', () => setTheme(b.dataset.themeSet)));

  /* ── Section index + scroll spy ──────────────────────────────────────────── */

  const sections = Array.from(document.querySelectorAll('.sc-section[data-index-label]'));

  const buildIndex = (listId) => {
    const list = document.getElementById(listId);
    if (!list) return;
    list.innerHTML = '';
    for (const section of sections) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#${section.id}`;
      a.textContent = section.dataset.indexLabel;
      a.dataset.spy = section.id;
      li.appendChild(a);
      list.appendChild(li);
    }
  };
  buildIndex('sc-index-list');
  buildIndex('sc-index-mobile-list');

  const spyLinks = () => Array.from(document.querySelectorAll('[data-spy]'));
  const spy = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        for (const link of spyLinks()) {
          const active = link.dataset.spy === entry.target.id;
          if (active) link.setAttribute('aria-current', 'true');
          else link.removeAttribute('aria-current');
        }
      }
    },
    { rootMargin: '-20% 0px -70% 0px' }
  );
  sections.forEach((s) => spy.observe(s));

  /* ── Header chrome ───────────────────────────────────────────────────────── */

  document.getElementById('sc-version').textContent = `versão ${D.version}`;
  document.getElementById('sc-slogan').textContent = D.slogan;
  document.getElementById('sc-footer-slogan').textContent = D.slogan + '.';
  document.getElementById('sc-icons-hint').textContent =
    `${D.counts.icons} ícones de linha em uma grade de 24 px e traço de 2 px, herdando a cor do ` +
    'texto. Todo glifo do sistema vem daqui — nunca um emoji, nunca um desenho avulso.';

  /* ── Abertura: motif + counted figures ───────────────────────────────────── */

  mount('mount-hero-motif', h(DS.BrandMotif, { variant: 'interlock', size: 260 }));

  const FIGURES = [
    { n: D.counts.components, l: 'componentes' },
    { n: D.counts.tokens, l: 'tokens' },
    { n: D.counts.palette, l: 'cores oficiais' },
    { n: D.counts.themes, l: 'temas' },
    { n: D.counts.templates, l: 'peças prontas' },
    { n: D.counts.cards, l: 'espécimes' },
  ];
  mount(
    'mount-numbers',
    h(F, null, FIGURES.map((f, i) =>
      h('div', { key: i },
        h('div', { className: 'n' }, fmt(f.n)),
        h('div', { className: 'l' }, f.l)
      )
    ))
  );

  /* ── Por que um sistema: the same page, with and without ─────────────────── */

  const PLAIN_PAGE = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"></head><body>
<h3>Rede Sesc de Educação</h3>
<h1>Aprender para a vida acontecer</h1>
<p>Educação que acolhe, forma e transforma — em unidades por todo o Brasil.</p>
<p><button>Quero me inscrever</button> <button>Conheça os programas</button></p>
<hr>
<h2>Programas</h2>
<p><b>Educação Infantil</b><br>Cuidar e educar juntos, com o brincar como método.</p>
<p><b>Ensino Fundamental</b><br>Base sólida em leitura, matemática e convivência.</p>
<p><b>Ensino Médio</b><br>Formação integral com projeto de vida no centro.</p>
<hr>
<p><label>Nome completo <input></label></p>
<p><label>Unidade <select><option>Selecione</option></select></label></p>
<p><button>Enviar inscrição</button></p>
</body></html>`;

  function ComparedWithSystem() {
    const [tab, setTab] = React.useState('infantil');
    const PROGRAMS = {
      infantil: { title: 'Educação Infantil', desc: 'Cuidar e educar juntos, com o brincar como método.', color: 'green' },
      fundamental: { title: 'Ensino Fundamental', desc: 'Base sólida em leitura, matemática e convivência.', color: 'blue' },
      medio: { title: 'Ensino Médio', desc: 'Formação integral com projeto de vida no centro.', color: 'orange' },
    };
    const current = PROGRAMS[tab];
    return h('div', { className: 'sc-compare-body', style: { background: 'var(--rse-color-surface-page)', display: 'flex', flexDirection: 'column', gap: 'var(--rse-space-5)' } },
      h('p', { className: 'sc-eyebrow', style: { margin: 0 } }, 'Rede Sesc de Educação'),
      h('h1', { style: { fontSize: 'var(--rse-font-size-h1)', margin: 0 } }, 'Aprender para a vida acontecer'),
      h('p', { style: { fontSize: 'var(--rse-font-size-body-md)', color: 'var(--rse-color-text-muted)', margin: 0, lineHeight: 'var(--rse-line-height-body)' } },
        'Educação que acolhe, forma e transforma — em unidades por todo o Brasil.'),
      h('div', { style: { display: 'flex', gap: 'var(--rse-space-3)', flexWrap: 'wrap' } },
        h(DS.Button, { variant: 'primary', icon: h(DS.Icon, { name: 'graduation-cap', size: 20 }) }, 'Quero me inscrever'),
        h(DS.Button, { variant: 'ghost' }, 'Conheça os programas')
      ),
      h(DS.Divider, null),
      h(DS.Tabs, {
        tabs: [
          { id: 'infantil', label: 'Infantil' },
          { id: 'fundamental', label: 'Fundamental' },
          { id: 'medio', label: 'Médio' },
        ],
        activeId: tab,
        onChange: setTab,
        label: 'Níveis de ensino',
      }),
      h(DS.Card, {
        tag: h(DS.Tag, { color: current.color }, current.title),
        eyebrow: 'Programa',
        title: current.title,
        description: current.desc,
      }),
      h(DS.Input, { label: 'Nome completo', placeholder: 'Como está no documento' }),
      h(DS.Select, {
        label: 'Unidade',
        placeholder: 'Selecione uma unidade',
        options: [
          { label: 'Unidade A', value: 'a' },
          { label: 'Unidade B', value: 'b' },
        ],
      }),
      h(DS.Button, { variant: 'primary' }, 'Enviar inscrição')
    );
  }

  mount(
    'mount-compare',
    h(F, null,
      h('div', { className: 'sc-compare-col' },
        h('p', { className: 'sc-compare-label' },
          h(DS.Icon, { name: 'circle-x', size: 16 }), 'Sem sistema — o padrão do navegador'),
        h('div', { className: 'sc-compare-frame' },
          h('iframe', { srcDoc: PLAIN_PAGE, title: 'A mesma página sem nenhum sistema de design', loading: 'lazy' })
        ),
        h('p', { style: { fontSize: 'var(--rse-font-size-caption)', color: 'var(--rse-color-text-muted)', margin: 0, lineHeight: 'var(--rse-line-height-body)' } },
          'Mesmo conteúdo, mesma estrutura. Sem marca, sem hierarquia, sem alvo de toque, sem foco visível.')
      ),
      h('div', { className: 'sc-compare-col' },
        h('p', { className: 'sc-compare-label is-good' },
          h(DS.Icon, { name: 'circle-check', size: 16 }), 'Com o sistema — componentes reais'),
        h('div', { className: 'sc-compare-frame' }, h(ComparedWithSystem)),
        h('p', { style: { fontSize: 'var(--rse-font-size-caption)', color: 'var(--rse-color-text-muted)', margin: 0, lineHeight: 'var(--rse-line-height-body)' } },
          'Clique nas abas e nos campos: este painel está vivo. E acompanha o tema escolhido no topo.')
      )
    )
  );

  /* ── A marca ─────────────────────────────────────────────────────────────── */

  const NEVER_PT = {
    rotate: 'girar',
    stretch: 'esticar',
    distort: 'distorcer',
    'add effects': 'aplicar efeitos',
    redraw: 'redesenhar',
    'gradient fill': 'preencher com degradê',
    'outlined lettering': 'contornar o letreiramento',
    'lock up with the Sesc signature': 'travar junto à assinatura do Sesc',
  };
  const neverList = document.getElementById('mount-logo-never');
  for (const rule of D.rules.logo.never) {
    const li = document.createElement('li');
    li.textContent = NEVER_PT[rule] || rule;
    neverList.appendChild(li);
  }

  const MOTIF_PT = {
    cube: 'O cubo sólido — a marca de base',
    interlock: 'Dois cubos atravessando um ao outro',
    bar: 'Cubo atravessado por uma barra impossível',
    frame: 'Moldura aberta com dois vazios',
    chain: 'Corrente em ziguezague — a construção mais larga',
    hollow: 'Cubo aberto em torno de um centro vazio',
  };
  const HUE_PT = { green: 'verde', blue: 'azul', pink: 'rosa', orange: 'laranja', purple: 'roxo', yellow: 'amarelo' };

  const MOTIF_HUES = [
    { id: null, label: 'Original' },
    { id: 'purple', label: 'Roxo' },
    { id: 'green', label: 'Verde' },
    { id: 'blue', label: 'Azul' },
    { id: 'pink', label: 'Rosa' },
    { id: 'orange', label: 'Laranja' },
    { id: 'yellow', label: 'Amarelo' },
  ];

  const MotifGallery = () => {
    const [hue, setHue] = React.useState(null);
    return h(F, null,
      h('div', { className: 'sc-hue-switch', role: 'group', 'aria-label': 'Cor das construções' },
        MOTIF_HUES.map((option) =>
          h('button', {
            key: option.id || 'original',
            type: 'button',
            'aria-pressed': String(hue === option.id),
            onClick: () => setHue(option.id),
          },
            option.id
              ? h('span', { className: 'dot', style: { background: `var(--color-${option.id})` } })
              : null,
            option.label
          )
        )
      ),
      h('div', { className: 'sc-grid sc-grid-3', style: { marginTop: 'var(--rse-space-5)' } },
        D.assets.motifs.map((m) =>
          h('div', { className: 'sc-motif-cell', key: m.id },
            h(DS.BrandMotif, { variant: m.variant, size: 132, hue: hue || undefined }),
            h('span', { className: 'cap' },
              h('b', null, m.variant),
              MOTIF_PT[m.variant] || '',
              h('br'),
              hue && hue !== m.hue
                ? `família ${HUE_PT[m.hue] || m.hue}, recolorida`
                : `família ${HUE_PT[m.hue] || m.hue}`
            )
          )
        )
      )
    );
  };

  mount('mount-motifs', h(MotifGallery));

  mount(
    'mount-patterns',
    h(F, null, D.assets.patterns.map((p) =>
      h('div', { key: p.id },
        h('div', {
          className: 'sc-pattern',
          role: 'img',
          'aria-label': `Padrão de cubos na família ${HUE_PT[p.hue] || p.hue}`,
          style: { backgroundImage: `url(../${p.path})` },
        }),
        h('p', { style: { fontSize: 'var(--rse-font-size-caption)', color: 'var(--rse-color-text-muted)', margin: 'var(--rse-space-2) 0 0' } },
          HUE_PT[p.hue] || p.hue)
      )
    ))
  );

  /* ── Cores ───────────────────────────────────────────────────────────────── */

  const FAMILY_PT = {
    cream: 'Creme — o fundo da página',
    indigo: 'Índigo — o acento profundo',
    purple: 'Roxo — a cor primária da marca',
    pink: 'Rosa',
    orange: 'Laranja',
    yellow: 'Amarelo',
    green: 'Verde',
    blue: 'Azul',
    black: 'Preto da marca',
  };
  const FAMILY_ORDER = ['purple', 'indigo', 'cream', 'green', 'blue', 'pink', 'orange', 'yellow', 'black'];

  const families = [];
  for (const c of D.palette) {
    let family = families.find((f) => f.name === c.family);
    if (!family) { family = { name: c.family, colors: [] }; families.push(family); }
    family.colors.push(c);
  }
  families.sort((a, b) => {
    const ia = FAMILY_ORDER.indexOf(a.name);
    const ib = FAMILY_ORDER.indexOf(b.name);
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
  });

  const Swatch = ({ color }) =>
    h('button', {
      type: 'button',
      className: 'sc-swatch',
      onClick: () => copy(color.hex, color.hex),
      title: `Copiar ${color.hex}`,
    },
      h('span', { className: 'chip', style: { background: color.hex } }),
      h('span', { className: 'meta' },
        h('span', { className: 'tok' }, color.token),
        h('span', { className: 'val' }, color.hex.toUpperCase()),
        color.cmyk
          ? h('span', { className: 'cmyk' },
              `CMYK ${color.cmyk.c} ${color.cmyk.m} ${color.cmyk.y} ${color.cmyk.k}`)
          : null
      )
    );

  mount(
    'mount-palette',
    h(F, null, families.map((family) =>
      h('div', { className: 'sc-family', key: family.name },
        h('p', { className: 'sc-family-name' }, FAMILY_PT[family.name] || family.name),
        h('div', { className: 'sc-swatches' },
          family.colors.map((c) => h(Swatch, { color: c, key: c.token }))
        )
      )
    ))
  );

  /* ── Semantic tokens + contrast: both measured, both re-run on theme change ─ */

  const SEMANTIC_ROLES = [
    ['--rse-color-surface-page', 'Fundo da página'],
    ['--rse-color-surface-card', 'Superfície de cartão'],
    ['--rse-color-surface-sunken', 'Superfície rebaixada'],
    ['--rse-color-text-heading', 'Texto de título'],
    ['--rse-color-text-body', 'Texto corrido'],
    ['--rse-color-text-muted', 'Texto secundário'],
    ['--rse-color-primary', 'Ação primária'],
    ['--rse-color-border-subtle', 'Borda sutil'],
    ['--rse-color-border-default', 'Borda padrão'],
    ['--rse-color-focus-ring', 'Anel de foco'],
  ];

  const SemanticTable = () =>
    h(F, null,
      h('thead', null,
        h('tr', null,
          h('th', { style: { width: '52px' } }, ''),
          h('th', null, 'Papel'),
          h('th', null, 'Token'),
          h('th', null, 'Valor agora')
        )
      ),
      h('tbody', null, SEMANTIC_ROLES.map(([token, label]) => {
        const value = resolveColor(token);
        return h('tr', { key: token },
          h('td', null, h('span', { className: 'sc-dot', style: { background: value } })),
          h('td', null, label),
          h('td', { className: 'mono' }, token),
          h('td', { className: 'mono' }, toHex(value).toUpperCase())
        );
      }))
    );

  /* Every pair the system puts on screen, with its WCAG floor. Generated from
     scripts/contrast-pairs.mjs — the same list `npm run audit` gates on, so the table
     cannot quietly test only the pairs that pass. */
  const CONTRAST_PAIRS = D.contrastPairs;

  const ContrastTable = () => {
    const rows = CONTRAST_PAIRS.map(({ fg, bg, label, floor }) => {
      const front = resolveColor(fg);
      const back = resolveColor(bg);
      const ratio = contrastRatio(front, back);
      return { fg, bg, label, floor, front, back, ratio, pass: ratio >= floor };
    });
    const failing = rows.filter((r) => !r.pass);

    return h(F, null,
      h('caption', {
        style: {
          captionSide: 'top',
          textAlign: 'left',
          padding: 'var(--rse-space-4) var(--rse-space-4) 0',
          fontSize: 'var(--rse-font-size-body-sm)',
          color: failing.length ? 'var(--rse-color-danger-text)' : 'var(--rse-color-success-text)',
          fontWeight: 'var(--rse-font-weight-semibold)',
        },
      },
        failing.length
          ? `${rows.length - failing.length} de ${rows.length} combinações passam neste tema. ` +
            (failing.length > 1
              ? `${failing.length} estão abaixo do piso`
              : 'Uma está abaixo do piso') +
            ' — veja a nota abaixo da tabela.'
          : `As ${rows.length} combinações passam neste tema.`
      ),
      h('thead', null,
        h('tr', null,
          h('th', null, 'Combinação'),
          h('th', null, 'Amostra'),
          h('th', null, 'Razão'),
          h('th', null, 'Mínimo'),
          h('th', null, 'Resultado')
        )
      ),
      h('tbody', null, rows.map((r) =>
        h('tr', { key: r.label },
          h('td', null, r.label),
          h('td', null,
            r.floor < 4.5
              // A 3:1 pair is a boundary (a ring, a border), not text: show it as one.
              ? h('span', {
                  className: 'sc-contrast-sample is-graphic', 'aria-hidden': 'true',
                  style: { background: r.back, boxShadow: `inset 0 0 0 3px ${r.front}` },
                })
              : h('span', {
                  className: 'sc-contrast-sample',
                  style: { color: r.front, background: r.back },
                }, 'Aprender')
          ),
          h('td', null, h('span', { className: 'sc-ratio' }, `${r.ratio.toFixed(2)}:1`)),
          h('td', { className: 'mono' }, `${r.floor}:1`),
          h('td', null,
            h('span', { className: `sc-verdict ${r.pass ? 'pass' : 'fail'}` },
              h(DS.Icon, { name: r.pass ? 'circle-check' : 'triangle-alert', size: 14 }),
              r.pass ? 'Passa' : 'Reprova'
            )
          )
        )
      ))
    );
  };

  /** Re-render everything that was measured from the DOM rather than declared. */
  const renderMeasured = () => {
    mount('mount-semantic', h(SemanticTable));
    mount('mount-contrast', h(ContrastTable));
  };

  /* ── Tipografia ──────────────────────────────────────────────────────────── */

  const TYPE_ROWS = [
    ['--rse-font-size-display-1', 'Display 1', 'Aprender para a vida acontecer', 'extrabold'],
    ['--rse-font-size-display-2', 'Display 2', 'Aprender para a vida acontecer', 'extrabold'],
    ['--rse-font-size-h1', 'Título 1', 'Educação que acolhe, forma e transforma', 'extrabold'],
    ['--rse-font-size-h2', 'Título 2', 'Uma trajetória completa', 'extrabold'],
    ['--rse-font-size-h3', 'Título 3', 'Ensino fundamental', 'extrabold'],
    ['--rse-font-size-h4', 'Título 4', 'Matrículas abertas', 'bold'],
    ['--rse-font-size-body-lg', 'Corpo grande', 'A Rede reúne escolas e programas educacionais do Sesc em todo o país.', 'regular'],
    ['--rse-font-size-body-md', 'Corpo', 'A Rede reúne escolas e programas educacionais do Sesc em todo o país.', 'regular'],
    ['--rse-font-size-body-sm', 'Corpo pequeno', 'A Rede reúne escolas e programas educacionais do Sesc em todo o país.', 'regular'],
    ['--rse-font-size-caption', 'Legenda', 'Fonte a verificar com o Sesc', 'regular'],
    ['--rse-font-size-eyebrow', 'Eyebrow', 'Rede Sesc de Educação', 'eyebrow'],
  ];

  const TypeSpecimens = () =>
    h(F, null, TYPE_ROWS.map(([token, label, sample, style]) => {
      const isEyebrow = style === 'eyebrow';
      return h('div', { className: 'sc-type-row', key: token },
        h('div', { className: 'sc-type-meta' },
          h('b', null, label),
          token
        ),
        h('div', {
          className: 'sc-type-sample',
          style: {
            fontSize: `var(${token})`,
            fontWeight: isEyebrow
              ? 'var(--rse-font-weight-bold)'
              : `var(--font-weight-${style})`,
            letterSpacing: isEyebrow
              ? 'var(--rse-letter-spacing-eyebrow)'
              : style === 'extrabold' ? 'var(--rse-letter-spacing-tight)' : 'normal',
            textTransform: isEyebrow ? 'uppercase' : 'none',
            lineHeight: style === 'regular' ? 'var(--rse-line-height-body)' : 'var(--rse-line-height-heading)',
            color: isEyebrow ? 'var(--rse-color-primary)' : 'var(--rse-color-text-heading)',
          },
        }, sample)
      );
    }));

  mount('mount-type', h(TypeSpecimens));

  const WEIGHTS = [
    ['regular', '400', 'Regular — corpo de texto'],
    ['medium', '500', 'Medium — rótulos e apoios'],
    ['semibold', '600', 'Semibold — botões e links'],
    ['bold', '700', 'Bold — eyebrows e destaques'],
    ['extrabold', '800', 'Extrabold — todos os títulos'],
    ['black', '900', 'Black — uso pontual, peças grandes'],
  ];

  mount(
    'mount-weights',
    h(F, null, WEIGHTS.map(([name, value, label]) =>
      h('div', { className: 'sc-type-row', key: name },
        h('div', { className: 'sc-type-meta' },
          h('b', null, value),
          `--font-weight-${name}`
        ),
        h('div', {
          className: 'sc-type-sample',
          style: { fontSize: 'var(--rse-font-size-h4)', fontWeight: `var(--font-weight-${name})`, color: 'var(--rse-color-text-heading)' },
        }, label)
      )
    ))
  );

  /* ── Espaço e forma ──────────────────────────────────────────────────────── */

  const SPACES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  mount(
    'mount-space',
    h(F, null, SPACES.map((n) =>
      h('div', { className: 'sc-space-row', key: n },
        h('span', { className: 'sc-space-name' }, `--space-${n}`),
        h('span', { className: 'sc-space-bar', style: { width: `var(--space-${n})` } }),
        h('span', { className: 'sc-space-name', style: { width: 'auto' } }, D.scales.spacing[n])
      )
    ))
  );

  const RADII = ['sm', 'md', 'lg', 'xl', 'pill'];
  mount(
    'mount-radius',
    h(F, null, RADII.map((r) =>
      h('div', { key: r },
        h('div', { className: 'sc-specimen', style: { borderRadius: `var(--radius-${r})` } }, D.scales.radius[r]),
        h('p', { style: { fontSize: 'var(--rse-font-size-caption)', color: 'var(--rse-color-text-muted)', margin: 'var(--rse-space-2) 0 0' } },
          `--radius-${r}`)
      )
    ))
  );

  const SHADOWS = ['sm', 'md', 'lg'];
  mount(
    'mount-shadow',
    h(F, null, SHADOWS.map((s) =>
      h('div', { key: s, style: { padding: 'var(--rse-space-3)' } },
        h('div', { className: 'sc-shadow-box', style: { boxShadow: `var(--shadow-${s})` } }, `shadow-${s}`),
        h('p', { style: { fontSize: 'var(--rse-font-size-caption)', color: 'var(--rse-color-text-muted)', margin: 'var(--rse-space-3) 0 0' } },
          `--shadow-${s}`)
      )
    ))
  );

  mount(
    'mount-icons',
    h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(64px,1fr))', gap: 'var(--rse-space-3)' } },
      (D.assets.icons.names || []).map((name) =>
        h('button', {
          key: name,
          type: 'button',
          title: `Copiar "${name}"`,
          onClick: () => copy(name, `O nome "${name}"`),
          style: {
            appearance: 'none', border: '1px solid var(--rse-color-border-subtle)', background: 'var(--rse-color-surface-card)',
            borderRadius: 'var(--rse-radius-sm)', color: 'var(--rse-color-text-body)', cursor: 'pointer',
            aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
          },
        }, h(DS.Icon, { name, size: 22, title: name }))
      )
    )
  );

  /* ── Componentes: pt-BR gloss + a live demo for each ─────────────────────── */

  /* Written for this page, for a reader who does not build screens. The English
     one-liner from docs/components.md stays available under "detalhes técnicos". */
  const GLOSS = {
    Accordion: 'Lista que abre e fecha — perguntas frequentes e detalhes longos de um programa.',
    Alert: 'Aviso fixo dentro da página: prazo de matrícula, erro em formulário, comunicado.',
    Avatar: 'Foto ou iniciais de uma pessoa — depoimentos, equipe, área do estudante.',
    Badge: 'Selinho de estado com um ponto colorido: vagas abertas, encerrado, novo.',
    BrandMotif: 'O cubo impossível oficial, em suas seis construções. Obra da marca, não enfeite.',
    Breadcrumb: 'Trilha de onde a pessoa está em páginas profundas de unidade ou programa.',
    Button: 'A ação principal. Três variações e três tamanhos, sempre em formato de pílula.',
    Card: 'O cartão de programa ou unidade — imagem, categoria, título e descrição.',
    Checkbox: 'Caixa de seleção para múltipla escolha e aceite de termos.',
    DataTable: 'Tabela de turmas, horários, unidades e valores. Rola no celular sem quebrar.',
    DateField: 'Campo de data com prazo em destaque — nascimento, janela de inscrição.',
    Divider: 'Linha fina que separa blocos, com rótulo opcional no meio.',
    FileUpload: 'Envio de documentos por arrastar ou clicar, com a lista do que já foi anexado.',
    FilterChips: 'Pílulas de filtro acima de uma listagem: nível, turno, região.',
    Footer: 'O rodapé institucional, em fundo escuro, com assinatura e colunas de links.',
    Icon: 'A fonte única de ícones. Um glifo fora daqui não entra no sistema.',
    IconButton: 'Botão redondo só com ícone — fechar, compartilhar, avançar.',
    Input: 'Campo de texto com rótulo, ajuda e estado de erro.',
    Menu: 'Menu suspenso para navegação regional e ações de linha. Fecha com Esc.',
    Modal: 'Diálogo centralizado sobre a página — confirmações e etapas de inscrição.',
    Navbar: 'O cabeçalho fixo do site, translúcido, com a assinatura e a ação principal.',
    Pagination: 'Controle de páginas para listagens longas de unidades e programas.',
    PlatformEntry: 'A ponte para a Plataforma Sesc Sab.IA, com as duas marcas juntas.',
    ProgressBar: 'Barra de progresso com percentual — envio de documentos, etapas concluídas.',
    Radio: 'Escolha única dentro de um grupo: turno, categoria, forma de contato.',
    Select: 'Lista suspensa para escolher unidade, programa ou estado.',
    Skeleton: 'O esqueleto que ocupa o lugar do conteúdo enquanto ele carrega.',
    Spinner: 'Indicador de carregamento para ações sem duração previsível.',
    Stat: 'Um número de impacto com rótulo — o pilar do resultado, tornado visível.',
    Stepper: 'As etapas de um fluxo, mostrando onde a pessoa está e o que já concluiu.',
    Switch: 'Interruptor de liga e desliga para preferências.',
    Tabs: 'Abas para alternar seções. Andam com as setas do teclado.',
    Tag: 'Etiqueta de categoria em uma das seis cores de acento.',
    Textarea: 'Campo de texto longo, com contador de caracteres opcional.',
    Toast: 'Aviso passageiro que aparece após uma ação — o que confirma a cópia nesta página.',
    Tooltip: 'Rótulo que aparece ao passar o cursor sobre um ícone ou texto cortado.',
  };

  const icon = (name, size) => h(DS.Icon, { name, size: size || 20 });

  const DEMOS = {
    Accordion: { block: true, render: () =>
      h(DS.Accordion, { items: [
        { title: 'Quem pode se inscrever?', content: 'Trabalhadores do comércio de bens, serviços e turismo, seus dependentes e a comunidade em geral, conforme as vagas de cada unidade.' },
        { title: 'Quais documentos são necessários?', content: 'Documento de identidade, CPF, comprovante de residência e, quando houver, a Credencial Sesc.' },
        { title: 'Como funciona a lista de espera?', content: 'Quando as vagas se esgotam, a inscrição segue registrada e a unidade entra em contato assim que uma vaga abre.' },
      ] }) },

    Alert: { block: true, render: () => {
      const Demo = () => {
        const [shown, setShown] = React.useState(true);
        return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--rse-space-4)' } },
          shown
            ? h(DS.Alert, { tone: 'info', title: 'Matrículas abertas', message: 'As inscrições seguem até o fim do mês nas unidades participantes.', onDismiss: () => setShown(false) })
            : h(DS.Button, { variant: 'ghost', size: 'sm', onClick: () => setShown(true) }, 'Mostrar o aviso de novo'),
          h(DS.Alert, { tone: 'warning', title: 'Documento pendente', message: 'Falta anexar o comprovante de residência para concluir a inscrição.' }),
          h(DS.Alert, { tone: 'danger', message: 'Não foi possível enviar o formulário. Verifique os campos destacados.' }),
          h(DS.Alert, { tone: 'success', title: 'Inscrição registrada', message: 'A unidade entrará em contato pelo telefone informado.' })
        );
      };
      return h(Demo);
    } },

    Avatar: { render: () =>
      h(F, null,
        h(DS.Avatar, { initials: 'MC', size: 'sm' }),
        h(DS.Avatar, { initials: 'JS', size: 'md', status: 'online' }),
        h(DS.Avatar, { initials: 'AR', size: 'lg', status: 'away' })
      ) },

    Badge: { render: () =>
      h(F, null,
        h(DS.Badge, { tone: 'success' }, 'Vagas abertas'),
        h(DS.Badge, { tone: 'warning' }, 'Últimas vagas'),
        h(DS.Badge, { tone: 'danger' }, 'Encerrado'),
        h(DS.Badge, { tone: 'info' }, 'Novo'),
        h(DS.Badge, { tone: 'primary' }, 'Destaque'),
        h(DS.Badge, { tone: 'neutral' }, 'Rascunho')
      ) },

    BrandMotif: { render: () =>
      h(F, null,
        h(DS.BrandMotif, { variant: 'cube', size: 96 }),
        h(DS.BrandMotif, { variant: 'interlock', size: 96 }),
        h(DS.BrandMotif, { variant: 'frame', size: 96 })
      ) },

    Breadcrumb: { block: true, render: () =>
      h(DS.Breadcrumb, { items: [
        { label: 'Início', href: '#' },
        { label: 'Programas', href: '#' },
        { label: 'Ensino Fundamental' },
      ] }) },

    Button: { render: () =>
      h(F, null,
        h(DS.Button, { variant: 'primary', icon: icon('graduation-cap') }, 'Quero me inscrever'),
        h(DS.Button, { variant: 'secondary' }, 'Saiba mais'),
        h(DS.Button, { variant: 'ghost' }, 'Voltar'),
        h(DS.Button, { variant: 'primary', size: 'sm' }, 'Pequeno'),
        h(DS.Button, { variant: 'primary', disabled: true }, 'Indisponível')
      ) },

    Card: { block: true, render: () =>
      h(DS.Card, {
        tag: h(DS.Tag, { color: 'green' }, 'Educação Infantil'),
        eyebrow: 'Programa',
        title: 'Primeiros passos',
        description: 'Acolhimento e descoberta para crianças de 0 a 5 anos, com o brincar como método.',
        footer: h(DS.Button, { variant: 'ghost', size: 'sm', icon: icon('arrow-right', 18) }, 'Conheça o programa'),
      }) },

    Checkbox: { block: true, render: () => {
      const Demo = () => {
        const [state, setState] = React.useState({ termos: true, contato: false });
        return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--rse-space-3)' } },
          h(DS.Checkbox, { label: 'Li e aceito os termos de matrícula', checked: state.termos, onChange: (e) => setState({ ...state, termos: e.target.checked }) }),
          h(DS.Checkbox, { label: 'Quero receber avisos sobre novas turmas', checked: state.contato, onChange: (e) => setState({ ...state, contato: e.target.checked }) }),
          h(DS.Checkbox, { label: 'Opção indisponível nesta unidade', checked: false, disabled: true })
        );
      };
      return h(Demo);
    } },

    DataTable: { block: true, render: () =>
      h(DS.DataTable, {
        caption: 'Turmas — conteúdo de exemplo',
        columns: [
          { key: 'turma', label: 'Turma' },
          { key: 'turno', label: 'Turno' },
          { key: 'vagas', label: 'Vagas', align: 'right' },
          { key: 'situacao', label: 'Situação' },
        ],
        rows: [
          { turma: '1º ano A', turno: 'Manhã', vagas: '00', situacao: h(DS.Badge, { tone: 'success' }, 'Abertas') },
          { turma: '1º ano B', turno: 'Tarde', vagas: '00', situacao: h(DS.Badge, { tone: 'warning' }, 'Últimas') },
          { turma: '2º ano A', turno: 'Manhã', vagas: '00', situacao: h(DS.Badge, { tone: 'danger' }, 'Encerrada') },
        ],
      }) },

    DateField: { block: true, render: () =>
      h(DS.DateField, { label: 'Data de nascimento', hint: 'Como consta no documento do estudante.', deadline: 'Inscrições até 28/02' }) },

    Divider: { block: true, render: () =>
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--rse-space-5)' } },
        h(DS.Divider, null),
        h(DS.Divider, { label: 'ou' }),
        h('div', { style: { display: 'flex', alignItems: 'center', gap: 'var(--rse-space-4)', height: '40px' } },
          h('span', { style: { fontSize: 'var(--rse-font-size-body-sm)', color: 'var(--rse-color-text-muted)' } }, 'Manhã'),
          h(DS.Divider, { orientation: 'vertical' }),
          h('span', { style: { fontSize: 'var(--rse-font-size-body-sm)', color: 'var(--rse-color-text-muted)' } }, 'Tarde'),
          h(DS.Divider, { orientation: 'vertical' }),
          h('span', { style: { fontSize: 'var(--rse-font-size-body-sm)', color: 'var(--rse-color-text-muted)' } }, 'Integral')
        )
      ) },

    FileUpload: { block: true, render: () => {
      const Demo = () => {
        const [files, setFiles] = React.useState([{ name: 'comprovante-residencia.pdf', size: 184320 }]);
        return h(DS.FileUpload, {
          label: 'Documentos da matrícula',
          hint: 'Identidade, CPF e comprovante de residência.',
          accept: '.pdf,.jpg,.png',
          multiple: true,
          maxSizeLabel: 'até 5 MB por arquivo',
          files,
          onFilesChange: setFiles,
        });
      };
      return h(Demo);
    } },

    FilterChips: { block: true, render: () => {
      const Demo = () => {
        const [value, setValue] = React.useState(['fundamental']);
        return h(DS.FilterChips, {
          label: 'Nível de ensino',
          options: [
            { id: 'infantil', label: 'Educação Infantil' },
            { id: 'fundamental', label: 'Ensino Fundamental' },
            { id: 'medio', label: 'Ensino Médio' },
            { id: 'tecnico', label: 'Educação Profissional' },
          ],
          value,
          onChange: setValue,
          showClear: true,
        });
      };
      return h(Demo);
    } },

    Footer: { block: true, render: () =>
      h('div', { style: { borderRadius: 'var(--rse-radius-md)', overflow: 'hidden' } },
        h(DS.Footer, {
          logoSrc: '../assets/logos/wordmark-white.svg',
          logoAlt: 'Rede Sesc de Educação',
          tagline: 'Aprender para a vida acontecer.',
          columns: [
            { title: 'Institucional', links: [{ label: 'Sobre a Rede', href: '#' }, { label: 'Unidades', href: '#' }] },
            { title: 'Estude', links: [{ label: 'Programas', href: '#' }, { label: 'Matrículas', href: '#' }] },
          ],
          note: 'Conteúdo de exemplo — verifique com o Sesc antes de publicar.',
        })
      ) },

    Icon: { render: () =>
      h(F, null,
        ['graduation-cap', 'school', 'users', 'calendar-check', 'map-pin', 'book-open', 'award', 'heart'].map((n) =>
          h('span', { key: n, style: { color: 'var(--rse-color-primary)' } }, h(DS.Icon, { name: n, size: 28, title: n }))
        )
      ) },

    IconButton: { render: () =>
      h(F, null,
        h(DS.IconButton, { ariaLabel: 'Compartilhar', icon: icon('share-2') }),
        h(DS.IconButton, { ariaLabel: 'Favoritar', icon: icon('heart'), variant: 'primary' }),
        h(DS.IconButton, { ariaLabel: 'Fechar', icon: icon('x'), size: 'sm' }),
        h(DS.IconButton, { ariaLabel: 'Baixar', icon: icon('download'), size: 'lg' })
      ) },

    Input: { block: true, render: () =>
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--rse-space-4)' } },
        h(DS.Input, { label: 'Nome completo do estudante', placeholder: 'Como está no documento' }),
        h(DS.Input, { label: 'E-mail', type: 'email', placeholder: 'nome@exemplo.com', helpText: 'Usaremos apenas para avisos sobre a matrícula.' }),
        h(DS.Input, { label: 'CPF', value: '000', error: 'Informe os 11 dígitos, apenas números.' })
      ) },

    Menu: { block: true, render: () =>
      h(DS.Menu, {
        label: 'Escolha a região',
        items: [
          { label: 'Norte', href: '#', meta: '00 unidades' },
          { label: 'Nordeste', href: '#', meta: '00 unidades' },
          { label: 'Centro-Oeste', href: '#', meta: '00 unidades' },
          { label: 'Sudeste', href: '#', meta: '00 unidades' },
          { label: 'Sul', href: '#', meta: '00 unidades' },
        ],
      }) },

    Modal: { render: () => {
      const Demo = () => {
        const [open, setOpen] = React.useState(false);
        return h(F, null,
          h(DS.Button, { variant: 'primary', onClick: () => setOpen(true) }, 'Abrir o diálogo'),
          h(DS.Modal, {
            open,
            onClose: () => setOpen(false),
            title: 'Confirmar inscrição',
            footer: h(F, null,
              h(DS.Button, { variant: 'ghost', onClick: () => setOpen(false) }, 'Cancelar'),
              h(DS.Button, { variant: 'primary', onClick: () => setOpen(false) }, 'Confirmar')
            ),
          },
            h('p', { style: { margin: 0, fontSize: 'var(--rse-font-size-body-md)', color: 'var(--rse-color-text-body)', lineHeight: 'var(--rse-line-height-body)' } },
              'A inscrição será registrada e a unidade entrará em contato. Navegue com Tab: o foco fica preso dentro do diálogo e volta ao botão quando você fechar com Esc.')
          )
        );
      };
      return h(Demo);
    } },

    Navbar: { block: true, render: () =>
      h('div', { style: { borderRadius: 'var(--rse-radius-md)', overflow: 'hidden', border: '1px solid var(--rse-color-border-subtle)' } },
        h(DS.Navbar, {
          logoSrc: '../assets/logos/wordmark-purple.svg',
          logoAlt: 'Rede Sesc de Educação',
          links: [{ label: 'Programas', href: '#' }, { label: 'Unidades', href: '#' }, { label: 'Matrículas', href: '#' }],
          activeHref: '#',
          ctaLabel: 'Quero me inscrever',
          ctaHref: '#',
        })
      ) },

    Pagination: { block: true, render: () => {
      const Demo = () => {
        const [page, setPage] = React.useState(3);
        return h(DS.Pagination, { page, totalPages: 8, onChange: setPage });
      };
      return h(Demo);
    } },

    PlatformEntry: { block: true, render: () =>
      h(DS.PlatformEntry, {
        href: '#',
        logoSrc: '../assets/logos/sabia-wordmark-cream.svg',
        logoAlt: 'Plataforma Sesc Sab.IA',
        title: 'Aprendizagem que acompanha cada estudante',
        description: 'Avaliação diagnóstica, trilhas personalizadas e acompanhamento contínuo.',
        ctaLabel: 'Acessar a plataforma',
        note: 'O endereço real da plataforma ainda não foi informado pelo Sesc.',
        tone: 'purple',
      }) },

    ProgressBar: { block: true, render: () =>
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--rse-space-5)' } },
        h(DS.ProgressBar, { value: 60, label: 'Documentos enviados' }),
        h(DS.ProgressBar, { value: 100, tone: 'success', label: 'Inscrição concluída' }),
        h(DS.ProgressBar, { value: 25, tone: 'danger', label: 'Prazo restante' })
      ) },

    Radio: { block: true, render: () => {
      const Demo = () => {
        const [turno, setTurno] = React.useState('manha');
        return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--rse-space-3)' } },
          ['manha', 'tarde', 'integral'].map((id) =>
            h(DS.Radio, {
              key: id,
              name: 'turno-demo',
              label: { manha: 'Manhã', tarde: 'Tarde', integral: 'Integral' }[id],
              checked: turno === id,
              onChange: () => setTurno(id),
            })
          )
        );
      };
      return h(Demo);
    } },

    Select: { block: true, render: () =>
      h(DS.Select, {
        label: 'Unidade',
        placeholder: 'Selecione uma unidade',
        options: [
          { label: 'Unidade de exemplo A', value: 'a' },
          { label: 'Unidade de exemplo B', value: 'b' },
          { label: 'Unidade de exemplo C', value: 'c' },
        ],
      }) },

    Skeleton: { block: true, render: () =>
      h('div', { style: { display: 'flex', gap: 'var(--rse-space-5)', alignItems: 'flex-start' } },
        h(DS.Skeleton, { variant: 'circle' }),
        h('div', { style: { flex: 1 } }, h(DS.Skeleton, { variant: 'text', lines: 3 }))
      ) },

    Spinner: { render: () =>
      h(F, null,
        h(DS.Spinner, { size: 20 }),
        h(DS.Spinner, { size: 28 }),
        h('span', { style: { background: 'var(--rse-color-primary)', padding: 'var(--rse-space-3)', borderRadius: 'var(--rse-radius-md)', display: 'inline-flex' } },
          h(DS.Spinner, { size: 24, tone: 'inverse' }))
      ) },

    Stat: { block: true, render: () =>
      h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: 'var(--rse-space-5)' } },
        h(DS.Stat, { value: '000', label: 'Unidades', accent: 'primary' }),
        h(DS.Stat, { value: '00 anos', label: 'De tradição', accent: 'green' }),
        h(DS.Stat, { value: '000 mil', label: 'Estudantes', accent: 'orange' })
      ) },

    Stepper: { block: true, render: () => {
      const Demo = () => {
        const [current, setCurrent] = React.useState(1);
        return h(DS.Stepper, {
          steps: [
            { label: 'Dados', description: 'Estudante e responsável' },
            { label: 'Documentos', description: 'Anexos obrigatórios' },
            { label: 'Confirmação', description: 'Revisão e envio' },
          ],
          current,
          onStepClick: setCurrent,
        });
      };
      return h(Demo);
    } },

    Switch: { block: true, render: () => {
      const Demo = () => {
        const [on, setOn] = React.useState(true);
        return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--rse-space-3)' } },
          h(DS.Switch, { label: 'Receber avisos por e-mail', checked: on, onChange: (e) => setOn(e.target.checked) }),
          h(DS.Switch, { label: 'Indisponível nesta unidade', checked: false, disabled: true })
        );
      };
      return h(Demo);
    } },

    Tabs: { block: true, render: () => {
      const Demo = () => {
        const [active, setActive] = React.useState('infantil');
        const CONTENT = {
          infantil: 'Cuidar e educar juntos, com o brincar como método.',
          fundamental: 'Base sólida em leitura, matemática e convivência.',
          medio: 'Formação integral com projeto de vida no centro.',
        };
        return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--rse-space-4)' } },
          h(DS.Tabs, {
            tabs: [
              { id: 'infantil', label: 'Infantil', panelId: 'demo-painel' },
              { id: 'fundamental', label: 'Fundamental', panelId: 'demo-painel' },
              { id: 'medio', label: 'Médio', panelId: 'demo-painel' },
            ],
            activeId: active,
            onChange: setActive,
            label: 'Níveis de ensino',
          }),
          h('p', {
            id: 'demo-painel',
            role: 'tabpanel',
            'aria-labelledby': `tab-${active}`,
            style: { margin: 0, fontSize: 'var(--rse-font-size-body-sm)', color: 'var(--rse-color-text-body)' },
          }, CONTENT[active])
        );
      };
      return h(Demo);
    } },

    Tag: { render: () =>
      h(F, null,
        ['pink', 'orange', 'green', 'blue', 'purple', 'yellow'].map((color) =>
          h(DS.Tag, { key: color, color }, { pink: 'Artes', orange: 'Esporte', green: 'Ciências', blue: 'Linguagens', purple: 'Tecnologia', yellow: 'Cidadania' }[color])
        )
      ) },

    Textarea: { block: true, render: () =>
      h(DS.Textarea, {
        label: 'Observações sobre o estudante',
        placeholder: 'Necessidades de acessibilidade, cuidados de saúde, o que a unidade precisa saber.',
        hint: 'Opcional. Fica visível apenas para a equipe da unidade.',
        maxLength: 300,
        rows: 4,
      }) },

    Toast: { block: true, render: () => {
      const Demo = () => {
        const [visible, setVisible] = React.useState(true);
        return visible
          ? h(DS.Toast, { tone: 'success', title: 'Inscrição enviada', message: 'A unidade entrará em contato em breve.', onClose: () => setVisible(false) })
          : h(DS.Button, { variant: 'ghost', size: 'sm', onClick: () => setVisible(true) }, 'Mostrar de novo');
      };
      return h(Demo);
    } },

    Tooltip: { render: () =>
      h(F, null,
        h(DS.Tooltip, { label: 'Fonte do dado a verificar com o Sesc' },
          h(DS.IconButton, { ariaLabel: 'Fonte do dado', icon: icon('info'), size: 'sm' })),
        h('span', { style: { fontSize: 'var(--rse-font-size-body-sm)', color: 'var(--rse-color-text-muted)' } },
          'Passe o cursor sobre o ícone.')
      ) },
  };

  /* ── Component gallery ───────────────────────────────────────────────────── */

  const GROUPS = [];
  for (const c of D.components) {
    if (!GROUPS.some((g) => g.id === c.group)) GROUPS.push({ id: c.group, label: c.groupLabel });
  }

  const importSnippet = (name) =>
    `// React\nimport { ${name} } from './index.js';\n\n// Página estática\nconst { ${name} } = window.${D.namespace};`;

  const DemoCard = ({ component }) => {
    const demo = DEMOS[component.name];
    return h('article', { className: 'sc-demo' },
      h('div', { className: 'sc-demo-head' },
        h('h3', { className: 'sc-demo-name' },
          component.name,
          h('span', { className: 'sc-demo-group' }, component.groupLabel)
        ),
        h('p', { className: 'sc-demo-desc' }, GLOSS[component.name] || component.summary)
      ),
      h('div', { className: `sc-demo-stage${demo && demo.block ? ' is-block' : ''}` },
        demo
          ? demo.render()
          : h('p', { style: { fontSize: 'var(--rse-font-size-body-sm)', color: 'var(--rse-color-text-muted)', margin: 0 } },
              'Sem demonstração nesta página — veja o espécime em ' + component.sourcePath.replace(/[^/]+$/, '') + '.')
      ),
      h('details', { className: 'sc-demo-details' },
        h('summary', null, 'Detalhes técnicos'),
        h('div', { className: 'body' },
          h('p', { style: { fontSize: 'var(--rse-font-size-caption)', color: 'var(--rse-color-text-muted)', margin: '0 0 var(--rse-space-4)', lineHeight: 'var(--rse-line-height-body)' } },
            component.summary),
          component.props.length
            ? h('table', { className: 'sc-props' },
                h('thead', null, h('tr', null,
                  h('th', null, 'prop'), h('th', null, 'tipo'), h('th', null, 'nota'))),
                h('tbody', null, component.props.map((p) =>
                  h('tr', { key: p.name },
                    h('td', null, h('code', null, p.name), p.required ? h('span', { className: 'req' }, ' *') : null),
                    h('td', null, h('code', null, p.type)),
                    h('td', null, p.notes || '—')
                  )
                ))
              )
            : null,
          h('pre', { className: 'sc-code', tabIndex: 0, 'aria-label': 'Exemplo de código: ' + component.name }, importSnippet(component.name)),
          h('p', { style: { fontSize: 'var(--rse-font-size-caption)', color: 'var(--rse-color-text-muted)', margin: 'var(--rse-space-3) 0 0' } },
            component.sourcePath)
        )
      )
    );
  };

  const Gallery = () => {
    const [query, setQuery] = React.useState('');
    const [groups, setGroups] = React.useState([]);

    const visible = D.components.filter((c) => {
      const inGroup = groups.length === 0 || groups.includes(c.group);
      const q = query.trim().toLowerCase();
      const inQuery =
        !q ||
        c.name.toLowerCase().includes(q) ||
        (GLOSS[c.name] || '').toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q);
      return inGroup && inQuery;
    });

    // The controls live in their own container in the markup, so render both here
    // and let the caller place them — a portal keeps the sticky bar out of the grid.
    return h(F, null,
      ReactDOM.createPortal(
        h(F, null,
          h('div', { className: 'sc-gallery-search' },
            h(DS.Input, {
              label: 'Buscar componente',
              placeholder: 'botão, tabela, matrícula…',
              value: query,
              onChange: (e) => setQuery(e.target.value),
            })
          ),
          h('div', { style: { flex: '1 1 auto' } },
            h(DS.FilterChips, {
              label: 'Grupo',
              options: GROUPS.map((g) => ({
                id: g.id,
                label: g.label,
                count: D.components.filter((c) => c.group === g.id).length,
              })),
              value: groups,
              onChange: setGroups,
              showClear: true,
            })
          ),
          h('span', { className: 'sc-gallery-count' },
            `${visible.length} de ${D.components.length}`)
        ),
        document.getElementById('mount-gallery-controls')
      ),
      visible.length
        ? h('div', { className: 'sc-demos' },
            visible.map((c) => h(DemoCard, { component: c, key: c.name })))
        : h('div', { className: 'sc-empty' },
            'Nenhum componente corresponde a essa busca. Limpe os filtros para ver os ',
            D.components.length, '.')
    );
  };

  mount('mount-gallery', h(Gallery));

  /* ── Temas lado a lado ───────────────────────────────────────────────────── */

  const THEME_PANELS = [
    { theme: null, label: 'Claro — o padrão' },
    { theme: 'dark', label: 'Escuro' },
    { theme: 'contrast', label: 'Alto contraste' },
  ];

  const ThemePreview = ({ theme, label }) =>
    h('div', { className: 'sc-theme-preview', 'data-rse-theme': theme || undefined },
      h('div', { className: 'head' }, label),
      h('div', { className: 'body' },
        h(DS.Tag, { color: 'green' }, 'Educação Infantil'),
        h('h4', { style: { fontSize: 'var(--rse-font-size-h4)', margin: 0, color: 'var(--rse-color-text-heading)' } },
          'Primeiros passos'),
        h('p', { style: { fontSize: 'var(--rse-font-size-body-sm)', color: 'var(--rse-color-text-muted)', margin: 0, lineHeight: 'var(--rse-line-height-body)' } },
          'Acolhimento e descoberta para crianças de 0 a 5 anos.'),
        h(DS.Button, { variant: 'primary', size: 'sm' }, 'Quero me inscrever'),
        h(DS.Alert, { tone: 'info', message: 'Matrículas abertas nas unidades participantes.' }),
        h(DS.BrandMotif, { variant: 'cube', size: 64 })
      )
    );

  mount(
    'mount-themes',
    h(F, null, THEME_PANELS.map((p) => h(ThemePreview, { ...p, key: p.label })))
  );

  /* ── Demonstração de teclado ─────────────────────────────────────────────── */

  const KeyboardDemo = () => {
    const [tab, setTab] = React.useState('a');
    const [checked, setChecked] = React.useState(false);
    return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--rse-space-4)' } },
      h(DS.Input, { label: 'Comece aqui', placeholder: 'e pressione Tab' }),
      h(DS.Tabs, {
        tabs: [{ id: 'a', label: 'Uma' }, { id: 'b', label: 'Duas' }, { id: 'c', label: 'Três' }],
        activeId: tab,
        onChange: setTab,
        label: 'Demonstração de teclado',
      }),
      h(DS.Checkbox, { label: 'Marque com a barra de espaço', checked, onChange: (e) => setChecked(e.target.checked) }),
      h(DS.Button, { variant: 'ghost', size: 'sm' }, 'Última parada')
    );
  };
  mount('mount-a11y-demo', h(KeyboardDemo));

  /* ── Artefatos: real files, running in scaled frames ─────────────────────── */

  const TEMPLATE_PT = {
    'Landing Page': {
      title: 'Página de campanha',
      desc: 'Barra de aviso, hero, faixa de números, programas em abas, depoimento, busca de unidades e formulário de interesse.',
    },
    'Program detail page': {
      title: 'Página de programa',
      desc: 'Cabeçalho fixo, janela de matrícula, tabela de turmas, filtros, perguntas frequentes e inscrição em etapas.',
    },
    'Institutional deck': {
      title: 'Apresentação institucional',
      desc: 'Nove slides em 1920×1080, prontos para projeção, PDF ou PowerPoint.',
    },
    'Enrollment form (print)': {
      title: 'Ficha de matrícula',
      desc: 'Formulário A4 de duas páginas para impressão: dados, documentos, termos e assinaturas.',
    },
  };

  /* Viewport each artefact is given inside its frame. The deck and the printable
     form size themselves (deck-stage scales its 1920×1080 canvas to whatever
     viewport it gets; doc-page lays out an A4 sheet), so these are the window
     they look through, not their authored size. */
  const ARTEFACT_VIEWPORT = {
    'Landing Page': { width: 1280, height: 1560 },
    'Program detail page': { width: 1280, height: 1560 },
    'Institutional deck': { width: 1280, height: 720 },
    'Enrollment form (print)': { width: 880, height: 1240, paper: true },
  };

  const ARTEFACTS = [
    ...D.templates.map((t) => ({
      key: t.name,
      title: (TEMPLATE_PT[t.name] || {}).title || t.name,
      desc: (TEMPLATE_PT[t.name] || {}).desc || t.description,
      src: `../${t.entryPath}`,
      ...(ARTEFACT_VIEWPORT[t.name] || { width: 1280, height: 1400 }),
    })),
    {
      key: 'poster',
      title: 'Cartaz A3',
      desc: 'Ponto de partida em branco para peça impressa, com o CSS de impressão já resolvido.',
      src: '../starters/poster.html',
      width: 1170,
      height: 1660,
      paper: true,
    },
  ];

  const Artefact = ({ item }) => {
    const stageRef = React.useRef(null);
    const [scale, setScale] = React.useState(0.25);

    React.useEffect(() => {
      const node = stageRef.current;
      if (!node) return;
      const measure = () => {
        const available = node.clientWidth - (item.paper ? 32 : 0);
        setScale(Math.max(0.08, available / item.width));
      };
      measure();
      const observer = new ResizeObserver(measure);
      observer.observe(node);
      return () => observer.disconnect();
    }, [item.width, item.paper]);

    const visibleHeight = Math.round(item.height * scale);

    return h('div', { className: 'sc-artefact' },
      h('div', { className: 'sc-artefact-head' },
        h('div', null,
          h('h3', { className: 'sc-artefact-title' }, item.title),
          h('p', { className: 'sc-artefact-desc' }, item.desc)
        )
      ),
      h('div', { className: `sc-viewport${item.paper ? ' is-paper' : ''}` },
        item.paper ? null : h('div', { className: 'chrome' }, h('i'), h('i'), h('i')),
        h('div', {
          className: 'stage',
          ref: stageRef,
          style: { height: `${visibleHeight + (item.paper ? 32 : 0)}px` },
        },
          h('iframe', {
            src: item.src,
            title: item.title,
            loading: 'lazy',
            tabIndex: -1,
            'aria-hidden': 'true',
            style: {
              width: `${item.width}px`,
              height: `${item.height}px`,
              transform: `scale(${scale})`,
            },
          })
        ),
        h('a', {
          className: 'sc-open',
          href: item.src,
          target: '_blank',
          rel: 'noopener',
        }, h('span', null, h(DS.Icon, { name: 'external-link', size: 18 }), `Abrir ${item.title} em tamanho real`))
      )
    );
  };

  mount(
    'mount-artefacts',
    h(F, null, ARTEFACTS.map((item) => h(Artefact, { item, key: item.key })))
  );

  /* ── First paint of everything that is measured ──────────────────────────── */

  renderMeasured();
})();
