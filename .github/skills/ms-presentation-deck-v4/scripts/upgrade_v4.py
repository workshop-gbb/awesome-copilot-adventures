#!/usr/bin/env python3
"""Upgrade a generated v3 deck with v4 profile, taxonomy, and UX metadata.

This migration does not change slide content or layout. It adds accessible names, live regions,
visual classification, and the deck profile required by the v4 quality gates.
"""
import argparse
import os
import re
import sys
from html import escape, unescape

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from visual_taxonomy import classify_slide, normalize_profile, slug
from slide_markup import SLIDE_RE


SECTION_RE = SLIDE_RE


def add_attr(tag, name, value):
    if re.search(r'\b' + re.escape(name) + r'=', tag):
        return tag
    return tag[:-1] + f' {name}="{escape(str(value), quote=True)}">'


def ensure_attr_on_class(markup, tag_name, class_name, attr, value):
    pattern = re.compile(r'<' + tag_name + r'\b[^>]*>', re.I)

    def replace(match):
        tag = match.group(0)
        classes = re.search(r'\bclass="([^"]*)"', tag)
        if not classes or class_name not in classes.group(1).split():
            return tag
        return add_attr(tag, attr, value)

    return pattern.sub(replace, markup)


def plain_title(section):
    match = re.search(r'<(?:h1|h2)\b[^>]*>(.*?)</(?:h1|h2)>', section, re.S)
    if not match:
        return 'Slide visual'
    text = re.sub(r'<[^>]+>', ' ', match.group(1))
    return re.sub(r'\s+', ' ', unescape(text)).strip() or 'Slide visual'


def upgrade_section(section):
    archetype, family, hero = classify_slide(section)
    open_tag = re.match(r'<section\b[^>]*>', section).group(0)
    upgraded_tag = add_attr(open_tag, 'data-ps-family', slug(family))
    upgraded_tag = add_attr(upgraded_tag, 'data-ps-archetype', slug(archetype))
    if hero:
        upgraded_tag = add_attr(upgraded_tag, 'data-ps-hero', '1')
    section = upgraded_tag + section[len(open_tag):]

    title = plain_title(section)
    for cls, suffix in (('ch', 'chart'), ('dg', 'diagram'), ('scn', 'animated scene')):
        section = ensure_attr_on_class(section, 'svg', cls, 'aria-label', f'{title} - {suffix}')

    for cls in ('ipanel', 'csim__out', 'poll__v'):
        section = ensure_attr_on_class(section, 'div', cls, 'aria-live', 'polite')

    def upgrade_video(match):
        tag = add_attr(match.group(0), 'aria-label', f'{title} - recorded demonstration')
        if 'data-transcript=' not in tag:
            tag = add_attr(tag, 'data-transcript', 'Speaker notes contain the narrated walkthrough.')
        return tag

    return re.sub(r'<video\b[^>]*>', upgrade_video, section)


def upgrade(markup, profile):
    profile = normalize_profile(profile)
    if not re.search(r'<meta name="ps-deck-profile"', markup):
        markup = markup.replace('</head>', f'<meta name="ps-deck-profile" content="{profile}">\n</head>', 1)
    else:
        markup = re.sub(
            r'<meta name="ps-deck-profile" content="[^"]*">',
            f'<meta name="ps-deck-profile" content="{profile}">',
            markup,
            count=1,
        )
    return SECTION_RE.sub(lambda match: upgrade_section(match.group(0)), markup)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('deck')
    parser.add_argument('--profile', default='standard')
    output = parser.add_mutually_exclusive_group()
    output.add_argument('--output')
    output.add_argument('--in-place', action='store_true')
    args = parser.parse_args()

    with open(args.deck, encoding='utf-8') as deck_file:
        source = deck_file.read()
    upgraded = upgrade(source, args.profile)
    destination = args.deck if args.in_place or not args.output else args.output
    with open(destination, 'w', encoding='utf-8') as deck_file:
        deck_file.write(upgraded)
    print(f'{destination}: upgraded to v4 profile {normalize_profile(args.profile)}')


if __name__ == '__main__':
    main()
