// A small markdown renderer for the component .prompt.md files, used by build-site. It covers
// what those files use — headings, paragraphs, unordered lists, pipe tables, fenced code, and
// inline code / bold / italic / links — and escapes everything else, so no raw HTML from a
// prompt reaches the page. Not a general CommonMark implementation.

const escape = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function inline(text) {
  // Code spans first, so nothing inside them is formatted.
  const parts = String(text).split(/(`[^`]+`)/g);
  return parts.map((part) => {
    if (/^`[^`]+`$/.test(part)) return `<code>${escape(part.slice(1, -1))}</code>`;
    return escape(part)
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, href) => (/^(https?:|\.{0,2}\/|#)/.test(href) || !href.includes(':') ? `<a href="${href}">${label}</a>` : label))
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[\s(])\*([^*\s][^*]*)\*(?=[\s).,;:!?]|$)/g, '$1<em>$2</em>');
  }).join('');
}

/**
 * Renders markdown to HTML. `headingOffset` demotes headings (a prompt's "#" becomes an h3 inside
 * a page whose h1 and h2 are already taken); `codeLabel(lang)` names each code block for screen
 * readers.
 */
export function render(md, { headingOffset = 2, codeLabel = (lang) => (lang ? `${lang} example` : 'Example') } = {}) {
  const lines = String(md).replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let i = 0;
  const isTableRow = (l) => /^\s*\|.*\|\s*$/.test(l);
  const cells = (l) => l.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
  while (i < lines.length) {
    const line = lines[i];
    const fence = line.match(/^```\s*([a-z]*)\s*$/);
    if (fence) {
      const body = [];
      i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) body.push(lines[i++]);
      i++;
      const lang = fence[1];
      out.push(`<pre class="site-code" tabindex="0" aria-label="${escape(codeLabel(lang))}"><code${lang ? ` data-lang="${lang}"` : ''}>${escape(body.join('\n'))}</code></pre>`);
      continue;
    }
    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      const level = Math.min(6, heading[1].length + headingOffset);
      out.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      i++;
      continue;
    }
    if (isTableRow(line) && i + 1 < lines.length && /^\s*\|?\s*:?-{3,}/.test(lines[i + 1])) {
      const head = cells(line);
      i += 2;
      const rows = [];
      while (i < lines.length && isTableRow(lines[i])) rows.push(cells(lines[i++]));
      out.push(`<div class="site-table" tabindex="0" role="region" aria-label="Table"><table><thead><tr>${head.map((c) => `<th scope="col">${inline(c)}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);
      continue;
    }
    if (/^\s*[-*]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        let item = lines[i++].replace(/^\s*[-*]\s+/, '');
        while (i < lines.length && /^\s{2,}\S/.test(lines[i]) && !/^\s*[-*]\s+/.test(lines[i])) item += ' ' + lines[i++].trim();
        items.push(`<li>${inline(item)}</li>`);
      }
      out.push(`<ul>${items.join('')}</ul>`);
      continue;
    }
    if (!line.trim()) { i++; continue; }
    const para = [];
    while (i < lines.length && lines[i].trim() && !/^```/.test(lines[i]) && !/^#{1,6}\s/.test(lines[i]) && !/^\s*[-*]\s+/.test(lines[i]) && !isTableRow(lines[i])) para.push(lines[i++].trim());
    out.push(`<p>${inline(para.join(' '))}</p>`);
  }
  return out.join('\n');
}

export { escape };
