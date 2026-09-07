# Stonevale Guardrails lab

> [!TIP]
> [Download the learner ZIP](../../assets/lab-kits/adventures/stonevale-guardrails.zip) or copy this whole lab to an unused folder. Read [setup and optional GitHub steps](../../docs/downloads.md) first.

## Before you run anything

| Item | Contract |
| --- | --- |
| Runtime | Node 24; live integrations are separate |
| Files to inspect | `starter/guard.js`, `verify.js` |
| Verifier directory | Extracted kit root: `node verify.js`; from `starter/`: `node ../verify.js` |
| Starting state | Unfinished starter is rejected; preserve the diagnostic |
| Finish evidence | Only the two named scripts are allowed; the supplied unsafe strings are rejected without execution. |

**Concept in practice:** The policy receives a command string and returns a decision. A string containing shell operators is a rejected test input, never a command this exercise asks you to run.


Implement deterministic command guardrails before an automation step reaches a shell.

## Mission

Complete `starter/guard.js`. `isAllowed(command)` must return `true` only when:

- the input is a non-empty string;
- the executable is `node`;
- the script is `verify.js` or `test.js`;
- no shell operators, substitutions, absolute paths, or parent traversal appear.

Run `node verify.js`.

## Guided execution

1. Run the untouched verifier and record the expected initial state.
2. Ask for a source-grounded explanation of the relevant code and checks.
3. Plan: Specify exact allowed executable/script pairs and all rejected forms. Keep test inputs as strings; implement no shell execution. State the boolean behavior for empty and wrong-type input.
4. Implement only the approved slice, then rerun the same verifier.
5. Temporarily allow an extra argument and confirm the corresponding case fails. Restore the allowlist.
6. Review the diff and record the limitation: This function is not installed as a live hook. Hook support is Preview and any installation requires a separate reviewed configuration.

## Completion and safe reset

- [ ] The required behavior and its negative case have observed evidence.
- [ ] The result distinguishes local verification from live host/runtime behavior.
- [ ] No credentials, unrelated files or services were changed.
- [ ] Evidence is saved before resetting the copied starter.

Use a new extraction for another attempt, or restore only named files from a Git baseline created in this copy. Never apply a curriculum-root restore command from an unrelated project.

Continue with [the adventure and rubric](../../adventures/02-intermediate/stonevale-guardrails/README.md).
