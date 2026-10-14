#!/usr/bin/env python3
"""Render a 1080x1080 Rede Sesc de Educação social post from brand.json.

    python docs/examples/social_post.py                          # writes post.svg
    python docs/examples/social_post.py --out anuncio.svg \
        --eyebrow "Matrículas abertas" \
        --headline "Aprender para a vida acontecer" \
        --hue purple

This is the proof that the design system is not a web-only thing. It uses the Python
standard library and nothing else — no Pillow, no cairo, no npm. Every colour, size,
font and piece of artwork comes out of brand.json, so this same 150 lines works in any
language that can parse JSON.

The output is a self-contained SVG: the Montserrat font file and the official wordmark
are embedded as data URIs, so it renders identically anywhere and can be rasterised to
PNG/JPG with whatever tool you already have (a browser screenshot, Inkscape, rsvg-convert,
resvg, ImageMagick).

Rules this script enforces, read from brand.json rather than hard-coded:
  - palette colours only
  - Montserrat, headings at weight 800, eyebrow at 700 uppercase
  - logo clearspace of X on all sides, and the 150 px digital minimum
  - at most two background colours in the composition
"""

import argparse
import base64
import json
import re
import sys
from pathlib import Path
from xml.sax.saxutils import escape

# The repo root when run from here; the package or the unzipped static kit elsewhere.
ROOT = next(
    (p for p in (Path(__file__).resolve().parents[2],
                 Path.cwd() / "node_modules" / "@idcesares" / "rse-design-system", Path.cwd())
     if (p / "brand.json").is_file()),
    None,
)
if ROOT is None:
    sys.exit("brand.json not found — run this from the design system repo, from a project with the package installed, or from inside the unzipped static kit.")

BRAND = json.loads((ROOT / "brand.json").read_text(encoding="utf-8"))

SIZE = 1080


def token(name: str) -> str:
    """A resolved token value. Never a var() chain — brand.json already followed them."""
    return BRAND["tokens"][name]["value"]


def hex_of(family: str, tone: str = "base") -> str:
    for colour in BRAND["palette"]:
        if colour["family"] == family and colour["tone"] == tone:
            return colour["hex"]
    raise SystemExit(f"{family}/{tone} is not in the palette. Available: "
                     + ", ".join(sorted({c['family'] for c in BRAND['palette']})))


def data_uri(rel_path: str, mime: str) -> str:
    raw = (ROOT / rel_path).read_bytes()
    return f"data:{mime};base64,{base64.b64encode(raw).decode('ascii')}"


def asset(kind: str, **match) -> dict:
    for entry in BRAND["assets"][kind]:
        if all(entry.get(k) == v for k, v in match.items()):
            return entry
    raise SystemExit(f"no {kind} matching {match}")


def rem(value: str, root_px: float = 16.0) -> float:
    """Type tokens are in rem or clamp(); a canvas has no viewport, so resolve to px."""
    value = value.strip()
    if value.startswith("clamp("):
        value = value[len("clamp("):-1].split(",")[-1].strip()  # the max
    if value.endswith("rem"):
        return float(value[:-3]) * root_px
    if value.endswith("px"):
        return float(value[:-2])
    return float(value)


def em(value: str, font_px: float) -> float:
    """An em-relative token (letter-spacing) against a concrete font size."""
    return float(value.strip().removesuffix("em")) * font_px


def px(value: str) -> float:
    """First number in a prose-y rule value, e.g. '150px wide' -> 150.0."""
    return float(re.search(r"[\d.]+", value).group())


def build(eyebrow: str, headline: str, hue: str, out: Path) -> None:
    rules = BRAND["rules"]
    type_rules = rules["typography"]

    on_purple = hue == "purple"
    background = hex_of("purple", "dark") if on_purple else hex_of("cream")
    # Two background colours max (rules.colour.maxBackgroundColoursPerComposition), so the
    # accent hue is carried by the motif, never by a second full-bleed field.
    ink = token("--rse-brand-white") if on_purple else token("--rse-color-text-heading")
    eyebrow_colour = token("--rse-brand-white") if on_purple else hex_of("purple", "dark")

    # The wordmark is the simplificada version; pick the one made for this surface.
    logo = asset("logos", id="wordmark-white" if on_purple else "wordmark-purple")
    # rules.logo.minSize.digital is the floor, not a target.
    logo_w = max(px(rules["logo"]["minSize"]["digital"]), SIZE * 0.26)
    logo_h = logo_w * 0.34  # wordmark aspect, tight viewBox

    # Clearspace is X on all four sides, X = height of the stem of the E ≈ the cap height
    # of the wordmark. Everything in the composition stays outside it.
    x_unit = logo_h
    margin = max(x_unit * 2, SIZE * 0.08)

    motif = asset("motifs", hue="pink" if on_purple else hue) if hue != "purple" else asset("motifs", hue="pink")
    motif_size = SIZE * 0.30

    font_regular = data_uri(BRAND["assets"]["fonts"][0]["file"], "font/woff2")
    logo_uri = data_uri(logo["path"], "image/svg+xml")
    motif_uri = data_uri(motif["path"], "image/svg+xml")

    head_px = rem(BRAND["scales"]["type"]["sizes"]["display-2"]) * 1.5
    eyebrow_px = rem(BRAND["scales"]["type"]["sizes"]["body-lg"])
    line_height = float(BRAND["scales"]["type"]["lineHeights"]["heading"])

    # Wrap by character count — good enough without a text-measuring library, and the
    # headline is short by house style ("short declarative sentences").
    words, lines, current = headline.split(), [], ""
    for word in words:
        if len(current) + len(word) + 1 > 18 and current:
            lines.append(current)
            current = word
        else:
            current = f"{current} {word}".strip()
    lines.append(current)

    # Place by baseline, not by box top: setting the last line's descenders on the bottom
    # margin is what makes the optical bottom margin match the top one.
    last_baseline = SIZE - margin - head_px * 0.22
    first_baseline = last_baseline - head_px * line_height * (len(lines) - 1)
    eyebrow_baseline = first_baseline - head_px * 0.95 - eyebrow_px * 0.7

    tspans = "".join(
        f'<tspan x="{margin:.0f}" dy="{0 if i == 0 else head_px * line_height:.0f}">{escape(line)}</tspan>'
        for i, line in enumerate(lines)
    )

    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="{SIZE}" height="{SIZE}" viewBox="0 0 {SIZE} {SIZE}" role="img" aria-label="{escape(headline)}">
  <title>{escape(headline)}</title>
  <style>
    @font-face {{ font-family: 'Montserrat'; font-weight: 100 900; src: url({font_regular}) format('woff2'); }}
    text {{ font-family: 'Montserrat', sans-serif; }}
    .eyebrow {{ font-weight: {type_rules['eyebrow']['weight']}; letter-spacing: {em(type_rules['eyebrow']['letterSpacing'], eyebrow_px):.2f}px; text-transform: uppercase; }}
    .headline {{ font-weight: {type_rules['headingWeight']}; letter-spacing: {em(type_rules['headingLetterSpacing'], head_px):.2f}px; }}
  </style>

  <rect width="{SIZE}" height="{SIZE}" fill="{background}"/>

  <!-- One motif construction per composition, never recoloured. -->
  <image xlink:href="{motif_uri}" x="{SIZE - margin - motif_size:.0f}" y="{margin:.0f}" width="{motif_size:.0f}" height="{motif_size:.0f}" opacity="0.95"/>

  <!-- Simplificada wordmark, clearspace X on all sides. -->
  <image xlink:href="{logo_uri}" x="{margin:.0f}" y="{margin:.0f}" width="{logo_w:.0f}" height="{logo_h:.0f}"/>

  <text class="eyebrow" x="{margin:.0f}" y="{eyebrow_baseline:.0f}" font-size="{eyebrow_px:.0f}" fill="{eyebrow_colour}">{escape(eyebrow)}</text>
  <text class="headline" x="{margin:.0f}" y="{first_baseline:.0f}" font-size="{head_px:.0f}" fill="{ink}">{tspans}</text>
</svg>
"""
    out.write_text(svg, encoding="utf-8")
    print(f"wrote {out}  {SIZE}x{SIZE}")
    print(f"  background {background}   motif {motif['id']} ({motif['hue']})   logo {logo['id']}")
    print(f"  brand.json v{BRAND['version']} — palette colours only, Montserrat {type_rules['weightRange'][0]}–{type_rules['weightRange'][1]}")
    print("  copy is pt-BR and unverified: check any figure with Sesc before publishing.")


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--out", type=Path, default=Path("post.svg"))
    ap.add_argument("--eyebrow", default="Rede Sesc de Educação")
    ap.add_argument("--headline", default="Aprender para a vida acontecer")
    ap.add_argument("--hue", default="green", help="motif hue: green, blue, pink — or 'purple' for a purple field")
    a = ap.parse_args()
    build(a.eyebrow, a.headline, a.hue, a.out)
