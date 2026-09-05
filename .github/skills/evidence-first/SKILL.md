---
name: evidence-first
description: Defines deterministic evidence, executes the smallest relevant validation, and reports outcomes without invented claims.
---

# Evidence-first delivery

Use this skill whenever a task changes code, configuration, documentation links, or a runnable lab.

## Method

1. Translate the requested outcome into observable acceptance criteria.
2. Select the smallest existing command or probe that covers each criterion.
3. Run validation after the change.
4. Record the exact command and whether it passed.
5. Distinguish unverified assumptions from verified results.
6. Never convert “looks correct” into a success claim.

## Evidence examples

- A route exists: start the service and probe the route.
- A link works internally: resolve the target from the source file.
- A customization loads: verify its expected location and required metadata.
- A refactor preserves behavior: run the pre-existing focused tests.
