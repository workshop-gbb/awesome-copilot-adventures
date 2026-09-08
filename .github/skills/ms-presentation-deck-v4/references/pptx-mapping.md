# PPTX mapping from the HTML source of truth (v4.0.0)

PPTX is a derivative generated only when requested. The HTML deck remains the source of truth for
content, speaker notes, visual semantics, interactions, and final QA.

## Choose the export mode

### Fidelity mode

Render each HTML slide at 1280 x 720 and place it as a full-slide image in PPTX. Use when visual
fidelity matters more than editability, especially for:

- simulations
- interactions
- custom SVG scenes
- complex diagrams
- media compositions
- layered typography

Embed the corresponding speaker note as text in the PowerPoint notes panel.

### Native-editable mode

Rebuild supported components with PptxGenJS native shapes, text, charts, and tables. Use only when
the user explicitly needs editable content. Validate every slide because PowerPoint text metrics
differ from Chromium.

Good native candidates:

- title and closing slides
- ledgers, tiles, checklists, steps
- tables and matrices
- simple charts
- timelines and gantts
- diagrams whose geometry is available as primitives

Complex interactive and animated states become a chosen final-state still unless a custom
PowerPoint animation implementation was requested.

## Coordinate system

Use `LAYOUT_WIDE`, 13.333 x 7.5 inches.

```text
x inches = x pixels / 96
y inches = y pixels / 96
```

HTML content margins of 60px map to 0.625 inches. Keep the same stage hierarchy rather than
copying browser CSS properties literally.

## Structural mapping

### Cover

- exactly two title lines
- second line in the deck's exact Microsoft theme accent (red, green, yellow or blue)
- uniform black background preserves contrast without changing the logo color
- no eyebrow, subtitle, metadata block, page number, or decorative footer
- fit the two lines as one unit

### Agenda

- generated from the real part positions
- bar numerals are vector shapes, not text glyphs
- title, eyebrow, range, and count remain grouped

### Divider

- dark background
- roman numeral built from vector bars
- one-line title
- subtitle below
- no Arabic numeral, story chip, page number, rail, or list of topics

### Closing

- dark background
- two-line title and italic tagline
- the second title line uses the same exact theme accent as the cover
- Paula Silva role and corporate contact
- optional quick-rule code block
- no generic next-step panel

## Family mapping

| HTML family | PPTX strategy |
|---|---|
| editorial | native text and shapes |
| data | native chart when editability matters; otherwise fidelity render |
| process | native timeline, gantt, or step shapes |
| structured | native table, matrix, tiers, or cards |
| diagram | native primitives only when labels and connectors remain faithful |
| motion | final-state image, unless custom animation is requested |
| simulation | final-state image |
| interactive | neutral or chosen final-state image plus notes |
| media | image/video poster with source |
| technical | native monospace text for short artifacts; image for complex rendering |

## Typography

- Use Segoe UI or Inter when available for sans text.
- Use Cascadia Mono or JetBrains Mono for technical text.
- Refit every title in PowerPoint. Do not assume HTML pixel size equals PPT points.
- Keep title lines, hierarchy, and whitespace consistent with HTML even when exact numeric sizes
  differ.

## Charts

- Preserve the analytical question, series colors, values, labels, and source.
- Never convert a chart into decorative bars without an axis or values.
- Never introduce 3D effects, dual axes, or PowerPoint theme colors.
- If a native chart cannot reproduce the HTML result faithfully, use a vector or raster render.

## Diagrams

- Preserve zones, icons, nodes, line styles, arrow directions, and legend.
- Use official icon SVGs or high-resolution PNGs.
- Bar numerals and diagram connectors are shapes, not font glyph approximations.
- If native text fitting changes the meaning or collisions appear, use the rendered SVG/slide.

## Speaker notes

Strip lightweight markdown markers only when the PPTX library cannot represent them. Keep semantic
markers such as `[ABERTURA]`, `[NÚCLEO]`, `[GANCHO]`, `[TRANSIÇÃO]`, and `[TIMING]`.

## Validation

1. Generate a fresh presentation instance.
2. Open in PowerPoint and LibreOffice when compatibility matters.
3. Render to PDF or images.
4. Inspect every slide for overflow, font substitution, icon loss, chart labels, and speaker notes.
5. Compare contact sheets against the HTML source.
6. Confirm slide count, order, titles, and notes.

PPTX is complete only when its visual comparison is acceptable; successful file creation is not a
quality gate.
