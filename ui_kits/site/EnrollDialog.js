function EnrollDialog({ open, onClose }) {
  const [step, setStep] = React.useState("form");
  if (!open) return null;
  return React.createElement(
    "div",
    {
      style: { position: "fixed", inset: 0, background: "rgba(30,28,23,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 },
      onClick: onClose
    },
    React.createElement(
      "div",
      {
        onClick: (e) => e.stopPropagation(),
        style: { background: "var(--surface-card)", borderRadius: "var(--radius-lg)", padding: 32, width: 420, maxWidth: "90vw", boxShadow: "var(--shadow-lg)", fontFamily: "var(--font-family-base)" }
      },
      step === "form" ? React.createElement(
        React.Fragment,
        null,
        React.createElement("h3", { style: { fontSize: "var(--text-h3)", marginBottom: 6 } }, "Quero me inscrever"),
        React.createElement("p", { style: { color: "var(--text-muted)", fontSize: "var(--text-body-sm)", marginBottom: 20 } }, "Preencha seus dados e retornaremos em até 2 dias úteis."),
        React.createElement(
          "div",
          { style: { display: "flex", flexDirection: "column", gap: 14 } },
          React.createElement("input", { placeholder: "Nome completo", style: inputStyle }),
          React.createElement("input", { placeholder: "E-mail", style: inputStyle }),
          React.createElement("button", {
            onClick: () => setStep("done"),
            style: { marginTop: 8, padding: "12px 24px", borderRadius: "var(--radius-pill)", background: "var(--color-primary)", color: "white", border: "none", fontWeight: 600, cursor: "pointer" }
          }, "Enviar inscrição")
        )
      ) : React.createElement(
        React.Fragment,
        null,
        React.createElement("h3", { style: { fontSize: "var(--text-h3)", marginBottom: 6 } }, "Inscrição enviada!"),
        React.createElement("p", { style: { color: "var(--text-muted)", fontSize: "var(--text-body-sm)" } }, "Você receberá um e-mail de confirmação em breve."),
        React.createElement("button", {
          onClick: onClose,
          style: { marginTop: 20, padding: "12px 24px", borderRadius: "var(--radius-pill)", background: "var(--surface-primary-tint)", color: "var(--text-on-primary-tint)", border: "none", fontWeight: 600, cursor: "pointer" }
        }, "Fechar")
      )
    )
  );
}
const inputStyle = { padding: "12px 16px", borderRadius: "var(--radius-md)", border: "1.5px solid var(--border-default)", fontFamily: "var(--font-family-base)", fontSize: "var(--text-body-md)", outline: "none" };
Object.assign(window, { EnrollDialog });
