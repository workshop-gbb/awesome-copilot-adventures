# Lumoria Graph lab

> [!TIP]
> [Download the learner ZIP](../../assets/lab-kits/adventures/lumoria-graph.zip) or copy this whole lab to an unused folder. Read [setup and optional GitHub steps](../../docs/downloads.md) first.

## Before you run anything

| Item | Contract |
| --- | --- |
| Runtime | Node 24; live integrations are separate |
| Files to inspect | `starter/graph.js`, `verify.js` |
| Verifier directory | Extracted kit root: `node verify.js`; from `starter/`: `node ../verify.js` |
| Starting state | Unfinished starter is rejected; preserve the diagnostic |
| Finish evidence | Changing types reaches all five supplied nodes; changing api reaches api and docs only. |

**Concept in practice:** If api depends on core and core depends on types, a change to types can affect api. A change to api does not automatically affect its dependency types.


Repair a dependency graph traversal so an agent can explain impact before editing.

## Mission

Implement `affectedBy` in `starter/graph.js`. Given a graph whose keys depend on the listed nodes, return every node directly or transitively affected by a changed node.

Requirements:

- include the changed node;
- return unique names in alphabetical order;
- handle cycles safely;
- reject an unknown starting node.

Run `node verify.js`.

## Guided execution

1. Run the untouched verifier and record the expected initial state.
2. Ask for a source-grounded explanation of the relevant code and checks.
3. Plan: Specify affectedBy for the provided dependency direction. Include the changed node, visit reverse dependants once, handle cycles and sort the final unique names. Explain an unknown-start error.
4. Implement only the approved slice, then rerun the same verifier.
5. Reverse the traversal direction deliberately in the disposable implementation. Confirm the types impact case detects the mistake, then restore it.
6. Review the diff and record the limitation: The fixture validates traversal, not automatic discovery of every real repository dependency.

## Completion and safe reset

- [ ] The required behavior and its negative case have observed evidence.
- [ ] The result distinguishes local verification from live host/runtime behavior.
- [ ] No credentials, unrelated files or services were changed.
- [ ] Evidence is saved before resetting the copied starter.

Use a new extraction for another attempt, or restore only named files from a Git baseline created in this copy. Never apply a curriculum-root restore command from an unrelated project.

Continue with [the adventure and rubric](../../adventures/03-advanced/lumoria-graph/README.md).
