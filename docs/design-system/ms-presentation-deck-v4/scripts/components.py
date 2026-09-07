"""components v4.0.0: HTML builders for the ms-presentation-deck visual layer.
Every builder returns a string. Text goes in as given (already i18n-wrapped when needed:
use I(key, text) from the deck builder to emit data-i18n spans)."""
from html import escape
from itertools import count
from xml.etree import ElementTree as ET
from visual_layer import ico

COL4 = ['red', 'yellow', 'blue', 'green']
_UID = count(1)
def cv(i): return f'var(--ps-color-ms-{COL4[i % 4]}-500)'
def cvn(name): return f'var(--ps-color-ms-{name}-500)'

def required(value, label):
    if not str(value).strip():
        raise ValueError(f'{label} is required for accessible media.')
    return str(value)

# ---------- text families ----------
def hero_statement(text_html, sub_html=''):
    return f'<div class="hero-stmt">{text_html}</div>' + (f'<div class="hero-sub">{sub_html}</div>' if sub_html else '')

def big_numbers(items):
    """items: [(value_html, label, text, color)]"""
    return '<div class="bignums">' + ''.join(f'<div class="bn" style="--c:{cvn(c)};--i:{i}"><div class="bn__v">{v}</div><div class="bn__k">{k}</div><div class="bn__t">{t}</div></div>' for i, (v, k, t, c) in enumerate(items)) + '</div>'

def ledger(rows, icons=None):
    """rows: [(label, text_html)]"""
    out = []
    for i, (k, t) in enumerate(rows):
        ic = ico(icons[i % len(icons)]) if icons else ''
        icon = f'<div class="lr__i">{ic}</div>' if ic else ''
        out.append(f'<div class="lr{" lr--noicon" if not ic else ""}" style="--c:{cv(i)};--tc:var(--ps-text-{COL4[i % 4]});--i:{i}"><div class="lr__n">{i+1:02d}</div>{icon}<div class="lr__b"><div class="lr__k">{k}</div><div class="lr__t">{t}</div></div></div>')
    return '<div class="ledg">' + ''.join(out) + '</div>'

def tiles(items, icons=None, cols=2, story=False, foot=None):
    """items: [(title, body_html)]; foot: list of pill texts (red) or None"""
    out = []
    for i, (t, b) in enumerate(items):
        ic = ico(icons[i % len(icons)]) if icons else ''
        title = f'<div class="tile__t">{t}</div>'; body = f'<div class="tile__b">{b}</div>'
        f = f'<div class="tile__f">{foot[i]}</div>' if foot and foot[i] else ''
        if story: inner = f'<div class="tile__h">{ic}<div class="tile__n">{i+1:02d}</div></div><div>{title}{body}{f}</div>'
        else: inner = f'<div class="tile__h">{ic}<div class="tile__n">{i+1:02d}</div>{title}</div>{body}{f}'
        out.append(f'<div class="tile" style="--c:{cv(i)};--i:{i}">{inner}</div>')
    cls = 'tiles' + (' tiles--3' if cols == 3 else '') + (' tiles--story' if story else '')
    return f'<div class="{cls}">' + ''.join(out) + '</div>'

def kpis(items, cols=None):
    """items: [(value, label, text_html, color)]; cols: fixed column count (default: as many as fit, 180px min)"""
    st = f' style="grid-template-columns:repeat({cols},minmax(0,1fr))"' if cols else ''
    return f'<div class="kpis"{st}>' + ''.join(f'<div class="kpi" style="--c:{cvn(c)};--i:{i}"><div class="kpi__v">{v}</div><div class="kpi__k">{k}</div><div class="kpi__t">{t}</div></div>' for i, (v, k, t, c) in enumerate(items)) + '</div>'

def timeline(items, cols=6):
    """items: [(date, title, why)] up to 12; cols=3 gives two rows with wide columns (fills the stage with 6 items)"""
    return f'<div class="tline{" tline--3" if cols == 3 else ""}">' + ''.join(f'<div class="tl" style="--c:{cv(i)};--tc:var(--ps-text-{COL4[i % 4]});--i:{i}"><div class="tl__d">{d}</div><div class="tl__t">{t}</div><div class="tl__w">{w}</div></div>' for i, (d, t, w) in enumerate(items)) + '</div>'

def quote(text, author, icon='users'):
    return f'<div class="bquote"><div class="bquote__ph">{ico(icon)}</div><div><div class="bquote__t">{text}</div><div class="bquote__a">{author}</div></div></div>'

def checklist(items):
    """items: [(title, detail)]"""
    chk = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7"/></svg>'
    return '<div class="checks">' + ''.join(f'<div class="chk" style="--c:{cv(i)};--i:{i}"><div class="chk__b">{chk}</div><div><div class="chk__t">{t}</div><div class="chk__d">{d}</div></div></div>' for i, (t, d) in enumerate(items)) + '</div>'

def steps(items):
    """items: [(title, detail)]"""
    return f'<div class="steps" style="--n:{len(items)}">' + ''.join(f'<div class="stp" style="--c:{cv(i)};--i:{i}"><div class="stp__n">{i+1}</div><div class="stp__t">{t}</div><div class="stp__d">{d}</div></div>' for i, (t, d) in enumerate(items)) + '</div>'

def dodont(dont_title, donts, do_title, dos):
    li = lambda xs: ''.join(f'<li>{x}</li>' for x in xs)
    return f'<div class="dodont"><div class="dd dd--no"><div class="dd__h">{ico("x")}{dont_title}</div><ul>{li(donts)}</ul></div><div class="dd dd--yes"><div class="dd__h">{ico("check")}{do_title}</div><ul>{li(dos)}</ul></div></div>'

def defs(items, plain=False):
    """items: [(question_or_label, answer)]. plain=True drops the question badge (label + explanation)."""
    return '<div class="defs wrap' + (' defs--plain' if plain else '') + '">' + ''.join(f'<div class="def"><div class="def__q">{q}</div><div class="def__a">{a}</div></div>' for q, a in items) + '</div>'

def glossary(items):
    return '<div class="gloss stagger">' + ''.join(f'<div class="gterm" data-n="{i+1:02d}" style="--accent:{cv(i)}"><div class="gt">{t}</div><div class="gd">{d}</div></div>' for i, (t, d) in enumerate(items)) + '</div>'

def cards3(items, why=None):
    """items: [(kicker, title, text)]; why: (why, impact, example|trap, trap?)"""
    h = '<div class="grid-3 stagger">' + ''.join(f'<div class="card"><div class="k k--accent">{k}</div><h3>{t}</h3><p class="longp">{p}</p></div>' for k, t, p in items) + '</div>'
    if why:
        w1, w2, w3, red = why
        h += f'<div class="why"><div class="why__i why__i--blue"><b>{w1[0]}</b>{w1[1]}</div><div class="why__i why__i--green"><b>{w2[0]}</b>{w2[1]}</div><div class="why__i why__i--{"red" if red else "yellow"}"><b>{w3[0]}</b>{w3[1]}</div></div>'
    return h

def chips(items, cols=3):
    return f'<div class="chips stagger" style="margin-top:16px;grid-template-columns:repeat({cols},1fr);">' + ''.join(f'<div class="chip"><b>{k}</b><span>{t}</span></div>' for k, t in items) + '</div>'

def compare(left, right):
    """left/right: (kicker, text_html, color)"""
    (lk, lt, lc), (rk, rt, rc) = left, right
    return f'<div class="cmp stagger" style="margin-top:22px;"><div class="card--bar" style="--accent:{cvn(lc)};"><div class="k" style="color:var(--ps-text-{lc});">{lk}</div><p>{lt}</p></div><div class="card--bar" style="--accent:{cvn(rc)};"><div class="k" style="color:var(--ps-text-{rc});">{rk}</div><p>{rt}</p></div></div>'

def watch(label, text):
    return f'<div class="watch" style="margin-top:14px;max-width:1280px;"><b>{label}</b><span>{text}</span></div>'

# ---------- tables ----------
def table(headers, rows, widths=None, cls='dt stagger'):
    th = ''.join('<th' + (' style="width:' + str(w) + '"' if widths else '') + '>' + h + '</th>' for h, w in zip(headers, widths or [None] * len(headers)))
    tr = ''.join('<tr>' + ''.join(f'<td>{c}</td>' for c in r) + '</tr>' for r in rows)
    return f'<table class="{cls}"><thead><tr>{th}</tr></thead><tbody>{tr}</tbody></table>'

def yes(): return '<span class="yes">✓</span>'
def no(): return '<span class="no">✕</span>'
def pill(text, kind='gray'): return f'<span class="pill pill--{kind}">{text}</span>'
def bar_cell(pct, color='blue', text=''): return f'<span class="bar" style="width:{pct * 1.4:.0f}px;--c:{cvn(color)}"></span>{text}'
def heat_cell(val, level):
    """level 0..4 -> yellow/green/red intensity"""
    cols = ['color-mix(in srgb, var(--ps-color-ms-green-500) 22%, transparent)', 'color-mix(in srgb, var(--ps-color-ms-green-500) 55%, transparent)', 'color-mix(in srgb, var(--ps-color-ms-yellow-500) 70%, transparent)', 'color-mix(in srgb, var(--ps-color-ms-red-500) 55%, transparent)', 'var(--ps-color-ms-red-500)']
    return f'<span class="hm" style="background:{cols[level]}">{val}</span>'

def tiers(items, hi=1):
    """items: [(name, price, per, [(feature, ok)], color)]"""
    out = []
    for i, (n, p, per, feats, c) in enumerate(items):
        li = ''.join(f'<li class="{"" if ok else "off"}">{f}</li>' for f, ok in feats)
        out.append(f'<div class="ptier{" ptier--hi" if i == hi else ""}" style="--c:{cvn(c)}"><div class="ptier__h"><div class="ptier__n">{n}</div><div class="ptier__p">{p}<small>{per}</small></div></div><ul>{li}</ul></div>')
    return '<div class="ptiers">' + ''.join(out) + '</div>'

def quadrant(xl, xr, yt, yb, dots):
    """dots: [(x%, y%, label, color)]"""
    d = ''.join(f'<div class="quad__d" style="left:{x}%;top:{100-y}%;--c:{cvn(c)};--i:{i}"><i></i><b>{l}</b></div>' for i, (x, y, l, c) in enumerate(dots))
    return f'<div class="quad"><span class="quad__l" style="left:14px;bottom:10px">{xl}</span><span class="quad__l" style="right:14px;bottom:10px">{xr}</span><span class="quad__l" style="left:14px;top:10px">{yt}</span><span class="quad__l" style="left:14px;top:52%">{yb}</span>{d}</div>'

# ---------- data ----------
def sparkline(values, color):
    n = len(values); mx = max(values) or 1
    pts = ' '.join(f'{i * 120 / (n - 1):.1f},{44 - v / mx * 40:.1f}' for i, v in enumerate(values))
    return f'<svg viewBox="0 0 120 44"><polyline points="{pts}" fill="none" stroke="{cvn(color)}" stroke-width="2.5" stroke-linejoin="round" pathLength="100" class="a-line"/><circle cx="120" cy="{44 - values[-1] / mx * 40:.1f}" r="4" fill="{cvn(color)}"/></svg>'

def stats(items):
    """items: [(kicker, value, delta_text, up(bool), values[], color)]"""
    return '<div class="stats">' + ''.join(f'<div class="stat" style="--c:{cvn(c)};--i:{i}"><div><div class="stat__k">{k}</div><div class="stat__v">{v}</div><div class="stat__d {"up" if up else "down"}">{d}</div></div>{sparkline(vals, c)}</div>' for i, (k, v, d, up, vals, c) in enumerate(items)) + '</div>'

def bars(items, marker=None):
    """items: [(label, pct, value_text, color)]"""
    return '<div class="pbars">' + ''.join(f'<div class="br" style="--c:{cvn(c)};--i:{i}"><div class="br__k">{k}</div><div class="br__t"><div class="br__f" style="--w:{p}%"></div>' + (f'<div class="br__m" style="--m:{marker}%"></div>' if marker else '') + f'</div><div class="br__v">{v}</div></div>' for i, (k, p, v, c) in enumerate(items)) + '</div>'

def ruler(items):
    """items: [(label, old, new, unit)]"""
    return '<div class="ruler">' + ''.join(f'<div class="rl" style="--i:{i}"><div class="rl__k">{k}</div><div class="rl__old">{o}</div><div class="rl__arrow">→</div><div class="rl__new">{n}<small>{u}</small></div></div>' for i, (k, o, n, u) in enumerate(items)) + '</div>'

def gantt(cols, rows):
    """cols: [labels]; rows: [(name, start_idx, len, color, text)].
    The phase text rides under the row name, never inside the bar: a one-column bar can never hold a caption."""
    h = f'<div class="gantt" style="--cols:{len(cols)}"><div class="gantt__h">' + ''.join(f'<span>{c}</span>' for c in cols) + '</div>'
    for i, (n, s, l, c, t) in enumerate(rows):
        wpct = l / len(cols) * 100; spct = s / len(cols) * 100
        bar = f'<div class="gantt__b" style="--s:{spct:.1f}%;--w:{wpct:.1f}%;--c:{cvn(c)};--i:{i}"></div>'
        key = f'<div class="gantt__k"><b>{n}</b>' + (f'<small style="color:var(--ps-text-{c})">{t}</small>' if t else '') + '</div>'
        h += f'{key}<div class="gantt__t">{bar}</div>'
    return h + '</div>'

# ---------- media ----------
def _media_image(src, cls, alt, asset_kind):
    markup = str(src).lstrip()
    if markup.startswith('<svg'):
        svg = ET.fromstring(markup)
        if svg.tag != '{http://www.w3.org/2000/svg}svg':
            raise ValueError('Native illustrations need an SVG namespace and a viewBox')
        if not svg.get('viewBox') or any(e.tag.rsplit('}', 1)[-1] == 'image' for e in svg.iter()):
            raise ValueError('Native illustrations need a viewBox and cannot embed reference images')
        ET.register_namespace('', 'http://www.w3.org/2000/svg')
        svg.set('class', ' '.join(filter(None, (svg.get('class'), cls))))
        svg.set('role', 'img')
        if not svg.get('aria-labelledby'):
            svg.set('aria-label', alt)
        svg.set('data-ps-asset-kind', 'native-illustration')
        return ET.tostring(svg, encoding='unicode')
    kind = asset_kind or 'reference'
    if kind not in {'reference', 'portrait', 'brand', 'photo', 'product-evidence'}:
        raise ValueError('Reference charts, diagrams, tables and code must be rebuilt as native SVG/HTML')
    return f'<img class="{cls}" src="{escape(str(src), quote=True)}" alt="{escape(alt, quote=True)}" data-ps-asset-kind="{kind}">'


def figure(img_src, caption, source, alt, *, asset_kind=None):
    caption, source, alt = required(caption, 'Figure caption'), required(source, 'Figure source'), required(alt, 'Figure alt text')
    return f'<div class="fig">{_media_image(img_src, "fig__img", alt, asset_kind)}<div><div class="fig__cap">{caption}</div><div class="fig__src">{source}</div></div></div>'

def figure_wide(img_src, caption, source, alt, *, asset_kind=None):
    """Native illustration or explicitly classified photographic/product evidence, with source."""
    caption, source, alt = required(caption, 'Wide figure caption'), required(source, 'Wide figure source'), required(alt, 'Wide figure alt text')
    return f'<div class="figw">{_media_image(img_src, "figw__img", alt, asset_kind)}<div class="figw__row"><div class="figw__cap">{caption}</div><div class="figw__src">{source}</div></div></div>'

def statement_photo(text_html, sub_html, img_src, source, alt, round_img=False, photo_left=False, *, asset_kind=None):
    """A narrative beat: one big sentence (one <span class="acc"> accent) beside a photo; source line under the text."""
    source, alt = required(source, 'Statement image source'), required(alt, 'Statement image alt text')
    img = _media_image(img_src, f'stmt__img{" stmt__img--round" if round_img else ""}', alt, asset_kind)
    txt = f'<div><div class="stmt__t">{text_html}</div>' + (f'<div class="stmt__s">{sub_html}</div>' if sub_html else '') + f'<div class="stmt__src">{source}</div></div>'
    return '<div class="stmt">' + (img + txt if photo_left else txt + img) + '</div>'

def image_compare(before_src, after_src, before_label, after_label, caption, source, before_alt, after_alt, *, asset_kind=None):
    """Two equally framed images with explicit labels, one caption, and one source."""
    caption = required(caption, 'Image comparison caption')
    source = required(source, 'Image comparison source')
    before_alt = required(before_alt, 'Before image alt text')
    after_alt = required(after_alt, 'After image alt text')
    return (
        '<figure class="imgcmp"><div class="imgcmp__grid">'
        f'<div class="imgcmp__item">{_media_image(before_src, "imgcmp__img", before_alt, asset_kind)}<span class="imgcmp__label imgcmp__label--before">{before_label}</span></div>'
        f'<div class="imgcmp__item">{_media_image(after_src, "imgcmp__img", after_alt, asset_kind)}<span class="imgcmp__label imgcmp__label--after">{after_label}</span></div>'
        f'</div><figcaption class="imgcmp__foot"><span>{caption}</span><span class="fig__src">{source}</span></figcaption></figure>'
    )

def video(src, poster, caption, source, alt, transcript='', track_src='', track_label='Captions'):
    caption = required(caption, 'Video caption')
    source = required(source, 'Video source')
    poster = required(poster, 'Video poster')
    alt = required(alt, 'Video accessible name')
    if not str(transcript).strip() and not str(track_src).strip():
        raise ValueError('Video requires a captions track or a transcript reference.')
    track = f'<track kind="captions" src="{escape(str(track_src), quote=True)}" label="{escape(str(track_label), quote=True)}" default>' if track_src else ''
    transcript_attr = f' data-transcript="{escape(str(transcript), quote=True)}"' if transcript else ''
    return (
        '<div class="cols2 cols2--wide"><div class="vid">'
        f'<video controls playsinline preload="metadata" poster="{escape(poster, quote=True)}" src="{escape(str(src), quote=True)}" aria-label="{escape(alt, quote=True)}"{transcript_attr}>{track}</video>'
        f'</div><div><div class="fig__cap">{caption}</div><div class="fig__src">{source}</div></div></div>'
    )

def shapes(items):
    """items: [(kind, x, y, w, h, color, opacity, float)] kind: c r t blob ring"""
    out = []
    for i, (k, x, y, w, h, c, o, fl) in enumerate(items):
        st = f'left:{x}px;top:{y}px;width:{w}px;height:{h}px;--c:{cvn(c)};background:{cvn(c)};opacity:{o};--i:{i}'
        if k == 't': st = f'left:{x}px;top:{y}px;border-bottom:{h}px solid {cvn(c)};opacity:{o};--i:{i}'
        out.append(f'<div class="shp shp--{k}{" shp--float" if fl else ""}" style="{st}"></div>')
    return '<div class="shapes" aria-hidden="true">' + ''.join(out) + '</div>'

def icongrid(ids):
    def one(i):
        fa = '' if i.startswith('i-') else ' fill="currentColor"'
        return '<div class="ig"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"' + fa + '><use href="#' + i + '"/></svg><span>' + i + '</span></div>'
    return '<div class="icongrid">' + ''.join(one(i) for i in ids) + '</div>'

def markdown(src):
    return f'<script type="text/markdown" class="mdsrc">{src}</script><div class="md"></div>'

def diff(file, lines):
    """lines: [(kind, text)] kind: ' ', '+', '-'"""
    n = 0; out = []
    for k, t in lines:
        n += 1; cls = {'+': 'l add', '-': 'l del'}.get(k, 'l')
        out.append(f'<span class="{cls}" data-n="{n}">{t.replace("<", "&lt;")}</span>')
    return f'<div class="diff"><div class="diff__h"><span>{file}</span><span style="color:var(--ps-text-green)">+{sum(1 for k, _ in lines if k == "+")}</span><span style="color:var(--ps-text-red)">-{sum(1 for k, _ in lines if k == "-")}</span></div><pre>{"".join(out)}</pre></div>'

def codewin(file, lines, hl=()):
    out = ''.join(f'<span class="l{" hl" if i + 1 in hl else ""}" data-n="{i+1}">{t}</span>' for i, t in enumerate(lines))
    return f'<div class="codewin"><div class="codewin__h">{ico("code")}<span>{file}</span></div><pre>{out}</pre></div>'

def tree(node, depth=0, *, expanded=False):
    """node: dict|list|scalar -> collapsible tree"""
    def render(k, v, open_=True):
        if isinstance(v, dict):
            return f'<details{" open" if open_ or expanded else ""}><summary><span class="k">{k}</span> {{ … }}</summary>' + ''.join(render(kk, vv, False) for kk, vv in v.items()) + '</details>'
        if isinstance(v, list):
            return f'<details{" open" if open_ or expanded else ""}><summary><span class="k">{k}</span> [ {len(v)} ]</summary>' + ''.join(render(f'[{i}]', vv, False) for i, vv in enumerate(v)) + '</details>'
        cls = 's' if isinstance(v, str) else ('b' if isinstance(v, bool) else 'n')
        vv = f'"{v}"' if isinstance(v, str) else str(v).lower()
        return f'<div><span class="k">{k}</span>: <span class="{cls}">{vv}</span></div>'
    return '<div class="tree">' + ''.join(render(k, v) for k, v in node.items()) + '</div>'

# ---------- interactives ----------
def quiz(question, options, correct, whys, panel_k, empty, okk, okv, badk, badv):
    """options: [text]; correct: index; whys: [text per option]"""
    ob = ''.join(f'<button class="ibtn" data-correct="{1 if i == correct else 0}" data-why="{whys[i]}" aria-pressed="false"><b>{chr(65+i)}</b>{o}</button>' for i, o in enumerate(options))
    return f'<div class="quiz"><div><div class="quiz__q">{question}</div><div class="quiz__opts">{ob}</div></div><div class="ipanel" aria-live="polite" data-okk="{okk}" data-okv="{okv}" data-badk="{badk}" data-badv="{badv}"><div class="ipanel__k">{panel_k}</div><div class="ipanel__empty">{empty}</div></div></div>'

def assessment(questions, levels, panel_k, empty, next_label, top_label, yes_t='yes', no_t='no'):
    """questions: [(text, next_step)]; levels: [(code, name)] length = len(questions)+1"""
    q = ''.join(f'<div class="aq" data-next="{nx}"><span>{t}</span><span class="seg"><button class="ibtn" data-v="y" aria-pressed="false">{yes_t}</button><button class="ibtn" data-v="n" aria-pressed="false">{no_t}</button></span></div>' for t, nx in questions)
    l = ''.join(f'<div data-name="{n}"><b>{c}</b>{n}</div>' for c, n in levels)
    return f'<div class="assess"><div class="assess__list">{q}</div><div><div class="ipanel" aria-live="polite" data-k="{panel_k}" data-next="{next_label}" data-top="{top_label}"><div class="ipanel__k">{panel_k}</div><div class="ipanel__empty">{empty}</div></div><div class="ladder">{l}</div></div></div>'

def calculator(inputs, formula, big_unit, big_label, extras=()):
    """inputs: [(id, label, min, max, value, unit)]; formula: JS over ids; extras: [(label, expr)]"""
    rows = ''.join(f'<div class="calc__row"><label for="{i}">{l}</label><input type="range" id="{i}" min="{mn}" max="{mx}" value="{v}" data-unit="{u}"><output for="{i}">{v}{u}</output></div>' for i, l, mn, mx, v, u in inputs)
    ex = ''.join(f'<div class="ipanel__t"><b data-expr="{e}"></b> {l}</div>' for l, e in extras)
    return f'<div class="calc" data-formula="{formula}"><div>{rows}</div><div class="ipanel" aria-live="polite"><div class="ipanel__k">{big_label}</div><div class="calc__big">0<small>{big_unit}</small></div>{ex}</div></div>'

def toggle(labels, panels):
    uid = f'toggle-{next(_UID)}'
    sw = ''.join(f'<button aria-pressed="{"true" if i == 0 else "false"}" aria-controls="{uid}-panel-{i}">{l}</button>' for i, l in enumerate(labels))
    ps = ''.join(f'<div id="{uid}-panel-{i}" class="toggle__p{" on" if i == 0 else ""}" aria-hidden="{"false" if i == 0 else "true"}">{p}</div>' for i, p in enumerate(panels))
    return f'<div class="toggle"><div><div class="toggle__sw" role="group">{sw}</div></div><div class="toggle__panels">{ps}</div></div>'

def tabs(items, initial=0, empty=''):
    """items: [(label, panel_html)]; initial=None keeps an exploratory slide neutral."""
    if not items or (initial is not None and not 0 <= initial < len(items)):
        raise ValueError('Tabs require items and a valid initial panel index')
    uid = f'tabs-{next(_UID)}'
    b = ''.join(f'<button id="{uid}-tab-{i}" role="tab" aria-controls="{uid}-panel-{i}" aria-selected="{"true" if i == initial else "false"}" tabindex="{0 if i == (initial if initial is not None else 0) else -1}">{l}</button>' for i, (l, _) in enumerate(items))
    p = ''.join(f'<div id="{uid}-panel-{i}" role="tabpanel" aria-labelledby="{uid}-tab-{i}" aria-hidden="{"false" if i == initial else "true"}" class="tabs__p{" on" if i == initial else ""}">{h}</div>' for i, (_, h) in enumerate(items))
    neutral = f'<div class="ipanel tabs__empty" aria-live="polite"{"" if initial is None else " hidden"}>{empty}</div>' if empty else ''
    return f'<div class="tabs"><div class="tabs__bar" role="tablist">{b}</div>{neutral}{p}</div>'

def hotspots(base_html, points):
    """points: [(x%, y%, title, text, color)]"""
    uid = f'hot-{next(_UID)}'
    pts = ''.join(f'<button class="hot__pt" aria-label="{escape(str(t), quote=True)}" aria-controls="{uid}-tip-{i}" aria-expanded="false" style="left:{x}%;top:{y}%;--c:{cvn(c)}">{i+1}</button>' for i, (x, y, t, d, c) in enumerate(points))
    tips = ''.join(f'<div id="{uid}-tip-{i}" role="status" class="hot__tip{" hot__tip--up" if y > 55 else ""}" style="left:{min(max(x, 14), 86)}%;top:{y}%;--c:{cvn(c)}"><b>{t}</b>{d}</div>' for i, (x, y, t, d, c) in enumerate(points))
    return f'<div class="hot">{base_html}{pts}{tips}</div>'

def poll(options):
    return '<div class="poll">' + ''.join(f'<div class="poll__o" style="--c:{cv(i)}"><button class="ibtn">{o}</button><div class="poll__t"><div class="poll__f"></div></div><div class="poll__v" aria-live="polite"></div></div>' for i, o in enumerate(options)) + '</div>'

def chainsim(groups, stages, matrix, off_by_policy, verdict_words, state_words, empty_html, why_pool):
    """A decision simulator you can reconstruct: the call travels a visible chain of controls and the
    stage that stops it lights up, so the answer is never a bare word.
      groups:          [(kicker_html, key, [(value, option_html), ...])]  the pickers, left to right
      stages:          [(name_html, sub_html)]                            the chain, left to right
      matrix:          {'<t><c>': {'stop': n, 'v': 'allow|ask|deny', 'why': 'e11'}}
      off_by_policy:   {'<c>': [stage numbers this policy does not have]}
      verdict_words:   {'allow': html, 'ask': html, 'deny': html}         trilingual spans
      state_words:     {'pass': html, 'off': html, 'skip': html, 'run': html}
      why_pool:        {'e11': html, ...}                                 trilingual explanation spans
    """
    import json as _json
    ctl = ''.join(
        f'<div class="csim__g"><div class="csim__k">{k}</div><div class="csim__opts" data-k="{key}">'
        + ''.join(f'<button class="csim__o" data-v="{v}" aria-pressed="false">{o}</button>' for v, o in opts)
        + '</div></div>' for k, key, opts in groups)
    chain = []
    for i, (name, sub) in enumerate(stages):
        if i: chain.append('<span class="csim__ar" aria-hidden="true">→</span>')
        chain.append(f'<div class="csim__st"><b>{name}</b><small>{sub}</small><i class="csim__badge"></i></div>')
    pool = ''.join(f'<span data-fk="{k}">{v}</span>' for k, v in
                   list(why_pool.items())
                   + [('v_' + k, v) for k, v in verdict_words.items()]
                   + [('s_' + k, v) for k, v in state_words.items()]
                   + [('empty', empty_html)])
    data = _json.dumps({'m': matrix, 'off': off_by_policy}, separators=(',', ':'))
    return ('<div class="csim">'
            f'<div class="csim__ctl">{ctl}</div>'
            f'<div class="csim__chain">{"".join(chain)}</div>'
            '<div class="csim__out" aria-live="polite"><span class="csim__verdict">·</span><p class="csim__why"></p></div>'
            f'<script type="application/json" class="csim__data">{data}</script>'
            f'<div class="csim__pool" hidden>{pool}</div></div>')
