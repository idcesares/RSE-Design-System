function SiteHeader({ active = "inicio" }) {
  const links = [
    { id: "inicio", label: "Início" },
    { id: "unidades", label: "Unidades" },
    { id: "programas", label: "Programas" },
    { id: "sobre", label: "Sobre a Rede" },
    { id: "contato", label: "Contato" }
  ];
  return React.createElement(
    "header",
    { style: { position: "sticky", top: 0, zIndex: 20, background: "rgba(242,244,228,0.92)", backdropFilter: "blur(8px)", borderBottom: "1px solid var(--border-subtle)" } },
    React.createElement(
      "div",
      { style: { maxWidth: "var(--container-max)", margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 } },
      React.createElement("img", { src: "../../assets/logos/wordmark-purple.svg", alt: "Rede Sesc de Educação", style: { height: 34 } }),
      React.createElement(
        "nav",
        { style: { display: "flex", gap: 28 } },
        links.map((l) => React.createElement("a", {
          key: l.id,
          href: "#",
          style: { fontFamily: "var(--font-family-base)", fontSize: "var(--text-body-sm)", fontWeight: "var(--font-weight-semibold)", textDecoration: "none", color: l.id === active ? "var(--color-primary)" : "var(--text-body)" }
        }, l.label))
      ),
      React.createElement("button", {
        style: { fontFamily: "var(--font-family-base)", fontWeight: "var(--font-weight-semibold)", fontSize: "var(--text-body-sm)", padding: "10px 22px", borderRadius: "var(--radius-pill)", background: "var(--color-primary)", color: "white", border: "none", cursor: "pointer" }
      }, "Encontre uma unidade")
    )
  );
}
Object.assign(window, { SiteHeader });
