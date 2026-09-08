import asyncio, sys, json
from playwright.async_api import async_playwright
import os
# Usage: DECK=/path/deck.html [QA_FULL=4] [QA_WAIT='21:23,30:16'] python3 qa_overflow.py <locale> [slide,slide,...]
# Measures scrollHeight vs 720 per slide, records JS errors, saves shots to ./shots/<locale>_NN.png.
OUT=os.environ.get('DECK', '/mnt/user-data/outputs/deck.html')
WAIT={int(k): float(v) for k, v in (kv.split(':') for kv in os.environ.get('QA_WAIT', '').split(',') if kv)}
FULL=float(__import__("os").environ.get("QA_FULL","0"))
async def main(locale='pt-BR', shots=True, only=None):
    async with async_playwright() as p:
        br=await p.chromium.launch()
        ctx=await br.new_context(viewport={'width':1280,'height':720}, reduced_motion='no-preference')
        page=await ctx.new_page()
        errs=[]
        page.on('pageerror', lambda e: errs.append(str(e)))
        page.on('console', lambda m: errs.append('console.'+m.type+': '+m.text) if m.type in ('error',) else None)
        await page.goto('file://'+OUT)
        await page.wait_for_timeout(800)
        await page.evaluate(f"setLocale('{locale}')")
        n=await page.evaluate("document.querySelectorAll('.slide').length")
        report=[]
        for i in range(n):
            if only and (i+1) not in only: continue
            await page.evaluate(f"goToSlide({i})")
            await page.wait_for_timeout(int(max(WAIT.get(i+1,1.0), FULL)*1000))
            ov=await page.evaluate("""(i)=>{const s=document.querySelectorAll('.slide')[i]; const r=s.getBoundingClientRect();
              let worst=null; s.querySelectorAll('*').forEach(el=>{ if(el.closest('.tsim__body,.vsim__chat,.vsim__code,.vsim__term')) return; const b=el.getBoundingClientRect(); if(b.width===0||b.height===0) return; const cs=getComputedStyle(el); if(cs.visibility==='hidden'||cs.opacity==='0') return; const o=Math.max(0,b.bottom-r.bottom); if(o>2 && (!worst||o>worst.o)) worst={o:Math.round(o),cls:el.className&&el.className.baseVal!==undefined?el.className.baseVal:String(el.className).slice(0,50),tag:el.tagName}; });
              return {sh:s.scrollHeight, ch:s.clientHeight, worst};}""", i)
            report.append((i+1, ov))
            if shots: await page.screenshot(path=f'shots/{locale}_{i+1:02d}.png')
        await br.close()
        return errs, report
if __name__=='__main__':
    loc=sys.argv[1] if len(sys.argv)>1 else 'pt-BR'
    only=[int(x) for x in sys.argv[2].split(',')] if len(sys.argv)>2 else None
    errs,rep=asyncio.run(main(loc, True, only))
    print('ERRORS:', json.dumps(errs, indent=1) if errs else 'none')
    for i,o in rep:
        flag='  <-- OVERFLOW' if (o['sh']>o['ch']+2 or o['worst']) else ''
        print(f"{i:02d} sh={o['sh']} ch={o['ch']} worst={o['worst']}{flag}")
