# Custom animated SVG scenes (v4.0.0)

Use this recipe for a one-off animated illustration not covered by the eight templates in
`scenes_kit.py`. The result is inline SVG with CSS keyframes, no external library, no GIF, and no
JavaScript animation loop. The deck engine's `data-active` attribute starts and resets the motion.

## Contract

- Wrap the drawing in `.scene`.
- The SVG uses `.scn` and publishes `data-scene-kind="meaningful-kind"`.
- Long translated text lives in an HTML overlay because SVG text does not wrap.
- Entrance beats finish before the 4200ms final-state screenshot.
- The complete still state is visible under `prefers-reduced-motion`.
- Ambient motion is subtle and never flashes above 2 Hz.

## Structure

```html
<div class="scene">
  <svg class="scn" data-scene-kind="queue-drain"
       viewBox="0 0 1120 330" role="img" aria-label="Queue drains into three workers">
    <!-- geometry and animated groups -->
  </svg>
  <div class="scene__panel">Translated explanation that can wrap.</div>
</div>
```

Every element begins in a hidden or rest state and animates only on the active slide:

```css
.queue__worker { opacity: 0; transform: translateY(18px); }
.slide[data-active="true"] .queue__worker {
  animation: queueIn .7s cubic-bezier(.22,1,.36,1) var(--d) forwards;
}
@keyframes queueIn {
  to { opacity: 1; transform: none; }
}
```

## Choreography

Build the explanation in spoken order:

| Beat | Target time | Typical motion |
|---|---:|---|
| context arrives | 0.4s | fade or slide |
| primary object appears | 0.9s | pop, rise, draw |
| mechanism is revealed | 1.5s | pass, converge, branch |
| labels land | 2.1s to 3.2s | staggered fade |
| conclusion settles | by 3.6s | pop or highlight |

After the conclusion, only ambient motion remains: a traveling dot, a slow pulse, a queue draining,
or a subtle loop. The ambient state must not hide labels or change the conclusion.

## Drawing rules

- Use gradients only inside an object when they express depth, material, or state. Page backgrounds
  remain light or dark.
- Use `clipPath` for boundaries and masks.
- Use outer groups for positioning and inner groups for animation; an animation transform replaces
  the element's original transform.
- Use per-element custom properties for stagger delays.
- Keep SVG labels to two or three words.
- Use official icons inside product or service nodes.
- Add an HTML caption or insight rail when the visual needs explanation.

## Suitable custom scenes

- queue filling or draining
- pipeline assembling
- data packets crossing boundaries
- agents delegating and returning
- cost or latency accumulating
- risk spreading across dependencies
- layers building into a platform
- feedback loop converging
- maturity path rising

## QA

1. Capture the final state at 4200ms.
2. Check the longest locale and reduced-motion state.
3. Run `qa_deck.py`, `audit_svg.py`, and `audit_arrows.py`.
4. Confirm the scene kind appears as a distinct archetype in `census.py`.
5. Watch the scene at presentation speed and verify that the speaking order matches the visual
   order.
