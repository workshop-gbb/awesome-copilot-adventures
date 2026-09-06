---
layout: default
title: Copilot concepts for hands-on work
parent: Hands-on Labs
nav_order: 2
permalink: /hands-on/copilot-concepts/
last_verified: "2026-09-06"
---

# Copilot concepts for hands-on work

## Five questions before a task

| Question | Concept | Example |
| --- | --- | --- |
| What responsibility is needed? | Role | Ask investigates; Plan designs; Agent implements |
| Which runtime controls the tools? | Harness | VS Code Local or Copilot Agent Host |
| Which destination is selected? | Session target | Local, Copilot, or an available Cloud target |
| Where do files and processes live? | Environment | Disposable folder, worktree, Codespace |
| What can this session do? | Permissions | Read, edit, execute, network access, explicit approvals |

The **model** is another choice, not a synonym for any row.
The old screenshots shipped with the imported material show earlier UI layouts.
Use the current Command Palette and the documentation below; do not infer current
feature status, model access, or settings defaults from those images.

## Choose the smallest useful workflow

1. **Ask:** request a trace of the real code with paths and uncertainty.
2. **Plan:** ask for acceptance criteria, affected files, risks, validation, and a stop condition.
3. **Agent:** implement one approved slice, then inspect its diff and actual tool output.
4. **Review:** compare the result with the acceptance criteria in a clean context.

Planning is useful for small risky changes too. Agent may perform planning internally;
the three roles are not three mandatory product buttons in every CLI or harness.

### Example: a library search feature

```text
Ask: Trace the console action to the repository. Cite the files you inspected.
Separate what the code already does from what the requirement requests. Do not edit.
```

```text
Plan: Add case-insensitive title search. Preserve existing loan and return behavior.
List the contract, empty/missing input cases, changed files, and focused test command.
Do not assume a whole book is unavailable because one physical copy is on loan.
```

```text
Agent: Implement only the reviewed search slice in this disposable workspace.
Run the specified tests, report exit codes, and stop after two unsuccessful repairs
to explain the blocker. Do not change unrelated projects or publish a branch.
```

## Context is selected evidence, not the entire repository

Attach the smallest useful file or selection, but also follow relevant interfaces,
callers, tests, and data. `#codebase` requests retrieval; it does not guarantee every
file is placed into model context. Closing a tab does not prove the file is inaccessible.

Instruction files influence responses. They do not enforce filesystem restrictions,
guarantee code quality, or change the permission model. Resolve conflicting instruction
files directly: the VS Code documentation does not promise a precedence order when
it combines them. Inline completions are not the same instruction-aware chat workflow.

## Customization choices

| Need | Use | Loading evidence |
| --- | --- | --- |
| Repository conventions | `.github/copilot-instructions.md` | Inspect discovered instructions/references |
| Path-specific conventions | `.github/instructions/*.instructions.md` | Match `applyTo` to the actual source path |
| Manually invoked task | `.github/prompts/*.prompt.md` | Invoke from a supported Local session |
| Reusable expertise | `.github/skills/<name>/SKILL.md` | Verify discovery and relevant invocation |
| Role and tool selection | `.github/agents/*.agent.md` | Inspect available profile and tools |
| External capabilities | Reviewed MCP configuration | Discover a tool and verify its result |
| Deterministic lifecycle check | Hook | Observe hook input, output, and exit status |

> [!WARNING]
> VS Code hooks and agent-scoped hooks are **Preview**. Nested `AGENTS.md` support
> and extra Plan-agent tools are experimental where documented. Availability is
> affected by organization policy.

> [!IMPORTANT]
> VS Code Agent Host sessions do **not** use prompt files. For the Spec Kit slash
> commands in this track, use a supported **Local** session or verify the generated
> custom-agent integration explicitly. Do not assume copying a prompt into a skill
> preserves Spec Kit's scripts, arguments, or workflow.

## Features are not entitlements

Do not change a private repository to public just to complete a lab. Do not hardcode
plan quotas, request counts, or a particular model as universally available. Record
the capabilities actually available to your account. Local/offline exercise evidence
must be labeled separately from cloud or live SDK execution.

## Source register

Checked on **2026-09-06**. These are product references, not copies of chat output.

| Subject | Official source | Boundary used in this track |
| --- | --- | --- |
| Setup | [Set up Copilot](https://code.visualstudio.com/docs/setup/copilot) | Account access; UI labels can change |
| Harnesses | [Choose a harness](https://code.visualstudio.com/docs/agents/run/agent-harnesses) | Cloud is a target; worktrees are not sandboxes |
| Planning | [Plan with agents](https://code.visualstudio.com/docs/agents/run/planning) | Review before implementation; extra tools are experimental |
| Instructions | [Custom instructions](https://code.visualstudio.com/docs/agent-customization/custom-instructions) | Scope; no guaranteed combination order |
| Prompt files | [Prompt files](https://code.visualstudio.com/docs/agent-customization/prompt-files) | Local harness versus Agent Host |
| Skills | [Agent Skills](https://code.visualstudio.com/docs/agent-customization/agent-skills) | Relevance-based loading is not deterministic execution |
| Agents | [Custom agents](https://code.visualstudio.com/docs/agent-customization/custom-agents) | Tool names and handoffs differ by surface |
| Hooks | [Hooks](https://code.visualstudio.com/docs/agent-customization/hooks) | Preview; inspect executable commands |
| Cloud | [Start cloud sessions](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/start-copilot-sessions) | Remote work and PR evidence require access |
| Tests | [C#](https://code.visualstudio.com/docs/csharp/testing), [Python](https://code.visualstudio.com/docs/python/testing) | Discovery, build, and execution are separate |

## Related guidance

- [Environment and resource limits](SETUP.md)
- [Harness guide](../../../docs/harness-guide.md)
- [Feature-status matrix](../../../docs/feature-status.md)
