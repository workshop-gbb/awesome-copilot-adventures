#!/usr/bin/env python3
"""
audit.py — identity and quality audit for a multi.html deck.

Checks:
1. Em dashes (—) — should be 0 anywhere in the file (forbidden in Paula's style)
2. Identity strings — required Paula Silva role and corporate contact
3. Forbidden strings — absence of "@paulasilvatech", "paulanunes", "Microsoft Americas", "Software GBB Americas", "Microsoft Global Black Belt"
4. Colors — usage of the Microsoft 4-color palette (F25022, 7FBA00, FFB900, 00A4EF); flags non-MS reds/greens/yellows/blues that look brand-adjacent
5. Notes completeness — counts characters/words per locale per slide
6. JS validity — pipes the script content through node --check
7. Structural conformity (v2.1.0):
   - :root token namespace: every custom property declared in :root must start with --ps-
   - I18N shape: nested semantic keys required; flat positional keys ("s0.t1") fail
   - Brand v2.1.0: the </.> logo (aria-label="paulasilva") and the favicon must be present
   - Inline-style budget: content elements with style= (excluding --accent) above threshold warn

Usage:
    python audit.py <deck.html> [--max-em-dashes 0] [--locales en pt-BR es]
"""

import argparse
import json
import os
import re
import subprocess
import sys
import tempfile
from slide_markup import SLIDE_RE
from deck_structure import issues as structural_issues


REQUIRED_STRINGS = [
    "Global Black Belt",
    "Software Latam Leader",
    "paulasilva@microsoft.com",
]

FORBIDDEN_STRINGS = [

    "@paulasilvatech",
    "paulanunes",
    "Software GBB Americas",
    "Microsoft Global Black Belt",
    "AI-Native Software Engineer",
    "deck-brand__squares",
    "s-brand__squares",
    "brand-squares",
]


MS_COLORS = {
    "F25022": "Microsoft red",
    "7FBA00": "Microsoft green",
    "FFB900": "Microsoft yellow",
    "00A4EF": "Microsoft blue",
}

# Common look-alike colors that signal "someone used the wrong palette"
# v2.0.0: the personal palette (FF3133/7ED956/FFDE59/39B8FF) is the LOGO palette
# and is expected on every slide via the </.> brand mark. Only flag look-alikes
# that signal accent-palette mistakes.
SUSPICIOUS_COLORS = {
    "1976D2": "blue (use Microsoft blue 00A4EF for accents)",
}

# v2.0.0: the retired Microsoft 2x2 squares mark must not appear in new decks.


def extract_i18n(content: str):
    """Parse the I18N object out of the deck JS."""
    start = content.find("const I18N = {")
    if start < 0:
        return None
    i = start + len("const I18N = ")
    depth = 0
    in_str = False
    str_ch = None
    esc = False
    end = -1
    while i < len(content):
        c = content[i]
        if esc:
            esc = False
        elif in_str:
            if c == "\\":
                esc = True
            elif c == str_ch:
                in_str = False
        else:
            if c in ('"', "'"):
                in_str = True
                str_ch = c
            elif c == "{":
                depth += 1
            elif c == "}":
                depth -= 1
                if depth == 0:
                    end = i + 1
                    break
        i += 1
    if end < 0:
        return None
    try:
        return json.loads(content[start + len("const I18N = ") : end])
    except json.JSONDecodeError:
        return None


def check_js(content: str) -> tuple[bool, str]:
    blocks = re.findall(r"<script\b([^>]*)>(.*?)</script\s*>", content, re.DOTALL | re.I)
    if not blocks:
        return False, "No <script> block found"
    checked = 0
    for index, (attrs, code) in enumerate(blocks, 1):
        script_type = re.search(r'\btype=["\']([^"\']+)["\']', attrs)
        if script_type and script_type.group(1) not in {
            "module", "text/javascript", "application/javascript",
        }:
            continue
        suffix = ".mjs" if script_type and script_type.group(1) == "module" else ".js"
        with tempfile.NamedTemporaryFile(mode="w", suffix=suffix, encoding="utf-8", delete=False) as f:
            f.write(code)
            path = f.name
        try:
            result = subprocess.run(["node", "--check", path], capture_output=True, text=True)
        finally:
            os.unlink(path)
        checked += 1
        if result.returncode:
            return False, f"Script {index}: {result.stderr.strip()}"
    return (True, "OK") if checked else (False, "No executable inline script block found")



def check_token_namespace(content: str):
    """All custom properties declared in :root must live in the --ps- namespace."""
    m = re.search(r":root\s*\{([^}]*)\}", content)
    if not m:
        return None
    declared = sorted(set(re.findall(r"(--[\w-]+)\s*:", m.group(1))))
    return [d for d in declared if not d.startswith("--ps-")]


def check_i18n_shape(i18n):
    """Nested semantic keys required. Flat positional keys like 's0.t1' fail."""
    if not i18n:
        return None
    flat = []
    for loc, tree in i18n.items():
        if not isinstance(tree, dict):
            continue
        flat += [f"{loc}:{k}" for k in tree if isinstance(k, str) and "." in k]
    return flat


def check_inline_style_budget(content: str, budget: int = 350):
    """Count style= on content elements, excluding the accepted --accent custom prop."""
    hits = re.findall(r"<(?:div|p|h[1-6]|span|section|li|ul|ol)[^>]* style=\"([^\"]*)\"", content)
    # v3.0.0: a style that only sets custom properties (--accent, --c, --i, --w, --s, --d ...) is data for the
    # component CSS (color, stagger, width), not improvised layout, and does not count.
    def improvised(st):
        return any(not d.strip().startswith("--") for d in st.split(";") if d.strip())
    count = sum(1 for s in hits if improvised(s))
    return count, budget


def audit(deck_path: str, max_em_dashes: int = 0, locales: list[str] = None) -> int:
    if locales is None:
        locales = ["en", "pt-BR", "es"]

    with open(deck_path, encoding="utf-8") as deck_file:
        content = deck_file.read()
    errors = 0
    warnings = 0

    print(f"=== Audit: {deck_path} ({len(content)} bytes) ===\n")

    # 1. Em dashes
    em_count = content.count("—")
    if em_count > max_em_dashes:
        print(f"  FAIL: em dashes found: {em_count} (max allowed: {max_em_dashes})")
        errors += 1
    else:
        print(f"  OK: em dashes: {em_count}")

    # 2. Required strings
    for s in REQUIRED_STRINGS:
        count = content.count(s)
        if count == 0:
            print(f"  FAIL: required string missing: '{s}'")
            errors += 1
        else:
            print(f"  OK: '{s}': {count} occurrences")

    # 3. Forbidden strings
    for s in FORBIDDEN_STRINGS:
        count = content.count(s)
        if count > 0:
            print(f"  FAIL: forbidden string found: '{s}' ({count} occurrences)")
            errors += 1
    print(f"  OK: no forbidden strings" if all(content.count(s) == 0 for s in FORBIDDEN_STRINGS) else "")

    # 4. Suspicious colors
    for hex_color, msg in SUSPICIOUS_COLORS.items():
        count = content.count(f"#{hex_color}") + content.count(hex_color.lower())
        if count > 0:
            print(f"  WARN: suspicious color #{hex_color} ({msg}) found {count} times")
            warnings += 1

    # 5. Check "GitHub Copilot" never abbreviated to just "Copilot"
    bare_copilot = len(re.findall(r"(?<!GitHub )(?<!Microsoft 365 )Copilot(?! (?:Studio|Chat))", content))
    if bare_copilot > 0:
        print(f"  WARN: 'Copilot' without 'GitHub' prefix: {bare_copilot} occurrences (may be in code blocks or notes; check manually)")
        warnings += 1

    # 6. JS validity
    js_ok, js_msg = check_js(content)
    if js_ok:
        print(f"  OK: JS valid")
    else:
        print(f"  FAIL: JS invalid: {js_msg[:300]}")
        errors += 1

    # 7. Notes completeness
    i18n = extract_i18n(content)
    if i18n is None:
        print("  FAIL: could not parse I18N block")
        errors += 1
    else:
        count = len(SLIDE_RE.findall(content))
        expected_notes = {f"s{number}" for number in range(1, count + 1)}
        for loc in locales:
            if loc not in i18n:
                print(f"  FAIL: locale '{loc}' not in I18N")
                errors += 1
                continue
            notes = i18n[loc].get("notes")
            if not notes:
                print(f"  FAIL: no notes for locale '{loc}'")
                errors += 1
                continue
            missing = sorted(expected_notes - set(notes))
            empty = [key for key, value in notes.items() if not isinstance(value, str) or not value.strip()]
            if missing or empty:
                print(f"  FAIL: incomplete {loc} notes: missing={missing}, empty={empty}")
                errors += 1
            total_words = sum(len(n.split()) for n in notes.values())
            avg_words = total_words / len(notes) if notes else 0
            short = [k for k, v in notes.items() if len(v.split()) < 10]
            print(f"  Notes {loc}: {len(notes)} slides, avg {avg_words:.0f} words/slide")
            if short:
                print(f"    very short notes (<10 words): {short}")
                warnings += 1

    # 8. Token namespace (v2.1.0)
    bad_tokens = check_token_namespace(content)
    if bad_tokens is None:
        print("  WARN: no :root block found for token check")
        warnings += 1
    elif bad_tokens:
        print(f"  FAIL: tokens fora do namespace --ps- no :root: {bad_tokens[:12]}{' ...' if len(bad_tokens) > 12 else ''}")
        print("        Use o builder e os tokens do kit; nao crie um sistema visual paralelo no deck.")
        errors += 1
    else:
        print("  OK: todos os tokens do :root no namespace --ps-")

    # 9. I18N shape (v2.1.0)
    flat_keys = check_i18n_shape(i18n)
    if flat_keys:
        print(f"  FAIL: I18N com chaves flat posicionais ({len(flat_keys)}), ex: {flat_keys[:4]}")
        print("        Use chaves aninhadas semanticas (cover.eyebrow), max 2 niveis, camelCase no ultimo segmento.")
        errors += 1
    elif i18n is not None:
        print("  OK: I18N aninhado (sem chaves flat)")

    # 10. Brand, by channel (v2.2.0): Microsoft-facing deck uses the 4-square mark, personal deck uses </.>
    ms_mark = content.count('aria-label="Microsoft"')
    ps_mark = content.count('aria-label="paulasilva"')
    if ms_mark == 0 and ps_mark == 0:
        print('  FAIL: nenhuma marca no header (esperado aria-label="Microsoft" em deck Microsoft-facing, ou "paulasilva" em deck pessoal)')
        errors += 1
    elif ms_mark and ps_mark:
        print('  FAIL: marcas misturadas (Microsoft e </.> no mesmo deck)')
        errors += 1
    else:
        print(f"  OK: marca {'Microsoft 4-square' if ms_mark else '</.> pessoal'} presente")
    # v2.2.0 chrome rules
    for needle, label in [('stage-scale', 'palco fixo 16:9 (stage-scale)'), ('data-on-cover', 'seletor de idioma so na capa (data-on-cover)'), ('.replay { display: none', 'botoes REPLAY ocultos')]:
        if needle in content: print(f"  OK: {label}")
        else: print(f"  WARN: {label} ausente (regra v2.2.0)")
    if content.count('rel="icon"') == 0:
        print('  FAIL: favicon ausente (rel="icon")')
        errors += 1
    else:
        print("  OK: favicon presente")

    # 11. Inline-style budget (v2.1.0)
    style_count, budget = check_inline_style_budget(content)
    if style_count > budget:
        print(f"  WARN: {style_count} inline styles em elementos de conteudo (teto {budget}). Use os patterns do catalogo em vez de improvisar layout.")
        warnings += 1
    else:
        print(f"  OK: inline styles em conteudo: {style_count} (teto {budget})")

    structure_failures = structural_issues(content, i18n)
    for failure in structure_failures:
        print(f"  FAIL: structure: {failure}")
    errors += len(structure_failures)
    if not structure_failures:
        print("  OK: shared Hooks cover, generated agenda, dividers and closing")

    print(f"\n=== Result: {errors} errors, {warnings} warnings ===")
    return errors


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("deck", help="Path to the multi.html deck")
    parser.add_argument("--max-em-dashes", type=int, default=0)
    parser.add_argument("--locales", nargs="+", default=["en", "pt-BR", "es"])
    args = parser.parse_args()
    sys.exit(audit(args.deck, args.max_em_dashes, args.locales))


if __name__ == "__main__":
    main()
