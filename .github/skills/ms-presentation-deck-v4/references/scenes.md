# Animated scenes (v4.0.0)

A scene is the hero slide of a part: an inline SVG (1120 x 330) whose elements enter in a spoken
rhythm and then breathe, plus three captions under it. No library, no JavaScript, no GIF: CSS
keyframes scoped to `.slide[data-active="true"] .scn`, so the scene replays every time the
presenter returns to the slide. `scripts/scenes_kit.py` ships eight scenes with captions and notes
in three locales (showcase part VI, slides 73 to 80); each one is the template for one kind of
motion.

Each scene publishes `data-scene-kind`, so lifecycle, input/output, convergence, gate, loop, lanes,
flip/lock, and maturity count as distinct archetypes.

| # | Kind of motion | Use it when the content is… | Function |
|---|---|---|---|
| 1 | Reveal in sequence on a line | a lifecycle, a timeline of moments, an order of events | `scene1()` |
| 2 | Type in, print out | an input that becomes an output through one box (contract, API, hook) | `scene2()` |
| 3 | Converge into one | many sources merging into one result (config precedence, data lake) | `scene3()` |
| 4 | Pass or bounce | a gate: one thing goes through, the other comes back with a reason | `scene4()` |
| 5 | Loop with a traveling dot | a cycle that repeats until a condition (agent loop, retry, review) | `scene5()` |
| 6 | Packets on lanes | evidence, events or requests traveling to several destinations | `scene6()` |
| 7 | Flip and lock | switches the user controls and one they cannot (settings, policies) | `scene7()` |
| 8 | Rise step by step | maturity, adoption, a ninety-day path | `scene8()` |

## Writing a new scene

```python
from scenes_kit import T, R, G, ICON, PILL          # text, rect, animated group, line icon, pill
p = []
p.append(G('a-draw', 100, '<path class="ln" d="M70 190 H1050" pathLength="100"/>'))   # a line that draws itself at 100 ms
p.append(G('a-pop', 400, '<circle cx="96" cy="190" r="7" fill="var(--ps-color-ms-blue-500)"/>'))
p.append(G('a-in', 480, T(96, 150, 'sessionStart', 'm', 'middle')))
p.append(PILL(600, 40, 140, 'allow', 'var(--ps-color-ms-green-500)', 900))
svg = f'<svg class="scn" data-scene-kind="custom-kind" viewBox="0 0 1120 330" xmlns="http://www.w3.org/2000/svg" role="img">{MARKER}{"".join(p)}</svg>'
```

Primitives: `T(x, y, text, cls='m'|'m m--b'|'lbl', anchor, extra)`, `R(x, y, w, h, fill, stroke,
rx)`, `G(cls, delay_ms, inner)`, `ICON(name, x, y, size, color)`, `PILL(x, y, w, text, color,
delay)`. The delay is in milliseconds after the slide becomes active (`--d`).

Animation classes (CSS in `visual_layer.py`, `scenes_kit.EXTRA_CSS`):

| Class | What it does | Typical use |
|---|---|---|
| `a-in` | fade up | labels, boxes |
| `a-pop` | scale in with a small overshoot | dots, pills, icons |
| `a-draw` | stroke draws from start to end (`pathLength="100"`) | lines, connectors, rings |
| `a-pulse` | breathes forever | the element that decides |
| `a-slide` | slides in from the left | a payload arriving |
| `a-type` | grows from the left in six steps | typed text |
| `a-flash` | one flash | a result appearing |
| `a-shake` | shakes once | a deny, a bounce |
| `a-flip` | moves 22px left (a toggle knob) | switches |
| `a-rise` | rises 30px | steps of a ladder |
| `a-travel` | follows an `offset-path` forever | a dot on a loop |
| `a-pass` | crosses the stage left to right | a packet that goes through |
| `a-bounce` | goes in and comes back | a packet rejected |
| `a-hit` | lights up then dims | a target reached |

## Rules

- **Entrance beats, then ambience.** Chain the arrivals with `--d` about 150 to 300 ms apart in
  the order you will speak them; after the last beat only `a-pulse` and `a-travel` keep moving.
- **SVG text never wraps.** Labels are two or three words; anything longer goes to the captions
  (`scene_caps`) or to an HTML overlay above the SVG.
- **Color is the code**: red decides or denies, green passes, yellow is the loop or the cost, blue
  is the platform. Same code as the diagrams of the same deck.
- **Captions, three, colored**: `scene_caps(n, key, reg)` renders the three `.cap` blocks
  (title + one sentence) in the three locales; they say what to look at, not what the SVG shows.
- **Notes carry the choreography**: `[ABERTURA]` says what will move, `[NÚCLEO]` explains it as it
  moves, `[GANCHO]` asks the question the motion suggests (see the notes of scene 1).
- Scene slides are `nofill=True` (the SVG already fills the width; the captions fit under it).
- Reduced motion: `@media (prefers-reduced-motion: reduce)` shows every element at rest, so QA
  screenshots use `reduced_motion='no-preference'` in Playwright to see the real thing.
- For a one-off animated illustration with custom geometry and an HTML overlay, use the general
  recipe in `svg-animation.md`. It must still publish a scene kind and obey the same timing,
  translation, accessibility, and final-state rules.
- Contact-sheet screenshots wait 4200ms. Finish every entrance beat before that boundary.

## Finite causal mechanisms

`causal_scenes.py` adds six named entries to the master catalog. These are explanations of a
mechanism, not decorative metaphors or synthetic performance measurements:

| `kind` | Visual question |
|---|---|
| `agent-anatomy` | How do the model and harness compose an agent? |
| `feedback-loop` | How does tool output change the next model request? |
| `verification-gate` | Where do pass and failure lead? |
| `context-assembly` | Which layers form a request? |
| `prefix-reuse` | What stays identical between two requests? |
| `parallel-ownership` | Where do separate tasks return for explicit integration? |

```python
from causal_scenes import render

D.content(
    'blue', eyebrow3, title3, render(D, 'feedback-loop'), notes3,
    nofill=True, hero=True,
)
```

The component registers its scoped CSS through `Deck.component_style()` once per document.
The existing taxonomy recognizes `svg.scn[data-scene-kind]`; no guessed family or generic
scene archetype is necessary. Labels, accessible descriptions and captions are trilingual.

Actors arrive before routes; routes arrive before the consequence. All beats finish by
3.6 seconds. There are no perpetual loops or SMIL timelines. Packet motion runs only on the
active slide and stops after illustrating the handoff. Returning to the slide restarts the
sequence. Reduced motion shows the complete, untransformed diagram immediately.

Equal context blocks represent structure or equality, never an invented token distribution.
The verification paths are alternatives, not a fabricated test run. Parallel completion leads
to explicit review and checks, never an implied automatic merge.
Scene strokes use theme-aware accessible ink. Official marks use `visual_layer.svg_icon()` and
retain their original colors over a neutral contrasting plate, including on dark slides.
