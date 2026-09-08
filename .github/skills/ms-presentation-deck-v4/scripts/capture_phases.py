import asyncio
from playwright.async_api import async_playwright
DECK='file:///mnt/user-data/outputs/VibeCodingEngenharia_BTG_Deck_v2_2_0_2026-09-01_multi.html'
async def main():
    async with async_playwright() as p:
        br=await p.chromium.launch(); pg=await (await br.new_context(viewport={'width':1280,'height':720}, device_scale_factor=2, reduced_motion='no-preference')).new_page()
        await pg.goto(DECK); await pg.wait_for_timeout(800); await pg.evaluate("setLocale('pt-BR')")
        await pg.evaluate("goToSlide(10)"); await pg.wait_for_timeout(1500)
        for k in range(5):
            await pg.evaluate(f"document.querySelectorAll('.ph__tab')[{k}].click()"); await pg.wait_for_timeout(2600)
            el=await pg.query_selector('.slide[data-active="true"] .ph__panel.on svg.ph__svg')
            await el.screenshot(path=f'img_phase{k+1}.png'); print('ok phase', k+1)
        await br.close()
asyncio.run(main())
