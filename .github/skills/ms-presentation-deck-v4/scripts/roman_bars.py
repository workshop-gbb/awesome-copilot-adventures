"""roman_bars v3.0.0: the divider numeral drawn as clean bars (no serifs, no crossbars).
I = one vertical bar, V = two bars meeting at the bottom, X = two crossing bars. Color = the part accent."""
H = 250      # glyph height
W = 46       # bar thickness
GAP = 30     # gap between glyphs

def _glyph(ch, x):
    if ch == 'I':
        return f'<rect x="{x}" y="0" width="{W}" height="{H}" rx="3"/>', W
    if ch == 'V':
        w = 190
        return (f'<polygon points="{x},0 {x+W},0 {x+w/2+W/2},{H} {x+w/2-W/2},{H}"/>'
                f'<polygon points="{x+w-W},0 {x+w},0 {x+w/2+W/2},{H} {x+w/2-W/2},{H}"/>'), w
    if ch == 'X':
        w = 190
        return (f'<polygon points="{x},0 {x+W},0 {x+w},{H} {x+w-W},{H}"/>'
                f'<polygon points="{x+w-W},0 {x+w},0 {x+W},{H} {x},{H}"/>'), w
    raise ValueError(ch)

def roman_svg(numeral, color='var(--accent)'):
    parts = []; x = 0
    for ch in numeral:
        g, w = _glyph(ch, x); parts.append(g); x += w + GAP
    total = x - GAP
    return (f'<div class="section-number section-number--bars" aria-label="{numeral}">'
            f'<svg viewBox="0 0 {total} {H}" width="{total}" height="{H}" fill="{color}" xmlns="http://www.w3.org/2000/svg">{"".join(parts)}</svg></div>')

def roman_inline(numeral, h=34, color='var(--accent)', cls='rn'):
    """The same bar glyphs at row scale: the agenda numerals are the divider numerals, smaller."""
    parts = []; x = 0
    for ch in numeral:
        g, w = _glyph(ch, x); parts.append(g); x += w + GAP
    total = x - GAP
    return (f'<svg class="{cls}" viewBox="0 0 {total} {H}" width="{total * h / H:.1f}" height="{h}" '
            f'fill="{color}" xmlns="http://www.w3.org/2000/svg" aria-label="{numeral}">{"".join(parts)}</svg>')

CSS = r"""
/* --- divider: algarismo em barras limpas, sem serifa e sem travessa --- */
.section-number--bars { font-size: 0; line-height: 0; margin-bottom: 34px; }
.section-number--bars svg { display: block; overflow: visible; }
.slide[data-active="true"] .section-number--bars svg polygon, .slide[data-active="true"] .section-number--bars svg rect { animation: barIn .7s var(--ps-ease) both; transform-box: fill-box; transform-origin: bottom; }
.slide[data-active="true"] .section-number--bars svg *:nth-child(2) { animation-delay: .12s; }
.slide[data-active="true"] .section-number--bars svg *:nth-child(3) { animation-delay: .24s; }
.slide[data-active="true"] .section-number--bars svg *:nth-child(4) { animation-delay: .36s; }
.slide[data-active="true"] .section-number--bars svg *:nth-child(5) { animation-delay: .48s; }
.slide[data-active="true"] .section-number--bars svg *:nth-child(6) { animation-delay: .6s; }
.ag__n .rn { display: block; margin: 0 auto; }
.slide[data-active="true"] .agenda .ag__n .rn * { animation: barIn .5s var(--ps-ease) both; transform-box: fill-box; transform-origin: bottom; }
@keyframes barIn { from { opacity: 0; transform: scaleY(.2); } to { opacity: 1; transform: scaleY(1); } }
"""
