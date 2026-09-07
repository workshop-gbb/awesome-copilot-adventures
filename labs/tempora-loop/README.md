# Tempora Loop lab

> [!TIP]
> [Download the learner ZIP](../../assets/lab-kits/adventures/tempora-loop.zip) or copy this whole lab to an unused folder. Read [setup and optional GitHub steps](../../docs/downloads.md) first.

## Before you run anything

| Item | Contract |
| --- | --- |
| Runtime | Node 24; live integrations are separate |
| Files to inspect | `starter/loop.js`, `verify.js` |
| Verifier directory | Extracted kit root: `node verify.js`; from `starter/`: `node ../verify.js` |
| Starting state | Unfinished starter is rejected; preserve the diagnostic |
| Finish evidence | The stable example ends at six after four calls; the never-stable example stops at its budget. |

**Concept in practice:** Starting at zero and adding two until six produces a repeated six on the fourth step call. The stable flag describes equality between consecutive values, not simply reaching the target number.


Repair a bounded feedback loop that stops when its output stabilizes.

## Mission

Implement `refine` in `starter/loop.js`. It must:

1. call the supplied step function at most `maxIterations` times;
2. stop early when two consecutive values are equal;
3. return `{ value, iterations, stable }`;
4. reject invalid iteration limits.

Run `node verify.js`.

## Guided execution

1. Run the untouched verifier and record the expected initial state.
2. Ask for a source-grounded explanation of the relevant code and checks.
3. Plan: Specify refine input validation, equality, iteration counting and the returned object. Trace stable and never-stable examples before implementing; preserve the step-call limit.
4. Implement only the approved slice, then rerun the same verifier.
5. Temporarily increment the reported iteration count incorrectly. Confirm the stable-count assertion fails, then restore it.
6. Review the diff and record the limitation: This local function models bounded iteration; it does not control a live Copilot session automatically.

## Completion and safe reset

- [ ] The required behavior and its negative case have observed evidence.
- [ ] The result distinguishes local verification from live host/runtime behavior.
- [ ] No credentials, unrelated files or services were changed.
- [ ] Evidence is saved before resetting the copied starter.

Use a new extraction for another attempt, or restore only named files from a Git baseline created in this copy. Never apply a curriculum-root restore command from an unrelated project.

Continue with [the adventure and rubric](../../adventures/01-basics/tempora-loop/README.md).
