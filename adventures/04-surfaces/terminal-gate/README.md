---
title: "The Terminal Gate"
layout: default
parent: "Surfaces"
grand_parent: "Adventure Catalog"
nav_order: 2
permalink: /adventures/04-surfaces/terminal-gate/
level: "04-surfaces"
slug: "terminal-gate"
status: "content-ready"
last_verified: "2026-09-05"
primary_capability: "Using GitHub Copilot CLI safely"
---

# The Terminal Gate


> [!NOTE]
> **Status:** Content ready · **Media:** Original SVG illustration · **Last verified:** 2026-09-05  
> **Primary capability:** Using GitHub Copilot CLI safely

![Command text, Safe parser, Named action illustrated through The Terminal Gate.](../../../assets/images/adventures/terminal-gate-hero.svg)

> [!TIP]
> [Download this learner kit](../../../assets/lab-kits/adventures/terminal-gate.zip) and use
> [the extraction and setup guide](../../../docs/downloads.md). Keep the original starter untouched.

```mermaid
---
config:
  theme: base
  look: classic
  themeVariables:
    darkMode: false
    background: "#ffffff"
    primaryColor: "#f5f5f5"
    primaryTextColor: "#111111"
    primaryBorderColor: "#555555"
    secondaryColor: "#e0e0e0"
    secondaryTextColor: "#111111"
    secondaryBorderColor: "#666666"
    tertiaryColor: "#bdbdbd"
    tertiaryTextColor: "#111111"
    tertiaryBorderColor: "#444444"
    lineColor: "#444444"
    textColor: "#111111"
    mainBkg: "#f5f5f5"
    nodeBorder: "#555555"
    clusterBkg: "#ffffff"
    clusterBorder: "#999999"
    edgeLabelBackground: "#ffffff"
    actorBkg: "#e0e0e0"
    actorBorder: "#555555"
    actorTextColor: "#111111"
    actorLineColor: "#777777"
    signalColor: "#333333"
    signalTextColor: "#111111"
    labelBoxBkgColor: "#f5f5f5"
    labelBoxBorderColor: "#777777"
    labelTextColor: "#111111"
    loopTextColor: "#111111"
    activationBkgColor: "#bdbdbd"
    activationBorderColor: "#555555"
    noteBkgColor: "#f5f5f5"
    noteTextColor: "#111111"
    noteBorderColor: "#777777"
    attributeBackgroundColorOdd: "#f5f5f5"
    attributeBackgroundColorEven: "#e0e0e0"
---
flowchart LR
    accTitle: The Terminal Gate capability map
    accDescr: A parser can make a small interface predictable. It is not a replacement for runtime permissions or a complete CLI integration.
    S["Input string"] --> T["Token count and action"]
    T --> P["Relative path validation"]
    P --> Q{"Allowed request?"}
    Q -->|Yes| O["Return action and target"]
    Q -->|No| E["Explicit error"]
```

**Legend.** Validation boxes describe parsing stages; neither successful nor rejected input is executed as shell code.

**Explanation.** A parser can make a small interface predictable. It is not a replacement for runtime permissions or a complete CLI integration.

## Official references

These official sources are the authority for product behavior and availability. Recheck them when using a different surface or after a product update.

- [About GitHub Copilot CLI](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli)
- [Copilot CLI quickstart](https://docs.github.com/en/copilot/get-started/cli-quickstart)
- [Copilot CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)

## Story

At the Terminal Gate, every spell becomes a command with a working directory, exit code, and side effect.

The fantasy is a memory aid; the engineering lesson requires observable, reproducible evidence.

## Learning objectives

- Parse only inspect and verify actions with one relative path.
- Reject unsupported arguments, traversal and shell syntax without evaluating input.
- Record working-directory assumptions and separate the local parser from Copilot CLI authentication.

## Prerequisites

| Requirement | Why it matters |
| --- | --- |
| Complete the preceding adventure, or demonstrate its exit evidence | Keep this mission focused on its named capability |
| Node 24 and the extracted kit | The local verifier uses the supplied runtime and files |
| A disposable folder outside another project | Customizations and intentional failures must not leak into other work |
| Authorized host access, only for live steps | Availability, tools and policies differ |

**Evidence boundary:** No shell command is executed by the parser exercise. Using the real Copilot CLI is a separate live workflow with its own setup and permissions.

Estimated session: 45–75 minutes after prerequisites; actual duration varies. Never use production secrets or customer data.

## Concept explanation

Copilot CLI is a terminal agent harness. Commands inherit the current directory, user permissions, environment variables, and network configuration. Ask and Plan should establish scope before Agent executes. Read commands before approval, avoid exposing secrets, prefer existing project tasks, preserve output and exit codes, and do not assume feature or model availability across plans or platforms.

### Concrete use case

The same relative file name means something different from another working directory. A safe command contract states both its permitted action and where the target is resolved.

### Vocabulary checkpoint

- **Role:** Ask, Plan, Agent, or a custom agent.
- **Harness/surface:** the runtime or product surface in which a role operates.
- **Target:** the selected session destination, such as Local, Copilot, or Cloud where exposed.
- **Environment:** the folder, worktree, local machine, Codespace, or remote environment.
- **Instructions:** automatically applied durable context.
- **Prompt:** a manually invoked task template.
- **Skill:** reusable expertise loaded when relevant.
- **Custom agent:** a role with instructions, tools, and optional handoffs.
- **MCP:** Model Context Protocol.
- **Evidence:** a path, diff, command result, trace, or review decision.

## Ask → Plan → Agent workflow

### Ask — investigate

1. Identify the real user outcome and current source of truth.
2. Inspect relevant files, instructions, tools, permissions, and existing checks.
3. Cite concrete paths or platform evidence for every important finding.
4. Record uncertainty and do not infer unavailable capabilities.

**Gate:** No implementation until the current state and evidence are understood.

### Plan — design

1. State scope, non-goals, assumptions, risks, and trust boundaries.
2. Select the minimum role, tools, authority, and environment.
3. Define acceptance criteria, verification commands, review, and reset.
4. Mark any Preview or experimental dependency and provide a fallback.

**Gate:** Another learner should be able to predict completion from the plan.

### Agent — execute

1. Make the smallest reversible change or produce the planned artifact.
2. Use short inspect → change → verify loops.
3. Preserve command output, exit status, diffs, traces, or platform records.
4. Stop when acceptance criteria are met; do not perform unrelated cleanup.

### Review — challenge

1. Inspect the complete diff or artifact.
2. Compare each result with the plan and acceptance criteria.
3. Run the narrowest relevant existing check, broadening only when justified.
4. Record limitations and unresolved risks.
5. Score the work with [rubric.md](rubric.md).

## Guided mission

### 1. Prepare one isolated copy

1. Download and extract the [terminal-gate kit](../../../assets/lab-kits/adventures/terminal-gate.zip) into a new work-drive directory.
2. Read `KIT-START.md` at its root. Open `starter/` as the VS Code workspace when testing discovery, but run the verifier from the kit root.
3. Inspect `starter/command.js`, `verify.js` before editing.
4. From the extracted kit root, run `node verify.js`.
5. Record the documented starter rejection. A missing runtime or unrelated crash is not the expected exercise result.

### 2. Investigate and plan

In Ask, request a trace of the inspected files and what the verifier actually observes. Challenge any claim about live execution that is not supported by output.

Use this planning prompt:

```text
Define parseCommand output for the two allowed actions. Require exactly one relative target and reject absolute paths, traversal, quotes and shell operators as untrusted strings.
Do not implement yet. Identify affected files, the negative case and a safe reset.
```

### 3. Implement the reviewed slice

1. Approve only the named starter artifact and necessary focused tests.
2. Ask Agent to implement one slice; inspect proposed commands before execution.
3. Run `node verify.js` again from the kit root, or `node ../verify.js` from `starter/`.
4. Compare the exact result with the checkpoint below and review the complete diff.
5. Record host discovery or live activity separately when available. Do not enable extra services to manufacture a passing result.

> [!IMPORTANT]
> **Checkpoint:** Valid requests return action and target; every supplied invalid form is rejected.
> No shell command is executed by the parser exercise. Using the real Copilot CLI is a separate live workflow with its own setup and permissions.

### 4. Prove a check can reject a mistake

Temporarily accept an extra argument and confirm the invalid-input case fails. Restore the strict parser.

| Observation | Decision | Action | Evidence | Limitation |
| --- | --- | --- | --- | --- |
| Initial state and exact diagnostic | Why this change is needed | Named file and bounded change | Command, exit code and observed result | What the local check does not prove |

Finish with the adventure-specific capability evidence in [the rubric](rubric.md), not just the presence of a file.

## Intentional failure: The Wrong-Side Command

Perform this only in a disposable environment:

Change to an unrelated directory and observe how a safe relative command changes meaning. The shell environment is part of the execution contract.

### Recovery

Return to Ask, identify the violated boundary, narrow the plan, remove unnecessary authority or context, and repeat the smallest relevant verification. Document the causal lesson rather than merely stating that the attempt failed.

## Independent challenge

Complete a tiny bug fix using terminal evidence sufficient for another learner to reproduce and reset it.

Constraints:

- Do not copy the guided mission verbatim.
- Do not add tools, permissions, or cloud resources without a stated need.
- Do not claim quality, performance, compatibility, or availability without executed evidence.
- Keep fantasy language subordinate to technical clarity.

## Evidence checklist

- [ ] Source-grounded Ask findings.
- [ ] Approved plan with scope, non-goals, risks, checks, and reset.
- [ ] Agent diff or artifact limited to the declared scope.
- [ ] Verification output with command, status, or platform record.
- [ ] Intentional-failure root cause and recovery.
- [ ] Independent challenge result.
- [ ] Explicit limitations and feature-status notes.
- [ ] Completed [rubric.md](rubric.md).

## Reset instructions

1. Save your diff, command output and limitations from the disposable kit.
2. Stop only the process or learning session you started. Do not stop other projects.
3. If you initialized Git in the kit, inspect `git status --short` there and restore only your named exercise files from its local baseline.
4. Otherwise, extract the original ZIP into a new unused directory for another attempt; do not overwrite your current work.
5. Remove only exercise-owned configurations, worktrees or remote resources after reviewing anything worth preserving.

The curriculum source and other projects must remain unchanged. A reset of the copied kit is not a repository-wide hard reset.

## Next adventure

[The Automaton Foundry](../../04-surfaces/automaton-foundry/README.md)
