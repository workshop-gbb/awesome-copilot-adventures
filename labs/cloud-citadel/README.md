# Cloud Citadel lab

> [!TIP]
> [Download the learner ZIP](../../assets/lab-kits/adventures/cloud-citadel.zip) or copy this whole lab to an unused folder. Read [setup and optional GitHub steps](../../docs/downloads.md) first.

## Before you run anything

| Item | Contract |
| --- | --- |
| Runtime | Node 24; live integrations are separate |
| Files to inspect | `starter/task-contract.json`, `verify.js` |
| Verifier directory | Extracted kit root: `node verify.js`; from `starter/`: `node ../verify.js` |
| Starting state | Unfinished starter is rejected; preserve the diagnostic |
| Finish evidence | The task names the exact two allowed directories and the evidence a reviewer will demand. |

**Concept in practice:** A cloud worker receives a small issue with source scope and acceptance criteria. A command written in JSON is only a proposed check until an authorized worker actually runs it.


Write a bounded task contract suitable for delegation to a remote ephemeral environment.

## Mission

Complete `starter/task-contract.json` with:

- a non-empty `goal`;
- `allowedPaths` containing only `src/` and `test/`;
- explicit `acceptanceCriteria`;
- a local verification command of `node test/run.js`;
- `networkRequired` set to `false`;
- an `evidence` list containing changed files, command, exit code, and observed result.

Do not add credentials or deployment instructions. Run `node verify.js`.

## Guided execution

1. Run the untouched verifier and record the expected initial state.
2. Ask for a source-grounded explanation of the relevant code and checks.
3. Plan: Complete the goal, allowedPaths, acceptanceCriteria, local verification command and required evidence. Keep networkRequired false and add no credentials or deployment instructions.
4. Implement only the approved slice, then rerun the same verifier.
5. Set networkRequired true in the copied contract and confirm rejection. Restore the bounded local contract.
6. Review the diff and record the limitation: The verifier does not execute node test/run.js or assign a real issue. A live exercise needs a repository with that actual command and separate authorization.

## Completion and safe reset

- [ ] The required behavior and its negative case have observed evidence.
- [ ] The result distinguishes local verification from live host/runtime behavior.
- [ ] No credentials, unrelated files or services were changed.
- [ ] Evidence is saved before resetting the copied starter.

Use a new extraction for another attempt, or restore only named files from a Git baseline created in this copy. Never apply a curriculum-root restore command from an unrelated project.

Continue with [the adventure and rubric](../../adventures/04-surfaces/cloud-citadel/README.md).
