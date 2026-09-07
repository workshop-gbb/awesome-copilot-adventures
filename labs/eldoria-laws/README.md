# Laws of Eldoria lab

> [!TIP]
> [Download the learner ZIP](../../assets/lab-kits/adventures/eldoria-laws.zip) or copy this whole lab to an unused folder. Read [setup and optional GitHub steps](../../docs/downloads.md) first.

## Before you run anything

| Item | Contract |
| --- | --- |
| Runtime | Node 24; live integrations are separate |
| Files to inspect | `starter/.github/copilot-instructions.md`, `verify.js` |
| Verifier directory | Extracted kit root: `node verify.js`; from `starter/`: `node ../verify.js` |
| Starting state | Unfinished starter is rejected; preserve the diagnostic |
| Finish evidence | The instruction file names actionable constraints and the host discovery result is recorded separately. |

**Concept in practice:** A repository convention can require deterministic tests and prohibit credentials. It cannot grant filesystem isolation; the allowed source paths and available tools remain separate controls.


Create repository instructions that give an agent durable, testable constraints.

## Isolate the exercise

Copy this lab to a disposable location and open `starter/` as the workspace root. Start a new session so `.github/copilot-instructions.md` is discovered from the correct root.

## Mission

Replace the placeholder in `starter/.github/copilot-instructions.md`. The instructions must explicitly require:

- deterministic local tests;
- no credentials in source;
- changes limited to `src/`;
- verification before completion.

From `starter/`, run `node ../verify.js`. Capture host discovery evidence separately; the verifier checks content, not whether a session loaded it.

## Guided execution

1. Run the untouched verifier and record the expected initial state.
2. Ask for a source-grounded explanation of the relevant code and checks.
3. Plan: Write four concise rules covering deterministic tests, no credentials, source-path scope and verification before completion. Explain which rules are guidance rather than enforced permissions.
4. Implement only the approved slice, then rerun the same verifier.
5. Remove the test requirement from the disposable file and observe the verifier reject the missing rule. Restore it before asking for a bounded change.
6. Review the diff and record the limitation: A text check cannot prove instruction compliance or define precedence between conflicting natural-language files.

## Completion and safe reset

- [ ] The required behavior and its negative case have observed evidence.
- [ ] The result distinguishes local verification from live host/runtime behavior.
- [ ] No credentials, unrelated files or services were changed.
- [ ] Evidence is saved before resetting the copied starter.

Use a new extraction for another attempt, or restore only named files from a Git baseline created in this copy. Never apply a curriculum-root restore command from an unrelated project.

Continue with [the adventure and rubric](../../adventures/01-basics/eldoria-laws/README.md).
