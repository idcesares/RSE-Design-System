/* ─────────────────────────────────────────────────────────────────────────────
   demos.js — one live demonstration per component, for showcase/index.html.

   Each entry renders the real component from dist/rse.js with realistic pt-BR content.
   `block: true` asks for a full-width stage. Add an entry when you add a component —
   the gallery falls back to a note when one is missing, and `npm run test:pages` opens
   every demo in a browser.
   ───────────────────────────────────────────────────────────────────────────── */
window.SC_DEMOS = (DS) => {
  'use strict';
  const h = React.createElement;
  const F = React.Fragment;
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
    Hero: 'A abertura da página: título único, apoio, botões e imagem lado a lado.',
    CtaBand: 'A faixa de chamada para ação que fecha a página.',
    PlatformEntry: 'A ponte para a Plataforma Sesc Sab.IA, com as duas marcas juntas.',
    ProgressBar: 'Barra de progresso com percentual — envio de documentos, etapas concluídas.',
    Radio: 'Escolha única dentro de um grupo: turno, categoria, forma de contato.',
    Select: 'Lista suspensa para escolher unidade, programa ou estado.',
    Skeleton: 'O esqueleto que ocupa o lugar do conteúdo enquanto ele carrega.',
    Spinner: 'Indicador de carregamento para ações sem duração previsível.',
    StatBand: 'Uma faixa de números de impacto sobre uma cor só, lida como lista.',
    Stat: 'Um número de impacto com rótulo — o pilar do resultado, tornado visível.',
    Stepper: 'As etapas de um fluxo, mostrando onde a pessoa está e o que já concluiu.',
    Switch: 'Interruptor de liga e desliga para preferências.',
    Tabs: 'Abas para alternar seções. Andam com as setas do teclado.',
    Tag: 'Etiqueta de categoria em uma das seis cores de acento.',
    Testimonial: 'Um depoimento estático, com autor e unidade — sempre real e autorizado, nunca inventado.',
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

    Hero: { block: true, render: () =>
      h(DS.Hero, {
        eyebrow: 'Rede Sesc de Educação', title: 'Aprender para a vida acontecer', as: 'h2',
        lead: 'Educação que acolhe, forma e transforma — em unidades por todo o Brasil.',
        badge: h(DS.Badge, { tone: 'success' }, 'Vagas abertas'),
        media: h('image-slot', { id: 'demo-hero-photo', shape: 'rounded', radius: '32', placeholder: 'estudantes em sala, luz natural, estilo documental' })
      },
        h(DS.Button, { variant: 'primary', size: 'lg' }, 'Quero me inscrever'),
        h(DS.Button, { variant: 'ghost', size: 'lg' }, 'Assista a nossa história')
      ) },

    Testimonial: { render: () =>
      h(DS.Testimonial, {
        example: true, quote: 'Depoimento de exemplo: substitua por um relato real e autorizado.',
        name: 'Nome Sobrenome', role: 'responsável', unit: 'unidade a definir',
        avatar: h(DS.Avatar, { initials: 'NS', size: 'lg' })
      }) },

    CtaBand: { block: true, render: () =>
      h(DS.CtaBand, { tone: 'ink', eyebrow: 'Fale conosco', title: 'Ainda com dúvidas?', description: 'Nossa equipe responde o mais rápido possível.' },
        h(DS.Button, { variant: 'primary', size: 'lg' }, 'Fale conosco')
      ) },

    Stat: { block: true, render: () =>
      h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: 'var(--rse-space-5)' } },
        h(DS.Stat, { value: '000', label: 'Unidades', accent: 'primary' }),
        h(DS.Stat, { value: '00 anos', label: 'De tradição', accent: 'green' }),
        h(DS.Stat, { value: '000 mil', label: 'Estudantes', accent: 'orange' })
      ) },

    StatBand: { block: true, render: () =>
      h(DS.StatBand, { tone: 'primary', title: 'A Rede em números', note: 'Números de exemplo: substituir por dados verificados antes de publicar.' },
        h(DS.Stat, { value: '000', label: 'Unidades', accent: 'inverse', align: 'center' }),
        h(DS.Stat, { value: '00 anos', label: 'De tradição', accent: 'inverse', align: 'center' }),
        h(DS.Stat, { value: '000 mil', label: 'Estudantes', accent: 'inverse', align: 'center' })
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

  return { GLOSS, DEMOS };
};
