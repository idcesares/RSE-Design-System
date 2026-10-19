// Every foreground/background pair the system puts on screen, with the WCAG floor that applies.
// One list, two readers: scripts/audit.mjs gates on it, and build-showcase.mjs folds it into
// showcase-data.js so the showcase's live contrast table measures exactly the same pairs.
// Adding a component that sets text on a new surface? Add its pair here.
//
// floor 4.5 = text below 24px / 18.66px bold (every text pair here is 12–16px).
// floor 3   = large text, or a non-text boundary that identifies a control (WCAG 1.4.11).
// `label` is pt-BR because the showcase shows it to people; `where` is for script output.

export const CONTRAST_PAIRS = [
  { where: 'Body text on page', label: 'Texto corrido sobre a página', fg: '--rse-color-text-body', bg: '--rse-color-surface-page', floor: 4.5 },
  { where: 'Body text on card', label: 'Texto corrido sobre o cartão', fg: '--rse-color-text-body', bg: '--rse-color-surface-card', floor: 4.5 },
  { where: 'Heading on page', label: 'Título sobre a página', fg: '--rse-color-text-heading', bg: '--rse-color-surface-page', floor: 4.5 },
  { where: 'Muted text on page', label: 'Texto secundário sobre a página', fg: '--rse-color-text-muted', bg: '--rse-color-surface-page', floor: 4.5 },
  { where: 'Muted text on card', label: 'Texto secundário sobre o cartão', fg: '--rse-color-text-muted', bg: '--rse-color-surface-card', floor: 4.5 },
  { where: 'Primary button label', label: 'Texto dentro do botão primário', fg: '--rse-color-text-on-primary', bg: '--rse-color-primary', floor: 4.5 },
  { where: 'Secondary button, menu hover, avatar', label: 'Botão secundário, item de menu, avatar', fg: '--rse-color-text-on-primary-tint', bg: '--rse-color-surface-primary-tint', floor: 4.5 },
  { where: 'Ghost button on hover', label: 'Botão fantasma em foco do mouse', fg: '--rse-color-text-on-primary-tint', bg: '--rse-color-surface-sunken', floor: 4.5 },
  { where: 'Ghost button on page', label: 'Botão fantasma sobre a página', fg: '--rse-color-text-on-primary-tint', bg: '--rse-color-surface-page', floor: 4.5 },
  { where: 'Link on page', label: 'Link sobre a página', fg: '--rse-color-text-link', bg: '--rse-color-surface-page', floor: 4.5 },
  { where: 'Field error message', label: 'Mensagem de erro do campo', fg: '--rse-color-danger-text', bg: '--rse-color-surface-card', floor: 4.5 },
  { where: 'Badge / Alert success', label: 'Status: sucesso', fg: '--rse-color-success-text', bg: '--rse-color-success-surface', floor: 4.5 },
  { where: 'Badge / Alert warning', label: 'Status: atenção', fg: '--rse-color-warning-text', bg: '--rse-color-warning-surface', floor: 4.5 },
  { where: 'Badge / Alert danger', label: 'Status: erro', fg: '--rse-color-danger-text', bg: '--rse-color-danger-surface', floor: 4.5 },
  { where: 'Badge / Alert info', label: 'Status: informação', fg: '--rse-color-info-text', bg: '--rse-color-info-surface', floor: 4.5 },
  { where: 'Tag pink', label: 'Etiqueta rosa', fg: '--rse-color-tint-pink-ink', bg: '--rse-color-tint-pink', floor: 4.5 },
  { where: 'Tag orange', label: 'Etiqueta laranja', fg: '--rse-color-tint-orange-ink', bg: '--rse-color-tint-orange', floor: 4.5 },
  { where: 'Tag green', label: 'Etiqueta verde', fg: '--rse-color-tint-green-ink', bg: '--rse-color-tint-green', floor: 4.5 },
  { where: 'Tag blue', label: 'Etiqueta azul', fg: '--rse-color-tint-blue-ink', bg: '--rse-color-tint-blue', floor: 4.5 },
  { where: 'Tag purple', label: 'Etiqueta roxa', fg: '--rse-color-tint-purple-ink', bg: '--rse-color-tint-purple', floor: 4.5 },
  { where: 'Tag yellow', label: 'Etiqueta amarela', fg: '--rse-color-tint-yellow-ink', bg: '--rse-color-tint-yellow', floor: 4.5 },
  { where: 'Stat yellow figure on page', label: 'Número de destaque amarelo', fg: '--rse-color-tint-yellow-ink', bg: '--rse-color-surface-page', floor: 3 },
  { where: 'Focus ring on page', label: 'Anel de foco sobre a página', fg: '--rse-color-focus-ring', bg: '--rse-color-surface-page', floor: 3 },
  { where: 'Focus ring on card', label: 'Anel de foco sobre o cartão', fg: '--rse-color-focus-ring', bg: '--rse-color-surface-card', floor: 3 },
  { where: 'Control border on card', label: 'Borda do campo de formulário', fg: '--rse-color-border-strong', bg: '--rse-color-surface-card', floor: 3 },
  { where: 'Control border on page', label: 'Borda do campo sobre a página', fg: '--rse-color-border-strong', bg: '--rse-color-surface-page', floor: 3 },
  // Data palette (charts, Stat, legends): non-text marks on the card, WCAG 1.4.11.
  { where: 'Data 1 on card', label: 'Série de dados 1 (roxo) sobre o cartão', fg: '--rse-color-data-1', bg: '--rse-color-surface-card', floor: 3 },
  { where: 'Data 2 on card', label: 'Série de dados 2 (azul) sobre o cartão', fg: '--rse-color-data-2', bg: '--rse-color-surface-card', floor: 3 },
  { where: 'Data 3 on card', label: 'Série de dados 3 (verde) sobre o cartão', fg: '--rse-color-data-3', bg: '--rse-color-surface-card', floor: 3 },
  { where: 'Data 4 on card', label: 'Série de dados 4 (amarelo) sobre o cartão', fg: '--rse-color-data-4', bg: '--rse-color-surface-card', floor: 3 },
  { where: 'Data 5 on card', label: 'Série de dados 5 (laranja) sobre o cartão', fg: '--rse-color-data-5', bg: '--rse-color-surface-card', floor: 3 },
  { where: 'Data 6 on card', label: 'Série de dados 6 (rosa) sobre o cartão', fg: '--rse-color-data-6', bg: '--rse-color-surface-card', floor: 3 },
  { where: 'Primary button label on press', label: 'Texto do botão primário ao pressionar', fg: '--rse-color-text-on-primary', bg: '--rse-color-primary-active', floor: 4.5 },
  // Roles that were measured nowhere before.
  { where: 'Link on card', label: 'Link sobre o cartão', fg: '--rse-color-text-link', bg: '--rse-color-surface-card', floor: 4.5 },
  { where: 'Link hover on page', label: 'Link em foco do mouse sobre a página', fg: '--rse-color-text-link-hover', bg: '--rse-color-surface-page', floor: 4.5 },
  { where: 'Link hover on card', label: 'Link em foco do mouse sobre o cartão', fg: '--rse-color-text-link-hover', bg: '--rse-color-surface-card', floor: 4.5 },
  { where: 'Inverse text on inverse surface', label: 'Texto invertido sobre superfície invertida', fg: '--rse-color-text-inverse', bg: '--rse-color-surface-inverse', floor: 4.5 },
  { where: 'Primary button label on hover', label: 'Texto do botão primário em foco do mouse', fg: '--rse-color-text-on-primary', bg: '--rse-color-primary-hover', floor: 4.5 },
  // Accent bands (decision D3): ink text on every light and mid accent sanctioned as a band.
  { where: 'Band: ink on pink light', label: 'Faixa rosa clara com texto ink', fg: '--rse-brand-ink', bg: '--rse-brand-pink-light', floor: 4.5 },
  { where: 'Band: ink on pink mid', label: 'Faixa rosa média com texto ink', fg: '--rse-brand-ink', bg: '--rse-brand-pink', floor: 4.5 },
  { where: 'Band: ink on orange light', label: 'Faixa laranja clara com texto ink', fg: '--rse-brand-ink', bg: '--rse-brand-orange-light', floor: 4.5 },
  { where: 'Band: ink on orange mid', label: 'Faixa laranja média com texto ink', fg: '--rse-brand-ink', bg: '--rse-brand-orange', floor: 4.5 },
  { where: 'Band: ink on yellow light', label: 'Faixa amarela clara com texto ink', fg: '--rse-brand-ink', bg: '--rse-brand-yellow-light', floor: 4.5 },
  { where: 'Band: ink on yellow mid', label: 'Faixa amarela média com texto ink', fg: '--rse-brand-ink', bg: '--rse-brand-yellow', floor: 4.5 },
  { where: 'Band: ink on green light', label: 'Faixa verde clara com texto ink', fg: '--rse-brand-ink', bg: '--rse-brand-green-light', floor: 4.5 },
  { where: 'Band: ink on green mid', label: 'Faixa verde média com texto ink', fg: '--rse-brand-ink', bg: '--rse-brand-green', floor: 4.5 },
  { where: 'Band: ink on blue light', label: 'Faixa azul clara com texto ink', fg: '--rse-brand-ink', bg: '--rse-brand-blue-light', floor: 4.5 },
  { where: 'Band: ink on blue mid', label: 'Faixa azul média com texto ink', fg: '--rse-brand-ink', bg: '--rse-brand-blue', floor: 4.5 },
  { where: 'Band: ink on purple light', label: 'Faixa roxa clara com texto ink', fg: '--rse-brand-ink', bg: '--rse-brand-purple-light', floor: 4.5 },
  { where: 'Footer secondary text on ink', label: 'Texto secundário no rodapé', fg: '--rse-color-text-on-ink-muted', bg: '--rse-brand-ink', floor: 4.5 },
  { where: 'Sab.IA chrome text on blue', label: 'Texto sobre o azul da Sab.IA', fg: '--rse-color-sabia-on-blue', bg: '--rse-color-sabia-blue', floor: 4.5 },
];
