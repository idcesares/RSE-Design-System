// Readers for the hand-written component .d.ts files, shared by gen-docs (docs/components.md),
// build-catalog (dist/components.json) and check-ds (the class contract).

/** Props of `export interface <Name>Props`, in declaration order. */
export const propsOf = (dts, name) => {
  const block = dts.match(new RegExp(`export interface ${name}Props(?: extends [^{]+)? \\{([\\s\\S]*?)\\n\\}`));
  if (!block) return [];
  return [...block[1].matchAll(/(?:\/\*\*(.*?)\*\/\s*)?\n?\s*'?([\w-]+)'?(\??):\s*([^;]+);/gs)].map((m) => ({
    doc: (m[1] ?? '').trim(),
    name: m[2],
    required: m[3] !== '?',
    type: m[4].replace(/\s+/g, ' ').trim(),
  }));
};

/** What `<Name>Props` extends, e.g. "React.ButtonHTMLAttributes<HTMLButtonElement>", or null. */
export const extendsOf = (dts, name) => {
  const m = dts.match(new RegExp(`export interface ${name}Props extends ([^{]+)\\{`));
  return m ? m[1].replace(/\s+/g, ' ').trim() : null;
};

/** The doc comment immediately before the component's declaration, not everything above it. */
export const summaryOf = (dts, name) => {
  const m = dts.match(new RegExp(`/\\*\\*((?:(?!\\*/)[\\s\\S])*)\\*/\\s*export (?:declare )?(?:function|const) ${name}\\b`));
  return m ? m[1].replace(/^\s*\*\s?/gm, ' ').replace(/\s+/g, ' ').trim() : '';
};

/**
 * The string-literal values of a type, following type aliases found in `allDts`
 * ('page' | 'card' | BandTone). null when any member is not a literal or a resolvable alias
 * (string, number, ReactNode…): the prop is open, not an enumeration.
 */
export const literalValues = (type, allDts, depth = 0) => {
  const out = [];
  for (const part of type.split('|').map((t) => t.trim()).filter(Boolean)) {
    const lit = part.match(/^'([^']+)'$/);
    if (lit) { out.push(lit[1]); continue; }
    const alias = /^[A-Z]\w*$/.test(part) && depth < 4 && allDts.match(new RegExp(`type ${part}\\s*=\\s*([^;]+);`));
    const inner = alias && literalValues(alias[1], allDts, depth + 1);
    if (!inner) return null;
    out.push(...inner);
  }
  return out.length ? out : null;
};
