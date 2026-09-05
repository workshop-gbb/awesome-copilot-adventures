# Portals of Nexus lab

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
