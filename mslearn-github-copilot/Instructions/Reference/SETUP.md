---
layout: default
title: Hands-on environment and resource limits
parent: Hands-on Labs
nav_order: 1
permalink: /hands-on/environment/
last_verified: "2026-09-06"
---

# Hands-on environment and resource limits

These exercises are a **non-fantasy companion track** to Awesome Copilot Adventures.
They retain the exercise/task format of the imported learning material.
You do not need to complete the adventures first.

## Work in a disposable copy

1. Start in the root of `awesome-copilot-adventures`.
2. Select a lab in the [catalog](../../index.md). Use its `lab_id`, not its displayed title.
3. Choose an **unused absolute directory outside this repository**. On the workshop Mac,
   use the T9 drive. Do not use Desktop, Downloads, the home directory, or `/tmp`.
4. Run the preparation command documented by the lab, for example:

   ```bash
   node scripts/prepare-hands-on.js --lab 02-csharp --destination /Volumes/T9/Dev/oss/workshop-runs/02-csharp
   ```

   Preparation copies only the named fixture. It refuses an existing destination;
   it does not install dependencies, run generated code, initialize Git, or overwrite a project.
5. Open the printed directory as the **only root in a new VS Code window**.
   A multi-root workspace can inherit instructions from the wrong project.
6. If the lab needs version control, initialize only that copy and make a baseline:

   ```bash
   git init -b training
   git status --short
   git add .
   git commit -m "Record untouched hands-on baseline"
   ```

   Inspect files before staging. Use a repository-local Git identity if one is
   required; do not replace the learner's global identity. A GitHub repository,
   public visibility, and a push are **not** prerequisites for a local lab.

## Keep temporary files and caches on the work drive

For Bash/zsh on the T9 workshop machine, run this in the terminal that will execute
the exercise. A new terminal needs the same exports:

```bash
export HANDS_ON_HOME=/Volumes/T9/Dev/oss/workshop-runs
export TMPDIR="$HANDS_ON_HOME/.cache/tmp"
export XDG_CACHE_HOME="$HANDS_ON_HOME/.cache"
export npm_config_cache="$HANDS_ON_HOME/.cache/npm"
export PIP_CACHE_DIR="$HANDS_ON_HOME/.cache/pip"
export UV_CACHE_DIR="$HANDS_ON_HOME/.cache/uv"
export UV_TOOL_DIR="$HANDS_ON_HOME/.tools/uv"
export UV_TOOL_BIN_DIR="$HANDS_ON_HOME/.tools/bin"
export UV_PYTHON_INSTALL_DIR="$HANDS_ON_HOME/.tools/python"
export DOTNET_CLI_HOME="$HANDS_ON_HOME/.cache/dotnet"
export NUGET_PACKAGES="$HANDS_ON_HOME/.cache/nuget"
export PYTHONDONTWRITEBYTECODE=1
export DOTNET_CLI_TELEMETRY_OPTOUT=1
export DOTNET_CLI_WORKLOAD_UPDATE_NOTIFY_DISABLE=true
export DOTNET_GENERATE_ASPNET_CERTIFICATE=false
mkdir -p "$TMPDIR" "$UV_TOOL_BIN_DIR" "$DOTNET_CLI_HOME" "$NUGET_PACKAGES"
```

For another OS, choose an equivalent external/project drive and set these variables
using that shell's environment syntax. `C:\` itself is not a workspace.
The scripts use Node's path APIs; do not paste Bash syntax into PowerShell.

> [!IMPORTANT]
> A worktree isolates source changes, **not** CPU, memory, network, or credentials.
> Do not change `HOME`, disable certificate verification, grant all tool permissions,
> or install a workspace-wide MCP server to make a lab work.

## Runtime choices

| Track | Runtime | Why |
| --- | --- | --- |
| C# library/refactoring | .NET 10 SDK; C# Dev Kit if using editor tests | Imported fixtures target `net10.0` after integration |
| Python library/tests | A supported Python 3.x interpreter; fixture requirements | `pytest` is the existing runner, not a new test framework |
| JavaScript/TypeScript examples | Node 24 | Native test runner and TypeScript stripping for lightweight examples |
| Spec Kit | Python and uv required by the selected Specify release | The application stack does not need to be Python |
| Copilot SDK | Runtime and package listed by the SDK lab | Offline application tests and authenticated inference are separate |

Use the exact version and tool status printed by your environment. A newer SDK
does not automatically provide older runtimes or guarantee third-party compatibility.
Install dependencies only for the selected fixture. Do not build all copies of the
library solution at once.

## Resource budget

- Run **one lab, build, test runner, or profiler at a time**.
- For .NET use `-m:1` and `-p:UseSharedCompilation=false` where appropriate.
- Use `node --test --test-concurrency=1` and ordinary single-process pytest.
- Start servers on loopback and an unused port; stop them with `Ctrl+C` in their
  owning terminal. Never use process-name-wide termination.
- Profile a small input first. Do not generate millions of rows or run a load test
  on this shared machine.
- Do not install an SDK, browser, database, container runtime, or global package
  unless the chosen exercise actually requires it.
- Keep logs small and redact identifiers before sharing them.

## Record a baseline

Save an evidence note **in the disposable copy**, not in the curriculum source:

| Item | Record |
| --- | --- |
| Fixture and runtime | Lab ID, source path, runtime version |
| Copilot setup | Role, harness/target, model if exposed, permissions |
| Baseline command | Exact command and working directory |
| Result | Exit code, discovered tests, observable output |
| Change | Acceptance criterion and affected paths |
| After change | Same checks, regression result, limitations |

A green build proves compilation. It does not prove feature behavior, test discovery,
model quality, or preservation of data. A screenshot from another run proves none
of those things for your copy.

## Reset safely

1. Save evidence you want to keep.
2. Stop only the server/profiler started for the exercise.
3. Inspect `git status --short` in the disposable copy.
4. If resetting a tracked exercise file, restore **that named file** from the
   baseline; do not use a repository-wide hard reset.
5. For a fresh attempt, choose a new destination for the preparation script.
6. Remove old copies through your file manager only after checking their absolute
   paths. Never recursively delete the repository, work drive, or shared cache root.

## Official references

- [VS Code Copilot setup](https://code.visualstudio.com/docs/setup/copilot)
- [VS Code worktrees](https://code.visualstudio.com/docs/sourcecontrol/branches-worktrees)
- [Python testing](https://code.visualstudio.com/docs/python/testing)
- [C# testing](https://code.visualstudio.com/docs/csharp/testing)
- [.NET CLI environment variables](https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet-environment-variables)
