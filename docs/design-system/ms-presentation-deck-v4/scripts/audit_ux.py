#!/usr/bin/env python3
"""UX and accessibility audit for a generated HTML deck."""
import argparse
import re
import sys
from html.parser import HTMLParser


class DeckUXParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.errors = []
        self.warnings = []
        self.buttons = []
        self.videos = []

    def error(self, message, line=None):
        self.errors.append(f'line {line or self.getpos()[0]}: {message}')

    def warning(self, message, line=None):
        self.warnings.append(f'line {line or self.getpos()[0]}: {message}')

    def handle_starttag(self, tag, attrs):
        line = self.getpos()[0]
        pairs = dict(attrs)
        classes = set((pairs.get('class') or '').split())

        if tag == 'img' and pairs.get('aria-hidden') != 'true' and not (pairs.get('alt') or '').strip():
            self.error('meaningful image is missing alt text', line)

        if tag in {'img', 'image'}:
            kind = pairs.get('data-ps-asset-kind', '')
            if kind not in {'portrait', 'brand', 'photo', 'product-evidence'}:
                self.error(
                    'reference visual must be reconstructed as native SVG/HTML; '
                    'only genuine portrait, brand, photo or product-evidence images may declare data-ps-asset-kind',
                    line,
                )

        if tag == 'video':
            if 'controls' not in pairs:
                self.error('video must expose controls', line)
            if 'autoplay' in pairs:
                self.error('video must not autoplay', line)
            if not (pairs.get('poster') or '').strip():
                self.error('video requires a poster frame', line)
            if not (pairs.get('aria-label') or pairs.get('aria-labelledby')):
                self.error('video requires an accessible name', line)
            self.videos.append({
                'line': line,
                'captions': False,
                'transcript': bool((pairs.get('data-transcript') or '').strip()),
            })

        if tag == 'track' and self.videos and pairs.get('kind') in {'captions', 'subtitles'}:
            self.videos[-1]['captions'] = True

        if tag == 'svg' and classes.intersection({'ch', 'dg', 'scn'}):
            if not (pairs.get('aria-label') or pairs.get('aria-labelledby')):
                self.error(f'{"/".join(sorted(classes.intersection({"ch", "dg", "scn"})))} SVG requires an accessible name', line)

        if tag == 'a' and pairs.get('target') == '_blank' and 'noopener' not in (pairs.get('rel') or '').split():
            self.error('target=_blank link is missing rel=noopener', line)

        if tag == 'button':
            self.buttons.append({
                'line': line,
                'label': (pairs.get('aria-label') or pairs.get('title') or '').strip(),
                'text': '',
            })

        if classes.intersection({'ipanel', 'csim__out', 'poll__v'}) and pairs.get('aria-live') not in {'polite', 'assertive'}:
            self.error(f'{" ".join(sorted(classes))} result region is missing aria-live', line)

    def handle_data(self, data):
        if self.buttons:
            self.buttons[-1]['text'] += data

    def handle_endtag(self, tag):
        if tag == 'button' and self.buttons:
            button = self.buttons.pop()
            if not button['label'] and not button['text'].strip():
                self.error('button has no accessible name', button['line'])
        if tag == 'video' and self.videos:
            video = self.videos.pop()
            if not video['captions'] and not video['transcript']:
                self.error('video needs a captions track or transcript reference', video['line'])


def audit(path):
    with open(path, encoding='utf-8') as deck_file:
        markup = deck_file.read()
    parser = DeckUXParser()
    parser.feed(markup)

    if 'prefers-reduced-motion' not in markup:
        parser.errors.append('document: reduced-motion fallback is missing')
    if 'focus-visible' not in markup:
        parser.errors.append('document: visible keyboard focus styles are missing')
    if "document.addEventListener('keydown'" not in markup and 'document.addEventListener("keydown"' not in markup:
        parser.errors.append('document: keyboard navigation handler is missing')
    if not re.search(r'<meta\s+name="viewport"', markup):
        parser.errors.append('document: viewport meta tag is missing')

    print(f'=== UX audit: {path} ===')
    for issue in parser.errors:
        print(f'  FAIL: {issue}')
    for issue in parser.warnings:
        print(f'  WARN: {issue}')
    print(f'=== Result: {len(parser.errors)} errors, {len(parser.warnings)} warnings ===')
    return 1 if parser.errors else 0


def main():
    argp = argparse.ArgumentParser()
    argp.add_argument('deck')
    args = argp.parse_args()
    sys.exit(audit(args.deck))


if __name__ == '__main__':
    main()
