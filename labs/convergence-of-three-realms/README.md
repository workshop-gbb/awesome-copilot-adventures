# Convergence of Three Realms lab

> [!TIP]
> [Download the learner ZIP](../../assets/lab-kits/adventures/convergence-of-three-realms.zip) or copy this whole lab to an unused folder. Read [setup and optional GitHub steps](../../docs/downloads.md) first.

## Before you run anything

| Item | Contract |
| --- | --- |
| Runtime | Node 24; live integrations are separate |
| Files to inspect | `starter/workflow.json`, `verify.js` |
| Verifier directory | Extracted kit root: `node verify.js`; from `starter/`: `node ../verify.js` |
| Starting state | Unfinished starter is rejected; preserve the diagnostic |
| Finish evidence | The graph preserves findings, design, verification, pull request, evaluation report and human decision in order. |

**Concept in practice:** A local developer, a cloud worker and an embedded runtime agent have different identities and outputs. The final maintainer needs both the implementation evidence and the runtime evaluation before deciding.


Connect local development, remote repository work, and an embedded runtime into one traceable delivery graph.

## Mission

Complete `starter/workflow.json` with six ordered stages:

| Phase | Actor | Agent role | Harness | Target | Environment | Review surface |
| --- | --- | --- | --- | --- | --- | --- |
| Ask | Learner | `ask` | `vscode-local` | `local` | `repository-folder` | — |
| Plan | Learner | `plan` | `vscode-copilot` | `copilot` | `repository-folder` | — |
| Implement | GitHub Copilot | `agent` | `vscode-copilot` | `copilot` | `worktree` | — |
| Cloud implementation | GitHub Copilot | `agent` | `github-copilot-cloud-agent` | `cloud` | `ephemeral-github-environment` | — |
| Runtime evaluation | SDK application | `custom-agent` | `github-copilot-sdk` | `application` | `application-runtime` | — |
| Review | Maintainer | none | not applicable | not applicable | not applicable | `github-pull-request` |

Every stage must declare the actor separately from:

- agent role, when an agent is involved;
- harness;
- target;
- environment;
- what artifacts it consumes;
- its trust boundary;
- at least one concrete evidence item.

The human review stage intentionally leaves agent-only dimensions null instead of forcing a pull request to masquerade as a harness or environment.

Run:

```bash
node verify.js
```

Use paper artifacts when cloud-agent or SDK access is unavailable. Label the fallback rather than fabricating execution evidence.

## Guided execution

1. Run the untouched verifier and record the expected initial state.
2. Ask for a source-grounded explanation of the relevant code and checks.
3. Plan: Complete the six-stage contract using the supplied actor and artifact dimensions. Explain every consumes/produces edge, trust boundary and evidence item. Keep agent-only fields null for human review.
4. Implement only the approved slice, then rerun the same verifier.
5. Give the human-review stage an agent harness and confirm the verifier rejects the conflation. Restore the distinct review boundary.
6. Review the diff and record the limitation: Completing the workflow contract is not a production delivery. Record unexecuted cloud and SDK stages as paper alternatives, never fabricated observations.

## Completion and safe reset

- [ ] The required behavior and its negative case have observed evidence.
- [ ] The result distinguishes local verification from live host/runtime behavior.
- [ ] No credentials, unrelated files or services were changed.
- [ ] Evidence is saved before resetting the copied starter.

Use a new extraction for another attempt, or restore only named files from a Git baseline created in this copy. Never apply a curriculum-root restore command from an unrelated project.

Continue with [the adventure and rubric](../../adventures/99-capstone/convergence-of-three-realms/README.md).
