---
layout: default
title: Hands-on environment and resource limits
parent: Hands-on Labs
nav_order: 1
permalink: /hands-on/environment/
last_verified: "2026-09-07"
---

# Hands-on environment and resource limits

These exercises are a **non-fantasy companion track** to Awesome Copilot Adventures.
They retain the exercise/task format of the imported learning material.
You do not need to complete the adventures first.

> [!TIP]
> **Starting without a clone?** Use [the learner ZIP catalog](../../../docs/downloads.md).
> Each kit includes a complete lesson, local images, an integrity manifest and
> `KIT-START.md` with the exact workspace root and baseline. The instructions below
> are the alternative for learners who already have the curriculum checkout.

## Work in a disposable copy

1. Start in the root of `awesome-copilot-adventures`.
2. Select a lab in the [catalog](../../index.md). Use its `lab_id`, not its displayed title.
3. Choose an **unused absolute directory outside this repository** on an existing
   work drive. Create and inspect its parent first. The following examples use
   `02-csharp`; replace the lab ID with your selection. Do not install .NET if you
   are taking a Node or Python exercise.

### macOS: Bash or zsh

On the workshop Mac, the T9 drive is the selected work drive:

```bash
mkdir -p /Volumes/T9/Dev/oss/workshop-runs
node scripts/prepare-hands-on.js --lab 02-csharp --destination /Volumes/T9/Dev/oss/workshop-runs/02-csharp
```

### Windows: PowerShell

Replace `D:\WorkshopRuns` with a directory on your existing approved work drive;
the example does not create or assume that a D: drive exists.

```powershell
New-Item -ItemType Directory -Force -Path 'D:\WorkshopRuns'
node scripts/prepare-hands-on.js --lab 02-csharp --destination 'D:\WorkshopRuns\02-csharp'
```

### Linux: Bash

Replace `/mnt/work` with your existing work-drive mount before running the example:

```bash
mkdir -p /mnt/work/workshop-runs
node scripts/prepare-hands-on.js --lab 02-csharp --destination /mnt/work/workshop-runs/02-csharp
```

Preparation copies only the named fixture. It refuses an existing destination;
it does not install dependencies, run generated code, initialize Git, or overwrite a project.

### Continue from the prepared copy

1. Open the printed directory as the **only root in a new VS Code window**.
   A multi-root workspace can inherit instructions from the wrong project.
2. Run the selected lab's baseline from its documented working directory.
3. If the lab needs version control, initialize only that copy and make a baseline:

   ```bash
   git init -b training
   git status --short
   git add .
   git commit -m "Record untouched hands-on baseline"
   ```

   Inspect files before staging. Use a repository-local Git identity if one is
   required; do not replace the learner's global identity. A GitHub repository,
   public visibility, and a push are **not** prerequisites for a local lab.

For first-time Git users, the [download and repository walkthrough](../../../docs/downloads.md)
covers local identity, file review, the first commit, creating an empty private
GitHub repository, adding its remote and pushing without force.

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

On Linux, use the same Bash variable names with your work-drive path. For PowerShell,
the equivalent cache setup is:

```powershell
$env:HANDS_ON_HOME = 'D:\WorkshopRuns'
$env:TMP = Join-Path $env:HANDS_ON_HOME '.cache\tmp'
$env:TEMP = $env:TMP
$env:npm_config_cache = Join-Path $env:HANDS_ON_HOME '.cache\npm'
$env:PIP_CACHE_DIR = Join-Path $env:HANDS_ON_HOME '.cache\pip'
$env:UV_CACHE_DIR = Join-Path $env:HANDS_ON_HOME '.cache\uv'
$env:UV_TOOL_DIR = Join-Path $env:HANDS_ON_HOME '.tools\uv'
$env:UV_TOOL_BIN_DIR = Join-Path $env:HANDS_ON_HOME '.tools\bin'
$env:UV_PYTHON_INSTALL_DIR = Join-Path $env:HANDS_ON_HOME '.tools\python'
$env:DOTNET_CLI_HOME = Join-Path $env:HANDS_ON_HOME '.cache\dotnet'
$env:NUGET_PACKAGES = Join-Path $env:HANDS_ON_HOME '.cache\nuget'
$env:PYTHONDONTWRITEBYTECODE = '1'
$env:DOTNET_CLI_TELEMETRY_OPTOUT = '1'
$env:DOTNET_CLI_WORKLOAD_UPDATE_NOTIFY_DISABLE = 'true'
$env:DOTNET_GENERATE_ASPNET_CERTIFICATE = 'false'
New-Item -ItemType Directory -Force -Path $env:TMP,$env:UV_TOOL_BIN_DIR,$env:DOTNET_CLI_HOME,$env:NUGET_PACKAGES
```

Replace the drive path first and repeat the variables in each new terminal.
These examples describe shell syntax; they are not a claim that the Windows
or Linux walkthrough was executed on the workshop Mac.

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
