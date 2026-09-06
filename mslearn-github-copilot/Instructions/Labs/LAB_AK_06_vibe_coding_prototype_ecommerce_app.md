---
layout: default
title: Prototype an accessible shopping flow
parent: Hands-on Labs
nav_order: 20
permalink: /hands-on/06-prototype/
lab_id: 06-prototype
last_verified: "2026-09-06"
lab:
  title: Exercise - Prototype an e-commerce interface with a bounded agent workflow
  description: Turn a small PRD into an accessible prototype, then verify its behavior rather than accepting appearance alone.
  duration: 50 minutes
  level: 200
  islab: true
  primarytopics: [Prototyping, JavaScript, Accessibility]
---

# Prototype an e-commerce interface with GitHub Copilot

Natural-language development still requires engineering decisions. This exercise
uses the original shopping prototype scenario, but replaces open-ended generation
with a small contract, a working domain module, and observable UI checks.

## Learning objectives

- Write an achievable PRD with exclusions and acceptance criteria.
- Separate durable engineering instructions from task-specific product requirements.
- Implement a usable interface on top of a tested cart contract.
- Use keyboard, viewport, and error-state checks to challenge generated output.

## Before you start

Prepare `06-prototype` with [the work-drive procedure](../Reference/SETUP.md).
Node 24 is sufficient; do not install a front-end framework or external image package.
Use only the fixture's synthetic products. Checkout is a simulation, not a payment form.

## Concepts and use cases

| Artifact | Contains | Does not contain |
| --- | --- | --- |
| PRD | User goals, behavior, acceptance, non-goals | Claimed test results |
| Wireframe | Navigation and information hierarchy | Business-rule implementation |
| Instructions | Short conventions and validation rules | The entire PRD copied into every request |
| Domain tests | Cart arithmetic and rejected input | Accessibility or visual proof |

## Exercise scenario

A shopper browses three products, opens details, adds quantities to a cart, and
reviews a mock order summary. No account, analytics, remote assets, persistence,
payment processor, or real personal data is required.

## Task 1 - Establish the domain baseline

1. Inspect `cart.mjs`, its test, and the HTML starter.
2. Run:

   ```bash
   node --test --test-concurrency=1 cart.test.mjs
   ```

3. Record that these tests exercise domain rules, not the unfinished UI.
4. In Ask, request a description of valid cart lines and how totals are represented.
   Verify the answer against the source: currency uses integer cents.

## Task 2 - Write the PRD before generating the UI

1. Use the [PRD examples](../Concepts/Sample%20PRDs.md).
2. Create `PRD.md` in the disposable workspace with these acceptance criteria:

   | ID | Criterion | Observable check |
   | --- | --- | --- |
   | SHOP-1 | List every bundled product | Product names and prices are visible |
   | SHOP-2 | Navigate list, details, cart, summary | Keyboard can reach each view and return |
   | SHOP-3 | Show totals from the domain module | Two apples and one banana cost 330 cents |
   | SHOP-4 | Reject invalid quantities | Zero, negative, fractional, and empty quantities show errors |
   | SHOP-5 | Announce state changes | Visible status and an appropriate live region |
   | SHOP-6 | Show mock checkout only | No card, password, or real-address inputs |

3. Sketch one screen per view. A labeled text layout is enough.
4. Choose meaningful mobile/desktop viewports such as 375 and 1280 CSS pixels.
   Do not use a 300-pixel breakpoint as the only responsive test.

## Task 3 - Review a plan

Use Plan:

```text
Use PRD.md and the existing cart.mjs contract. Plan a framework-free interface.
Identify the views, DOM state, labels, focus transitions, error messages, and
keyboard/viewport checks. Keep currency arithmetic in cart.mjs. Do not implement yet.
```

Approve the smallest implementation. Reject real checkout, remote tracking, unrelated
dependencies, or a new pricing implementation that duplicates the tested module.

## Task 4 - Implement one view at a time

1. In Agent, implement the product list and details view first.
2. Review the diff and test navigation before adding cart controls.
3. Reuse `summarizeCart` for totals; render user-visible strings with safe DOM APIs.
4. Add cart and mock confirmation views. Require accessible names and focus handling.
5. Put only conventions in `.github/copilot-instructions.md`; link `PRD.md` as context
   for this task instead of copying its entire contents into instructions.
6. Stop after two failed repairs to inspect the smallest broken behavior.

## Task 5 - Observe the running prototype

1. Start the provided loopback-only server:

   ```bash
   node serve.mjs
   ```

2. Open the printed URL. It uses an OS-assigned port to avoid other projects.
3. Perform the SHOP-1 through SHOP-6 checks manually.
4. Repeat using only keyboard navigation and both selected viewports.
5. Deliberately try a quantity of zero and confirm an error rather than a silent
   reset or an incorrect total.
6. Re-run the domain tests and inspect the browser console. Record actual results.

## Verify your work

- [ ] Domain tests still pass, including rejected input.
- [ ] Every PRD acceptance criterion has a browser observation.
- [ ] No real transaction, credential, tracker, or remote asset was introduced.
- [ ] Keyboard focus remains visible and usable after navigation.
- [ ] No success is claimed solely because the page looks plausible.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Module import fails from a file URL | Use the provided local server |
| Total differs by a cent | Reuse integer-cents arithmetic instead of floating-point display values |
| Cart controls are unreachable | Inspect semantic controls, labels, tab order and focus |
| Mobile layout overflows | Test the actual viewport and long product names, not only window resizing |

## Independent practice

Add a name filter with a no-results state. Specify whether case and surrounding
whitespace matter, then test those cases. Keep it client-only.

## Reset

Stop `serve.mjs` with `Ctrl+C`, save evidence, and restore only the UI files you
changed in the disposable copy. Do not remove or stop another project's server.

## Official references

- [Planning with agents](https://code.visualstudio.com/docs/agents/run/planning)
- [Agent best practices](https://code.visualstudio.com/docs/agents/best-practices)
- [Custom instructions](https://code.visualstudio.com/docs/agent-customization/custom-instructions)
- [VS Code browser tools](https://code.visualstudio.com/docs/agents/browser)
