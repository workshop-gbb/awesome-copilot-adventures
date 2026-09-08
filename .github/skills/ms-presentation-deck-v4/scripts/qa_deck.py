"""qa_deck v3.0.0: overflow and error gate for every slide in the three locales.
Usage: python qa_deck.py deck.html [en,pt-BR,es] [--slides 1 2 3]
Fails a slide on scrollHeight > 721, on any element wider than its box (code, terminals and mocks
with internal scroll excluded), and on any box crossing the right or bottom edge of the stage.
Measures with animations off (.ps-measure, pseudo-elements included). Exit code 1 when anything is bad."""
import argparse, asyncio, sys, os
from playwright.async_api import async_playwright
from browser_state import SETTLE_ENTRANCES
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("deck")
parser.add_argument("locales", nargs="?", default="en,pt-BR,es")
parser.add_argument("--slides", type=int, nargs="+", help="One-based slides for a targeted regression check")
args = parser.parse_args()
F = os.path.abspath(args.deck); LOCS = args.locales.split(",")
CHECK = r"""()=>{const s=document.querySelector('.slide[data-active=true]'); s.classList.add('ps-measure');
  const R=s.getBoundingClientRect(); let bad=null; const k=s.dataset.psk||'-';
  if(s.classList.contains('slide--dark') && getComputedStyle(s).backgroundColor!=='rgb(0, 0, 0)')
    bad='dark canvas '+getComputedStyle(s).backgroundColor+'; expected #000000';
  else if(s.classList.contains('slide--dark') && [document.body,document.documentElement].some(e=>getComputedStyle(e).backgroundColor!=='rgb(0, 0, 0)'))
    bad='dark canvas seam: the outer canvas must also be #000000';
  else if(s.scrollHeight>721) bad='sh '+s.scrollHeight;
  for(const e of s.querySelectorAll('*')){ if(bad) break; if(e.closest('.code-block, .gterm, pre, .kbd-hint, .deco, .term, .vsc, .chatwin, .portal, .ghpr, .browser, .phone, .gantt__t, [data-nofit]')) continue;
    const r=e.getBoundingClientRect(); if(!r.width) continue;
    const cs=getComputedStyle(e);
    if(e.scrollWidth>e.clientWidth+1 && cs.overflowX!=='auto' && !e.closest('svg')) bad='sw '+e.className+' '+(e.textContent||'').trim().slice(0,30);
    // CLIP: a framed box (border or paper background) that hides part of its own content
    else if(!e.closest('svg') && cs.overflow!=='visible' && e.scrollHeight>e.clientHeight+2 && cs.overflowY!=='auto'
            && (parseFloat(cs.borderTopWidth)>0 || parseFloat(cs.borderLeftWidth)>0 || !/rgba\(0, 0, 0, 0\)|transparent/.test(cs.backgroundColor)))
      bad='clip '+e.className+' '+e.scrollHeight+'>'+e.clientHeight+' '+(e.textContent||'').trim().slice(0,30);
    else if(r.right>R.right-39.5 || r.bottom>R.bottom+1 || r.left<R.left+20 || r.top<R.top-1) bad='rect '+e.tagName+'.'+e.className+' r='+Math.round(r.right)+' b='+Math.round(r.bottom)+' l='+Math.round(r.left)+' t='+Math.round(r.top);}
  s.classList.remove('ps-measure'); return [k,bad];}"""
async def main():
    total_bad = 0
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width': 1280, 'height': 720}, reduced_motion='no-preference')
        errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file://' + F); await pg.wait_for_timeout(1000)
        n = await pg.evaluate("document.querySelectorAll('.slide').length")
        selected = args.slides or list(range(1, n + 1))
        if any(i < 1 or i > n for i in selected):
            raise ValueError(f"Slide selectors must be between 1 and {n}")
        for loc in LOCS:
            await pg.evaluate(f"setLocale('{loc}')"); await pg.wait_for_timeout(300)
            bad = []
            for number in selected:
                i = number - 1
                await pg.evaluate(f'goToSlide({i})'); await pg.wait_for_timeout(420)
                await pg.evaluate(SETTLE_ENTRANCES)
                r = await pg.evaluate(CHECK)
                if r[1]: bad.append((i + 1, r))
            print(loc, len(selected), 'slides checked of', n, ', bad:', len(bad)); [print('  slide', x[0], x[1]) for x in bad]; total_bad += len(bad)
        print('errors', errs[:10]); await b.close()
    sys.exit(1 if total_bad or errs else 0)
asyncio.run(main())
