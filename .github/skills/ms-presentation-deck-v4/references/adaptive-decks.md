# Adaptive deck design (v4.0.0)

This reference chooses the narrative and visual mix for the audience. It prevents two opposite
failures: cloning a previous deck because it looked good, and forcing random visual variety that
does not fit the content.

## Start with five decisions

Before writing slides, record:

1. **Audience:** who is in the room, what they already know, and what language they use.
2. **Outcome:** what they should decide, understand, believe, practice, or do.
3. **Evidence:** facts, product behavior, data, examples, customer material, demos, and sources.
4. **Setting:** live talk, workshop, self-guided asset, executive review, or leave-behind.
5. **Constraints:** duration, slide count, confidentiality, internet, audio, and device.

The deck profile follows from these decisions. Do not choose a profile because another deck used it.

Then choose the theme accent explicitly with `Deck(theme_accent=...)`: one exact Microsoft logo
color, not always blue. Red can frame risk or limits, green verified results, yellow decisions or
iteration, and blue platforms or integration. Record the semantic reason. Cover and closing share
the selection; section accents and data/state colors continue to follow their own meaning.

## Narrative profiles

### Executive

Use for approval, prioritization, funding, or alignment.

1. Decision in one sentence
2. Context and urgency
3. Evidence and impact
4. Options and trade-offs
5. Recommendation
6. Risks and mitigations
7. Decision or commitment

Best families: editorial, data, structured, diagram, process. Keep simulations short and use an
interactive only when the decision itself benefits from exploring scenarios.

### Keynote

Use for a memorable idea or change of perspective.

1. Human tension
2. Reframe
3. Proof
4. Demonstration or visual reveal
5. Consequence
6. Call to action

Best families: editorial, motion, media, data, simulation. Fewer tables; more visual pacing and
intentional silence.

### Technical deep dive

Use for architecture, engineering behavior, implementation, or operations.

1. System boundary
2. Core mechanism
3. Request or data path
4. Contracts and configuration
5. Failure modes
6. Observability and security
7. Rollout or migration

Best families: diagram, technical, simulation, data, process, interactive. Rotate diagram subtypes:
architecture, sequence, state, request path, deployment, data flow, ER, class, DAG, or swimlane.

### Workshop

Use for facilitated, hands-on sessions.

1. Orient the room
2. Demonstrate the finished behavior
3. Explain the mechanism
4. Practice
5. Compare answers
6. Debrief
7. Apply to the participant's context

Best families: simulation, interactive, technical, process, diagram, motion. Every exercise needs a
visible outcome and every interactive needs an explanation, not just a verdict.

### Training

Use when retention and verification matter.

1. Learning objective
2. Prior knowledge check
3. Concept
4. Worked example
5. Guided practice
6. Independent practice
7. Knowledge check
8. Recap

Best families: editorial, process, diagram, simulation, interactive, structured. Alternate concept,
example, and practice; do not place six explanatory card slides in a row.

### Sales or proposal

Use for customer value, solution fit, or a proposed engagement.

1. Customer context
2. Cost of the current state
3. Desired outcome
4. Solution in one picture
5. Proof and differentiation
6. Delivery plan
7. Risks, assumptions, and commercial next step

Best families: editorial, data, diagram, structured, process, media. Product simulation is stronger
than a feature list when the behavior can be shown faithfully.

### Data story

Use when the argument is carried by quantitative evidence.

1. Question
2. Data scope and quality
3. Main pattern
4. Segment or comparison
5. Driver
6. Exception
7. Implication
8. Action

Best families: data, structured, editorial, process. A data deck may concentrate in the data family,
but it still rotates chart subtypes and alternates overview, comparison, distribution, driver, and
decision views.

### Report or portfolio review

Use for progress, operating rhythm, governance, or status.

1. Scorecard
2. Movement since last review
3. Delivered outcomes
4. Risks and dependencies
5. Decisions needed
6. Roadmap

Best families: data, structured, process, diagram, editorial. Avoid a wall of tables: promote the
finding to a chart, a risk map, a timeline, or a decision slide.

### Product demo

Use when the product behavior is the evidence.

1. Problem
2. Starting state
3. Happy path
4. Edge case
5. Integration point
6. Measured result
7. How to try it

Best families: simulation, interactive, technical, diagram, data. The simulation must match the real
surface and the still state must remain understandable if animation or audio is unavailable.

### Catalog

Use only for pattern libraries and references. Grouping many charts or diagrams together is
intentional, so `profile='catalog'` relaxes sequence concentration while still requiring distinct
subtypes and broad family coverage.

## Storyboard contract

Create one row per planned slide:

| # | Act | Audience takeaway | Evidence | Visual question | Family | Archetype | Hero | Source |
|---|---|---|---|---|---|---|---|---|
| 1 | Open | ... | ... | What must be remembered? | editorial | hero-statement | yes | ... |

The title is the conclusion, not the topic. The visual question determines the form:

- "How much?" -> bar, KPI, big number
- "How did it change?" -> line, ruler, waterfall
- "What is the share?" -> donut, stacked 100, treemap
- "Where does it go?" -> request path, data pipeline, network
- "Who talks to whom?" -> sequence
- "What state is it in?" -> state machine
- "What happens in the product?" -> simulation
- "What should the audience try?" -> interactive
- "What should they see or feel?" -> media or animated scene
- "What are the trade-offs?" -> compare, tiers, quadrant, table

## Diversity without randomness

Variety exists at four levels:

1. **Narrative role:** open, explain, prove, demonstrate, decide, practice, recap.
2. **Visual family:** editorial, data, process, structured, diagram, motion, simulation,
   interactive, media, technical.
3. **Archetype:** line chart, sequence diagram, terminal, quote, timeline, quiz, and so on.
4. **Composition:** full-width stage, split view, insight rail, small multiples, matrix, layered
   architecture, immersive media, or interactive control panel.

Changing only card color is not variety. Changing chart type without changing the question is not
clarity. The correct mix alternates role, family, archetype, and composition as the story advances.

## Hero policy

A hero is the high-attention composition that lets the audience experience the idea. It can be:

- animated scene
- faithful product simulation
- interactive decision or exercise
- high-information diagram
- media reveal
- strong editorial statement with evidence

For a deck with dividers, a hero appears within the first two content slides of each substantial
part. Use `hero=True` for a custom static hero. The gate automatically recognizes scenes,
simulations, interactions, and hero statements.

## Asset hierarchy

1. User-provided or customer-approved image
2. Official product or architecture icon
3. Inline SVG illustration built from the visual language
4. Neutral line icon for abstract concepts
5. Sourced editorial photo when the story genuinely needs one

Every image has an alt description and a source. Never use an image only to occupy empty space.
Never trace a brand mark from a screenshot.

For image, video, icon, accessibility, motion, and interaction rules, read `ux-design.md`.

## Final review questions

- Does every slide have one clear takeaway?
- Is each form the best answer to the visual question?
- Are repeated families doing different narrative jobs?
- Does each major section have a memorable hero?
- Are charts sourced and diagrams reconstructable?
- Can simulations be understood at rest?
- Do interactions explain why?
- Would the deck still work without audio, internet, or animation?
