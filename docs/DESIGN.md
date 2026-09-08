---
title: Site design system
permalink: /design-system/
last_verified: "2026-09-07"
---

# Site design system

## Reference and evidence

The canonical visual reference is the supplied
[Hub Editorial Studio](design-system/hub-editorial/README.md),
inspected on 2026-09-07. Astro imports its framework-independent tokens and local
fonts directly; site styles map existing names to those tokens instead of keeping
a second palette. Both theme attributes stay synchronized.

The standalone React showcase is reference material, not the site's runtime or a
translated lesson. The Astro site uses native controls and small JavaScript
modules. Product logos and the supplied icon-library cover are not repurposed as
the curriculum's identity. Original curriculum illustrations and monochrome
diagrams retain their aspect ratios and colors in both themes.

## Observed design tokens

| Role | Reference value |
| --- | --- |
| Primary ink | `#1a1a1a` |
| Secondary text | `#3a3a3a` |
| Muted text | `#686864` |
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

Reading text stays at the 16 px body token on narrow screens. Navigation, filters,
source actions and learning controls use the 44 px touch-target token. The masthead
switches to its compact menu at 1280 px to leave room for translated labels; code
blocks keep space above their first line for the copy control.

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

## Integrated practice studio

The [practice studio](simulations.md) is available in all three languages, linked
from the homepage, masthead, footer, learning navigation and related lessons.
Its tabs use stable fragments, keyboard navigation and readable non-JavaScript
fallbacks. Search and the sitemap include the page.

- Workflow: explicit play, pause, single step, playback speed, reset and a review
  failure that blocks the final evidence stage. Playback pauses on a hidden page
  or when the learner leaves the workflow tab; nothing plays automatically.
- Context: a bounded selection exercise with missing, over-budget, distracting
  and focused states. The displayed units are synthetic, not model tokens.
- Verification: three fixed JavaScript fixture checks run in the browser against
  incomplete or corrected implementations. Changing the implementation invalidates
  previous results. The module does not evaluate arbitrary code or call a service.

Simulation state is temporary and is never stored as course completion. Reading
marks remain separate, explicitly selected browser-local state and synchronize
between tabs. No simulation claims that a real agent, terminal or course lab ran.

## Image and icon handling

The site's line icons are small original SVGs with a consistent stroke and
decorative semantics; controls retain text or accessible names. Card illustrations
are decorative beside their lesson titles. Article images keep their descriptive
alternative text, can be enlarged in a keyboard-operable dialog, and retain an
original-image link. Closing the dialog restores focus. No image is inverted,
stretched or recolored to simulate dark mode.

The narrow layout exposes learning navigation as a native disclosure instead of
removing it. Primary controls use the design system's minimum touch target.
Reduced-motion preferences disable movement without disabling the learning tools.

## Adventure covers and animated montages

The 14 adventures use optimized 1456 x 832 WebP covers received from the maintainer,
while their original localized SVG concept illustrations remain in native disclosures.
The [cover inventory](../assets/images/adventures/README.md) records each pairing.
Fantasy artwork is limited to the adventure track; hands-on illustrations are unchanged.

The homepage and adventure catalog include 3 silent, 10-second animated montages
in a full-width editorial section. Each has a first-frame poster and a localized
visual description. Pointer hover or keyboard focus starts a scene without a
separate play button; leaving the scene restores the poster. Touch users can tap
the image to toggle playback. Only one clip plays at a time.

No video source is loaded before interaction. Page hiding and a switch to reduced
motion restore the poster without automatic resumption. With reduced motion, hover
and focus remain still and an explicit tap or activation is required. Direct links
remain available without JavaScript.

Original JPEGs and MP4s are preserved; optimized covers, silent playback copies
and posters are separate assets. The [media inventory](../assets/adventure-media.json)
maps the files, and the [video notes](../assets/video/README.md) describe playback
limits. Generated scenes are visual introductions, not UI screenshots or proof
that a lab, cloud agent or SDK session ran.
