---
layout: default
title: Spec Kit versions, artifacts and boundaries
parent: Hands-on Labs
nav_order: 3
permalink: /hands-on/spec-kit-reference/
last_verified: "2026-09-07"
---

# Spec Kit versions, artifacts and boundaries

This track was checked against **Spec Kit v1.0.4** on **2026-09-07**.
Pin a release rather than installing changing `main` content during a workshop.
The application contract and tests belong to the learner; Spec Kit is not a
compiler, runtime security boundary, or proof that generated code works.

## A material change from the imported lessons

The v1.0.4 **Copilot integration uses skills by default**:

```text
.github/skills/speckit-constitution/SKILL.md
.github/skills/speckit-specify/SKILL.md
.github/skills/speckit-plan/SKILL.md
...
.specify/memory/constitution.md
.specify/templates/
.specify/scripts/
```

The corresponding invocation uses a hyphen, for example `/speckit-specify`.
The optional commands layout is still supported:

```bash
specify init --here --integration copilot --script sh --integration-options="--commands"
```

That layout generates agent files, companion prompt files, and VS Code settings.
Its prompts use dotted names such as `/speckit.specify`. Use a **Local** session
for prompt files: Agent Host sessions do not consume them.

> [!IMPORTANT]
> The v1.0.4 installation guide still illustrates dotted commands while the Copilot
> integration reference and code specify skills as the default. Inspect the
> generated files and the selected host's picker. Do not mix the two layouts or
> assume an older screenshot describes the installed release.

## Install only in the work-drive tool directory

1. Follow [the cache/tool-directory setup](SETUP.md). The selected release requires
   Python 3.11 or later and uv for the recommended installation route.
2. If Specify is already installed, inspect `specify version` and `uv tool list`
   before changing anything.
3. When installation is needed, choose one reviewed route:

   ```bash
   uv tool install specify-cli --from git+https://github.com/github/spec-kit.git@v1.0.4
   ```

   The official PyPI alternative is:

   ```bash
   uv tool install specify-cli==1.0.4
   ```

4. Use the executable in the configured `UV_TOOL_BIN_DIR`. In that terminal:

   ```bash
   export PATH="$UV_TOOL_BIN_DIR:$PATH"
   specify version
   specify init --help
   ```

   A version printout is an availability check, not evidence of package provenance.
   Record the install source and release as well.

## Initialize an exercise copy, not the curriculum

```bash
specify init --here --integration copilot --script sh
```

Use `--script ps` in PowerShell. Do not run initialization at the root of Awesome
Copilot Adventures. First create a disposable copy, initialize its local Git
baseline, inspect existing `.github` and `.specify` files, and review the proposed
merge. Do not use `--force` to get past conflicts you have not inspected.

Spec Kit can merge or update its own scaffolding. “Existing repository” is not a
promise that every customization will remain byte-for-byte unchanged.

## Workflow and evidence gates

| Default skill | Artifact or action | Human verification |
| --- | --- | --- |
| `/speckit-constitution` | Project principles in `.specify/memory/constitution.md` | Actionable rules; no unrelated implementation |
| `/speckit-specify` | Feature specification under `specs/` | User behavior, IDs, non-goals and edge cases |
| `/speckit-clarify` | Resolve missing requirements | Decisions recorded, no silent scope expansion |
| `/speckit-plan` | Technical design and contracts | Chosen stack, preserved interfaces, tests, risks |
| `/speckit-tasks` | Dependency-ordered work | Each requirement has a task and check |
| `/speckit-analyze` | Cross-artifact consistency | Missing/contradictory coverage is addressed |
| `/speckit-checklist` | Requirements-quality checklist | Checklist is not an executed test suite |
| `/speckit-implement` | Implement the approved tasks | Inspect diff and actual test output |
| `/speckit-converge` | Compare code with specification/plan/tasks | Independently verify reported completion |

Inspect the actual generated paths rather than assuming a feature directory number.
Use the matching dotted command only if you intentionally selected commands mode.

Example input is **natural language**, not an invented command-line flag parser:

```text
/speckit-constitution Use requirements.md and the existing baseline tests.
Require deterministic local tests, no secrets, preservation of the public contract,
and one bounded implementation slice at a time.
```

Do not present `--text` or `--files` as supported flags to these agent workflows.
Attach the files through the host or name their paths in the request.

## Three different development cases

| Case | Starting state | Main risk | Gate before implementation |
| --- | --- | --- | --- |
| Greenfield | Requirements and no implementation | Building too much | Small acceptance contract and explicit non-goals |
| Brownfield feature | Working application and existing tests | Breaking current consumers | Baseline green plus new red regression |
| Modernization | Existing code/data and a required technical change | Losing compatibility or data | Characterization, import checks, rollback |

Spec Kit's workflow names do not make these cases identical. The modernization
lab deliberately keeps business behavior fixed while changing storage.

## Stop conditions

Stop after two unsuccessful repair iterations, an unexplained baseline failure,
an unreviewed dependency change, or a destructive proposal. Record the blocker
and update the plan. Do not let an automatic convergence loop run indefinitely.

## Official sources and version evidence

- [Spec Kit v1.0.4 release](https://github.com/github/spec-kit/releases/tag/v1.0.4)
- [Tagged installation guide](https://github.com/github/spec-kit/blob/v1.0.4/docs/installation.md)
- [Tagged integration reference](https://github.com/github/spec-kit/blob/v1.0.4/docs/reference/integrations.md)
- [Copilot integration implementation](https://github.com/github/spec-kit/blob/v1.0.4/src/specify_cli/integrations/copilot/__init__.py)
- [Constitution workflow](https://github.com/github/spec-kit/blob/v1.0.4/templates/commands/constitution.md)
- [Version and Python requirement](https://github.com/github/spec-kit/blob/v1.0.4/pyproject.toml)
- [VS Code prompt-file limitation](https://code.visualstudio.com/docs/agent-customization/prompt-files)
