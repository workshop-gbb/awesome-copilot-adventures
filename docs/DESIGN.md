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
This implementation uses those family names with system fallbacks, without requiring
an external font request.

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
