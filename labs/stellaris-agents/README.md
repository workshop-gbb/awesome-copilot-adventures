# Agents of Stellaris lab

> [!TIP]
> [Download the learner ZIP](../../assets/lab-kits/adventures/stellaris-agents.zip) or copy this whole lab to an unused folder. Read [setup and optional GitHub steps](../../docs/downloads.md) first.

## Before you run anything

| Item | Contract |
| --- | --- |
| Runtime | Node 24; live integrations are separate |
| Files to inspect | `starter/.github/agents/test-scout.agent.md`, `verify.js` |
| Verifier directory | Extracted kit root: `node verify.js`; from `starter/`: `node ../verify.js` |
| Starting state | Unfinished starter is rejected; preserve the diagnostic |
| Finish evidence | The profile has search and a focused command tool, no edit tool, and a concrete handoff prompt. |

**Concept in practice:** A test scout can inspect and run a narrow test, then recommend a missing case. A separate implementer owns source edits; the handoff transfers a reviewed plan, not unlimited authority.


Define a focused custom agent using the current `.agent.md` customization format.

## Isolate the exercise

Copy this lab to a disposable location and open `starter/` as the workspace root. Start a new session so `.github/agents/test-scout.agent.md` is discovered from the correct root.

## Mission

Complete `starter/.github/agents/test-scout.agent.md`. It must include frontmatter fields for `name`, `description`, and `tools`, then instruct the agent to:

- inspect existing tests before recommending changes;
- remain read-only with respect to source edits and recommend only test-focused changes;
- run the smallest relevant test command;
- report evidence and remaining failures.
- hand off a concrete test plan to the built-in Agent role for implementation.

From `starter/`, run `node ../verify.js`. Record separate evidence that the agent appears in the selected harness and that its handoff is available where supported.

## Guided execution

1. Run the untouched verifier and record the expected initial state.
2. Ask for a source-grounded explanation of the relevant code and checks.
3. Plan: Define test-scout metadata and a minimal tool list consistent with the verifier. Keep recommendations test-focused, preserve source-read-only intent and require a reviewed handoff to Agent.
4. Implement only the approved slice, then rerun the same verifier.
5. Temporarily add an edit tool to the copied profile. Verify rejection, then restore the restricted tool list.
6. Review the diff and record the limitation: A command tool can still have side effects. Read-only intent is not a sandbox; review exact test commands and permissions.

## Completion and safe reset

- [ ] The required behavior and its negative case have observed evidence.
- [ ] The result distinguishes local verification from live host/runtime behavior.
- [ ] No credentials, unrelated files or services were changed.
- [ ] Evidence is saved before resetting the copied starter.

Use a new extraction for another attempt, or restore only named files from a Git baseline created in this copy. Never apply a curriculum-root restore command from an unrelated project.

Continue with [the adventure and rubric](../../adventures/02-intermediate/stellaris-agents/README.md).
