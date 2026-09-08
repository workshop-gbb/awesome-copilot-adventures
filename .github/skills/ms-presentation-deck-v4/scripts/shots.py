"""shots v3.0.0: screenshots of every slide (or a list) at the final state of the animations, plus
contact sheets of 12 slides each. Usage: python shots.py deck.html <locale> <out_dir> [wait_ms] [slide numbers...]"""
import asyncio, sys, os
from playwright.async_api import async_playwright
from PIL import Image
F = os.path.abspath(sys.argv[1]); loc = sys.argv[2]; d = sys.argv[3]; wait = int(sys.argv[4]) if len(sys.argv) > 4 else 4200
only = [int(x) for x in sys.argv[5:]]
os.makedirs(d, exist_ok=True)
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width': 1280, 'height': 720}, reduced_motion='no-preference')
        await pg.goto('file://' + F); await pg.wait_for_timeout(800)
        await pg.evaluate(f"setLocale('{loc}')"); await pg.wait_for_timeout(300)
        n = await pg.evaluate("document.querySelectorAll('.slide').length")
        idx = only or list(range(1, n + 1))
        for i in idx:
            await pg.evaluate(f'goToSlide({i - 1})'); await pg.wait_for_timeout(wait)
            await pg.evaluate("document.querySelector('.kbd-hint') && (document.querySelector('.kbd-hint').style.display='none')")
            await pg.screenshot(path=f'{d}/{i:03d}.png')
        await b.close()
    files = [f'{d}/{i:03d}.png' for i in idx]
    for s in range(0, len(files), 12):
        chunk = files[s:s + 12]; W, H = 640, 360; rows = (len(chunk) + 2) // 3
        sheet = Image.new('RGB', (W * 3, H * rows), 'white')
        for k, f in enumerate(chunk): sheet.paste(Image.open(f).resize((W, H)), ((k % 3) * W, (k // 3) * H))
        sheet.save(f'{d}/sheet_{s // 12 + 1:02d}.png')
    print('done', len(files), 'slides,', (len(files) + 11) // 12, 'sheets in', d)
asyncio.run(main())
