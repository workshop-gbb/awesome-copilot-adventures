# UX, learning, and interaction standard (v4.0.0)

The deck is an interface used under time pressure, often on a projector, in a second language, and
with limited attention. Modern and elegant means clear hierarchy, purposeful motion, predictable
interaction, and restrained visual language. It does not mean more decoration.

## Information UX

- The title states the conclusion.
- The audience can identify the reading order in one second.
- One slide carries one cognitive task: understand, compare, inspect, decide, practice, or remember.
- Labels sit next to the object they name.
- Sources sit next to the evidence they support.
- Dense detail moves to speaker notes, a drill-down slide, or a linked artifact.
- Use progressive disclosure for complex flows and interactions.
- Keep controls and outputs in the same visual field.

## Visual hierarchy

Use, in this order:

1. position
2. scale
3. contrast
4. spacing
5. typography
6. color
7. decoration

If a slide depends on shadows, gradients, or many borders to explain hierarchy, the composition is
not resolved.

## Modern and elegant

- Consistent grid, radii, strokes, tokens, and spacing.
- Generous but functional whitespace.
- One dominant visual and a small number of supporting elements.
- Subtle depth only on media, product surfaces, and elevated interactive panels.
- No gratuitous glassmorphism, neon glow, 3D chart, decorative stock photo, or rainbow palette.
- Motion follows cause and speaking order.
- Every visual treatment is repeated as a system, not as a one-off effect.

## Didactic design

Use evidence-based learning patterns:

- **Signaling:** highlight the line, node, value, or decision being explained.
- **Segmenting:** split a complex mechanism into meaningful beats.
- **Dual coding:** combine concise language with a real visual model.
- **Worked example:** show a complete example before asking the room to practice.
- **Retrieval:** use quiz, poll, or prediction before revealing the answer.
- **Feedback:** explain why an answer or outcome is correct.
- **Scaffolding:** progress from guided to independent use.
- **Recap:** end a section with the decision rule, not a repeated agenda.

Avoid redundant narration of paragraphs already visible on the slide. Speaker notes should add
meaning, context, and transition.

## Interaction UX

- Native buttons, inputs, and links are preferred.
- Every control is keyboard reachable.
- Focus is always visible.
- Initial state is neutral and gives a short instruction.
- Feedback appears on the first action.
- Result regions use `aria-live="polite"`.
- Tabs expose `tablist`, `tab`, and `tabpanel` semantics.
- Hidden panels expose `aria-hidden`.
- Hotspots expose an accessible name and expanded state.
- Interactions reset when the slide is revisited.
- A result includes its mechanism or reason.
- The slide remains understandable as a static final state.

## Motion UX

- Entrance animation clarifies order or causality.
- The first meaningful object appears quickly.
- All entrance beats finish before 4200ms.
- Ambient loops are slow and optional.
- No flashing above 2 Hz.
- `prefers-reduced-motion` shows the complete result without movement.
- Do not animate every object merely because it can move.

## Images and SVG

- Images are evidence, context, or narrative anchors, never filler.
- Use descriptive alt text that explains the relevant information.
- Reference charts, diagrams, tables, code and explanatory screenshots are research inputs.
  Reconstruct them as original native SVG/HTML; never paste, enlarge or crop them into a slide.
- Extract the verified entities, relationships and data, then recompose for the stage with live
  translated labels. Cite the source. Never estimate chart values from pixels.
- Crop genuine photographs intentionally; never crop a technical explanation to fill its frame.
- Keep the exact image only for identity or when a real product screenshot is itself the evidence,
  not a substitute for an authored diagram or simulation.
- Annotate only the details the audience needs.
- Every sourced image has a caption and source.
- Inline SVG is preferred for diagrams, illustrations, and data visualizations.
- SVG text stays short; translated prose belongs in HTML.
- Declare image purpose with `data-ps-asset-kind`: `portrait`, `brand`, `photo` or `product-evidence`.
  The UX gate rejects undeclared/reference images. Do not relabel a reference diagram as a photo.
  The `figure`, `figure_wide`, `statement_photo` and `image_compare` helpers accept an authored SVG
  string directly; it stays inline, not an encoded image.

Recommended image compositions:

- figure with caption
- wide figure or screenshot
- statement plus image
- before/after image comparison
- annotated image with hotspots
- full-stage media reveal

## Icons

- Product and service icons are official.
- Abstract concepts use the shared 24px line-icon system.
- One icon has one meaning throughout the deck.
- Icons support labels; they do not replace unfamiliar words.
- Decorative icons are `aria-hidden`.
- Avoid mixed stroke weights, mixed visual styles, and random emoji.

## Video

- No autoplay.
- Native controls are visible.
- A poster frame is mandatory.
- Provide a captions track or transcript reference.
- Provide an accessible name, caption, and source.
- Keep a still of the key moment for rooms without audio or playback.
- Short clips should make one point; long recordings belong outside the deck.

## Accessibility and resilience

- Use WCAG AA contrast as the baseline: 4.5:1 for normal text, 3:1 for large text and meaningful
  graphical controls. Measure the rendered foreground against its actual surface in both themes.
- Never put a black mark, image detail or label directly on a dark surface. Use an official
  light variant or a neutral contrasting plate; do not recolor vendor marks arbitrarily or
  invert entire images. `visual_layer.svg_icon()` provides the shared plate for diagram marks.
- Use the theme-aware `--ps-text-*` tones for small colored labels, meaningful strokes and chart
  value labels. Bright Microsoft colors remain appropriate for large fills and brand accents.
- Do not use those derived text tones for the cover/closing brand accent. Choose one exact
  logo color through `theme_accent` and place the structural title on uniform black so contrast
  does not depend on darkening or recoloring the brand. Other surfaces may use neutral text
  with a separate brand accent when the exact color cannot meet the text threshold.
- On light slides, statement and hero emphasis in blue, green or yellow uses neutral ink
  with an underline in the exact accent color. This retains the brand color without putting
  low-contrast colored text on white. Dark structural titles continue to use the exact accent
  as their text color. Small scene labels and meaningful connector strokes use accessible
  text-role tones; original brand fills and official marks are unchanged.
- Minimum practical body size is 13px on the 1280 x 720 stage.
- Do not rely on color alone; pair it with label, icon, line style, or position.
- Links are visibly links and open safely.
- All meaningful images have alt text.
- Charts, diagrams, and scenes have accessible names.
- Keyboard navigation, focus, reduced motion, and offline use are tested.
- The deck works without internet, audio, or animation.
- Comfortable controls use at least 44px targets. A valid diversity score does not replace
  inspection: vary spatial composition, not only component names, colors or the number of cards.
  Mix explanation, worked examples, simulation, practice and synthesis. Use video only when a
  validated, relevant clip adds evidence and has the required accessible offline fallback.

## Gate

Run:

```bash
python scripts/audit_ux.py deck.html
```

The gate checks image alt text, video controls/poster/name/transcript, accessible SVG names, safe
links, live result regions, reduced motion, visible focus, viewport configuration, and keyboard
navigation.
It also resolves every SVG `use` reference against embedded IDs, including definitions appearing
later in the document. A missing icon or externally referenced sprite is a failure, not a silent
blank space in the node.
