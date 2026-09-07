# Mythos Parallel lab

> [!TIP]
> [Download the learner ZIP](../../assets/lab-kits/adventures/mythos-parallel.zip) or copy this whole lab to an unused folder. Read [setup and optional GitHub steps](../../docs/downloads.md) first.

## Before you run anything

| Item | Contract |
| --- | --- |
| Runtime | Node 24; live integrations are separate |
| Files to inspect | `starter/parallel.js`, `verify.js` |
| Verifier directory | Extracted kit root: `node verify.js`; from `starter/`: `node ../verify.js` |
| Starting state | Unfinished starter is rejected; preserve the diagnostic |
| Finish evidence | All three tasks start before the release gate; a failed task is represented without losing successful results. |

**Concept in practice:** Three runes can begin together even if the middle rune fails. The report still follows the original assignment order, so a reviewer can attribute each result.


Coordinate independent work concurrently while preserving deterministic evidence.

## Mission

Implement `runInParallel` in `starter/parallel.js`. It receives task functions and must:

- start all tasks before awaiting their results;
- preserve input order in the returned array;
- return `{ index, status, value }` for success;
- return `{ index, status, error }` for failure instead of rejecting the batch;
- reject non-function entries before starting any task.

Run `node verify.js`.

## Guided execution

1. Run the untouched verifier and record the expected initial state.
2. Ask for a source-grounded explanation of the relevant code and checks.
3. Plan: Validate the whole task list before invoking any function. Define fulfilled/rejected result records, start all tasks and preserve original indexes in the final array.
4. Implement only the approved slice, then rerun the same verifier.
5. Await each task inside the start loop and observe the verifier reject sequential startup. Restore concurrent startup.
6. Review the diff and record the limitation: JavaScript task concurrency is not proof of isolated agent sessions or worktrees. Those require separate ownership and environment evidence.

## Completion and safe reset

- [ ] The required behavior and its negative case have observed evidence.
- [ ] The result distinguishes local verification from live host/runtime behavior.
- [ ] No credentials, unrelated files or services were changed.
- [ ] Evidence is saved before resetting the copied starter.

Use a new extraction for another attempt, or restore only named files from a Git baseline created in this copy. Never apply a curriculum-root restore command from an unrelated project.

Continue with [the adventure and rubric](../../adventures/03-advanced/mythos-parallel/README.md).
