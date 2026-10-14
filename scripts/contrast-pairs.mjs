// Every foreground/background pair the system puts on screen, with the WCAG floor that applies.
// One list, two readers: scripts/audit.mjs gates on it, and build-showcase.mjs folds it into
// showcase-data.js so the showcase's live contrast table measures exactly the same pairs.
// Adding a component that sets text on a new surface? Add its pair here.
//
// floor 4.5 = text below 24px / 18.66px bold (every text pair here is 12–16px).
// floor 3   = large text, or a non-text boundary that identifies a control (WCAG 1.4.11).
// `label` is pt-BR because the showcase shows it to people; `where` is for script output.

export const CONTRAST_PAIRS = [
  { where: 'Body text on page', label: 'Texto corrido sobre a página', fg: '--text-body', bg: '--surface-page', floor: 4.5 },
  { where: 'Body text on card', label: 'Texto corrido sobre o cartão', fg: '--text-body', bg: '--surface-card', floor: 4.5 },
  { where: 'Heading on page', label: 'Título sobre a página', fg: '--text-heading', bg: '--surface-page', floor: 4.5 },
  { where: 'Muted text on page', label: 'Texto secundário sobre a página', fg: '--text-muted', bg: '--surface-page', floor: 4.5 },
  { where: 'Muted text on card', label: 'Texto secundário sobre o cartão', fg: '--text-muted', bg: '--surface-card', floor: 4.5 },
  { where: 'Primary button label', label: 'Texto dentro do botão primário', fg: '--text-on-primary', bg: '--color-primary', floor: 4.5 },
  { where: 'Secondary button, menu hover, avatar', label: 'Botão secundário, item de menu, avatar', fg: '--text-on-primary-tint', bg: '--surface-primary-tint', floor: 4.5 },
  { where: 'Link on page', label: 'Link sobre a página', fg: '--text-link', bg: '--surface-page', floor: 4.5 },
  { where: 'Field error message', label: 'Mensagem de erro do campo', fg: '--danger-text', bg: '--surface-card', floor: 4.5 },
  { where: 'Badge / Alert success', label: 'Status: sucesso', fg: '--success-text', bg: '--success-surface', floor: 4.5 },
  { where: 'Badge / Alert warning', label: 'Status: atenção', fg: '--warning-text', bg: '--warning-surface', floor: 4.5 },
  { where: 'Badge / Alert danger', label: 'Status: erro', fg: '--danger-text', bg: '--danger-surface', floor: 4.5 },
  { where: 'Badge / Alert info', label: 'Status: informação', fg: '--info-text', bg: '--info-surface', floor: 4.5 },
  { where: 'Tag pink', label: 'Etiqueta rosa', fg: '--tint-pink-ink', bg: '--tint-pink', floor: 4.5 },
  { where: 'Tag orange', label: 'Etiqueta laranja', fg: '--tint-orange-ink', bg: '--tint-orange', floor: 4.5 },
  { where: 'Tag green', label: 'Etiqueta verde', fg: '--tint-green-ink', bg: '--tint-green', floor: 4.5 },
  { where: 'Tag blue', label: 'Etiqueta azul', fg: '--tint-blue-ink', bg: '--tint-blue', floor: 4.5 },
  { where: 'Tag purple', label: 'Etiqueta roxa', fg: '--tint-purple-ink', bg: '--tint-purple', floor: 4.5 },
  { where: 'Tag yellow', label: 'Etiqueta amarela', fg: '--tint-yellow-ink', bg: '--tint-yellow', floor: 4.5 },
  { where: 'Stat yellow figure on page', label: 'Número de destaque amarelo', fg: '--tint-yellow-ink', bg: '--surface-page', floor: 3 },
  { where: 'Focus ring on page', label: 'Anel de foco sobre a página', fg: '--focus-ring', bg: '--surface-page', floor: 3 },
  { where: 'Focus ring on card', label: 'Anel de foco sobre o cartão', fg: '--focus-ring', bg: '--surface-card', floor: 3 },
  { where: 'Control border on card', label: 'Borda do campo de formulário', fg: '--border-strong', bg: '--surface-card', floor: 3 },
  { where: 'Control border on page', label: 'Borda do campo sobre a página', fg: '--border-strong', bg: '--surface-page', floor: 3 },
  // Accent bands (decision D3): ink text on every light and mid accent sanctioned as a band.
  { where: 'Band: ink on pink light', label: 'Faixa rosa clara com texto ink', fg: '--color-ink', bg: '--color-pink-light', floor: 4.5 },
  { where: 'Band: ink on pink mid', label: 'Faixa rosa média com texto ink', fg: '--color-ink', bg: '--color-pink', floor: 4.5 },
  { where: 'Band: ink on orange light', label: 'Faixa laranja clara com texto ink', fg: '--color-ink', bg: '--color-orange-light', floor: 4.5 },
  { where: 'Band: ink on orange mid', label: 'Faixa laranja média com texto ink', fg: '--color-ink', bg: '--color-orange', floor: 4.5 },
  { where: 'Band: ink on yellow light', label: 'Faixa amarela clara com texto ink', fg: '--color-ink', bg: '--color-yellow-light', floor: 4.5 },
  { where: 'Band: ink on yellow mid', label: 'Faixa amarela média com texto ink', fg: '--color-ink', bg: '--color-yellow', floor: 4.5 },
  { where: 'Band: ink on green light', label: 'Faixa verde clara com texto ink', fg: '--color-ink', bg: '--color-green-light', floor: 4.5 },
  { where: 'Band: ink on green mid', label: 'Faixa verde média com texto ink', fg: '--color-ink', bg: '--color-green', floor: 4.5 },
  { where: 'Band: ink on blue light', label: 'Faixa azul clara com texto ink', fg: '--color-ink', bg: '--color-blue-light', floor: 4.5 },
  { where: 'Band: ink on blue mid', label: 'Faixa azul média com texto ink', fg: '--color-ink', bg: '--color-blue', floor: 4.5 },
  { where: 'Band: ink on purple light', label: 'Faixa roxa clara com texto ink', fg: '--color-ink', bg: '--color-purple-light', floor: 4.5 },
  { where: 'Sab.IA chrome text on blue', label: 'Texto sobre o azul da Sab.IA', fg: '--sabia-on-blue', bg: '--sabia-blue', floor: 4.5 },
];
