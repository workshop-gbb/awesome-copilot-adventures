"""audit_svg v3.0.0: spatial audit of every inline SVG (scenes .scn, diagrams .dg, charts .ch).
Per slide and locale it reports:
  OVERFLOW  a <text> that starts inside a rect and runs past its right or bottom edge
  OVERLAP   two <text> boxes that intersect
  CROSS     a stroked path, line, circle or polyline passing through a <text> box (unless a filled
            shape drawn later covers that point)
  EDGE      a text or shape outside the SVG viewBox
Usage: python audit_svg.py deck.html [locales] [slide numbers...]      exit 1 when anything is found."""
import asyncio, sys, os
from playwright.async_api import async_playwright
from browser_state import SETTLE_ENTRANCES
F = os.path.abspath(sys.argv[1]); LOCS = sys.argv[2].split(',') if len(sys.argv) > 2 else ['en', 'pt-BR', 'es']
ONLY = [int(x) for x in sys.argv[3:]]
JS = r"""() => {
  const out = []; const slide = document.querySelector('.slide[data-active=true]'); slide.classList.add('ps-measure');
  slide.querySelectorAll('svg.scn, svg.dg, svg.ch').forEach((svg, si) => {
    const vb = svg.viewBox.baseVal; const S = svg.getBoundingClientRect(); const sx = S.width / vb.width, sy = S.height / vb.height;
    const box = el => { const r = el.getBoundingClientRect(); return { l: (r.left - S.left) / sx + vb.x, t: (r.top - S.top) / sy + vb.y, r: (r.right - S.left) / sx + vb.x, b: (r.bottom - S.top) / sy + vb.y }; };
    const vis = el => { const cs = getComputedStyle(el); return cs.display !== 'none' && cs.visibility !== 'hidden'; };
    const texts = [...svg.querySelectorAll('text')].filter(t => vis(t) && t.textContent.trim()).map(t => ({ el: t, b: box(t), s: t.textContent.trim().slice(0, 34) }));
    const all = [...svg.querySelectorAll('*')];
    const filled = [...svg.querySelectorAll('rect, circle, ellipse, polygon, path')].filter(e => { if (e.classList.contains('dot') || e.querySelector('animateMotion')) return false; const f = getComputedStyle(e).fill; return vis(e) && f && f !== 'none' && !/rgba\(0, 0, 0, 0\)/.test(f) && !/transparent/.test(f) && (parseFloat(getComputedStyle(e).fillOpacity) || 1) > .05; }).map(e => ({ el: e, b: box(e), i: all.indexOf(e) }));
    const inside = (p, b, m) => p.x > b.l + m && p.x < b.r - m && p.y > b.t + m && p.y < b.b - m;
    // OVERFLOW: text inside a rect but crossing its right/bottom edge
    const rects = [...svg.querySelectorAll('rect')].filter(vis).map(e => ({ el: e, b: box(e) }));
    const floating = t => /cl--free|halo|zl|lanel|msg/.test(t.el.getAttribute('class') || '');   // labels that deliberately float over zones and lines
    texts.forEach(t => {
      if (floating(t)) { if (t.b.r > vb.x + vb.width + 1 || t.b.l < vb.x - 1 || t.b.b > vb.y + vb.height + 1) out.push(`EDGE '${t.s}' outside the canvas`); return; }
      const start = { x: t.b.l + 1, y: (t.b.t + t.b.b) / 2 };
      const mid = { x: (t.b.l + t.b.r) / 2, y: (t.b.t + t.b.b) / 2 };
      rects.forEach(r => {
        if (r.b.r - r.b.l < 40 || r.b.b - r.b.t < 14) return;
        const startIn = inside(start, r.b, 0), midIn = inside(mid, r.b, 0);
        if (!startIn && !midIn) return;
        // a centered label (pill, chip, badge) leaves its frame on BOTH sides: measure the widest escape
        const esc = Math.max(t.b.r - r.b.r, t.b.b - r.b.b, midIn ? r.b.l - t.b.l : 0, midIn ? r.b.t - t.b.t : 0);
        if (esc > 1.5) out.push(`OVERFLOW '${t.s}' past box by ${Math.round(esc)}px`);
      });
      if (t.b.r > vb.x + vb.width + 1 || t.b.l < vb.x - 1 || t.b.b > vb.y + vb.height + 1) out.push(`EDGE '${t.s}' outside the canvas`);
    });
    // OVERLAP: text vs text
    for (let i = 0; i < texts.length; i++) for (let j = i + 1; j < texts.length; j++) {
      const a = texts[i].b, b = texts[j].b; const ix = Math.min(a.r, b.r) - Math.max(a.l, b.l), iy = Math.min(a.b, b.b) - Math.max(a.t, b.t);
      if (ix > 3 && iy > 3) out.push(`OVERLAP '${texts[i].s}' x '${texts[j].s}' by ${Math.round(ix)}x${Math.round(iy)}px`);
    }
    // CROSS: stroked paths through text boxes
    [...svg.querySelectorAll('path, line, circle, polyline, polygon')].filter(e => vis(e) && !e.closest('marker') && !e.closest('defs')).forEach(p => {
      const cs = getComputedStyle(p); if (!cs.stroke || cs.stroke === 'none' || parseFloat(cs.strokeWidth) < 0.5) return;
      if (p.tagName === 'circle' && p.getAttribute('r') && +p.getAttribute('r') < 20) return;   // dots and node rings
      let L = 0; try { L = p.getTotalLength(); } catch (e) { return; } if (!L || L < 8) return;
      const ctm = p.getScreenCTM(); const pi = all.indexOf(p);
      const n = Math.min(160, Math.max(12, Math.round(L / 6)));
      for (let k = 0; k <= n; k++) {
        const pt = p.getPointAtLength(L * k / n); const sp = pt.matrixTransform(ctm);   // screen px
        const q = { x: (sp.x - S.left) / sx + vb.x, y: (sp.y - S.top) / sy + vb.y };   // back to viewBox units
        for (const t of texts) {
          if (t.el.closest('g') && p.closest('g') === t.el.closest('g') && p.tagName !== 'circle') continue;   // same group: a label with its own box/line
          if (/cl--free|halo/.test(t.el.getAttribute('class') || '')) continue;                                 // a paper halo hides the line behind the text
          if (inside(q, t.b, -1)) {
            const covered = filled.some(f => f.i > pi && inside(q, f.b, 0) && (f.el.tagName !== 'circle' || Math.hypot(q.x - (f.b.l + f.b.r) / 2, q.y - (f.b.t + f.b.b) / 2) < (f.b.r - f.b.l) / 2));
            if (!covered) { out.push(`CROSS ${p.tagName} through '${t.s}'`); break; }
          }
        }
      }
    });
    // TOUCH: a text partially overlapping a filled shape that is not its own container
    const isNode = f => /\bn\b|n--paper|n--dark|n--soft|ent|diamond|cyl/.test(f.el.getAttribute('class') || '');
    texts.forEach(t => filled.forEach(f => {
      // a zone or lane label may sit over its own zone by design, but never over a node card drawn inside it
      if (/zl|lanel/.test(t.el.getAttribute('class') || '')) { if (!isNode(f)) return; }
      else if (floating(t)) return;                                                       // a halo label may sit over a zone by design
      if (f.el.closest('g') && t.el.closest('g') === f.el.closest('g')) return;          // same group: the label of that shape
      const a = t.b, b = f.b; const ix = Math.min(a.r, b.r) - Math.max(a.l, b.l), iy = Math.min(a.b, b.b) - Math.max(a.t, b.t);
      if (ix <= 1.5 || iy <= 1.5) return;
      const contained = a.l >= b.l - 1 && a.r <= b.r + 1 && a.t >= b.t - 1 && a.b <= b.b + 1;
      if (!contained) out.push(`TOUCH '${t.s}' meets ${f.el.tagName} at ${Math.round(b.l)},${Math.round(b.t)} ${Math.round(b.r - b.l)}x${Math.round(b.b - b.t)}`);
    }));
    // DOT: animateMotion paths (invisible tracks of traveling dots) through text boxes, with the dot radius as margin
    svg.querySelectorAll('animateMotion[path]').forEach(am => {
      const host = am.parentElement; const rr = +(host.getAttribute('r') || host.getAttribute('height') || 6);
      const tmp = document.createElementNS('http://www.w3.org/2000/svg', 'path'); tmp.setAttribute('d', am.getAttribute('path')); tmp.setAttribute('fill', 'none'); svg.appendChild(tmp);
      let L = 0; try { L = tmp.getTotalLength(); } catch (e) {}
      const ctm = tmp.getScreenCTM(); const n = Math.min(200, Math.max(12, Math.round(L / 5))); const hi = all.indexOf(host);
      for (let k = 0; k <= n && L; k++) {
        const pt = tmp.getPointAtLength(L * k / n); const sp = pt.matrixTransform(ctm);
        const q = { x: (sp.x - S.left) / sx + vb.x, y: (sp.y - S.top) / sy + vb.y };
        const hit = texts.find(t => inside(q, t.b, -rr));
        if (!hit) continue;
        const covered = filled.some(f => f.i > hi && inside(q, f.b, -rr) && (f.el.tagName !== 'circle' || Math.hypot(q.x - (f.b.l + f.b.r) / 2, q.y - (f.b.t + f.b.b) / 2) < (f.b.r - f.b.l) / 2 - rr));
        if (!covered) { out.push(`DOT crosses '${hit.s}'`); break; }
      }
      tmp.remove();
    });
  });
  slide.classList.remove('ps-measure'); return [...new Set(out)];
}"""
async def main():
    bad = 0
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width': 1280, 'height': 720}, reduced_motion='no-preference')
        await pg.goto('file://' + F); await pg.wait_for_timeout(900)
        n = await pg.evaluate("document.querySelectorAll('.slide').length")
        idx = ONLY or list(range(1, n + 1))
        for loc in LOCS:
            await pg.evaluate(f"setLocale('{loc}')"); await pg.wait_for_timeout(300)
            print('=====', loc)
            for i in idx:
                await pg.evaluate(f'goToSlide({i - 1})'); await pg.wait_for_timeout(350)
                has = await pg.evaluate("!!document.querySelector('.slide[data-active=true] svg.scn, .slide[data-active=true] svg.dg, .slide[data-active=true] svg.ch')")
                if not has: continue
                await pg.evaluate(SETTLE_ENTRANCES)
                r = await pg.evaluate(JS)
                for x in r: print(f'slide {i:03d} {x}'); bad += len(r)
        await b.close()
    sys.exit(1 if bad else 0)
asyncio.run(main())
