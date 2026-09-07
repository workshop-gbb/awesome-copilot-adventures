"""diagram_kit v3.0.0: builds .dg diagrams (zones, nodes, connectors, legends) plus the
engineering vocabulary (decision, database, actor, sequence, state, entity, class, lane, note).
All output uses the deck's .dg CSS classes, so dark and light slides need no extra rule.

Usage:
    d = Diagram('dg7', 1120, 460)
    d.zone(0, 0, 300, 400, 'blue', 'Client')
    a = d.node(20, 60, 260, 64, 'Browser', 'React SPA', icon=('gh-mark', '#24292F'))
    d.conn([(280, 92), (340, 92)], 'acc', 'ar-acc')
    html = d.render()
Icons: ('id', fill) uses <use href="#id"> from any sprite in the deck (#ic-*, #gh-*, #gx-*, #br-*: filled;
#i-*: line icons, colored by CSS color). Node text never compresses: keep labels short and let
the node be wide; fitDiagramText() is the safety net, not the plan.
"""
from visual_layer import svg_icon

COLORS = {'red': 'var(--ps-color-ms-red-500)', 'yellow': 'var(--ps-color-ms-yellow-500)',
          'blue': 'var(--ps-color-ms-blue-500)', 'green': 'var(--ps-color-ms-green-500)',
          'ink': 'var(--ps-color-ink)', 'ink3': 'var(--ps-color-ink-3)', 'accent': 'var(--accent)'}
TEXT = {'red': 'var(--ps-text-red)', 'yellow': 'var(--ps-text-yellow)', 'blue': 'var(--ps-text-blue)', 'green': 'var(--ps-text-green)'}

def col(c): return COLORS.get(c, c)

def wire_ink(marker):
    if marker == 'ar-acc':
        return 'color-mix(in srgb, var(--accent) 60%, var(--ps-color-ink) 40%)'
    if marker == 'ar-ink':
        return COLORS['ink']
    return TEXT.get(marker.removeprefix('ar-'))

def plain(t):
    """The visible text of a label that may carry i18n markup, for width estimates."""
    import re
    return re.sub(r'<[^>]+>', '', str(t))

class Diagram:
    def __init__(self, id, W=1120, H=460, cls='dg', kind='generic'):
        self.id, self.W, self.H, self.cls = id, W, H, cls
        self.kind = ''.join(c if c.isalnum() else '-' for c in str(kind).lower()).strip('-')
        self.parts = []; self.dots = []; self.nodes = []; self.zones = []; self.d = 0
        self.markers = ('<defs>' + ''.join(
            f'<marker id="{id}-{k}" viewBox="0 0 12 12" refX="10.5" refY="6" markerWidth="7.5" markerHeight="7.5" orient="auto-start-reverse"><path d="M1.5 1.6 L10.6 6 L1.5 10.4 Q3.4 6 1.5 1.6 z" fill="{v}"/></marker>'
            for k, v in [('ar', COLORS['ink3']), ('ar-acc', wire_ink('ar-acc')), ('ar-red', TEXT['red']), ('ar-green', TEXT['green']), ('ar-blue', TEXT['blue']), ('ar-yellow', TEXT['yellow']), ('ar-ink', COLORS['ink'])])
            + f'<marker id="{id}-none" viewBox="0 0 10 10" markerWidth="1" markerHeight="1"></marker>'
            + f'<marker id="{id}-dot" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6"><circle cx="5" cy="5" r="4" fill="{COLORS["ink3"]}"/></marker>'
            + f'<marker id="{id}-crow" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="9" markerHeight="9" orient="auto-start-reverse"><path d="M1 1 L11 6 L1 11 M1 6 H11" fill="none" stroke="{COLORS["ink3"]}" stroke-width="1.4"/></marker>'
            + f'<marker id="{id}-tri" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="10" markerHeight="10" orient="auto-start-reverse"><path d="M1 1 L11 6 L1 11 z" fill="var(--ps-color-paper)" stroke="{COLORS["ink3"]}" stroke-width="1.4"/></marker>'
            + f'<marker id="{id}-dia" viewBox="0 0 14 12" refX="13" refY="6" markerWidth="12" markerHeight="10" orient="auto-start-reverse"><path d="M1 6 L7 1 L13 6 L7 11 z" fill="var(--ps-color-paper)" stroke="{COLORS["ink3"]}" stroke-width="1.4"/></marker>'
            + '</defs>')
    def nd(self): self.d += 1; return self.d
    def raw(self, s): self.parts.append(s)
    # ---------- containers ----------
    LABEL_BAND = 30   # a zone keeps its top 30px for its own label: no node may start inside it

    def zone(self, x, y, w, h, color, label, d=None):
        d = self.nd() if d is None else d
        self.zones.append((x, y, w, label))
        self.parts.append(f'<g class="dz" style="--d:{d}"><rect class="z" x="{x}" y="{y}" width="{w}" height="{h}" rx="12" style="--z:{col(color)}"/><text class="zl" x="{x+14}" y="{y+20}" style="fill:{TEXT.get(color, col(color))}">{label}</text></g>')
        return d
    def lane(self, x, y, w, h, color, label, vertical=False):
        d = self.nd()
        if vertical:
            self.parts.append(f'<g class="dz" style="--d:{d};--lc:{col(color)}"><rect class="lane" x="{x}" y="{y}" width="{w}" height="{h}" rx="10"/><text class="lanel" x="{x+w/2}" y="{y+20}" text-anchor="middle">{label}</text></g>')
        else:
            self.parts.append(f'<g class="dz" style="--d:{d};--lc:{col(color)}"><rect class="lane" x="{x}" y="{y}" width="{w}" height="{h}" rx="10"/><text class="lanel" x="{x+14}" y="{y+h/2+4}" transform="rotate(-90 {x+14} {y+h/2+4})" text-anchor="middle">{label}</text></g>')
        return d
    # ---------- nodes ----------
    def _icon(self, icon, x, y, size=26):
        if not icon: return ''
        iid, fill = icon if isinstance(icon, tuple) else (icon, None)
        return svg_icon(iid, x, y, size, fill)
    def node(self, x, y, w, h, label, sub='', icon=None, kind='paper', bar=None, color=None, d=None, sub2=''):
        d = self.nd() if d is None else d
        style = f' style="--nc:{col(color)}"' if color else ''
        cy = y + h / 2
        ic = self._icon(icon, x + 12, cy - 13) if icon else ''
        tx = x + (50 if icon else 16)
        barh = f'<rect x="{x}" y="{y+8}" width="4" height="{h-16}" rx="2" fill="{col(bar)}"/>' if bar else ''
        light = ' nl--light' if kind == 'dark' else ''; slight = ' ns--light' if kind == 'dark' else ''
        room = w - (tx - x) - 10
        for t, per in ((label, 8.4), (sub, 6.5), (sub2, 6.5)):
            if t and len(plain(t)) * per > room:
                import sys; print(f'WARN diagram {self.id}: "{plain(t)}" needs ~{int(len(plain(t)) * per)}px, node "{plain(label)}" gives {int(room)}px', file=sys.stderr)
        if sub and sub2:
            txt = (f'<text class="nl{light}" x="{tx}" y="{cy-9:.1f}">{label}</text><text class="ns{slight}" x="{tx}" y="{cy+7:.1f}">{sub}</text><text class="ns{slight}" x="{tx}" y="{cy+20:.1f}">{sub2}</text>')
        elif sub:
            txt = f'<text class="nl{light}" x="{tx}" y="{cy-3:.1f}">{label}</text><text class="ns{slight}" x="{tx}" y="{cy+13:.1f}">{sub}</text>'
        else:
            txt = f'<text class="nl{light}" x="{tx}" y="{cy+5:.1f}">{label}</text>'
        self.nodes.append((x, y, w, h, label))
        self.parts.append(f'<g class="dn" style="--d:{d}"><rect class="n n--{kind}" x="{x}" y="{y}" width="{w}" height="{h}" rx="8"{style}/>{barh}{ic}{txt}</g>')
        return d
    def pill(self, x, y, w, label, color, d=None):
        d = self.nd() if d is None else d
        self.parts.append(f'<g class="dn" style="--d:{d}"><rect x="{x}" y="{y}" width="{w}" height="24" rx="12" fill="color-mix(in srgb, {col(color)} 16%, transparent)" stroke="{col(color)}" stroke-width="1.2"/><text class="cl" x="{x+w/2}" y="{y+16}" text-anchor="middle" style="fill:{TEXT.get(color, col(color))};font-weight:700">{label}</text></g>')
        return d
    def diamond(self, cx, cy, w, h, label, sub=''):
        d = self.nd()
        self.parts.append(f'<g class="dn" style="--d:{d}"><path class="diamond" d="M{cx} {cy-h/2} L{cx+w/2} {cy} L{cx} {cy+h/2} L{cx-w/2} {cy} z"/><text class="nl" x="{cx}" y="{cy+(5 if not sub else -2)}" text-anchor="middle">{label}</text>' + (f'<text class="ns" x="{cx}" y="{cy+14}" text-anchor="middle">{sub}</text>' if sub else '') + '</g>')
        return d
    def cylinder(self, cx, cy, w, h, label, sub=''):
        d = self.nd(); ry = 10
        self.parts.append(f'<g class="dn" style="--d:{d}"><path class="cyl" d="M{cx-w/2} {cy-h/2+ry} v{h-2*ry} a{w/2} {ry} 0 0 0 {w} 0 v-{h-2*ry}"/><ellipse class="cyl" cx="{cx}" cy="{cy-h/2+ry}" rx="{w/2}" ry="{ry}"/><text class="nl" x="{cx}" y="{cy+(8 if not sub else 2)}" text-anchor="middle">{label}</text>' + (f'<text class="ns" x="{cx}" y="{cy+18}" text-anchor="middle">{sub}</text>' if sub else '') + '</g>')
        return d
    def actor(self, cx, cy, label):
        d = self.nd()
        self.parts.append(f'<g class="dn" style="--d:{d}"><circle class="actor" cx="{cx}" cy="{cy-26}" r="9"/><path class="actor" d="M{cx} {cy-17} v22 M{cx-16} {cy-8} h32 M{cx} {cy+5} l-13 20 M{cx} {cy+5} l13 20"/><text class="nl" x="{cx}" y="{cy+44}" text-anchor="middle">{label}</text></g>')
        return d
    def note(self, x, y, w, h, lines):
        d = self.nd()
        t = ''.join(f'<text class="ns" x="{x+12}" y="{y+22+i*15}" style="fill:var(--ps-color-ink-2)">{l}</text>' for i, l in enumerate(lines))
        self.parts.append(f'<g class="dn" style="--d:{d}"><path class="note" d="M{x} {y} h{w-12} l12 12 v{h-12} h-{w} z"/>{t}</g>')
        return d
    def entity(self, x, y, w, name, attrs):
        """ER entity: attrs = [('id', 'pk'), ('name', ''), ...]"""
        d = self.nd(); rh = 20; h = 32 + rh * len(attrs)
        rows = ''.join(f'<text class="attr{" attr--pk" if k else ""}" x="{x+12}" y="{y+32+rh*i+14}">{"🔑 " if k=="pk" else ("↗ " if k=="fk" else "")}{a}</text>' for i, (a, k) in enumerate(attrs))
        self.parts.append(f'<g class="dn" style="--d:{d}"><rect class="ent" x="{x}" y="{y}" width="{w}" height="{h}" rx="8"/><path class="enth" d="M{x} {y+8} a8 8 0 0 1 8 -8 h{w-16} a8 8 0 0 1 8 8 v24 h-{w} z"/><text class="entt" x="{x+12}" y="{y+21}">{name}</text>{rows}</g>')
        return h
    def classbox(self, x, y, w, name, fields, methods, stereo=''):
        d = self.nd(); rh = 18; h = 30 + (rh * len(fields) + 8) + (rh * len(methods) + 8)
        f = ''.join(f'<text class="attr" x="{x+12}" y="{y+30+8+rh*i+6}">{a}</text>' for i, a in enumerate(fields))
        m = ''.join(f'<text class="attr" x="{x+12}" y="{y+30+8+rh*len(fields)+8+rh*i+6}">{a}</text>' for i, a in enumerate(methods))
        st = f'<text class="tag" x="{x+w/2}" y="{y-6}" text-anchor="middle">«{stereo}»</text>' if stereo else ''
        self.parts.append(f'<g class="dn" style="--d:{d}"><rect class="ent" x="{x}" y="{y}" width="{w}" height="{h}" rx="6"/><path class="enth" d="M{x} {y+6} a6 6 0 0 1 6 -6 h{w-12} a6 6 0 0 1 6 6 v24 h-{w} z"/><text class="entt" x="{x+w/2}" y="{y+20}" text-anchor="middle">{name}</text><line x1="{x}" y1="{y+30+8+rh*len(fields)+4}" x2="{x+w}" y2="{y+30+8+rh*len(fields)+4}" stroke="var(--ps-color-rule-2)"/>{f}{m}{st}</g>')
        return h
    def state(self, cx, cy, w, label, sub='', kind='paper'):
        d = self.nd(); h = 46 if not sub else 58
        light = ' nl--light' if kind == 'dark' else ''
        t = f'<text class="nl{light}" x="{cx}" y="{cy+5 if not sub else cy-2}" text-anchor="middle">{label}</text>' + (f'<text class="ns" x="{cx}" y="{cy+15}" text-anchor="middle">{sub}</text>' if sub else '')
        self.parts.append(f'<g class="dn" style="--d:{d}"><rect class="n n--{kind}" x="{cx-w/2}" y="{cy-h/2}" width="{w}" height="{h}" rx="{h/2}"/>{t}</g>')
        return d
    def startstop(self, cx, cy, end=False):
        d = self.nd()
        self.parts.append(f'<g class="dn" style="--d:{d}"><circle cx="{cx}" cy="{cy}" r="{12 if end else 10}" fill="{"none" if end else COLORS["ink"]}" stroke="{COLORS["ink"]}" stroke-width="2"/>' + (f'<circle cx="{cx}" cy="{cy}" r="7" fill="{COLORS["ink"]}"/>' if end else '') + '</g>')
        return d
    # ---------- sequence ----------
    def lifeline(self, x, y0, y1, label, icon=None):
        """Header box grows with the label; with an icon the label starts after it (never under it)."""
        d = self.nd(); w = max(140, int(len(plain(label)) * 8.6) + (58 if icon else 28)); left = x - w / 2
        ic = self._icon(icon, left + 10, y0 + 7) if icon else ''
        tx, anchor = (left + 44, 'start') if icon else (x, 'middle')
        self.parts.append(f'<g class="dn" style="--d:{d}"><rect class="n n--paper" x="{left}" y="{y0}" width="{w}" height="40" rx="8"/>{ic}<text class="nl" x="{tx}" y="{y0+25}" text-anchor="{anchor}">{label}</text><line class="life" x1="{x}" y1="{y0+40}" x2="{x}" y2="{y1}"/></g>')
        return d
    def activation(self, x, y0, y1):
        self.parts.append(f'<rect class="act" x="{x-6}" y="{y0}" width="12" height="{y1-y0}" rx="2"/>')
    def message(self, x0, x1, y, label, kind='thin', marker='ar', dashed=False):
        """A return message is dashed: `dashed=True` switches to the .c--dashed family, which is drawn
        rather than animated, because the draw animation owns stroke-dasharray."""
        d = self.nd()
        if dashed: kind = 'dashed'
        pl = '' if kind in ('dashed', 'never', 'out', 'gov') else ' pathLength="100"'
        self.parts.append(f'<path class="c c--{kind}" d="M{x0} {y} L{x1} {y}"{pl} style="--d:{d}" marker-end="url(#{self.id}-{marker})"/><g class="dn" style="--d:{d}"><text class="msg cl--free" x="{(x0+x1)/2}" y="{y-7}" text-anchor="middle">{label}</text></g>')
        return d
    def selfmsg(self, x, y, label):
        d = self.nd()
        self.parts.append(f'<path class="c c--thin" d="M{x+6} {y} h40 v26 h-40" style="--d:{d}" marker-end="url(#{self.id}-ar)"/><g class="dn" style="--d:{d}"><text class="msg cl--free" x="{x+54}" y="{y+17}">{label}</text></g>')
        return d
    # ---------- connectors ----------
    @staticmethod
    def _rounded(pts, r=16):
        """An orthogonal polyline drawn with rounded corners: elegant elbows instead of hard 90 degree turns."""
        if len(pts) < 3: return 'M' + ' L'.join(f'{a} {b}' for a, b in pts)
        out = [f'M{pts[0][0]} {pts[0][1]}']
        for i in range(1, len(pts) - 1):
            (x0, y0), (x1, y1), (x2, y2) = pts[i - 1], pts[i], pts[i + 1]
            d1 = ((x1 - x0) ** 2 + (y1 - y0) ** 2) ** .5; d2 = ((x2 - x1) ** 2 + (y2 - y1) ** 2) ** .5
            rr = min(r, d1 / 2, d2 / 2)
            if rr < 2: out.append(f'L{x1} {y1}'); continue
            ax, ay = x1 - (x1 - x0) / d1 * rr, y1 - (y1 - y0) / d1 * rr
            bx, by = x1 + (x2 - x1) / d2 * rr, y1 + (y2 - y1) / d2 * rr
            out.append(f'L{ax:.1f} {ay:.1f} Q{x1} {y1} {bx:.1f} {by:.1f}')
        out.append(f'L{pts[-1][0]} {pts[-1][1]}')
        return ' '.join(out)

    def conn(self, pts, kind='thin', marker='ar', d=None, start=None, radius=16):
        d = self.d if d is None else d
        path = self._rounded(pts, radius)
        pl = '' if kind in ('dashed', 'never', 'out', 'gov') else ' pathLength="100"'
        ms = f' marker-start="url(#{self.id}-{start})"' if start else ''
        ink = wire_ink(marker); stroke = f';stroke:{ink}' if ink else ''
        self.parts.append(f'<path class="c c--{kind}" d="{path}"{pl} style="--d:{d}{stroke}" marker-end="url(#{self.id}-{marker})"{ms}/>')
    def curve(self, x0, y0, x1, y1, kind='thin', marker='ar', d=None, bend=0.5):
        d = self.d if d is None else d
        mx = x0 + (x1 - x0) * bend
        ink = wire_ink(marker); stroke = f';stroke:{ink}' if ink else ''
        self.parts.append(f'<path class="c c--{kind}" d="M{x0} {y0} C{mx} {y0} {mx} {y1} {x1} {y1}" pathLength="100" style="--d:{d}{stroke}" marker-end="url(#{self.id}-{marker})"/>')
    def label(self, x, y, text, anchor='middle', d=None, color=None):
        d = self.d if d is None else d
        st = f' style="fill:{TEXT.get(color, col(color))}"' if color else ''
        self.parts.append(f'<g class="dn" style="--d:{d}"><text class="cl cl--free" x="{x}" y="{y}" text-anchor="{anchor}"{st}>{text}</text></g>')
    def text(self, x, y, text, cls='cl', anchor='start', extra=''):
        self.parts.append(f'<g class="dn" style="--d:{self.d}"><text class="{cls}" x="{x}" y="{y}" text-anchor="{anchor}" {extra}>{text}</text></g>')
    def dot(self, pts, dur=5, begin=2.4, color='var(--accent)'):
        """A traveling dot on an invisible track. Rendered under the nodes, so it passes beneath them and never over a label."""
        path = self._rounded(pts, 16)
        self.dots.append(f'<circle class="dot" r="4" fill="{color}" opacity="0"><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.05;.95;1" dur="{dur}s" begin="{begin}s" repeatCount="indefinite"/><animateMotion dur="{dur}s" begin="{begin}s" repeatCount="indefinite" path="{path}"/></circle>')
    def legend(self, y, items, x0=0):
        """items: (kind, color, text) kind: sw | ln | dl"""
        d = self.nd(); x = x0; out = []
        for kind, c, text in items:
            c = col(c)
            if kind == 'sw': out.append(f'<rect x="{x}" y="{y-10}" width="22" height="12" rx="3" fill="{c}"/>')
            elif kind == 'ln': out.append(f'<path d="M{x} {y-4} h22" stroke="{c}" stroke-width="2"/>')
            else: out.append(f'<path d="M{x} {y-4} h22" stroke="{c}" stroke-width="2" stroke-dasharray="5 4"/>')
            out.append(f'<text x="{x+30}" y="{y}">{text}</text>')
            x += 30 + int(len(plain(text)) * 7.2) + 34
        self.parts.append(f'<g class="lg dn" style="--d:{d}">{"".join(out)}</g>')
    def _check_label_bands(self):
        """A zone label owns the top band of its zone. A node that starts inside it collides with the
        label in the longer languages, which is exactly the defect the eye catches first."""
        import sys
        for zx, zy, zw, zlabel in self.zones:
            lw = 20 + len(plain(zlabel)) * 7.4
            for nx, ny, nw, nh, nlabel in self.nodes:
                if ny < zy + self.LABEL_BAND and ny + nh > zy and nx < zx + lw and nx + nw > zx:
                    print(f'WARN diagram {self.id}: node "{plain(nlabel)}" starts inside the label band of zone '
                          f'"{plain(zlabel)}" (node y={ny}, band {zy}..{zy + self.LABEL_BAND}). Move the node down '
                          f'or the zone up.', file=sys.stderr)

    def render(self):
        self._check_label_bands()
        zones = [p for p in self.parts if p.startswith('<g class="dz"')]; rest = [p for p in self.parts if not p.startswith('<g class="dz"')]
        return f'<svg class="{self.cls}" data-diagram-kind="{self.kind}" viewBox="0 0 {self.W} {self.H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="{self.kind.replace("-", " ")} diagram">{self.markers}{"".join(zones)}{"".join(self.dots)}{"".join(rest)}</svg>'
