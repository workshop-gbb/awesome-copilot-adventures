#!/usr/bin/env python3
"""
make_public.py — derive the public HTML deck from the multi.html source.

Removes:
- The notes-panel HTML element
- The formatNote() function
- The renderNotes() function
- The toggleNotes() function
- The entire PRESENTER VIEW block (PRESENTER_HTML, openPresenterView, broadcastState, toggleFullscreenAndPresenter)
- Key handlers for N, F, P
- The kbd-hint references to N (notas) and F (apresentador) — both in the inline HTML and in uiBundles inside setLocale()

Forces:
- A target locale (default pt-BR)

Usage:
    python make_public.py <input_multi.html> <output_public.html> [--locale pt-BR|en|es]
"""

import argparse
import re
import sys


def make_public(input_path: str, output_path: str, locale: str = "pt-BR") -> None:
    content = open(input_path).read()
    orig_size = len(content)

    # 1. Remove the notes-panel div (the HTML block)
    notes_panel_pattern = re.compile(
        r'<div class="notes-panel"[^>]*>.*?</div>\s*</div>\s*\n',
        re.DOTALL,
    )
    m = notes_panel_pattern.search(content)
    if m:
        content = content[:m.start()] + content[m.end():]

    # 2. Remove formatNote
    fn_format = re.compile(r"function formatNote\(text\) \{.*?\n\}\n\n", re.DOTALL)
    m = fn_format.search(content)
    if m:
        content = content[:m.start()] + content[m.end():]

    # 3. Remove renderNotes + toggleNotes
    fn_render = re.compile(r"function renderNotes\(\) \{.*?\n\}\nfunction toggleNotes", re.DOTALL)
    m = fn_render.search(content)
    if m:
        end_search = content.find("}\n\n", m.end())
        if end_search > 0:
            full_end = end_search + 3
            content = content[:m.start()] + content[full_end:]

    # 4. Remove the presenter view block (comment marker to the end of PRESENTER_HTML)
    presenter_start = content.find(
        "// PRESENTER VIEW (BroadcastChannel sync + auto fullscreen)"
    )
    presenter_end = content.find("`;\n", content.find("const PRESENTER_HTML"))
    if presenter_start > 0 and presenter_end > 0:
        block_start = content.rfind("// ====", 0, presenter_start)
        if block_start < 0:
            block_start = presenter_start
        block_end = presenter_end + 3
        content = content[:block_start] + content[block_end:]

    # 5. Remove key handlers for N, F, P
    old_keys = """  if (e.key === 'n' || e.key === 'N') toggleNotes();
  if (e.key === 'o' || e.key === 'O' || e.key === 'Escape') toggleOverview();
  if (e.key === 'f' || e.key === 'F') toggleFullscreenAndPresenter();
  if (e.key === 'p' || e.key === 'P') openPresenterView();
});"""
    new_keys = """  if (e.key === 'o' || e.key === 'O' || e.key === 'Escape') toggleOverview();
});"""
    content = content.replace(old_keys, new_keys)

    # 6. Remove calls to broadcastState() and renderNotes() and their guarded variants
    content = re.sub(
        r'\s*if \(typeof broadcastState === "function"\) broadcastState\(\);',
        "",
        content,
    )
    content = re.sub(r"\s*renderNotes\(\);", "", content)
    content = re.sub(
        r'\s*if \(typeof renderNotes === "function"\) renderNotes\(\);', "", content
    )

    # 7. Force the locale at startup
    old_init = """  const saved = (() => { try { return localStorage.getItem('ps-locale'); } catch { return null; }})();
  const browser = navigator.language?.startsWith('pt') ? 'pt-BR'
                : navigator.language?.startsWith('es') ? 'es'
                : 'en';
  setLocale(saved || browser);"""
    new_init = f"  // Public version: force {locale} as locale default\n  setLocale('{locale}');"
    if old_init in content:
        content = content.replace(old_init, new_init)

    # 8. Update the kbd-hint inline HTML (remove N/F references)
    hint_pattern = re.compile(r'<div class="kbd-hint" id="kbdHint">(.*?)</div>', re.DOTALL)
    m = hint_pattern.search(content)
    if m:
        old_hint = m.group(0)
        new_hint = (
            '<div class="kbd-hint" id="kbdHint">\n'
            '    USE <kbd>&larr;</kbd> <kbd>&rarr;</kbd> '
            '<span data-i18n="hint.navigate">para navegar</span> &middot;\n'
            '    <kbd>O</kbd> <span data-i18n="hint.overview">visão geral</span>\n'
            "  </div>"
        )
        content = content.replace(old_hint, new_hint)

    # 9. Update uiBundles to drop N/F references (they overwrite kbd-hint on locale change)
    old_bundles = re.compile(
        r"const uiBundles = \{\s*"
        r"'pt-BR': \{ title: '[^']+', hint: '[^']+', kbd: '[^']+' \},\s*"
        r"'en':\s*\{ title: '[^']+',\s*hint: '[^']+',\s*kbd: '[^']+' \},\s*"
        r"'es':\s*\{ title: '[^']+', hint: '[^']+', kbd: '[^']+' \}\s*\};"
    )
    new_bundles = (
        "const uiBundles = {\n"
        "    'pt-BR': { title: 'Visão geral', hint: 'Clique em um slide · Esc para fechar', "
        "kbd: 'Use <kbd>&larr;</kbd> <kbd>&rarr;</kbd> para navegar · <kbd>O</kbd> visão geral' },\n"
        "    'en':    { title: 'Overview',    hint: 'Click a slide · Esc to close',         "
        "kbd: 'Use <kbd>&larr;</kbd> <kbd>&rarr;</kbd> to navigate · <kbd>O</kbd> overview' },\n"
        "    'es':    { title: 'Vista general', hint: 'Clic en un slide · Esc para cerrar', "
        "kbd: 'Usa <kbd>&larr;</kbd> <kbd>&rarr;</kbd> para navegar · <kbd>O</kbd> vista general' }\n"
        "  };"
    )
    content = old_bundles.sub(new_bundles, content)

    open(output_path, "w").write(content)
    print(f"Public HTML written: {output_path}")
    print(f"Size: {len(content)} bytes (original: {orig_size}, removed: {orig_size - len(content)} bytes)")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("input", help="Input multi.html")
    parser.add_argument("output", help="Output public.html")
    parser.add_argument("--locale", default="pt-BR", choices=["pt-BR", "en", "es"])
    args = parser.parse_args()
    make_public(args.input, args.output, args.locale)


if __name__ == "__main__":
    main()
