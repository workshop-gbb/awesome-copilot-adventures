---
title: Site design system
permalink: /design-system/
last_verified: "2026-09-07"
---

# Site design system

## Reference and evidence

The visual reference is [Agentic DevOps Platform](https://agenticdevopsplatform.ai/en/),
inspected on 2026-09-07 through its public HTML/CSS and a browser screenshot.
Firecrawl was unavailable because its configured token was invalid; no Firecrawl
branding result is claimed.

We implement an original learning-site layout inspired by those visual conventions.
The reference's logo, portrait, illustrations, text and analytics code are not copied.
Original curriculum content and monochrome diagrams remain the learning material.

## Observed design tokens

| Role | Reference value |
| --- | --- |
| Primary ink | `#1a1a1a` |
| Secondary text | `#3a3a3a` |
| Muted text | `#737373` |
| Paper | `#ffffff` |
| Page background | `#fcfcfb` |
| Alternate surface | `#f7f7f5` |
| Fine rule | `#e5e5e0` |
| Strong rule | `#cecec7` |
| Red accent | `#ff3133` |
| Green accent | `#7ed956` |
| Blue accent | `#39b8ff` |
| Yellow accent | `#ffde59` |

The accents identify navigation/card families and decorative rules, not diagram
semantics. Every Mermaid diagram retains the repository's white/ice/gray/black
palette and accessible legend.

## Typography and layout

The reference uses Inter for prose and JetBrains Mono for small uppercase labels.
Both fonts are bundled locally, with system fallbacks and no third-party font
request. Their [Inter license](../assets/site/fonts/OFL-Inter.txt) and
[JetBrains Mono license](../assets/site/fonts/OFL-JetBrains-Mono.txt) are included.

- Sticky, compact masthead with independent navigation, locale and theme controls.
- Dark introductory hero, strong editorial heading, restrained accent rules.
- Wide but bounded content container; readable article width and generous spacing.
- Square or subtly rounded cards, thin borders and minimal shadow.
- Sidebar navigation for learning documents; on-page table of contents for long guides.
- Responsive grids collapse into a single column without hiding essential content.

Exact spacing outside the inspected reference CSS is an implementation choice,
not a claim of pixel-perfect reproduction.

## Components

- Three real locale routes: English, Spanish and Brazilian Portuguese.
- Same-document language links, never a switch that always returns to the homepage.
- Search scoped to the selected language, with clearly labeled original-source entries.
- Repository explorer with all source files, code/data previews and original downloads.
- Notices for legacy material, untranslated executable examples and preserved licenses.
- Visible keyboard focus, skip link, mobile menu and reduced-motion behavior.

## Content rules

### Design for the first-time learner

The root README and [Start here](start-here.md) must lead to one runnable first
exercise before presenting the complete library. [Learning order](learning-path.md)
labels required, optional, advanced and maintainer work. [Downloads](downloads.md)
provides per-lab materials instead of requiring a full checkout.

Every primary lesson should answer: what am I learning, why would I use it, what
must already work, where do I run the command, what result should I observe, and
how do I recover? The finish must be an evidence checklist, not a marketing claim.

### Markdown editorial pattern

- One primary title and a short purpose statement before the details.
- A briefing table for scope, prerequisites, time estimate and expected evidence.
- Semantic headings and links that describe their destination.
- GFM notes, tips and warnings for actual decisions; do not rely on color alone.
- Numbered actions, copyable commands with working-directory context, and checkpoints.
- A concept-specific illustration or diagram with meaningful alternative text.
- Required versus optional execution clearly separated, especially for live services.
- Next-step navigation and a safe reset that protects other projects.

Illustrations explain a concept; they do not substitute for runnable evidence.
Historical interface captures must not imply current feature availability. The
professional hands-on track stays non-fantasy; stories remain in adventures.

Translate current learning prose, navigation and document metadata. Preserve
identifiers, commands, code samples, exact data and URLs so exercises remain
reproducible. Historical material and machine-consumed files remain available as
original source with a localized notice, not falsely labeled as translated lessons.

No automatic third-party translation, model request, analytics, or credential is
required to read the site.

## Build and verification

Use Astro's static build, validated content collections and GitHub Actions
publication. Missing translations, broken local links, incomplete source coverage
and invalid locale routes are build errors rather than silent English fallbacks.

Verify desktop and mobile navigation, keyboard operation, same-page language
switching, localized search, source downloads and Mermaid rendering before publishing.

The [publishing guide](site-publishing.md) documents the build, generated files and
official Astro/GitHub references. The layout is original; it does not require a
third-party theme or client-side application framework.

## Interaction and motion

The language selector remains visible in the masthead at every viewport size;
the homepage also names all three languages. Switching language preserves the
document, heading fragment and active library filters.

The hero contains a keyboard-operable, five-stage workflow accordion. The library
combines topic filtering, localized search and optional reading marks. Reading
marks are self-reported browser-local state, never proof that a lab or test passed;
learners can clear only this site's marks with an explicit confirmation.

Entrance animations, one-time section reveals, bounded count transitions, card
feedback and a scroll progress indicator add motion without a canvas or animation
framework. Reduced-motion preferences disable the effects. Essential content stays
readable without JavaScript; native workflow disclosures still work.
