# Context Mirrors experiment

> [!TIP]
> [Download the learner ZIP](../../assets/lab-kits/adventures/context-mirrors.zip) or copy this whole lab to an unused folder. Read [setup and optional GitHub steps](../../docs/downloads.md) first.

## Before you run anything

| Item | Contract |
| --- | --- |
| Runtime | Node 24; live integrations are separate |
| Files to inspect | `starter/`, `verify.js` |
| Verifier directory | Extracted kit root: `node verify.js`; from `starter/`: `node ../verify.js` |
| Starting state | Existing sequence tests pass |
| Finish evidence | A fresh starter passes its existing checks; every variant begins from that same untouched source. |

**Concept in practice:** Two explanations of the same sequence predictor can sound equally confident. The useful one cites the tested branch and identifies the missing new pattern instead of describing an imagined API.


Use the runnable [starter](./starter/) to compare context strategies without changing the task, model, or acceptance criteria.

## Controlled variants

Create a fresh copy of the starter and a new session for each variant:

1. prompt only;
2. prompt plus explicit file references;
3. repository instructions;
4. repository plus path-specific instructions;
5. custom agent;
6. custom agent plus the evidence-first skill.

Do not run a variant from the repository root if inherited instructions would contaminate the baseline.

## Fixed task

Add support for one new deterministic sequence pattern. Require:

- input validation;
- prediction of one and multiple values;
- API support;
- focused tests;
- no unrelated file changes.

## Evidence worksheet

For every variant record:

| Evidence | Value |
| --- | --- |
| Files changed | |
| Files changed outside scope | |
| Failed tool calls | |
| Human interventions | |
| Tests requested | |
| Tests actually executed | |
| Final test result | |
| Unsupported claims | |

The experiment compares outcomes. It does not establish a universal productivity ranking.

## Guided execution

1. Run the untouched verifier and record the expected initial state.
2. Ask for a source-grounded explanation of the relevant code and checks.
3. Plan: Choose one new sequence pattern. Keep model and acceptance fixed, define fresh-copy context variants, and state how you will record files changed, checks actually run and unsupported claims.
4. Implement only the approved slice, then rerun the same verifier.
5. Add an irrelevant design claim to one context packet, not to production code. Challenge whether the answer cites executable sources and record the unsupported assertion if it does not.
6. Review the diff and record the limitation: Local tests establish sequence behavior; the comparison is not a general ranking of models or workflows.

## Completion and safe reset

- [ ] The required behavior and its negative case have observed evidence.
- [ ] The result distinguishes local verification from live host/runtime behavior.
- [ ] No credentials, unrelated files or services were changed.
- [ ] Evidence is saved before resetting the copied starter.

Use a new extraction for another attempt, or restore only named files from a Git baseline created in this copy. Never apply a curriculum-root restore command from an unrelated project.

Continue with [the adventure and rubric](../../adventures/00-foundations/context-mirrors/README.md).
