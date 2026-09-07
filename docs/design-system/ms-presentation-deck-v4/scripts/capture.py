import asyncio, os
from playwright.async_api import async_playwright
DECK='file:///mnt/user-data/outputs/VibeCodingEngenharia_BTG_Deck_v2_2_0_2026-09-01_multi.html'
# (slide index 0-based, selector, out name, wait ms, pre-action js)
CAPS=[
 (7,  '.ice > div:last-child svg', 'iceberg', 3500, None),
 (8,  '.calc', 'calc', 2500, None),
 (10, '.ph__stage', 'phases', 3500, "document.querySelectorAll('.ph__tab')[4].click()"),
 (16, '.dg-wrap svg', 'dloop', 3200, None),
 (19, 'svg.ring-live', 'ring', 4500, None),
 (22, '.vsc2', 'vsc', 21500, None),
 (21, '.hooktl', 'hooks', 4000, None),
 (21, '.tsim', 'hooksterm', 4000, None),
 (23, '.stk-wrap, .stk', 'reuse', 2500, "document.querySelectorAll('.stk-pill input').forEach(i=>{i.checked=true; i.dispatchEvent(new Event('change'))})"),
 (25, '.trm', 'loop', 3500, None),
 (28, '.metro', 'metro', 2500, None),
 (29, '.tsim', 'cli', 17000, None),
 (30, '.rul', 'ruler', 4000, None),
 (31, '.bw', 'pr', 4000, None),
 (33, '.dash__panel', 'dash', 3000, None),
]
async def main():
    async with async_playwright() as p:
        br=await p.chromium.launch(); pg=await (await br.new_context(viewport={'width':1280,'height':720}, device_scale_factor=2, reduced_motion='no-preference')).new_page()
        await pg.goto(DECK); await pg.wait_for_timeout(800); await pg.evaluate("setLocale('pt-BR')")
        await pg.evaluate("document.querySelector('.kbd-hint') && (document.querySelector('.kbd-hint').style.display='none')")
        for idx, sel, name, wait, pre in [c for c in CAPS if c[2] in ('vsc',)]:
            await pg.evaluate(f"goToSlide({idx})"); await pg.wait_for_timeout(600)
            if pre: 
                try: await pg.evaluate(pre)
                except Exception as e: print('pre fail', name, e)
            await pg.wait_for_timeout(wait)
            found=None
            for s in sel.split(','):
                s=s.strip()
                if await pg.evaluate(f"!!document.querySelector('.slide[data-active=\"true\"] {s}')"): found=s; break
            if not found:
                cls=await pg.evaluate("[...document.querySelector('.slide[data-active=\"true\"]').querySelectorAll('div,svg')].slice(0,40).map(e=>e.className.baseVal||e.className).filter(Boolean)")
                print('MISSING', name, cls[:25]); continue
            el=await pg.query_selector(f'.slide[data-active="true"] {found}')
            await el.screenshot(path=f'img_{name}.png'); print('ok', name, found)
        await br.close()
asyncio.run(main())
