"""charts v3.0.0: inline SVG charts with CSS entrance animation. All use the .ch classes.
Palette: Microsoft 4 colors as series; ink for axes. Values are drawn as text, never guessed by eye."""
import math
C = {'red': 'var(--ps-color-ms-red-500)', 'yellow': 'var(--ps-color-ms-yellow-500)', 'blue': 'var(--ps-color-ms-blue-500)', 'green': 'var(--ps-color-ms-green-500)', 'ink': 'var(--ps-color-ink)', 'ink3': 'var(--ps-color-ink-3)'}
SER = ['blue', 'green', 'yellow', 'red']
def c(k): return C.get(k, k)
def ink(k): return f'var(--ps-text-{k})' if k in SER else c(k)

def svg(W, H, inner, kind='generic'): return f'<svg class="ch" data-chart-kind="{kind}" viewBox="0 0 {W} {H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="{kind.replace("-", " ")} chart">{inner}</svg>'

def hbar(items, W=1120, H=420, max_v=None, unit=''):
    """items: [(label, value, color)] horizontal bars, animated from the left."""
    mx = max_v or max(v for _, v, _ in items) * 1.1
    n = len(items); rowh = (H - 30) / n; bh = min(38, rowh * .62); out = []
    for i, (l, v, col) in enumerate(items):
        y = 10 + i * rowh + (rowh - bh) / 2; w = (W - 300) * v / mx
        out.append(f'<text class="lbl" x="220" y="{y+bh/2+5}" text-anchor="end">{l}</text>')
        out.append(f'<rect class="a-grow-x a-growx" x="240" y="{y}" width="{w:.1f}" height="{bh}" rx="{bh/2}" fill="{c(col)}" stroke="{ink(col)}" stroke-width="1.5" style="--d:{i*120}"/>')
        out.append(f'<text class="val halo a-in" x="{240+w+12:.1f}" y="{y+bh/2+5}" style="--d:{i*120+500}">{v}{unit}</text>')
    return svg(W, H, ''.join(out), 'hbar')

def columns(groups, series, W=1120, H=420, unit='', max_v=None):
    """groups: [label]; series: [(name, [values], color)] grouped columns with axis."""
    mx = max_v or max(v for _, vals, _ in series for v in vals) * 1.15
    left, bottom, top = 60, 60, 20; ph = H - bottom - top; gw = (W - left - 20) / len(groups); n = len(series); bw = min(46, gw * .7 / n); out = []
    for k in range(5):
        y = top + ph - ph * k / 4; out.append(f'<line class="grid" x1="{left}" y1="{y:.1f}" x2="{W-20}" y2="{y:.1f}"/><text class="ax" x="{left-10}" y="{y+4:.1f}" text-anchor="end">{mx*k/4:.0f}{unit}</text>')
    for gi, g in enumerate(groups):
        gx = left + gi * gw + gw / 2
        out.append(f'<text class="ax" x="{gx:.1f}" y="{H-bottom+22}" text-anchor="middle">{g}</text>')
        for si, (name, vals, col) in enumerate(series):
            h = ph * vals[gi] / mx; x = gx - (n * bw + (n - 1) * 6) / 2 + si * (bw + 6)
            out.append(f'<rect class="a-grow" x="{x:.1f}" y="{top+ph-h:.1f}" width="{bw}" height="{h:.1f}" rx="6" fill="{c(col)}" stroke="{ink(col)}" stroke-width="1.5" style="--d:{gi*140+si*60}"/>')
            out.append(f'<text class="val halo a-in" x="{x+bw/2:.1f}" y="{top+ph-h-8:.1f}" text-anchor="middle" style="--d:{gi*140+si*60+600};font-size:13px">{vals[gi]}{unit}</text>')
    lg = ''.join(f'<rect x="{left+i*170}" y="{H-14}" width="18" height="10" rx="3" fill="{c(col)}"/><text class="ax" x="{left+i*170+26}" y="{H-5}">{name}</text>' for i, (name, _, col) in enumerate(series))
    return svg(W, H, ''.join(out) + lg, 'columns')

def line(xlabels, series, W=1120, H=420, unit='', area=True, max_v=None):
    mx = max_v or max(v for _, vals, _ in series for v in vals) * 1.15
    left, bottom, top = 60, 50, 20; ph = H - bottom - top; pw = W - left - 80; n = len(xlabels); out = []
    # Place endpoint labels by their values, not series order, keeping adjacent labels apart.
    endpoints = sorted((top + ph - ph * values[-1] / mx - 8, i) for i, (_, values, _) in enumerate(series))
    end_y = {}
    previous = top - 6
    for desired, i in endpoints:
        end_y[i] = max(top + 12, desired, previous + 18)
        previous = end_y[i]
    ceiling = top + ph - 4
    for _, i in reversed(endpoints):
        end_y[i] = min(end_y[i], ceiling)
        ceiling = end_y[i] - 18
    for k in range(5):
        y = top + ph - ph * k / 4; out.append(f'<line class="grid" x1="{left}" y1="{y:.1f}" x2="{W-80}" y2="{y:.1f}"/><text class="ax" x="{left-10}" y="{y+4:.1f}" text-anchor="end">{mx*k/4:.0f}{unit}</text>')
    for i, xl in enumerate(xlabels): out.append(f'<text class="ax" x="{left+pw*i/(n-1):.1f}" y="{H-bottom+22}" text-anchor="middle">{xl}</text>')
    for si, (name, vals, col) in enumerate(series):
        pts = [(left + pw * i / (n - 1), top + ph - ph * v / mx) for i, v in enumerate(vals)]
        d = 'M' + ' L'.join(f'{x:.1f} {y:.1f}' for x, y in pts)
        if area: out.append(f'<path class="a-area" d="{d} L{pts[-1][0]:.1f} {top+ph} L{pts[0][0]:.1f} {top+ph} z" fill="{c(col)}" opacity=".12" style="--d:{si*300}"/>')
        out.append(f'<path class="a-line" d="{d}" fill="none" stroke="{ink(col)}" stroke-width="3" stroke-linejoin="round" pathLength="100" style="--d:{si*300}"/>')
        for i, (x, y) in enumerate(pts): out.append(f'<circle class="a-pop" cx="{x:.1f}" cy="{y:.1f}" r="5" fill="var(--ps-color-paper)" stroke="{ink(col)}" stroke-width="2.5" style="--d:{si*300+200+i*90}"/>')
        if abs(end_y[si] - (pts[-1][1] - 8)) > 8:
            out.append(f'<path class="a-in" d="M{pts[-1][0]+6:.1f} {pts[-1][1]:.1f} L{pts[-1][0]+10:.1f} {end_y[si]-4:.1f}" fill="none" stroke="{ink(col)}" stroke-width="1" style="--d:{si*300+1400}"/>')
        out.append(f'<text class="val halo a-in" x="{pts[-1][0]+10:.1f}" y="{end_y[si]:.1f}" style="--d:{si*300+1400};fill:{ink(col)}">{vals[-1]}{unit}</text>')
        out.append(f'<rect x="{left+si*180}" y="{H-14}" width="18" height="10" rx="3" fill="{c(col)}"/><text class="ax" x="{left+si*180+26}" y="{H-5}">{name}</text>')
    return svg(W, H, ''.join(out), 'line')

def donut(items, W=1120, H=420, center_v='', center_k=''):
    """items: [(label, value, color)]"""
    tot = sum(v for _, v, _ in items); cx, cy, r = 260, H / 2, 140; acc = 0; out = []
    for i, (l, v, col) in enumerate(items):
        pct = v / tot * 100
        out.append(f'<circle class="a-arc" cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="{c(col)}" stroke-width="44" pathLength="100" stroke-dasharray="{pct:.2f} 100" stroke-dashoffset="{-acc:.2f}" transform="rotate(-90 {cx} {cy})" style="--d:{i*250}"/>')
        y = 80 + i * 62
        out.append(f'<g class="a-in" style="--d:{i*250+400}"><rect x="520" y="{y-14}" width="22" height="22" rx="6" fill="{c(col)}"/><text class="lbl" x="556" y="{y+3}">{l}</text><text class="val" x="{W-40}" y="{y+3}" text-anchor="end" style="font-family:var(--ps-font-mono);font-size:22px">{v} <tspan class="ax" style="font-size:12px">· {pct:.0f}%</tspan></text><line class="grid" x1="520" y1="{y+24}" x2="{W-40}" y2="{y+24}"/></g>')
        acc += pct
    out.append(f'<text class="lbl" x="{cx}" y="{cy+2}" text-anchor="middle" style="font-family:var(--ps-font-mono);font-size:44px;font-weight:700">{center_v}</text><text class="ax" x="{cx}" y="{cy+30}" text-anchor="middle">{center_k}</text>')
    return svg(W, H, ''.join(out), 'donut')

def gauge(value, max_v, label, bands, W=1120, H=420, unit=''):
    """bands: [(from, to, color)] on a 180deg gauge."""
    cx, cy, r = W / 2, H - 110, 240; out = []
    def pt(v, rr): a = math.pi * (1 - v / max_v); return cx + rr * math.cos(a), cy - rr * math.sin(a)
    for f, t, col in bands:
        x0, y0 = pt(f, r); x1, y1 = pt(t, r)
        out.append(f'<path d="M{x0:.1f} {y0:.1f} A{r} {r} 0 0 1 {x1:.1f} {y1:.1f}" fill="none" stroke="{c(col)}" stroke-width="34" opacity=".85"/>')
    for k in range(0, 11):
        x0, y0 = pt(max_v * k / 10, r - 28); x1, y1 = pt(max_v * k / 10, r - 40)
        out.append(f'<line x1="{x0:.1f}" y1="{y0:.1f}" x2="{x1:.1f}" y2="{y1:.1f}" stroke="var(--ps-color-ink-3)" stroke-width="2"/>')
        if k % 5 == 0:
            x2, y2 = pt(max_v * k / 10, r - 64); out.append(f'<text class="ax halo" x="{x2:.1f}" y="{y2+4:.1f}" text-anchor="middle">{max_v*k/10:.0f}</text>')
    ang = 180 * value / max_v
    out.append(f'<g class="a-needle" style="transform:rotate({ang-90:.1f}deg)"><path d="M{cx-7} {cy} L{cx} {cy-r+50} L{cx+7} {cy} z" fill="var(--ps-color-ink)"/></g><circle cx="{cx}" cy="{cy}" r="14" fill="var(--ps-color-ink)"/>')
    out.append(f'<text class="lbl" x="{cx}" y="{cy+66}" text-anchor="middle" style="font-family:var(--ps-font-mono);font-size:44px;font-weight:700">{value}{unit}</text><text class="ax" x="{cx}" y="{cy+92}" text-anchor="middle">{label}</text>')
    return svg(W, H, ''.join(out), 'gauge')

def funnel(items, W=1120, H=420):
    """items: [(label, value, color)] decreasing widths."""
    mx = items[0][1]; n = len(items); rh = (H - 20) / n; out = []
    for i, (l, v, col) in enumerate(items):
        w = 700 * v / mx; x = 560 - w / 2; y = 10 + i * rh
        out.append(f'<rect class="a-in" x="{x:.1f}" y="{y}" width="{w:.1f}" height="{rh-10}" rx="8" fill="{c(col)}" style="--d:{i*180}"/>')
        out.append(f'<text class="lbl a-in" x="{x-16:.1f}" y="{y+rh/2}" text-anchor="end" style="--d:{i*180+200}">{l}</text>')
        out.append(f'<text class="val halo a-in" x="{x+w+16:.1f}" y="{y+rh/2}" style="--d:{i*180+300};font-family:var(--ps-font-mono);font-size:18px">{v}</text>')
        if i: out.append(f'<text class="ax a-in" x="{x+w+110:.1f}" y="{y+rh/2}" style="--d:{i*180+400}">{v/items[i-1][1]*100:.0f}% of previous</text>')
    return svg(W, H, ''.join(out), 'funnel')

def waterfall(items, W=1120, H=420, unit=''):
    """items: [(label, delta)] first is the start total; last computed as total."""
    left, bottom, top = 70, 60, 30; ph = H - bottom - top
    vals = []; run = 0
    for i, (l, d) in enumerate(items):
        if i == 0: run = d; vals.append((0, d, 'ink'))
        else: vals.append((run, run + d, 'green' if d >= 0 else 'red')); run += d
    vals.append((0, run, 'blue')); labels = [l for l, _ in items] + ['Total']
    mx = max(max(a, b) for a, b, _ in vals) * 1.15; n = len(vals); gw = (W - left - 20) / n; bw = gw * .6; out = []
    for k in range(5):
        y = top + ph - ph * k / 4; out.append(f'<line class="grid" x1="{left}" y1="{y:.1f}" x2="{W-20}" y2="{y:.1f}"/><text class="ax" x="{left-10}" y="{y+4:.1f}" text-anchor="end">{mx*k/4:.0f}{unit}</text>')
    for i, ((a, b, col), l) in enumerate(zip(vals, labels)):
        x = left + i * gw + (gw - bw) / 2; y0 = top + ph - ph * max(a, b) / mx; h = ph * abs(b - a) / mx
        out.append(f'<rect class="a-grow" x="{x:.1f}" y="{y0:.1f}" width="{bw:.1f}" height="{max(h,2):.1f}" rx="5" fill="{c(col)}" style="--d:{i*160}"/>')
        out.append(f'<text class="val halo a-in" x="{x+bw/2:.1f}" y="{y0-8:.1f}" text-anchor="middle" style="--d:{i*160+500};font-size:11.5px">{"+" if 0 < i < n-1 and b-a>=0 else ""}{b-a if 0 < i < n-1 else b}{unit}</text>')
        out.append(f'<text class="ax" x="{x+bw/2:.1f}" y="{H-bottom+22}" text-anchor="middle">{l}</text>')
        if i < n - 1: out.append(f'<line class="grid" x1="{x+bw:.1f}" y1="{top+ph-ph*b/mx:.1f}" x2="{x+gw:.1f}" y2="{top+ph-ph*b/mx:.1f}" stroke-dasharray="4 3"/>')
    return svg(W, H, ''.join(out), 'waterfall')

def stacked100(rows, series, W=1120, H=420):
    """rows: [label]; series: [(name, [values per row], color)] -> 100% stacked horizontal bars."""
    n = len(rows); rowh = (H - 40) / n; bh = min(40, rowh * .6); out = []
    for i, r in enumerate(rows):
        y = 10 + i * rowh + (rowh - bh) / 2; tot = sum(s[1][i] for s in series); x = 240
        out.append(f'<text class="lbl" x="220" y="{y+bh/2+5}" text-anchor="end">{r}</text>')
        for si, (name, vals, col) in enumerate(series):
            w = (W - 280) * vals[i] / tot
            out.append(f'<rect class="a-growx" x="{x:.1f}" y="{y}" width="{w:.1f}" height="{bh}" fill="{c(col)}" style="--d:{i*120+si*80}"/>')
            if w > 44: out.append(f'<text class="val halo a-in" x="{x+w/2:.1f}" y="{y+bh/2+4}" text-anchor="middle" style="--d:{i*120+si*80+500};fill:#1A1A1A;font-size:11.5px">{vals[i]/tot*100:.0f}%</text>')
            x += w
    lg = ''.join(f'<rect x="{240+i*170}" y="{H-16}" width="18" height="10" rx="3" fill="{c(col)}"/><text class="ax" x="{240+i*170+26}" y="{H-7}">{name}</text>' for i, (name, _, col) in enumerate(series))
    return svg(W, H, ''.join(out) + lg, 'stacked100')

def heatmap(rows, cols, values, W=1120, H=420, lo='green', hi='red'):
    """values[r][c] 0..1 -> color intensity between lo and hi."""
    left, top = 200, 40; cw = (W - left - 20) / len(cols); rh = (H - top - 10) / len(rows); out = []
    for j, cl in enumerate(cols): out.append(f'<text class="ax" x="{left+j*cw+cw/2:.1f}" y="{top-14}" text-anchor="middle">{cl}</text>')
    for i, r in enumerate(rows):
        out.append(f'<text class="lbl" x="{left-14}" y="{top+i*rh+rh/2+5:.1f}" text-anchor="end">{r}</text>')
        for j, cl in enumerate(cols):
            v = values[i][j]; col = f'color-mix(in srgb, {c(hi)} {v*100:.0f}%, {c(lo)})'
            out.append(f'<rect class="a-pop" x="{left+j*cw+3:.1f}" y="{top+i*rh+3:.1f}" width="{cw-6:.1f}" height="{rh-6:.1f}" rx="6" fill="{col}" opacity=".85" style="--d:{(i*len(cols)+j)*35}"/><text class="val halo a-in" x="{left+j*cw+cw/2:.1f}" y="{top+i*rh+rh/2+5:.1f}" text-anchor="middle" style="--d:{(i*len(cols)+j)*35+300};fill:#1A1A1A;font-size:12px">{v*100:.0f}</text>')
    return svg(W, H, ''.join(out), 'heatmap')

def radar(axes, series, W=1120, H=440, max_v=5):
    cx, cy, r = 400, H / 2, 165; n = len(axes); out = []
    def pt(i, v): a = -math.pi / 2 + 2 * math.pi * i / n; return cx + r * v / max_v * math.cos(a), cy + r * v / max_v * math.sin(a)
    for k in range(1, 6):
        out.append('<polygon points="' + ' '.join(f'{x:.1f},{y:.1f}' for x, y in (pt(i, max_v * k / 5) for i in range(n))) + '" fill="none" stroke="var(--ps-color-rule-2)"/>')
    for i, a in enumerate(axes):
        x, y = pt(i, max_v); out.append(f'<line x1="{cx}" y1="{cy}" x2="{x:.1f}" y2="{y:.1f}" stroke="var(--ps-color-rule-2)"/>')
        lx, ly = pt(i, max_v * 1.22); out.append(f'<text class="lbl" x="{lx:.1f}" y="{ly+4:.1f}" text-anchor="middle" style="font-size:12.5px">{a}</text>')
    for si, (name, vals, col) in enumerate(series):
        pts = ' '.join(f'{x:.1f},{y:.1f}' for x, y in (pt(i, v) for i, v in enumerate(vals)))
        out.append(f'<polygon class="a-pop" points="{pts}" fill="{c(col)}" fill-opacity=".18" stroke="{c(col)}" stroke-width="2.5" style="--d:{si*350}"/>')
        for i, v in enumerate(vals): x, y = pt(i, v); out.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="4.5" fill="{c(col)}"/>')
        y = 80 + si * 96
        pairs = [f'{a}: {v}' for a, v in zip(axes, vals)]
        lines = ''.join(f'<text class="ax" x="728" y="{y + 20 + j * 17}">' + ' · '.join(pairs[j * 3:(j + 1) * 3]) + '</text>' for j in range((len(pairs) + 2) // 3))
        out.append(f'<g class="a-in" style="--d:{si*350+300}"><rect x="700" y="{y-12}" width="18" height="12" rx="3" fill="{c(col)}"/><text class="lbl" x="728" y="{y}">{name}</text>{lines}</g>')
    return svg(W, H, ''.join(out), 'radar')

def treemap(items, W=1120, H=420):
    """items: [(label, value, color)] simple slice-and-dice treemap (two rows)."""
    tot = sum(v for _, v, _ in items); items = sorted(items, key=lambda t: -t[1]); out = []
    half = tot / 2; row1 = []; acc = 0
    for it in items:
        if acc < half: row1.append(it); acc += it[1]
        else: break
    row2 = items[len(row1):]
    def draw(row, y, h, d0):
        s = sum(v for _, v, _ in row); x = 0
        for i, (l, v, col) in enumerate(row):
            w = W * v / s
            out.append(f'<rect class="a-pop" x="{x+3:.1f}" y="{y+3}" width="{w-6:.1f}" height="{h-6}" rx="10" fill="{c(col)}" opacity=".88" style="--d:{d0+i*120}"/>')
            if w > 80: out.append(f'<text class="lbl a-in" x="{x+18:.1f}" y="{y+34}" style="--d:{d0+i*120+300};fill:#1A1A1A">{l}</text><text class="val halo a-in" x="{x+18:.1f}" y="{y+62}" style="--d:{d0+i*120+300};fill:#1A1A1A;font-family:var(--ps-font-mono);font-size:22px">{v/tot*100:.0f}%</text>')
            x += w
    h1 = H * (sum(v for _, v, _ in row1) / tot); draw(row1, 0, h1, 0); draw(row2, h1, H - h1, 400)
    return svg(W, H, ''.join(out), 'treemap')
