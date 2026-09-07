"""Shared Hooks structural contract, independent of a deck's subject and narrative."""

from __future__ import annotations

import json
import re
from html import escape

from bs4 import BeautifulSoup

from codebg import CSS as CODE_BACKGROUND_CSS
from slide_markup import SLIDE_RE

STANDARD = "hooks-v1"
LOCALES = ("en", "pt-BR", "es")

# Scoped rules prevent legacy themes from changing the shared structural components.
CSS = """
.slide[data-ps-family="structure"] { padding:34px 60px; font-family:var(--ps-font-sans); }
.slide[data-ps-family="structure"].slide--light { background:#F7F7F5; }
.slide[data-ps-family="structure"].slide--dark { background:var(--ps-color-dark-bg); }
html:has(body[data-slide-theme="dark"]), body[data-slide-theme="dark"] { background:var(--ps-color-dark-bg); }
html:has(body[data-slide-theme="light"]), body[data-slide-theme="light"] { background:var(--ps-color-bg); }
.slide[data-ps-archetype="cover"] { justify-content:center; }
.slide[data-ps-archetype="cover"] .title { font-size:82px; font-weight:500; line-height:1.06; max-width:none; margin:0; letter-spacing:-.02em; }
.slide[data-ps-archetype="cover"] .title > span { display:block; white-space:nowrap; }
.slide[data-ps-archetype="cover"] .accent-blue, .slide[data-ps-archetype="closing"] .accent-blue { color:var(--ps-text-blue); }
.slide[data-ps-archetype="divider"] { justify-content:center; }
.slide[data-ps-archetype="divider"] .section-number--bars { margin:0 0 42px; line-height:0; font-size:0; }
.slide[data-ps-archetype="divider"] .section-number--bars svg { height:250px; width:auto; }
.slide[data-ps-archetype="divider"] .section-title { font-size:60px; line-height:1.04; letter-spacing:-.03em; margin:0 0 18px; max-width:none; white-space:nowrap; }
.slide[data-ps-archetype="divider"] .subtitle { font-size:22px; line-height:1.42; max-width:1120px; margin:0; }
.slide[data-ps-archetype="agenda"] .agenda { display:grid; grid-template-columns:1fr 1fr; grid-auto-flow:column; gap:8px 44px; margin-top:10px; }
.slide[data-ps-archetype="agenda"] .ag { display:grid; grid-template-columns:104px minmax(0,1fr) auto 22px; align-items:center; gap:0 14px; padding:16px 14px 16px 10px; min-height:96px; border-radius:6px; border-bottom:1px solid var(--ps-color-rule); text-decoration:none; color:inherit; position:relative; }
.slide[data-ps-archetype="agenda"] .ag__n { color:var(--accent); text-align:center; }
.slide[data-ps-archetype="agenda"] .ag__n .rn { display:block; margin:0 auto; height:34px; }
.slide[data-ps-archetype="agenda"] .ag__body { display:flex; flex-direction:column; gap:3px; min-width:0; }
.slide[data-ps-archetype="agenda"] .ag__t { font-size:22px; font-weight:500; letter-spacing:-.015em; line-height:1.15; color:var(--ps-color-ink); text-wrap:balance; }
.slide[data-ps-archetype="agenda"] .ag__a { font-family:var(--ps-font-mono); font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:var(--label,var(--ps-label-ms)); }
.slide[data-ps-archetype="agenda"] .ag__r { display:flex; flex-direction:column; align-items:flex-end; gap:4px; font-family:var(--ps-font-mono); font-size:12px; color:var(--ps-color-ink-3); white-space:nowrap; }
.slide[data-ps-archetype="agenda"] .ag__go { color:var(--ps-color-ink-2); opacity:1; }
.slide[data-ps-archetype="agenda"] .ag__c { color:var(--ps-color-ink-2); }
.slide[data-ps-archetype="agenda"] .ag:focus-visible { outline:2px solid var(--accent); outline-offset:2px; }
.slide[data-ps-archetype="agenda"] .agenda--5 .ag { min-height:70px; padding:9px 14px 9px 10px; }
.slide[data-ps-archetype="agenda"] .agenda--5 .ag__n .rn { height:28px; }
.slide[data-ps-archetype="agenda"] .agenda--5 .ag__t { font-size:20px; }
.slide[data-ps-archetype="closing"] .section-title { font-size:60px; line-height:1.04; letter-spacing:-.03em; max-width:none; }
.slide[data-ps-archetype="closing"] .section-title > span { display:block; white-space:nowrap; }
.slide[data-ps-archetype="closing"] .subtitle { font-size:22px; line-height:1.42; max-width:1120px; }
.slide[data-ps-archetype="closing"] .code-block { padding:0; }
.slide[data-ps-archetype="closing"] .code-block__header { font-family:var(--ps-font-mono); font-size:11px; letter-spacing:.1em; padding:10px 18px; color:var(--ps-color-dark-ink-2); border-bottom:1px solid rgba(240,240,240,.12); }
"""

RUNTIME = """
(() => {
  document.addEventListener('keydown', event => {
    if (event.key !== ' ') return;
    const row = event.target.closest('[data-ps-archetype="agenda"] .ag[data-goto]');
    if (!row) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    row.click();
  }, true);
  document.addEventListener('click', event => {
    const row = event.target.closest('[data-ps-archetype="agenda"] .ag[data-goto]');
    if (!row) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    goToSlide(Number(row.dataset.goto));
  }, true);
  const previous = window.psFitAll;
  window.psFitAll = function() {
    if (previous) previous();
    const slide = document.querySelector('.slide[data-active="true"]');
    if (!slide || !['cover', 'closing'].includes(slide.dataset.psArchetype)) return;
    const title = slide.querySelector('h1');
    const max = slide.dataset.psArchetype === 'cover' ? 82 : 60;
    let size = max;
    title.style.fontSize = size + 'px';
    while (size > 32 && Array.from(title.children).some(line => line.scrollWidth > title.clientWidth + 1)) {
      size -= 1;
      title.style.fontSize = size + 'px';
    }
  };
  let pendingFrame = 0;
  const scheduleFit = () => {
    cancelAnimationFrame(pendingFrame);
    pendingFrame = requestAnimationFrame(() => {
      window.psFitAll();
      if (window.fillCanvas) window.fillCanvas();
    });
  };
  const previousGo = window.goToSlide;
  window.goToSlide = function(index) { previousGo(index); scheduleFit(); };
  const previousLocale = window.setLocale;
  window.setLocale = function(locale) { previousLocale(locale); scheduleFit(); };
  document.fonts.ready.then(scheduleFit);
  scheduleFit();
})();
"""


def install(markup: str, skeleton: str | None = None) -> str:
    if skeleton is not None and not re.search(r"@font-face\s*\{", markup):
        fonts = re.findall(r"@font-face\s*\{[^}]*\}", skeleton)
        if not fonts or any("data:" not in face for face in fonts):
            raise ValueError(
                "The shared skeleton must provide embedded offline fonts")
        markup = markup.replace(
            "</head>", '<style id="ps-offline-fonts">' + "\n".join(fonts) + "</style>\n</head>", 1)
    markup = re.sub(
        r'<link\b[^>]*href=["\']https://fonts\.(?:googleapis|gstatic)\.com[^"\']*["\'][^>]*>\s*',
        "", markup, flags=re.I,
    )
    markup = re.sub(r'<meta name="ps-deck-structure"[^>]*>\s*', "", markup)
    markup = re.sub(
        r'<style id="ps-structure-css">.*?</style>\s*', "", markup, flags=re.S)
    markup = re.sub(
        r'<script id="ps-structure-runtime">.*?</script>\s*', "", markup, flags=re.S)
    markup = markup.replace(
        "</head>", f'<meta name="ps-deck-structure" content="{STANDARD}">\n</head>', 1)
    before, separator, after = markup.rpartition("</body>")
    if not separator:
        raise ValueError("Deck is missing its closing body tag")
    return before + f'<style id="ps-structure-css">{CODE_BACKGROUND_CSS}{CSS}</style>\n<script id="ps-structure-runtime">{RUNTIME}</script>\n' + separator + after


def resolve(node, registry: dict, locale: str) -> str:
    if node is None:
        raise ValueError("Missing structural text")
    key = node.get("data-i18n")
    if not key:
        if node.select("[data-i18n]"):
            translated = BeautifulSoup(str(node), "html.parser")
            for child in translated.select("[data-i18n]"):
                child.clear()
                child.append(BeautifulSoup(resolve(node.select_one(
                    f'[data-i18n="{child["data-i18n"]}"]'), registry, locale), "html.parser"))
            return translated.get_text(" ", strip=True)
        return node.get_text(" ", strip=True)
    value = registry[locale]
    for segment in key.split("."):
        value = value[segment]
    if not isinstance(value, str) or not value.strip():
        raise ValueError(f"Empty structural text: {locale}:{key}")
    return value


def text3(node, registry: dict) -> tuple[str, str, str]:
    return tuple(resolve(node, registry, locale) for locale in LOCALES)


def normalize(markup: str, registry: dict, *, cover, title, version: str, date: str,
              profile: str, closing=None, refresh_runtime: bool = False) -> str:
    """Replace only structural slides; keep content, ordering and speaker notes intact."""
    from deck_builder import Deck

    if any(locale not in registry for locale in LOCALES):
        raise ValueError(
            "A complete deck requires en, pt-BR and es; do not publish a partial translation")
    original = SLIDE_RE.findall(markup)
    slides = [BeautifulSoup(
        section, "html.parser").section for section in original]
    builder = Deck(version=version, title=title, date=date, profile=profile)
    builder._n = 20000
    agenda = next((s for s in slides if s.get("data-ps-archetype")
                  == "agenda" or s.select_one(".agenda")), None)
    rows = agenda.select(".ag") if agenda else []
    part = 0
    for index, slide in enumerate(slides):
        notes = tuple(registry[locale]["notes"]
                      [f"s{index + 1}"] for locale in LOCALES)
        if index == 0:
            spans = slide.select("h1 > span")
            lines = [text3(node, registry)
                     for node in spans] if len(spans) == 2 else cover
            builder.cover(*lines, notes=notes)
        elif slide is agenda:
            builder.agenda(
                text3(slide.find(["h1", "h2"]), registry), notes=notes)
        elif slide.get("data-ps-archetype") == "divider" or slide.select_one(".section-number"):
            accent = re.search(
                r"--accent:\s*var\(--ps-color-ms-(red|green|yellow|blue)-500\)", slide.get("style", ""))
            if not accent:
                raise ValueError(
                    f"Slide {index + 1}: cannot determine the existing section accent")
            numeral = ("I", "II", "III", "IV", "V", "VI",
                       "VII", "VIII", "IX", "X")[part]
            eyebrow = rows[part].select_one(
                ".ag__a") if part < len(rows) else None
            heading = slide.find(["h1", "h2"])
            builder.part(numeral, accent[1], text3(heading, registry),
                         text3(eyebrow, registry) if eyebrow else text3(
                             heading, registry),
                         text3(slide.select_one(".subtitle"), registry), notes)
            part += 1
        elif index == len(slides) - 1:
            spans = slide.select("h1 > span")
            lines = closing or [text3(node, registry) for node in spans]
            if len(lines) != 2:
                raise ValueError("Closing needs two translated title lines")
            code = slide.select_one(".code-block pre")
            header = slide.select_one(".code-block__header")
            code_lines = [
                re.sub(r"<br\s*/?>", "\n", code.decode_contents())] if code else ()
            builder.closing(*lines, code_title=text3(header, registry) if header else "",
                            code_lines=code_lines, notes=notes)
        else:
            builder.add(original[index], notes)
            continue
        replacement, slide_notes = builder.slides[-1]
        old_id = slide.find(["h1", "h2"])
        if old_id and old_id.get("id"):
            replacement = re.sub(
                r"<(h[12]) ", rf'<\1 id="{escape(old_id["id"], quote=True)}" ', replacement, count=1)
        builder.slides[-1] = (replacement, slide_notes)
    if builder.agenda_idx is not None:
        builder.slides[builder.agenda_idx] = (
            builder._agenda_html(), builder.slides[builder.agenda_idx][1])
    for locale in LOCALES:
        for key, value in builder.I18N[locale].items():
            if key != "notes":
                registry[locale][key] = value
    if refresh_runtime:
        builder.I18N = registry
        return builder.html()
    replacements = iter(section for section, _ in builder.slides)
    result = SLIDE_RE.sub(lambda _: next(replacements), markup)
    declaration = "const I18N = "
    start = result.index(declaration) + len(declaration)
    _, length = json.JSONDecoder().raw_decode(result[start:])
    result = result[:start] + \
        json.dumps(registry, ensure_ascii=False, indent=1) + \
        result[start + length:]
    result = re.sub(r"<title[^>]*>.*?</title>",
                    f"<title>{escape(title[0])}</title>", result, count=1, flags=re.S)
    return install(result, skeleton=builder.skel)


def issues(markup: str, registry: dict | None) -> list[str]:
    soup = BeautifulSoup(markup, "html.parser")
    slides = soup.select("section.slide")
    failures = []
    if not slides:
        return ["No slides found"]
    marker = soup.select_one('meta[name="ps-deck-structure"]')
    if not marker or marker.get("content") != STANDARD:
        failures.append("Shared Hooks structural contract is missing")
    for node in soup.select('img[src], script[src], video[src], video[poster], source[src], link[rel="stylesheet"][href]'):
        for attribute in ("src", "poster", "href"):
            value = node.get(attribute)
            if value and not value.startswith(("data:", "#")):
                failures.append(
                    f"Offline deck depends on an external asset: {node.name}[{attribute}]")
    if not re.search(r"@font-face\s*\{", markup):
        failures.append("Offline fonts are missing")
    cover = slides[0]
    if cover.get("data-ps-archetype") != "cover" or "slide--light" not in cover.get("class", []):
        failures.append("Cover must use the light shared cover component")
    spans = cover.select("h1.title > span")
    if len(spans) != 2 or "accent-blue" not in spans[-1].get("class", []):
        failures.append(
            "Cover must have exactly two title lines, with the second blue")
    if len(cover.find_all(recursive=False)) != 1:
        failures.append("Cover contains content other than its title")
    dividers = [(index, slide) for index, slide in enumerate(
        slides) if slide.get("data-ps-archetype") == "divider"]
    for index, divider in dividers:
        if "slide--dark" not in divider.get("class", []) or len(divider.find_all(recursive=False)) != 3:
            failures.append(
                f"Slide {index + 1}: divider must contain only bars, title and subtitle on dark")
        if not divider.select_one(".section-number--bars svg") or not divider.select_one(".subtitle"):
            failures.append(
                f"Slide {index + 1}: divider bars or subtitle missing")
    agendas = soup.select('section[data-ps-archetype="agenda"]')
    if dividers and len(agendas) != 1:
        failures.append("Divided decks require exactly one generated agenda")
    for agenda in agendas:
        rows = agenda.select("a.ag[data-goto]")
        if len(rows) != len(dividers):
            failures.append("Agenda rows do not match the real dividers")
        for row_index, (row, (index, divider)) in enumerate(zip(rows, dividers)):
            if row.get("data-goto") != str(index) or not row.select_one(".ag__n svg.rn"):
                failures.append(
                    f"Agenda row {row_index + 1}: wrong target or missing bar numeral")
            end = dividers[row_index + 1][0] if row_index + \
                1 < len(dividers) else len(slides) - 1
            for locale in LOCALES:
                if registry and locale in registry:
                    expected = f"slides {index + 1} {'to' if locale == 'en' else 'a'} {end}"
                    actual = resolve(row.select_one(
                        ".ag__r > span"), registry, locale)
                    if actual != expected:
                        failures.append(
                            f"Agenda row {row_index + 1}: stale range in {locale}")
    closing = slides[-1]
    if closing.get("data-ps-archetype") != "closing" or "slide--dark" not in closing.get("class", []):
        failures.append(
            "Final slide must use the dark shared closing component")
    if len(closing.select("h1 > span")) != 2 or not closing.select_one(".subtitle"):
        failures.append(
            "Closing title or tagline does not follow the shared component")
    if not closing.select_one('a[href="mailto:paulasilva@microsoft.com"]'):
        failures.append("Closing is missing the corporate contact")
    if not re.search(r"\bv\d+\.\d+\.\d+\b", closing.get_text(" ", strip=True)):
        failures.append("Closing is missing the published version")
    if closing.select('[data-i18n*="next"], .next-step, .closing-next'):
        failures.append("Closing still contains a generic next-step panel")
    return failures
