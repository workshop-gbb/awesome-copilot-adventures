# Diagrams and architecture (v4.0.0)

Use a diagram whenever the audience needs to understand relationships, boundaries, direction,
sequence, state, ownership, deployment, or dependency. The current implementation is
`scripts/diagram_kit.py`; the catalog implementations are in `scripts/showcase_diagrams.py`.

## Core rule

A diagram is reconstructable:

- every node names a real actor, service, system, state, or artifact
- every connector has a direction and meaning
- every zone expresses a boundary or owner
- every color and line style is explained
- every product carries its official icon

A collection of chips with arrows is not architecture. A table of prose is not a sequence.

## Builder

```python
from diagram_kit import Diagram

d = Diagram('checkout', 1120, 470, kind='request-path')
d.zone(20, 20, 360, 400, 'blue', 'Client boundary')
d.node(60, 90, 260, 64, 'Web app', 'React', icon=('i-globe', 'var(--ps-color-ms-blue-500)'))
d.node(470, 90, 260, 64, 'API', 'orders', icon=('ic-aca', None))
d.conn([(320, 122), (470, 122)], 'acc', 'ar-acc')
html = d.render()
```

`kind=` is required for a named custom diagram and becomes `data-diagram-kind`. It lets
`census.py` distinguish sequence, state, request path, architecture, data flow, and other forms.

## Vocabulary

| Method | Meaning |
|---|---|
| `zone` | boundary, trust zone, team ownership, region, network, or platform |
| `lane` | owner or participant lane |
| `node` | service, system, artifact, decision stage, or component |
| `diamond` | decision |
| `database` | persistent store |
| `actor` | person or external role |
| `entity` | ER entity with attributes |
| `classbox` | class or interface with fields and methods |
| `state` | state-machine state |
| `startstop` | start or terminal state |
| `lifeline` | sequence participant |
| `activation` | active execution span |
| `message` | sequence message; `dashed=True` for a return |
| `selfmsg` | participant calling itself |
| `conn` | orthogonal connector |
| `curve` | curved connector |
| `label` | connector or region label |
| `note` | short annotation |
| `legend` | line, swatch, and state meaning |
| `dot` | animated flow marker |

## Catalog of diagram kinds

Engineering diagrams:

1. `flowchart`
2. `sequence`
3. `state-machine`
4. `er`
5. `class`
6. `c4-context`
7. `c4-container`
8. `deployment`
9. `event-driven`
10. `data-pipeline`
11. `hexagonal`
12. `request-path`
13. `decision-tree`
14. `mind-map`
15. `swimlane`
16. `network`
17. `dag`
18. `git-branching`

Reference architectures:

1. `architecture-webapp`
2. `architecture-aks`
3. `architecture-data`
4. `architecture-foundry`
5. `architecture-copilot`
6. `architecture-devops`
7. `architecture-zero-trust`
8. `architecture-hub-spoke`

Do not use one architecture shape for every question. Context, request flow, state, deployment, and
data lineage are different relationships and need different diagrams.

## Choosing the kind

| Question | Diagram |
|---|---|
| What is inside or outside the system? | C4 context or zoned architecture |
| Which containers or services exist? | C4 container |
| Who talks to whom, in what order? | sequence |
| Where does the request go? | request path |
| How does data move and transform? | data pipeline or event-driven |
| What state can this enter next? | state machine |
| Who owns each step? | swimlane |
| What depends on what? | DAG or network |
| How is it deployed? | deployment or infrastructure architecture |
| What are the entities and relationships? | ER |
| What are the code-level abstractions? | class |
| What happens at a decision? | flowchart or decision tree |

## Icon rules

- Azure services use official Azure architecture icons.
- GitHub surfaces use GitHub marks or Octicons.
- Other vendors use their official brand assets and colors.
- Abstract concepts use neutral line icons from `visual_layer.ICONS`.
- The icon sits inside the node next to the product name, not only in the slide header.
- Never trace a logo from a screenshot and never recolor a vendor mark arbitrarily.

## Geometry and labels

- Canvas is normally 1120 x 470.
- A zone owns its top 30px label band. Nodes start below it.
- SVG text does not wrap. Keep labels short; put explanations in HTML or notes.
- Connector labels sit above horizontal segments or beside vertical segments.
- Return messages are dashed.
- Avoid edge crossings. If a crossing is unavoidable, change the layout before adding decoration.
- A node that can stop a flow uses `kind='block'` and its semantic color.
- The legend is part of the diagram, not an optional footnote.

## Motion

- Zones and nodes enter in reading order.
- Solid paths draw; dashed paths fade.
- Traveling dots show only the primary flow.
- The complete final state appears under reduced motion.
- Entrance beats finish before the 4200ms screenshot gate.

## QA

```bash
python scripts/audit_svg.py deck.html
python scripts/audit_arrows.py deck.html
python scripts/qa_deck.py deck.html
python scripts/census.py deck.html
```

Failures to fix:

- label outside a node or pill
- node inside a zone label band
- connector through text
- overlapping nodes
- product without an official icon
- generic `DIAGRAM_GENERIC` repeated where a named kind should be declared
