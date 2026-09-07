# The visual standard (v4.0.0)

Every deck uses the same brand system and engine, but its narrative, slide sequence, density, and
visual mix adapt to the audience and content. `assets/showcase_master_multi.html` is a catalog, not
a template to clone.

## 1. Stage and canvas

- Fixed 1280 x 720 stage, scaled to the viewport.
- Content slides use `padding: 34px 60px`: 1160px useful width and 652px useful height.
- Nothing crosses x = 1240 or y = 720. `qa_deck.py` checks all three locales.
- `fill_canvas.js` grows typography, padding, gaps, and margins until the composition uses the stage,
  and shrinks when necessary. Mocks and code grow at most 1.18x.
- A short slide is a composition problem, not permission to inflate a card. Add useful evidence,
  a source, an insight rail, or choose a stronger form.
- `data-nofill="1"` is reserved for fixed-height media, simulations, scenes, and shape layouts.
- Light and dark are the only page backgrounds. Never use a gradient page background or glow.
- The dark canvas is uniform black (`--ps-color-dark-bg: #000000`). The slide, structural
  dividers, closing and outer browser canvas use the same token, with no letterbox color seam.
  The light canvas is similarly continuous. Component surfaces are distinct only when that
  boundary carries meaning; text and icons must still meet the contrast requirement.
- Content slides use the faint code-background layer. It supports the slide; it never competes with
  the primary composition.

## 2. Adaptive structure

The story length determines the chrome:

- 4 to 7 content slides: agenda and dividers are optional.
- 8 to 15: two or three acts; agenda optional.
- 16 to 35: agenda and three to six parts.
- 36 or more: agenda and five to ten parts, with checkpoints or recaps.

Structural forms:

| Slide | Rule |
|---|---|
| Cover | `.cover2`: exactly two complete sentence lines, second in blue, Inter Medium 500 at 82px, no eyebrow, subtitle, date, logo block, or metadata. |
| Who | Optional. Use only when the audience needs speaker context or the deck will circulate without her. Photo, blue-bar quote, two content-focused paragraphs, corporate email. |
| Agenda | Generated from real divider positions. Clickable rows use the same bar glyphs as dividers. Never type ranges by hand. |
| Divider | Dark slide with bar numeral, one-line title, and subtitle only. |
| Closing | Dark slide with two-line title, italic tagline, corporate contact, published version, and optional quick-rule code block. No generic next-step panel. |

## 3. Typography

- Inter 300 to 700 and JetBrains Mono 400 to 600 are embedded as base64.
- Content title: `h2.title.title--small`, 32px, one line when possible, never more than two.
- Body copy uses `text-wrap: pretty`; titles use `balance`.
- `typo.py` prevents orphan words and dangling function words without hard-coded NBSP chains.
- Product names receive official marks only where the mark improves identification. Uppercase
  kickers remain intact.
- No em dash in deck copy.
- Technical identifiers may wrap only in designated `.brk` or `.lku` containers.

## 4. Color and brand

- Microsoft palette: red `#F25022`, green `#7FBA00`, yellow `#FFB900`, blue `#00A4EF`.
- One accent anchors each part, but semantic color wins inside the slide:
  red = problem or deny, green = correction or pass, yellow = decision or loop, blue = platform.
- A repeated entity or series keeps its color throughout the deck.
- Brand marks use official assets and vendor colors. Do not recolor or redraw them.
- Microsoft 4-square is the corporate deck brand. The Paula Silva logo is used only for personal
  channel material.

## 5. Composition: one dominant idea

The v4 rule is **one dominant composition per slide**, not one isolated component. Supporting
elements may coexist when they prove the same conclusion:

- chart + source + KPI row
- simulation + insight rail
- diagram + legend + one watch line
- hero statement + three evidence numbers
- table + highlighted recommendation

Do not combine two competing stories. If two elements need separate titles, they need separate
slides.

## 6. Visual families

| Family | Use for | Examples |
|---|---|---|
| editorial | thesis, tension, framing, quote, comparison | hero statement, tiles, ledger, quote, compare |
| data | magnitude, trend, share, distribution, progress | charts, KPIs, stats, bars, ruler |
| process | order, dates, execution, checks | steps, timeline, gantt, checklist |
| structured | trade-offs, lookup, taxonomy, matrix | table, tiers, quadrant, glossary, definitions |
| diagram | relation, boundary, architecture, flow | sequence, state, C4, request path, DAG, ER |
| motion | change over time or causal reveal | animated scene |
| simulation | faithful product behavior | terminal, VS Code, portal, GitHub, browser, phone |
| interactive | audience input and scenario exploration | quiz, assessment, calculator, chainsim |
| media | visual evidence or illustration | figure, video, SVG shapes, icon grid |
| technical | implementation artifact | code, diff, JSON tree, markdown, source links |

Read `adaptive-decks.md`, `patterns.md`, and `ux-design.md` before selecting forms.

## 7. Diversity contract

- `Deck.content()` writes `data-ps-family` and `data-ps-archetype` automatically for known
  components. Custom bodies declare `family=` and `archetype=`.
- Charts publish `data-chart-kind`; diagrams publish `data-diagram-kind`; scenes publish
  `data-scene-kind`.
- No more than two consecutive slides of the same exact archetype in a normal deck.
- No more than three consecutive slides from the same family in a normal deck.
- Deck-size targets:

| Content slides | Families | Archetypes |
|---:|---:|---:|
| up to 5 | 2 | 3 |
| 6 to 10 | 3 | 4 |
| 11 to 20 | 4 | 6 |
| 21 to 35 | 5 | 8 |
| 36 to 60 | 6 | 11 |
| 61+ | 7 | 14 |

- `data-story`, `report`, and `portfolio` may concentrate in data while rotating chart subtypes.
- `workshop`, `training`, and `demo` require at least one motion, simulation, or interaction.
- `catalog` may group families for reference, but must expose distinct subtypes.
- Each substantial part has a hero in its first two content slides. Use `hero=True` for custom
  static heroes.
- Never satisfy diversity with invented data, decorative diagrams, fake UI, or irrelevant images.

## 8. Charts, diagrams, media, and product surfaces

- Chart titles state the finding, not the chart type. Every number has source, period, and sample.
- Architecture, flow, sequence, state, data movement, identity, and dependency are diagrams with
  official icons and a legend.
- SVG text stays short. Long explanations belong in HTML or speaker notes.
- Product simulations use light theme except the terminal. Content must match the real surface.
- Figures and videos have alt, caption, and source. A still follows video when the room may have no
  audio or playback.
- Image repertoire includes side figure, wide figure, statement plus image, before/after image
  comparison, and annotated image.
- Prefer vector SVG and official icons. Raster images are optimized to stage size.

## 9. Motion, interaction, and accessibility

- Entrance beats follow the speaking order and finish before the 4200ms final-state screenshot.
- After the entrance, only subtle ambient motion remains.
- Nothing flashes above 2 Hz.
- `prefers-reduced-motion` exposes a complete still state.
- Interactions are keyboard reachable, reset on re-entry, update on the first action, and explain
  the reason behind the result.
- No-spoiler: nothing starts preselected.
- A simulation or interaction must remain understandable as a static final frame.

## 10. Languages and notes

- Chrome, titles, captions, labels, interaction feedback, and notes are available in `en`, `pt-BR`,
  and `es`.
- Code, payloads, identifiers, and official product strings may remain in English.
- Every slide has speaker notes. Long notes follow `speaker-notes.md`; `Deck.N` is the concise form.
- Locale switching reruns typography, diagram fit, canvas fit, and interactive translation.

## 11. QA gates

```bash
python scripts/qa_deck.py deck.html
python scripts/audit_typo.py deck.html pt-BR,es,en
python scripts/diag_fill.py deck.html en
python scripts/audit_svg.py deck.html
python scripts/audit.py deck.html
python scripts/audit_ux.py deck.html
python scripts/census.py deck.html
python scripts/shots.py deck.html pt-BR shots/
```

Expected result:

- zero overflow, clipping, console errors, SVG collisions, and identity errors
- no unclassified content slides
- diversity gate passes for the embedded profile
- every contact sheet is inspected at the final animation state
