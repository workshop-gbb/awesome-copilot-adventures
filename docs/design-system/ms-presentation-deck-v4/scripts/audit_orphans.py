import asyncio, sys
from playwright.async_api import async_playwright
JS = """(minRatio) => {
  const out = [];
  const slide = document.querySelector('.slide[data-active="true"]');
  const sel = '.title, .subtitle, .section-title, .caption, .mock-cap, .eyebrow, p, .ba__b, .hl__d, .hl__w span, .cva__b, .cva__t, .oneline__t, .judge__t, .calc__read, .who__quote, .who__bio, .story-chip__t, .list-numbered__text, .logp__fix, .rul__tier p, .budget__c span, .dash__tile span, .agenda-list .list-numbered__text';
  slide.querySelectorAll(sel).forEach(el => {
    if (!el.offsetParent && getComputedStyle(el).position !== 'fixed') return;
    if (el.closest('svg')) return;
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const rects = [];
    let n; while ((n = walker.nextNode())) {
      const txt = n.textContent; let m; const re = /\\S+/g;
      while ((m = re.exec(txt))) { const r = document.createRange(); r.setStart(n, m.index); r.setEnd(n, m.index + m[0].length); const b = r.getBoundingClientRect(); if (b.width) rects.push({t: Math.round(b.top), l: b.left, r: b.right, w: m[0]}); }
    }
    if (!rects.length) return;
    const lines = []; rects.forEach(x => { const L = lines.find(l => Math.abs(l.t - x.t) < 6); if (L) { L.r = Math.max(L.r, x.r); L.l = Math.min(L.l, x.l); L.words++; } else lines.push({t: x.t, l: x.l, r: x.r, words: 1}); });
    if (lines.length < 2) return;
    const last = lines[lines.length - 1]; const elw = el.getBoundingClientRect().width;
    const ratio = (last.r - last.l) / elw;
    if (ratio < minRatio || last.words <= 2) out.push({cls: el.className.toString().slice(0, 40), tag: el.tagName, lines: lines.length, lastWords: last.words, ratio: +ratio.toFixed(2), text: el.textContent.trim().slice(0, 70)});
  });
  return out;
}"""
async def main(locale, only):
    async with async_playwright() as p:
        br = await p.chromium.launch(); pg = await (await br.new_context(viewport={'width': 1280, 'height': 720})).new_page()
        await pg.goto('file://' + __import__('os').environ.get('DECK', '/mnt/user-data/outputs/deck.html')); await pg.wait_for_timeout(700)
        await pg.evaluate(f"setLocale('{locale}')"); n = await pg.evaluate("document.querySelectorAll('.slide').length")
        for i in range(n):
            if only and (i + 1) not in only: continue
            await pg.evaluate(f"goToSlide({i})"); await pg.wait_for_timeout(900)
            res = await pg.evaluate(JS, 0.3)
            for r in res: print(f"{i+1:02d} {r['tag']}.{r['cls']} lines={r['lines']} lastWords={r['lastWords']} ratio={r['ratio']} | {r['text']}")
        await br.close()
loc = sys.argv[1] if len(sys.argv) > 1 else 'pt-BR'
only = [int(x) for x in sys.argv[2].split(',')] if len(sys.argv) > 2 else None
asyncio.run(main(loc, only))
