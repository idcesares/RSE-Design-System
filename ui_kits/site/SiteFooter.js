function SiteFooter() {
  const cols = [
    { title: "Rede Sesc de Educação", items: ["Sobre a Rede", "Nossas unidades", "Programas", "Notícias"] },
    { title: "Para famílias", items: ["Matrículas", "Calendário letivo", "Portal do estudante", "Perguntas frequentes"] },
    { title: "Institucional", items: ["Sesc Nacional", "Trabalhe conosco", "Transparência", "Fale conosco"] }
  ];
  return React.createElement(
    "footer",
    { style: { background: "var(--color-ink)", color: "var(--gray-300)", marginTop: "var(--space-9)" } },
    React.createElement(
      "div",
      { style: { maxWidth: "var(--container-max)", margin: "0 auto", padding: "64px 24px 32px", display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr 1fr", gap: 40 } },
      React.createElement(
        "div",
        null,
        React.createElement("img", { src: "../../assets/logos/wordmark-white.svg", alt: "Rede Sesc de Educação", style: { height: 36, marginBottom: 16 } }),
        React.createElement("p", { style: { fontSize: "var(--text-body-sm)", maxWidth: 260, lineHeight: 1.6, color: "var(--gray-400)" } }, "Aprender para a vida acontecer.")
      ),
      cols.map((c, i) => React.createElement(
        "div",
        { key: i },
        React.createElement("div", { style: { fontWeight: "var(--font-weight-semibold)", color: "white", fontSize: "var(--text-body-sm)", marginBottom: 14 } }, c.title),
        React.createElement(
          "div",
          { style: { display: "flex", flexDirection: "column", gap: 10 } },
          c.items.map((it, j) => React.createElement("a", { key: j, href: "#", style: { fontSize: "var(--text-body-sm)", color: "var(--gray-400)", textDecoration: "none" } }, it))
        )
      ))
    ),
    React.createElement("div", { style: { borderTop: "1px solid #3a3830", padding: "20px 24px", maxWidth: "var(--container-max)", margin: "0 auto", fontSize: "var(--text-caption)", color: "var(--gray-500)" } }, "© 2026 Sesc — Serviço Social do Comércio. Todos os direitos reservados.")
  );
}
Object.assign(window, { SiteFooter });
