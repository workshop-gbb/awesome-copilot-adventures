# Portals of Nexus lab

> [!TIP]
> [Download the learner ZIP](../../assets/lab-kits/adventures/portals-of-nexus.zip) or copy this whole lab to an unused folder. Read [setup and optional GitHub steps](../../docs/downloads.md) first.

## Before you run anything

| Item | Contract |
| --- | --- |
| Runtime | Node 24; live integrations are separate |
| Files to inspect | `starter/portal-map.json`, `verify.js` |
| Verifier directory | Extracted kit root: `node verify.js`; from `starter/`: `node ../verify.js` |
| Starting state | Unfinished starter is rejected; preserve the diagnostic |
| Finish evidence | Each task row has four independent dimensions; a GitHub pull request is not mislabeled as an environment. |

**Concept in practice:** A maintainer asks for an explanation, then a change. Ask can inspect without editing; a later Agent session may use a worktree. Record those decisions separately rather than describing both as one agent mode.


Practice routing work without conflating the agent role, harness, session target, and execution environment.

## Mission

Complete `starter/portal-map.json`:

| Task | Role | Harness | Target | Environment |
| --- | --- | --- | --- | --- |
| Explain an unfamiliar module | `ask` | `vscode-local` | `local` | `repository-folder` |
| Design an API migration | `plan` | `vscode-copilot` | `copilot` | `repository-folder` |
| Implement and test in isolation | `agent` | `vscode-copilot` | `copilot` | `worktree` |

These are teaching choices for this controlled exercise, not universal requirements for every task.

Run:

```bash
node verify.js
```

The verifier checks all four dimensions independently.

## Guided execution

1. Run the untouched verifier and record the expected initial state.
2. Ask for a source-grounded explanation of the relevant code and checks.
3. Plan: Map the three task rows to role, harness, target and environment. Justify each choice, identify which dimensions the verifier checks, and keep the task read-only until the map is reviewed.
4. Implement only the approved slice, then rerun the same verifier.
5. In the disposable map, temporarily swap one role with a harness value. The verifier must reject the mixed dimensions. Restore the correct row.
6. Review the diff and record the limitation: The verifier checks the map, not that any selected host or account is available.

## Completion and safe reset

- [ ] The required behavior and its negative case have observed evidence.
- [ ] The result distinguishes local verification from live host/runtime behavior.
- [ ] No credentials, unrelated files or services were changed.
- [ ] Evidence is saved before resetting the copied starter.

Use a new extraction for another attempt, or restore only named files from a Git baseline created in this copy. Never apply a curriculum-root restore command from an unrelated project.

Continue with [the adventure and rubric](../../adventures/00-foundations/portals-of-nexus/README.md).
