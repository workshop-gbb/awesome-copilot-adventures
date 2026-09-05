# Convergence of Three Realms lab

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
