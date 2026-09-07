"""diag_fill v4.0.0: per slide, the fill factor K reached by fillCanvas, the lowest content edge and
the last reason growth stopped. A content slide with K < 1 is over-full; one with bottom < 640 at K 1.84
has too little content. Catalog decks demonstrate isolated components and are exempt from the short
flag, but never from shrink or overflow checks. Usage: python diag_fill.py deck.html [locale]"""
import asyncio, sys, os, re
from playwright.async_api import async_playwright
from browser_state import SETTLE_ENTRANCES
F = os.path.abspath(sys.argv[1]); loc = sys.argv[2] if len(sys.argv) > 2 else 'en'
with open(F, encoding='utf-8') as deck_file:
    markup = deck_file.read()
match = re.search(r'<meta name="ps-deck-profile" content="([^"]+)"', markup)
PROFILE = match.group(1) if match else 'standard'
JS = """()=>{const s=document.querySelector('.slide[data-active=true]'); s.classList.add('ps-measure');
  let maxb=0; s.querySelectorAll('*').forEach(e=>{ if(e.closest('.deco,.kbd-hint')) return; const r=e.getBoundingClientRect(); if(r.width&&r.height&&r.bottom>maxb) maxb=r.bottom; });
  s.classList.remove('ps-measure');
  return [s.dataset.psk||'-', s.dataset.psfail||'', Math.round(maxb), (s.querySelector('.eyebrow')||{}).textContent||''];}"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width': 1280, 'height': 720}, reduced_motion='no-preference')
        await pg.goto('file://' + F); await pg.wait_for_timeout(900)
        await pg.evaluate(f"setLocale('{loc}')"); await pg.wait_for_timeout(300)
        n = await pg.evaluate("document.querySelectorAll('.slide').length")
        print('profile', PROFILE)
        for i in range(n):
            await pg.evaluate(f'goToSlide({i})'); await pg.wait_for_timeout(380)
            await pg.evaluate(SETTLE_ENTRANCES)
            r = await pg.evaluate(JS)
            flag = '  <-- shrunk' if r[0] != '-' and float(r[0]) < 1 else ('  <-- short' if PROFILE != 'catalog' and r[0] != '-' and r[2] < 640 else '')
            print(f"{i+1:03d} K={r[0]:>5} bottom={r[2]:>4} {r[3][:28]:28} {r[1][:60]}{flag}")
        await b.close()
asyncio.run(main())
