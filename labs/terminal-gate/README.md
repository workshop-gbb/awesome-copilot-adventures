# Terminal Gate lab

> [!TIP]
> [Download the learner ZIP](../../assets/lab-kits/adventures/terminal-gate.zip) or copy this whole lab to an unused folder. Read [setup and optional GitHub steps](../../docs/downloads.md) first.

## Before you run anything

| Item | Contract |
| --- | --- |
| Runtime | Node 24; live integrations are separate |
| Files to inspect | `starter/command.js`, `verify.js` |
| Verifier directory | Extracted kit root: `node verify.js`; from `starter/`: `node ../verify.js` |
| Starting state | Unfinished starter is rejected; preserve the diagnostic |
| Finish evidence | Valid requests return action and target; every supplied invalid form is rejected. |

**Concept in practice:** The same relative file name means something different from another working directory. A safe command contract states both its permitted action and where the target is resolved.


Build a tiny argument parser for a safe, deterministic terminal surface.

## Mission

Implement `parseCommand` in `starter/command.js`. Accept only:

```text
inspect <relative-path>
verify <relative-path>
```

Return `{ action, target }`. Reject missing or extra arguments, absolute paths, parent traversal, shell metacharacters, and unsupported actions.

Run `node verify.js`.

## Guided execution

1. Run the untouched verifier and record the expected initial state.
2. Ask for a source-grounded explanation of the relevant code and checks.
3. Plan: Define parseCommand output for the two allowed actions. Require exactly one relative target and reject absolute paths, traversal, quotes and shell operators as untrusted strings.
4. Implement only the approved slice, then rerun the same verifier.
5. Temporarily accept an extra argument and confirm the invalid-input case fails. Restore the strict parser.
6. Review the diff and record the limitation: No shell command is executed by the parser exercise. Using the real Copilot CLI is a separate live workflow with its own setup and permissions.

## Completion and safe reset

- [ ] The required behavior and its negative case have observed evidence.
- [ ] The result distinguishes local verification from live host/runtime behavior.
- [ ] No credentials, unrelated files or services were changed.
- [ ] Evidence is saved before resetting the copied starter.

Use a new extraction for another attempt, or restore only named files from a Git baseline created in this copy. Never apply a curriculum-root restore command from an unrelated project.

Continue with [the adventure and rubric](../../adventures/04-surfaces/terminal-gate/README.md).
