"""Shared visual taxonomy for generated decks.

The builder writes the detected family and archetype on every content slide. The census uses the
same classifier, so custom slides can be validated without keeping two lists of visual markers.
"""
import re


KNOWN_PROFILES = {
    'standard', 'executive', 'keynote', 'technical', 'workshop', 'training',
    'sales', 'proposal', 'data-story', 'report', 'portfolio', 'demo', 'catalog',
}

PROFILE_ALIASES = {
    'data': 'data-story',
    'data-report': 'report',
    'deep-dive': 'technical',
    'product-demo': 'demo',
}


def slug(value):
    return re.sub(r'[^a-z0-9]+', '-', str(value).strip().lower()).strip('-')


def canonical_archetype(value):
    return re.sub(r'[^A-Z0-9]+', '_', str(value).strip().upper()).strip('_')


def normalize_profile(value):
    profile = PROFILE_ALIASES.get(slug(value or 'standard'), slug(value or 'standard'))
    if profile not in KNOWN_PROFILES:
        raise ValueError(f'Unknown deck profile "{value}". Expected one of: {", ".join(sorted(KNOWN_PROFILES))}')
    return profile


def profile_policy(profile):
    profile = normalize_profile(profile)
    if profile == 'catalog':
        return 'catalog'
    if profile in {'data-story', 'report', 'portfolio'}:
        return 'data'
    if profile in {'workshop', 'training', 'demo'}:
        return 'experience'
    return 'standard'


def _attr(markup, name):
    match = re.search(r'\b' + re.escape(name) + r'="([^"]+)"', markup)
    return match.group(1) if match else None


def has_class(markup, name):
    return any(name in value.split() for value in re.findall(r'class="([^"]*)"', markup))


def has_root_class(markup, name):
    opening = re.match(r'<section\b[^>]*>', markup)
    if not opening:
        return False
    classes = re.search(r'\bclass="([^"]*)"', opening.group(0))
    return bool(classes and name in classes.group(1).split())


def family_for_archetype(archetype):
    a = canonical_archetype(archetype)
    if a in {'COVER', 'WHO', 'AGENDA', 'DIVIDER', 'CLOSING'}:
        return 'structure'
    if a.startswith('CHART_') or a in {'BIG_NUMBERS', 'KPIS', 'STATS', 'BARS', 'RULER'}:
        return 'data'
    if a.startswith('DIAGRAM_') or a == 'DIAGRAM':
        return 'diagram'
    if a.startswith('SCENE_') or a == 'SCENE':
        return 'motion'
    if a in {'TERMINAL', 'VSCODE', 'CHAT', 'PORTAL', 'GITHUB', 'BROWSER', 'PHONE'}:
        return 'simulation'
    if a in {'QUIZ', 'ASSESSMENT', 'CALCULATOR', 'TOGGLE', 'TABS', 'HOTSPOTS', 'POLL', 'CHAIN_SIM'}:
        return 'interactive'
    if a in {'FIGURE', 'FIGURE_WIDE', 'STATEMENT_PHOTO', 'IMAGE_COMPARE', 'VIDEO', 'SHAPES', 'ICONS'}:
        return 'media'
    if a in {'CODE', 'CODEBLOCK', 'DIFF', 'MARKDOWN', 'TREE', 'LINKS'}:
        return 'technical'
    if a in {'CHECKLIST', 'STEPS', 'DODONT', 'TIMELINE', 'GANTT'}:
        return 'process'
    if a in {'TABLE', 'TIERS', 'QUADRANT', 'DEFS', 'GLOSSARY'}:
        return 'structured'
    if a in {
        'HERO_STATEMENT', 'LEDGER', 'TILES', 'QUOTE', 'COMPARE', 'CHIPS',
        'CARDS3', 'CARDS', 'READ_BEFORE',
    }:
        return 'editorial'
    return 'custom'


PRIORITY_CLASSES = (
    ('gloss', 'GLOSSARY', 'structured', False),
    ('csim', 'CHAIN_SIM', 'interactive', True),
    ('quiz', 'QUIZ', 'interactive', True),
    ('qz', 'QUIZ', 'interactive', True),
    ('assess', 'ASSESSMENT', 'interactive', True),
    ('calc', 'CALCULATOR', 'interactive', True),
    ('toggle', 'TOGGLE', 'interactive', True),
    ('tabs', 'TABS', 'interactive', True),
    ('hot', 'HOTSPOTS', 'interactive', True),
    ('poll', 'POLL', 'interactive', True),
    ('tsim', 'TASK_SIMULATION', 'simulation', True),
    ('fsimwrap', 'FLOW_SIMULATION', 'simulation', True),
    ('rsim', 'REQUEST_SIMULATION', 'simulation', True),
    ('sim', 'SCENARIO_SIMULATOR', 'interactive', True),
    ('vsim', 'VSCODE', 'simulation', True),
    ('vsc2', 'VSCODE', 'simulation', True),
    ('ph', 'PROMPT_HISTORY', 'interactive', True),
    ('cat', 'CATALOG_EXPLORER', 'interactive', True),
    ('asm', 'ASSESSMENT', 'interactive', True),
    ('loop-hero', 'LOOP_TERMINAL', 'simulation', True),
    ('request-path', 'DIAGRAM_REQUEST_PATH', 'diagram', True),
    ('data-boundary', 'DIAGRAM_DATA_BOUNDARY', 'diagram', True),
    ('identity-path', 'DIAGRAM_IDENTITY_PATH', 'diagram', True),
    ('term', 'TERMINAL', 'simulation', True),
    ('vsc', 'VSCODE', 'simulation', True),
    ('chatwin', 'CHAT', 'simulation', True),
    ('portal', 'PORTAL', 'simulation', True),
    ('ghpr', 'GITHUB', 'simulation', True),
    ('browser', 'BROWSER', 'simulation', True),
    ('phone', 'PHONE', 'simulation', True),
    ('codewin', 'CODE', 'technical', False),
)

LEGACY_CONTENT_CLASSES = (
    ('agenda-list', 'AGENDA', 'structure', False),
    ('dvd', 'DIVIDER', 'structure', False),
    ('dt--bands', 'EVIDENCE_ROWS', 'data', False),
    ('dt--duel', 'COMPARISON_TABLE', 'structured', False),
    ('dt--anat', 'ANATOMY', 'structured', False),
    ('rub--cards', 'CARDS3', 'editorial', False),
    ('st--process', 'CODE_WALKTHROUGH', 'process', False),
    ('activation-steps', 'STEPS', 'process', False),
    ('operation-model', 'CHECKLIST', 'process', False),
    ('key-compare', 'COMPARE', 'editorial', False),
    ('endpoint-map', 'DIAGRAM_ENDPOINTS', 'diagram', True),
    ('control-plane-compare', 'CONTROL_PLANE_COMPARE', 'structured', False),
    ('intake-contract', 'INTAKE_CONTRACT', 'process', False),
    ('defender-coverage', 'COMPARE', 'editorial', False),
    ('network-decision', 'DECISION_FLOW', 'process', False),
    ('gateway-policy-map', 'POLICY_MAP', 'structured', False),
    ('threat-model', 'RISK_BOARD', 'structured', False),
    ('deal-ownership', 'RESPONSIBILITY_GRID', 'structured', False),
    ('request-path', 'DIAGRAM_REQUEST_PATH', 'diagram', True),
    ('data-boundary', 'DIAGRAM_DATA_BOUNDARY', 'diagram', True),
    ('identity-path', 'DIAGRAM_IDENTITY_PATH', 'diagram', True),
    ('roadviz', 'ROADMAP', 'process', True),
    ('rowline', 'ROLLOUT', 'process', False),
    ('qfn', 'PROCESS_FUNNEL', 'process', True),
    ('tlrow', 'TIMELINE', 'process', False),
    ('tml', 'TIMELINE', 'process', False),
    ('tl', 'TIMELINE', 'process', False),
    ('flow', 'FLOW', 'process', False),
    ('railtrack', 'PROCESS_RAIL', 'process', False),
    ('arc', 'PROCESS_ARC', 'process', False),
    ('apt', 'DODONT', 'process', False),
    ('riskboard', 'RISK_BOARD', 'structured', False),
    ('rub', 'RUBRIC', 'structured', False),
    ('layer-row', 'DECISION_LAYERS', 'structured', False),
    ('oneline', 'PROGRAM_LINES', 'structured', False),
    ('hl', 'HIGHLIGHTS', 'structured', False),
    ('pillar-grid--4', 'CARDS', 'editorial', False),
    ('pillar-grid', 'PILLARS', 'structured', False),
    ('pillar-card__points', 'PILLARS', 'structured', False),
    ('pillar-card', 'PILLARS', 'structured', False),
    ('wingrid', 'USE_CASE_GRID', 'structured', False),
    ('tier', 'TIERS', 'structured', False),
    ('ghgrid', 'SURFACE_MATRIX', 'structured', False),
    ('fdn', 'EVIDENCE_ROWS', 'structured', False),
    ('stat-pair', 'BIG_NUMBERS', 'data', False),
    ('fct', 'FACT_LEDGER', 'editorial', False),
    ('quotes', 'QUOTE', 'editorial', False),
    ('ba2', 'COMPARE', 'editorial', False),
    ('ba', 'BEFORE_AFTER', 'editorial', False),
    ('chg', 'CHANGE_MAP', 'editorial', False),
    ('ef', 'COMPARE', 'editorial', False),
    ('plain', 'HERO_STATEMENT', 'editorial', True),
    ('photocards', 'IMAGE_GRID', 'media', True),
    ('rcpt-wrap', 'COST_RECEIPT', 'data', False),
    ('tokb', 'TOKEN_BUDGET', 'data', False),
    ('rul', 'RULER', 'data', False),
    ('dash', 'DASHBOARD', 'data', True),
    ('ice', 'DIAGRAM_ICEBERG', 'diagram', True),
    ('sqd', 'DIAGRAM_SEQUENCE', 'diagram', True),
    ('dg-wrap', 'DIAGRAM_FLOW', 'diagram', True),
    ('metro', 'DIAGRAM_METRO_MAP', 'diagram', True),
    ('at__top', 'DIAGRAM_AGENT_TOPOLOGY', 'diagram', True),
    ('stk', 'DIAGRAM_STACK', 'diagram', True),
    ('spt', 'ANNOTATED_POINTS', 'structured', False),
    ('dfz', 'DIAGRAM_DEFENSE_LAYERS', 'diagram', True),
    ('alayer', 'DIAGRAM_LAYERS', 'diagram', True),
    ('plane-stack', 'DIAGRAM_LAYERS', 'diagram', True),
    ('surfmap', 'DIAGRAM_SURFACE_MAP', 'diagram', True),
    ('thes', 'DIAGRAM_BOUNDARY', 'diagram', True),
    ('stack', 'DIAGRAM_STACK', 'diagram', True),
    ('card--ico', 'CAPABILITY_GRID', 'editorial', False),
    ('kico', 'KEY_CONCEPTS', 'editorial', False),
    ('arcn2', 'PROCESS_ARC', 'process', False),
    ('lkc', 'CAPABILITY_MAP', 'structured', False),
    ('ea', 'ERROR_ANATOMY', 'structured', False),
    ('judge', 'DECISION_BOARD', 'structured', False),
    ('hd', 'HIERARCHY', 'structured', False),
    ('dec', 'DECISION_LAYERS', 'structured', False),
    ('pat', 'PATTERN_CATALOG', 'structured', False),
    ('mr', 'MATURITY_REVIEW', 'structured', False),
    ('fd', 'FAILURE_DIMENSIONS', 'structured', False),
    ('lim', 'LIMITS', 'structured', False),
    ('an', 'ANNOTATED_FILE', 'technical', False),
    ('logp', 'LOG_PATTERN', 'technical', False),
    ('lk', 'LINKS', 'technical', False),
    ('gt', 'GATE_TRACK', 'process', False),
    ('tsq', 'TASK_SEQUENCE', 'process', False),
    ('hp', 'HARNESS_PATH', 'process', False),
    ('fi', 'FAILURE_INVENTORY', 'process', False),
    ('lo', 'LOOP_OUTCOMES', 'process', False),
    ('ring-hero', 'SCENE_LOOP_RING', 'motion', True),
    ('bw', 'GITHUB_PR', 'simulation', True),
)


CONTENT_CLASSES = (
    ('hero-stmt', 'HERO_STATEMENT', 'editorial', True),
    ('bignums', 'BIG_NUMBERS', 'data', False),
    ('ledg', 'LEDGER', 'editorial', False),
    ('tiles', 'TILES', 'editorial', False),
    ('kpis', 'KPIS', 'data', False),
    ('tline', 'TIMELINE', 'process', False),
    ('bquote', 'QUOTE', 'editorial', False),
    ('checks', 'CHECKLIST', 'process', False),
    ('steps', 'STEPS', 'process', False),
    ('dodont', 'DODONT', 'process', False),
    ('defs', 'DEFS', 'structured', False),
    ('gloss', 'GLOSSARY', 'structured', False),
    ('ptiers', 'TIERS', 'structured', False),
    ('quad', 'QUADRANT', 'structured', False),
    ('stats', 'STATS', 'data', False),
    ('pbars', 'BARS', 'data', False),
    ('ruler', 'RULER', 'data', False),
    ('gantt', 'GANTT', 'process', False),
    ('imgcmp', 'IMAGE_COMPARE', 'media', False),
    ('figw', 'FIGURE_WIDE', 'media', False),
    ('fig', 'FIGURE', 'media', False),
    ('stmt', 'STATEMENT_PHOTO', 'media', True),
    ('vid', 'VIDEO', 'media', False),
    ('shapes', 'SHAPES', 'media', False),
    ('icongrid', 'ICONS', 'media', False),
    ('codewin', 'CODE', 'technical', False),
    ('diff', 'DIFF', 'technical', False),
    ('mdsrc', 'MARKDOWN', 'technical', False),
    ('tree', 'TREE', 'technical', False),
    ('linkcards', 'LINKS', 'technical', False),
    ('dt', 'TABLE', 'structured', False),
    ('code-block', 'CODEBLOCK', 'technical', False),
    ('grid-3', 'CARDS3', 'editorial', False),
    ('cmp', 'COMPARE', 'editorial', False),
    ('chips', 'CHIPS', 'editorial', False),
    ('card', 'CARDS', 'editorial', False),
)


def classify_slide(markup):
    """Return (archetype, family, hero) for a slide or component body."""
    explicit_archetype = _attr(markup, 'data-ps-archetype')
    explicit_family = _attr(markup, 'data-ps-family')
    explicit_hero = _attr(markup, 'data-ps-hero')
    if explicit_archetype:
        archetype = canonical_archetype(explicit_archetype)
        family = slug(explicit_family) if explicit_family else family_for_archetype(archetype)
        hero = explicit_hero in {'1', 'true', 'yes'} if explicit_hero is not None else family in {
            'motion', 'simulation', 'interactive',
        } or archetype == 'HERO_STATEMENT'
        return archetype, family, hero

    if has_root_class(markup, 'cover2'):
        return 'COVER', 'structure', False
    if has_root_class(markup, 'who'):
        return 'WHO', 'structure', False
    if has_class(markup, 'agenda'):
        return 'AGENDA', 'structure', False
    if has_class(markup, 'section-number'):
        return 'DIVIDER', 'structure', False
    if 'data-i18n="closing.title"' in markup and 'paulasilva@microsoft.com' in markup:
        return 'CLOSING', 'structure', False
    if 'mailto:paulasilva@microsoft.com' in markup and 'data-fitlines' in markup:
        return 'CLOSING', 'structure', False

    for class_name, archetype, family, hero in PRIORITY_CLASSES:
        if has_class(markup, class_name):
            return archetype, family, hero

    if has_class(markup, 'scene') or has_class(markup, 'scn'):
        kind = canonical_archetype(_attr(markup, 'data-scene-kind') or 'generic')
        return f'SCENE_{kind}', 'motion', True

    if has_class(markup, 'ch'):
        kind = canonical_archetype(_attr(markup, 'data-chart-kind') or 'generic')
        return f'CHART_{kind}', 'data', False

    if has_class(markup, 'dg'):
        kind = canonical_archetype(_attr(markup, 'data-diagram-kind') or 'generic')
        return f'DIAGRAM_{kind}', 'diagram', False

    for class_name, archetype, family, hero in LEGACY_CONTENT_CLASSES:
        if has_class(markup, class_name):
            return archetype, family, hero

    for class_name, archetype, family, hero in CONTENT_CLASSES:
        if has_class(markup, class_name):
            return archetype, family, hero

    return 'OTHER', 'other', False
