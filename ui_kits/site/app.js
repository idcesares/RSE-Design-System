function App() {
  const { Button, Badge, Tag, Card, Tabs, Input, Select, Checkbox, Radio } = window.RedeSescDeEducaODesignSystem_2167ce;
  const [screen, setScreen] = React.useState("home");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [level, setLevel] = React.useState("todos");
  const programs = [
    { tag: ["pink", "Educação Infantil"], title: "Sesc Educação Infantil", desc: "Cuidado, brincadeira e descoberta nos primeiros anos.", level: "infantil" },
    { tag: ["orange", "Ensino Fundamental"], title: "Colégio Sesc Fundamental", desc: "Base sólida com método, acolhimento e atividades integradas.", level: "fundamental" },
    { tag: ["green", "Ensino Médio"], title: "Colégio Sesc Ensino Médio", desc: "Protagonismo estudantil e preparação para o futuro.", level: "medio" },
    { tag: ["blue", "Formação Profissional"], title: "Cursos Técnicos Sesc", desc: "Formação prática conectada ao mercado de trabalho.", level: "profissional" }
  ];
  const filtered = level === "todos" ? programs : programs.filter((p) => p.level === level);
  const units = [
    { name: "Sesc Vila Mariana", city: "São Paulo, SP", programs: "Infantil · Fundamental" },
    { name: "Sesc Pompeia", city: "São Paulo, SP", programs: "Fundamental · Médio" },
    { name: "Sesc Copacabana", city: "Rio de Janeiro, RJ", programs: "Educação Infantil" },
    { name: "Sesc Rio Preto", city: "São José do Rio Preto, SP", programs: "Cursos Técnicos" }
  ];
  return React.createElement(
    "div",
    { style: { fontFamily: "var(--font-family-base)", background: "var(--surface-page)", minHeight: "100vh" } },
    React.createElement(SiteHeader, { active: screen }),
    // simple screen switcher tabs (dev nav, not part of the real header)
    React.createElement(
      "div",
      { style: { display: "flex", justifyContent: "center", gap: 8, padding: "12px 0", background: "var(--surface-sunken)" } },
      ["home", "programas", "unidades"].map((s) => React.createElement("button", {
        key: s,
        onClick: () => setScreen(s),
        style: { border: "none", background: screen === s ? "var(--color-primary)" : "transparent", color: screen === s ? "white" : "var(--text-muted)", padding: "6px 16px", borderRadius: "var(--radius-pill)", fontSize: "var(--text-caption)", fontWeight: 600, cursor: "pointer" }
      }, s === "home" ? "Início" : s === "programas" ? "Programas" : "Unidades"))
    ),
    screen === "home" && React.createElement(
      "main",
      null,
      React.createElement(
        "section",
        { style: { maxWidth: "var(--container-max)", margin: "0 auto", padding: "72px 24px", display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 48, alignItems: "center" } },
        React.createElement(
          "div",
          null,
          React.createElement("div", { style: { fontSize: "var(--text-eyebrow)", fontWeight: 700, letterSpacing: "var(--letter-spacing-eyebrow)", textTransform: "uppercase", color: "var(--color-primary)", marginBottom: 16 } }, "Rede Sesc de Educação"),
          React.createElement("h1", { style: { fontSize: "var(--text-display-2)", lineHeight: "var(--line-height-tight)", margin: 0 } }, "Aprender para a vida acontecer"),
          React.createElement("p", { style: { fontSize: "var(--text-body-lg)", color: "var(--text-body)", margin: "20px 0 32px", maxWidth: 480 } }, "Uma atuação educacional nacional que acolhe para desenvolver, e desenvolve para gerar resultados — da educação infantil à formação profissional."),
          React.createElement(
            "div",
            { style: { display: "flex", gap: 12 } },
            React.createElement(Button, { variant: "primary", size: "lg", onClick: () => setDialogOpen(true) }, "Quero me inscrever"),
            React.createElement(Button, { variant: "ghost", size: "lg", onClick: () => setScreen("unidades") }, "Encontrar uma unidade")
          )
        ),
        React.createElement("image-slot", { id: "home-hero", shape: "rounded", radius: "24", placeholder: "Foto de estudantes em sala de aula", style: { width: "100%", height: 380 } })
      ),
      React.createElement(
        "section",
        { style: { maxWidth: "var(--container-max)", margin: "0 auto", padding: "0 24px 32px", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 } },
        [["+ 470", "unidades pelo Brasil"], ["80 anos", "de tradição em educação"], ["+ 200 mil", "estudantes atendidos"], ["26 estados", "e o Distrito Federal"]].map(
          (s, i) => React.createElement(
            "div",
            { key: i, style: { textAlign: "center" } },
            React.createElement("div", { style: { fontSize: 32, fontWeight: 800, color: "var(--color-primary)" } }, s[0]),
            React.createElement("div", { style: { fontSize: "var(--text-body-sm)", color: "var(--text-muted)", marginTop: 4 } }, s[1])
          )
        )
      ),
      React.createElement(
        "section",
        { style: { maxWidth: "var(--container-max)", margin: "0 auto", padding: "48px 24px" } },
        React.createElement(
          "div",
          { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 } },
          React.createElement("h2", { style: { fontSize: "var(--text-h1)" } }, "Nossos programas"),
          React.createElement(Button, { variant: "secondary", size: "sm", onClick: () => setScreen("programas") }, "Ver todos")
        ),
        React.createElement(
          "div",
          { style: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 } },
          programs.map((p, i) => React.createElement(Card, {
            key: i,
            image: React.createElement("image-slot", { id: `home-card-${i}`, placeholder: "Foto do programa" }),
            tag: React.createElement(Tag, { color: p.tag[0] }, p.tag[1]),
            title: p.title,
            description: p.desc,
            footer: React.createElement(Button, { size: "sm", variant: "secondary" }, "Saiba mais")
          }))
        )
      ),
      React.createElement(
        "section",
        { style: { background: "var(--color-purple-dark)", padding: "64px 24px", margin: "32px 0" } },
        React.createElement(
          "div",
          { style: { maxWidth: 760, margin: "0 auto", textAlign: "center" } },
          React.createElement("p", { style: { fontSize: "var(--text-h2)", color: "white", lineHeight: 1.4, fontWeight: 600, margin: 0 } }, "“Na Rede Sesc encontrei acolhimento e método. Aprendi para a vida, não só para a prova.”"),
          React.createElement("div", { style: { color: "var(--color-purple-light)", marginTop: 16, fontSize: "var(--text-body-sm)", fontWeight: 600 } }, "Ana Beatriz, ex-aluna do Ensino Médio")
        )
      ),
      React.createElement(
        "section",
        { style: { maxWidth: "var(--container-max)", margin: "0 auto", padding: "32px 24px 72px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" } },
        React.createElement(
          "div",
          null,
          React.createElement("h2", { style: { fontSize: "var(--text-h2)", margin: 0 } }, "Pronto para dar o próximo passo?"),
          React.createElement("p", { style: { color: "var(--text-muted)", marginTop: 8 } }, "Fale com a unidade mais próxima de você.")
        ),
        React.createElement(Button, { variant: "primary", size: "lg", onClick: () => setDialogOpen(true) }, "Quero me inscrever")
      )
    ),
    screen === "programas" && React.createElement(
      "main",
      { style: { maxWidth: "var(--container-max)", margin: "0 auto", padding: "48px 24px", display: "grid", gridTemplateColumns: "260px 1fr", gap: 40 } },
      React.createElement(
        "aside",
        { style: { display: "flex", flexDirection: "column", gap: 20 } },
        React.createElement("h3", { style: { fontSize: "var(--text-h4)", margin: 0 } }, "Filtrar"),
        React.createElement(Select, { label: "Estado", placeholder: "Todos os estados", options: [{ label: "São Paulo", value: "sp" }, { label: "Rio de Janeiro", value: "rj" }] }),
        React.createElement(
          "div",
          null,
          React.createElement("div", { style: { fontSize: "var(--text-body-sm)", fontWeight: 600, marginBottom: 10 } }, "Turno"),
          React.createElement(
            "div",
            { style: { display: "flex", flexDirection: "column", gap: 10 } },
            React.createElement(Checkbox, { label: "Manhã", checked: true, onChange: () => {
            } }),
            React.createElement(Checkbox, { label: "Tarde", checked: false, onChange: () => {
            } }),
            React.createElement(Checkbox, { label: "Integral", checked: false, onChange: () => {
            } })
          )
        )
      ),
      React.createElement(
        "div",
        null,
        React.createElement("h1", { style: { fontSize: "var(--text-h1)", marginBottom: 20 } }, "Programas"),
        React.createElement(Tabs, {
          tabs: [{ id: "todos", label: "Todos" }, { id: "infantil", label: "Educação Infantil" }, { id: "fundamental", label: "Ens. Fundamental" }, { id: "medio", label: "Ensino Médio" }, { id: "profissional", label: "Profissional" }],
          activeId: level,
          onChange: setLevel
        }),
        React.createElement(
          "div",
          { style: { display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 24, marginTop: 28 } },
          filtered.map((p, i) => React.createElement(Card, {
            key: i,
            image: React.createElement("image-slot", { id: `prog-card-${i}`, placeholder: "Foto do programa" }),
            tag: React.createElement(Tag, { color: p.tag[0] }, p.tag[1]),
            title: p.title,
            description: p.desc,
            footer: React.createElement(Button, { size: "sm", variant: "secondary" }, "Saiba mais")
          }))
        )
      )
    ),
    screen === "unidades" && React.createElement(
      "main",
      { style: { maxWidth: "var(--container-max)", margin: "0 auto", padding: "48px 24px" } },
      React.createElement("h1", { style: { fontSize: "var(--text-h1)", marginBottom: 24 } }, "Encontre uma unidade"),
      React.createElement(
        "div",
        { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 } },
        React.createElement(
          "div",
          null,
          React.createElement(
            "div",
            { style: { display: "flex", gap: 12, marginBottom: 24 } },
            React.createElement(Input, { placeholder: "Buscar por cidade ou bairro" }),
            React.createElement(Button, { variant: "primary" }, "Buscar")
          ),
          React.createElement(
            "div",
            { style: { display: "flex", flexDirection: "column", gap: 16 } },
            units.map((u, i) => React.createElement(
              "div",
              {
                key: i,
                style: { padding: 20, background: "var(--surface-card)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center" }
              },
              React.createElement(
                "div",
                null,
                React.createElement("div", { style: { fontWeight: 700 } }, u.name),
                React.createElement("div", { style: { color: "var(--text-muted)", fontSize: "var(--text-body-sm)", marginTop: 2 } }, u.city),
                React.createElement("div", { style: { color: "var(--color-primary)", fontSize: "var(--text-caption)", marginTop: 6, fontWeight: 600 } }, u.programs)
              ),
              React.createElement(Button, { size: "sm", variant: "ghost" }, "Ver unidade")
            ))
          )
        ),
        React.createElement("image-slot", { id: "units-map", placeholder: "Mapa de unidades", style: { width: "100%", height: "100%", minHeight: 420 } })
      )
    ),
    React.createElement(SiteFooter),
    React.createElement(EnrollDialog, { open: dialogOpen, onClose: () => setDialogOpen(false) })
  );
}
const __rede_site_root = document.getElementById("rede-sesc-site-root");
if (__rede_site_root) ReactDOM.createRoot(__rede_site_root).render(React.createElement(App));
