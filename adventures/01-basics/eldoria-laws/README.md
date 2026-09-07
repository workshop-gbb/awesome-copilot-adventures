---
title: "The Laws of Eldoria"
layout: default
parent: "Basics"
grand_parent: "Adventure Catalog"
nav_order: 2
permalink: /adventures/01-basics/eldoria-laws/
level: "01-basics"
slug: "eldoria-laws"
status: "content-ready"
last_verified: "2026-09-05"
primary_capability: "Authoring scoped repository instructions"
---

# The Laws of Eldoria


> [!NOTE]
> **Status:** Content ready · **Media:** Original SVG illustration · **Last verified:** 2026-09-05  
> **Primary capability:** Authoring scoped repository instructions

![Durable rule, Path scope, Observed change illustrated through The Laws of Eldoria.](../../../assets/images/adventures/eldoria-laws-hero.svg)

> [!TIP]
> [Download this learner kit](../../../assets/lab-kits/adventures/eldoria-laws.zip) and use
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
flowchart TD
    accTitle: The Laws of Eldoria capability map
    accDescr: Verify both discovery and the resulting behavior. Resolve contradictory guidance rather than assuming a hidden precedence rule.
    R["Repository instructions"] --> C["Applicable context"]
    P["Path-specific instructions"] --> C
    T["Task request"] --> C
    C --> A["Agent proposal"]
    M["Permissions and tools"] --> A
    A --> D["Review diff and tests"]
```

**Legend.** Instruction and task boxes feed context; the separate permissions branch shows authority is not supplied by prose.

**Explanation.** Verify both discovery and the resulting behavior. Resolve contradictory guidance rather than assuming a hidden precedence rule.

## Official references

These official sources are the authority for product behavior and availability. Recheck them when using a different surface or after a product update.

- [Custom instructions](https://code.visualstudio.com/docs/agent-customization/custom-instructions)
- [Repository custom instructions](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions)
- [Prompt files](https://code.visualstudio.com/docs/agent-customization/prompt-files)

## Story

Eldoria’s laws are carved into nested stones. A law placed too high governs every village; one placed too low is never seen.

The fantasy is a memory aid; the engineering lesson requires observable, reproducible evidence.

## Learning objectives

- Write concise repository instructions tied to a real validation command.
- Separate durable conventions from task-specific requests and permission enforcement.
- Check host discovery independently of a content verifier.

## Prerequisites

| Requirement | Why it matters |
| --- | --- |
| Complete the preceding adventure, or demonstrate its exit evidence | Keep this mission focused on its named capability |
| Node 24 and the extracted kit | The local verifier uses the supplied runtime and files |
| A disposable folder outside another project | Customizations and intentional failures must not leak into other work |
| Authorized host access, only for live steps | Availability, tools and policies differ |

**Evidence boundary:** A text check cannot prove instruction compliance or define precedence between conflicting natural-language files.

Estimated session: 45–75 minutes after prerequisites; actual duration varies. Never use production secrets or customer data.

## Concept explanation

Repository instructions automatically provide durable conventions and constraints. Prompts are manually invoked task templates, not instructions. Path-specific instructions narrow guidance to matching files. Prefer testable rules such as “run command X after changing Y.” Instruction discovery and precedence can differ by Copilot feature, so verify the surface against official documentation.

### Concrete use case

A repository convention can require deterministic tests and prohibit credentials. It cannot grant filesystem isolation; the allowed source paths and available tools remain separate controls.

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

1. Download and extract the [eldoria-laws kit](../../../assets/lab-kits/adventures/eldoria-laws.zip) into a new work-drive directory.
2. Read `KIT-START.md` at its root. Open `starter/` as the VS Code workspace when testing discovery, but run the verifier from the kit root.
3. Inspect `starter/.github/copilot-instructions.md`, `verify.js` before editing.
4. From the extracted kit root, run `node verify.js`.
5. Record the documented starter rejection. A missing runtime or unrelated crash is not the expected exercise result.

### 2. Investigate and plan

In Ask, request a trace of the inspected files and what the verifier actually observes. Challenge any claim about live execution that is not supported by output.

Use this planning prompt:

```text
Write four concise rules covering deterministic tests, no credentials, source-path scope and verification before completion. Explain which rules are guidance rather than enforced permissions.
Do not implement yet. Identify affected files, the negative case and a safe reset.
```

### 3. Implement the reviewed slice

1. Approve only the named starter artifact and necessary focused tests.
2. Ask Agent to implement one slice; inspect proposed commands before execution.
3. Run `node verify.js` again from the kit root, or `node ../verify.js` from `starter/`.
4. Compare the exact result with the checkpoint below and review the complete diff.
5. Record host discovery or live activity separately when available. Do not enable extra services to manufacture a passing result.

> [!IMPORTANT]
> **Checkpoint:** The instruction file names actionable constraints and the host discovery result is recorded separately.
> A text check cannot prove instruction compliance or define precedence between conflicting natural-language files.

### 4. Prove a check can reject a mistake

Remove the test requirement from the disposable file and observe the verifier reject the missing rule. Restore it before asking for a bounded change.

| Observation | Decision | Action | Evidence | Limitation |
| --- | --- | --- | --- | --- |
| Initial state and exact diagnostic | Why this change is needed | Named file and bounded change | Command, exit code and observed result | What the local check does not prove |

Finish with the adventure-specific capability evidence in [the rubric](rubric.md), not just the presence of a file.

## Intentional failure: The Contradictory Tablets

Perform this only in a disposable environment:

Create incompatible global and path-specific rules for the same files. The result is ambiguous because natural-language instructions are context, not a formal policy engine.

### Recovery

Return to Ask, identify the violated boundary, narrow the plan, remove unnecessary authority or context, and repeat the smallest relevant verification. Document the causal lesson rather than merely stating that the attempt failed.

## Independent challenge

Refactor a long instruction file into durable global rules and narrow path-specific rules while preserving observable behavior.

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

[The Skills of Algora](../../02-intermediate/algora-skills/README.md)
