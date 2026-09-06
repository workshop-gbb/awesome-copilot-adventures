---
layout: default
title: Scope an agent-assisted exercise
parent: Hands-on Labs
nav_order: 40
permalink: /hands-on/scoping/
last_verified: "2026-09-06"
---

# Scope an agent-assisted exercise

A useful hands-on lab changes one capability and produces evidence that a learner
can inspect. Scope is not a promise that an agent will finish in a particular time.

## Choose one kind of work

| Kind | Starting evidence | Example | Exclude |
| --- | --- | --- | --- |
| Greenfield | Stakeholder needs and explicit non-goals | RSS subscription list | Background polling, real user accounts |
| Brownfield feature | Existing contract and baseline tests | Document metadata for a dashboard | Unrelated framework migration |
| Refactoring | Characterization tests and current side effects | Extract order validation | Changes to prices or eligibility |
| Modernization | Compatibility contract, data inventory, rollback | CSV storage to SQLite | Rewriting every layer at once |
| Runtime-agent integration | Allowed tools and permission boundaries | Read-only catalog assistant | Unrestricted shell or live payments |

## Make the task testable

Replace “make a great shopping site” with:

```text
Build only product listing, details, cart, and a mock summary using the bundled
products. Reuse integer-cents arithmetic. No accounts, tracking, network images,
database, or payment processor. Verify keyboard navigation, quantity errors,
empty cart, and totals at 375px and 1280px viewports.
```

The exclusions prevent unnecessary dependencies; the cases prevent a polished
but unusable result from being mistaken for completion.

## Keep useful struggle

Provide the input data and acceptance criteria. Do not prescribe the exact generated
code or give a screenshot of “all tests passed” as evidence. Include:

1. A baseline inspection.
2. A design decision with at least two reasonable choices.
3. One deliberately failing case.
4. A bounded implementation.
5. A negative check that proves the verifier can reject wrong behavior.
6. A reset limited to the disposable workspace.

## Review scope before implementation

- Can the task be done with local synthetic data?
- Does it need a new service, paid model, container, or database?
- Which runtime is actually required?
- What should remain unchanged?
- What do the tests not prove?
- What is the stop condition after a failed repair?

Use [the PRD examples](Sample%20PRDs.md) to turn these answers into a concrete contract.
