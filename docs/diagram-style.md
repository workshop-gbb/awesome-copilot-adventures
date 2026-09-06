---
layout: default
title: Diagram style and accessibility
nav_order: 12
permalink: /diagram-style/
last_verified: "2026-09-06"
---

# Diagram style and accessibility

All Mermaid diagrams in this repository use the same monochrome palette.
White, ice, gray, and black must remain readable both in the dark site and in a
printed document. Color alone never conveys a decision, a failure, or ownership.

## Palette

| Token | Color | Use |
| --- | --- | --- |
| Paper | `#ffffff` | Diagram canvas, label backgrounds |
| Ice | `#f5f5f5` | Primary nodes, notes, odd table rows |
| Light gray | `#e0e0e0` | Secondary nodes, participants, even rows |
| Medium gray | `#bdbdbd` | Tertiary nodes, activations |
| Boundary gray | `#999999`, `#777777`, `#666666`, `#555555` | Group and node borders |
| Charcoal | `#444444`, `#333333` | Relationships, signals |
| Ink | `#111111`, `#000000` | Text and emphasis |

The canonical theme is maintained in
[mermaid-theme.json](https://github.com/paulasilvatech/awesome-copilot-adventures/blob/main/scripts/mermaid-theme.json).
Every block includes that configuration in Mermaid's **diagram frontmatter**,
so rendering on GitHub does not depend on the Jekyll site's CSS.

## Choose a diagram that answers a question

| Question | Diagram | What not to imply |
| --- | --- | --- |
| What steps and gates follow? | `flowchart` | An arrow is not proof a tool ran |
| Who calls whom, and what returns? | `sequenceDiagram` | A dashed return is not another request |
| Which state transitions are legal? | `stateDiagram-v2` | A state name is not a deployed resource |
| How are records related? | `erDiagram` | A conceptual key does not create a database constraint |
| Which interfaces depend on which types? | `classDiagram` | A dependency is not necessarily inheritance |

We use stable syntax supported by the site's pinned Mermaid version. GitHub controls
its own renderer version: check the actual renderer before adopting a new diagram
type. Beta types and third-party layout engines are not required for the labs.

## Every diagram needs four pieces

1. A Mermaid fenced block using the canonical `base` theme and `classic` look.
2. `accTitle` and `accDescr` describing this diagram, not generic labels.
3. An adjacent **Legend.** paragraph explaining shapes, arrows, boundaries, and
   any abbreviations. Explain solid and dashed arrows separately when both exist.
4. An adjacent **Explanation.** paragraph interpreting the diagram and the lesson
   it supports. Include the limitation: for example, a graph is a design, not
   evidence that a distributed execution occurred.

Keep labels short, avoid decorative graphs, and do not rely on hovering or clickable
nodes for essential instructions. Text and tables remain the source of requirements.

## Validation

```bash
node scripts/check-diagrams.js
```

This checks palette configuration and documentation, not the correctness of a
business model. Render new diagrams in the supported preview or the published site
as well; parse/render failures must be fixed before publication.

## Official references

- [Diagrams in GitHub Markdown](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams)
- [Mermaid theme configuration](https://mermaid.js.org/config/theming.html)
- [Mermaid accessibility](https://mermaid.js.org/config/accessibility.html)
- [Mermaid configuration](https://mermaid.js.org/config/configuration.html)
