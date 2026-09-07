#!/usr/bin/env python3
"""Fail when an SVG connector crosses visible SVG text.

Usage:
    python audit_arrows.py deck.html
    python audit_arrows.py deck.html pt-BR,es,en 300
"""
import argparse
import asyncio
import os
import sys
from playwright.async_api import async_playwright


JS = """() => {
  const out = [];
  const slide = document.querySelector('.slide[data-active="true"]');
  slide.classList.add('ps-measure');
  slide.querySelectorAll('svg').forEach((svg, si) => {
    const texts = [...svg.querySelectorAll('text')]
      .map(t => ({el: t, b: t.getBoundingClientRect(), s: t.textContent.trim().slice(0, 30)}))
      .filter(t => t.b.width > 0);
    const conns = [...svg.querySelectorAll('path, line, polyline')]
      .filter(e => (e.getAttribute('marker-end') || e.getAttribute('marker-start')) && getComputedStyle(e).display !== 'none');
    conns.forEach(c => {
      const len = c.getTotalLength ? c.getTotalLength() : 0;
      if (!len) return;
      const ctm = c.getScreenCTM();
      for (let d = 0; d <= len; d += 3) {
        const pt = c.getPointAtLength(d);
        const sp = new DOMPoint(pt.x, pt.y).matrixTransform(ctm);
        for (const t of texts) {
          if (sp.x > t.b.left + 1 && sp.x < t.b.right - 1 && sp.y > t.b.top + 2 && sp.y < t.b.bottom - 2) {
            out.push({svg: si, text: t.s, at: Math.round(d)});
            break;
          }
        }
      }
    });
  });
  const seen = new Set();
  const result = out.filter(o => {
    const key = o.svg + '|' + o.text;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  slide.classList.remove('ps-measure');
  return result;
}"""


async def inspect_states(page):
    findings = list(await page.evaluate(JS))
    for selector in ('.tabs__bar button', '.toggle__sw button'):
        scoped = f".slide[data-active=true] {selector}"
        count = await page.evaluate(f"document.querySelectorAll('{scoped}').length")
        for index in range(count):
            await page.evaluate(f"document.querySelectorAll('{scoped}')[{index}].click()")
            await page.wait_for_timeout(250)
            findings.extend(await page.evaluate(JS))
    unique = {}
    for finding in findings:
        unique[(finding['svg'], finding['text'])] = finding
    return list(unique.values())


async def audit(deck, locales, wait_ms):
    total = 0
    errors = []
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch()
        context = await browser.new_context(viewport={'width': 1280, 'height': 720}, reduced_motion='no-preference')
        page = await context.new_page()
        page.on('pageerror', lambda error: errors.append(str(error)))
        await page.goto('file://' + os.path.abspath(deck))
        await page.wait_for_timeout(800)
        slide_count = await page.evaluate("document.querySelectorAll('.slide').length")
        for locale in locales:
            print(f'===== {locale}')
            await page.evaluate(f"setLocale('{locale}')")
            await page.wait_for_timeout(300)
            locale_total = 0
            for index in range(slide_count):
                await page.evaluate(f'goToSlide({index})')
                await page.wait_for_timeout(wait_ms)
                findings = await inspect_states(page)
                for finding in findings:
                    print(
                        f"{index + 1:03d} svg{finding['svg']} arrow crosses text: "
                        f"{finding['text']!r}"
                    )
                locale_total += len(findings)
            print(f'crossings: {locale_total}')
            total += locale_total
        await browser.close()
    if errors:
        print('page errors:', errors[:10])
    return 1 if total or errors else 0


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('deck')
    parser.add_argument('locales', nargs='?', default='en,pt-BR,es')
    parser.add_argument('wait_ms', nargs='?', type=int, default=300)
    args = parser.parse_args()
    sys.exit(asyncio.run(audit(args.deck, args.locales.split(','), args.wait_ms)))


if __name__ == '__main__':
    main()
