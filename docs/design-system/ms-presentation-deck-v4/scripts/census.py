#!/usr/bin/env python3
"""Visual diversity gate for generated decks.

Usage:
    python census.py deck.html
    python census.py deck.html --profile workshop
    python census.py deck.html --list DIAGRAM_SEQUENCE

The gate measures both visual families and exact archetypes, checks repeated runs, and verifies that
major sections open with a hero within their first two content slides. Thresholds scale with deck
length and relax only for profiles whose content legitimately concentrates in one family.
"""
import argparse
import collections
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from visual_taxonomy import canonical_archetype, classify_slide, normalize_profile, profile_policy
from slide_markup import SLIDE_RE


def extract_slides(markup):
    return SLIDE_RE.findall(markup)


def profile_from_markup(markup):
    match = re.search(r'<meta name="ps-deck-profile" content="([^"]+)"', markup)
    return match.group(1) if match else 'standard'


def size_targets(count):
    if count <= 5:
        return 2, 3, 0.50
    if count <= 10:
        return 3, 4, 0.40
    if count <= 20:
        return 4, 6, 0.32
    if count <= 35:
        return 5, 8, 0.28
    if count <= 60:
        return 6, 11, 0.24
    return 7, 14, 0.20


def longest_run(records, key):
    best = (0, None, None)
    current_value = None
    current_start = None
    current_count = 0
    for record in records:
        if record['family'] == 'structure':
            current_value = None
            current_start = None
            current_count = 0
            continue
        value = record[key]
        if value == current_value:
            current_count += 1
        else:
            current_value = value
            current_start = record['slide']
            current_count = 1
        if current_count > best[0]:
            best = (current_count, current_start, value)
    return best


def section_hero_issues(records):
    issues = []
    divider_positions = [i for i, record in enumerate(records) if record['archetype'] == 'DIVIDER']
    if not divider_positions:
        content = [r for r in records if r['family'] != 'structure']
        if len(content) >= 8 and not any(r['hero'] for r in content):
            issues.append('Decks with eight or more content slides need at least one hero composition.')
        return issues

    for pos_i, start in enumerate(divider_positions):
        end = divider_positions[pos_i + 1] if pos_i + 1 < len(divider_positions) else len(records)
        section = [
            r for r in records[start + 1:end]
            if r['family'] != 'structure'
        ]
        if len(section) >= 2 and not any(r['hero'] for r in section[:2]):
            issues.append(
                f'Section after divider slide {records[start]["slide"]} has no hero in its first two '
                f'content slides ({section[0]["slide"]}, {section[1]["slide"]}).'
            )
    return issues


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('deck')
    parser.add_argument('--profile', help='Override the profile embedded by Deck(profile=...).')
    parser.add_argument('--list', dest='list_archetype', help='List slide numbers for one archetype.')
    parser.add_argument('--details', action='store_true', help='Print the slide-by-slide classification.')
    args = parser.parse_args()

    with open(args.deck, encoding='utf-8') as deck_file:
        markup = deck_file.read()
    try:
        profile = normalize_profile(args.profile or profile_from_markup(markup))
    except ValueError as exc:
        print(f'FAIL: {exc}')
        return 1
    policy = profile_policy(profile)

    records = []
    for index, slide in enumerate(extract_slides(markup), 1):
        archetype, family, hero = classify_slide(slide)
        records.append({
            'slide': index,
            'archetype': archetype,
            'family': family,
            'hero': hero,
        })

    if args.list_archetype:
        wanted = canonical_archetype(args.list_archetype)
        print([r['slide'] for r in records if r['archetype'] == wanted])
        return 0

    content = [r for r in records if r['family'] != 'structure']
    family_counts = collections.Counter(r['family'] for r in content)
    archetype_counts = collections.Counter(r['archetype'] for r in content)
    count = len(content)

    print(f'Profile: {profile} ({policy} policy)')
    print('\nFamilies')
    for family, n in family_counts.most_common():
        print(f'{family:14} {n:3}  {n / max(1, count) * 100:5.1f}%')
    print('\nArchetypes')
    for archetype, n in archetype_counts.most_common():
        print(f'{archetype:24} {n:3}  {n / max(1, count) * 100:5.1f}%')
    print(
        f'\n{len(records)} slides, {count} content slides, '
        f'{len(family_counts)} visual families, {len(archetype_counts)} archetypes'
    )

    if args.details:
        print('\nSlide map')
        for record in records:
            marker = ' hero' if record['hero'] else ''
            print(
                f'{record["slide"]:3}: {record["family"]:12} '
                f'{record["archetype"]}{marker}'
            )

    if not content:
        print('\nFAIL: no content slides found.')
        return 1

    min_families, min_archetypes, max_archetype_share = size_targets(count)
    max_family_share = 0.45
    max_archetype_run = 2 if count >= 7 else 3
    max_family_run = 3 if count >= 10 else 4
    hero_gate = True

    if policy == 'data':
        min_families = max(3, min_families - 1)
        min_archetypes = max(5, min_archetypes - 1)
        max_family_share = 0.75
        max_family_run = 6
    elif policy == 'experience':
        max_family_share = 0.60
        max_family_run = 5
    elif policy == 'catalog':
        min_families = min(8, count)
        min_archetypes = min(20, count)
        max_archetype_share = 0.30
        max_family_share = 1.0
        max_archetype_run = count
        max_family_run = count
        hero_gate = False

    issues = []
    unclassified = [r['slide'] for r in content if r['archetype'] == 'OTHER' or r['family'] == 'other']
    if unclassified:
        issues.append(
            f'Unclassified content slides {unclassified}. Pass family= and archetype= to Deck.content '
            'or add the component to visual_taxonomy.py.'
        )
    if len(family_counts) < min_families:
        issues.append(f'Only {len(family_counts)} visual families; this {count}-slide deck needs at least {min_families}.')
    if len(archetype_counts) < min_archetypes:
        issues.append(f'Only {len(archetype_counts)} archetypes; this {count}-slide deck needs at least {min_archetypes}.')

    dominant_archetype, dominant_archetype_count = archetype_counts.most_common(1)[0]
    if dominant_archetype_count / count > max_archetype_share:
        issues.append(
            f'{dominant_archetype} occupies {dominant_archetype_count / count * 100:.1f}% of content '
            f'(limit {max_archetype_share * 100:.0f}%).'
        )
    dominant_family, dominant_family_count = family_counts.most_common(1)[0]
    if dominant_family_count / count > max_family_share:
        issues.append(
            f'Family {dominant_family} occupies {dominant_family_count / count * 100:.1f}% of content '
            f'(limit {max_family_share * 100:.0f}% for profile {profile}).'
        )

    archetype_run = longest_run(records, 'archetype')
    if archetype_run[0] > max_archetype_run:
        issues.append(
            f'{archetype_run[0]} consecutive {archetype_run[2]} slides starting at slide '
            f'{archetype_run[1]} (limit {max_archetype_run}).'
        )
    family_run = longest_run(records, 'family')
    if family_run[0] > max_family_run:
        issues.append(
            f'{family_run[0]} consecutive slides from family {family_run[2]} starting at slide '
            f'{family_run[1]} (limit {max_family_run}).'
        )

    if hero_gate:
        issues.extend(section_hero_issues(records))
    if policy == 'experience' and count >= 6:
        experiential = sum(family_counts[f] for f in ('interactive', 'simulation', 'motion'))
        if experiential == 0:
            issues.append(f'Profile {profile} needs at least one interactive, simulation, or animated scene.')

    hero_families = {r['family'] for r in content if r['hero']}
    divider_count = sum(1 for r in records if r['archetype'] == 'DIVIDER')
    if divider_count >= 4 and len(hero_families) == 1:
        print(
            f'\nWARN: all section heroes use the same family ({next(iter(hero_families), "none")}). '
            'Rotate scene, simulation, interaction, diagram, or editorial hero when the content supports it.'
        )

    if issues:
        print('\nFAIL')
        for issue in issues:
            print(f'  - {issue}')
        return 1

    print('\nPASS: visual diversity, repetition, and hero cadence are within the profile limits.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
