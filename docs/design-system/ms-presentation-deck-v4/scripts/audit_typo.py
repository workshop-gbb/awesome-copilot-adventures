"""Typography audit: for every slide and locale, report titles/subtitles with more than N lines,
single-word last lines (orphans), or a last line ending with a dangling function word."""
import asyncio, sys, os, json
from playwright.async_api import async_playwright
from browser_state import SETTLE_ENTRANCES
from typo import is_function_word
F = sys.argv[1]; LOCS = sys.argv[2].split(',') if len(sys.argv) > 2 else ['pt-BR', 'es', 'en']
JS = r"""() => {
  const s = document.querySelector('.slide[data-active=true]'); s.classList.add('ps-measure');
  const out = [];
  s.querySelectorAll('.section-title, .title, .subtitle').forEach(el => {
    if (el.closest('.cover2')) return;
    const words = [];
    const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let n;
    while ((n = w.nextNode())) {
      const t = n.nodeValue; const re = /\S+/g; let m;
      while ((m = re.exec(t))) { const r = document.createRange(); r.setStart(n, m.index); r.setEnd(n, m.index + m[0].length); const b = r.getBoundingClientRect(); if (b.width) words.push([Math.round(b.top), m[0]]); }
    }
    if (!words.length) return;
    const lines = []; let cur = null;
    words.forEach(([top, wd]) => { if (cur === null || Math.abs(top - cur) > 4) { lines.push([]); cur = top; } lines[lines.length - 1].push(wd); });
    const fs = getComputedStyle(el).fontSize;
    out.push({ cls: el.className, divider: s.dataset.psArchetype === 'divider' || !!s.querySelector('.section-number,.dvd'), fs, lines: lines.length, last: lines[lines.length - 1].join(' '), ends: lines.slice(0, -1).map(l => l[l.length - 1]), first: lines[0].slice(0, 6).join(' ') });
  });
  s.classList.remove('ps-measure'); return out;
}"""
async def main():
    failures = 0
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width': 1280, 'height': 720}, reduced_motion='no-preference')
        await pg.goto('file://' + os.path.abspath(F)); await pg.wait_for_timeout(800)
        n = await pg.evaluate("document.querySelectorAll('.slide').length")
        for loc in LOCS:
            await pg.evaluate(f"setLocale('{loc}')"); await pg.wait_for_timeout(300)
            print('=====', loc)
            for i in range(n):
                await pg.evaluate(f'goToSlide({i})'); await pg.wait_for_timeout(350)
                await pg.evaluate(SETTLE_ENTRANCES)
                for r in await pg.evaluate(JS):
                    flags = []
                    if r['lines'] > 2: flags.append('LINES>2')
                    if r['lines'] > 1 and len(r['last'].split()) == 1: flags.append('ORPHAN')
                    if r['divider'] and r['lines'] > 1 and r['cls'].startswith('section-title'): flags.append('DIVIDER 2 LINES')
                    if r['lines'] > 1 and any(is_function_word(e) for e in r['ends']): flags.append('DANGLING ' + ','.join(r['ends']))
                    if flags:
                        failures += 1
                        print(f"slide {i+1:02d} {r['cls'][:22]:22} {r['fs']:>7} lines={r['lines']} last='{r['last'][:40]}' {' '.join(flags)}")
        await b.close()
    sys.exit(1 if failures else 0)
asyncio.run(main())
