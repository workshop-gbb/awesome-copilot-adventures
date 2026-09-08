---
title: "The Tempora Loop"
layout: default
parent: "Basics"
grand_parent: "Adventure Catalog"
nav_order: 1
permalink: /adventures/01-basics/tempora-loop/
level: "01-basics"
slug: "tempora-loop"
status: "content-ready"
last_verified: "2026-09-05"
primary_capability: "Iterating with deterministic feedback"
---

# The Tempora Loop


> [!NOTE]
> **Status:** Content ready · **Media:** Generated cover and original SVG illustration · **Last verified:** 2026-09-05  
> **Primary capability:** Iterating with deterministic feedback

![An engineer inspects a circular mechanism beside a finite stack of tokens and a manual stop lever.](../../../assets/images/adventures/tempora-loop-hero.webp)

<details>
<summary>Original concept illustration (SVG)</summary>

![Hypothesis, Iteration budget, Stop condition illustrated through The Tempora Loop.](../../../assets/images/adventures/tempora-loop-hero.svg)

</details>

> [!TIP]
> [Download this learner kit](../../../assets/lab-kits/adventures/tempora-loop.zip) and use
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
    accTitle: The Tempora Loop capability map
    accDescr: Both outcomes are legitimate. A bounded loop must return evidence about why it stopped rather than silently claiming convergence.
    I["Validate step and limit"] --> S["Call one step"]
    S --> Q{"Same as previous value?"}
    Q -->|Yes| D["Return stable result"]
    Q -->|No| B{"Budget remaining?"}
    B -->|Yes| S
    B -->|No| N["Return bounded non-stable result"]
```

**Legend.** Diamonds are stop decisions. The return boxes distinguish stability from budget exhaustion.

**Explanation.** Both outcomes are legitimate. A bounded loop must return evidence about why it stopped rather than silently claiming convergence.

## Official references

These official sources are the authority for product behavior and availability. Recheck them when using a different surface or after a product update.

- [Agents overview](https://code.visualstudio.com/docs/agents/overview)
- [Planning with agents](https://code.visualstudio.com/docs/agents/run/planning)
- [Agent best practices](https://code.visualstudio.com/docs/agents/best-practices)

## Story

The river of Tempora repeats every mistake until a traveler carries evidence from one cycle into the next.

The fantasy is a memory aid; the engineering lesson requires observable, reproducible evidence.

## Learning objectives

- Implement a refinement loop with a maximum number of step calls.
- Distinguish reaching a stable value from exhausting the iteration budget.
- Reject invalid limits and explain the iteration count using a concrete trace.

## Prerequisites

For tools and personal accounts, complete [the prerequisites guide](../../../docs/prerequisites.md).
For terminal-only study, follow [the extracted-kit CLI route](../../../docs/downloads.md#use-copilot-cli-from-the-extracted-kit);
VS Code-specific evidence remains separate.

| Requirement | Why it matters |
| --- | --- |
| Complete the preceding adventure, or demonstrate its exit evidence | Keep this mission focused on its named capability |
| Node 24 and the extracted kit | The local verifier uses the supplied runtime and files |
| A disposable folder outside another project | Customizations and intentional failures must not leak into other work |
| Authorized host access, only for live steps | Availability, tools and policies differ |

**Evidence boundary:** This local function models bounded iteration; it does not control a live Copilot session automatically.

Estimated session: 45–75 minutes after prerequisites; actual duration varies. Never use production secrets or customer data.

## Concept explanation

A reliable agent loop is inspect, hypothesize, change, verify, and review. Use one bounded hypothesis per iteration and the narrowest existing deterministic check. Failed checks update the hypothesis; they do not justify unrelated edits. Hooks can automate lifecycle commands on supported surfaces, but hook support or behavior may be Preview and surface-specific. The lesson works without hooks.

### Concrete use case

Starting at zero and adding two until six produces a repeated six on the fourth step call. The stable flag describes equality between consecutive values, not simply reaching the target number.

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

1. Download and extract the [tempora-loop kit](../../../assets/lab-kits/adventures/tempora-loop.zip) into a new work-drive directory.
2. Read `KIT-START.md` at its root. Open `starter/` as the VS Code workspace when testing discovery, but run the verifier from the kit root.
3. Inspect `starter/loop.js`, `verify.js` before editing.
4. From the extracted kit root, run `node verify.js`.
5. Record the documented starter rejection. A missing runtime or unrelated crash is not the expected exercise result.

### 2. Investigate and plan

Copyable baseline command, from the extracted kit root:

```bash
node verify.js
```

In Ask, request a trace of the inspected files and what the verifier actually observes. Challenge any claim about live execution that is not supported by output.

Use this planning prompt:

```text
Specify refine input validation, equality, iteration counting and the returned object. Trace stable and never-stable examples before implementing; preserve the step-call limit.
Do not implement yet. Identify affected files, the negative case and a safe reset.
```

### 3. Implement the reviewed slice

1. Approve only the named starter artifact and necessary focused tests.
2. Ask Agent to implement one slice; inspect proposed commands before execution.
3. Run `node verify.js` again from the kit root, or `node ../verify.js` from `starter/`.
4. Compare the exact result with the checkpoint below and review the complete diff.
5. Record host discovery or live activity separately when available. Do not enable extra services to manufacture a passing result.

> [!IMPORTANT]
> **Checkpoint:** The stable example ends at six after four calls; the never-stable example stops at its budget.
> This local function models bounded iteration; it does not control a live Copilot session automatically.

### 4. Prove a check can reject a mistake

Temporarily increment the reported iteration count incorrectly. Confirm the stable-count assertion fails, then restore it.

| Observation | Decision | Action | Evidence | Limitation |
| --- | --- | --- | --- | --- |
| Initial state and exact diagnostic | Why this change is needed | Named file and bounded change | Command, exit code and observed result | What the local check does not prove |

Finish with the adventure-specific capability evidence in [the rubric](rubric.md), not just the presence of a file.

## Intentional failure: The Unbounded Time Spell

Perform this only in a disposable environment:

Ask Agent to keep improving until everything is perfect and delay testing until many edits accumulate. Causality is lost and scope drifts because no stop condition exists.

### Recovery

Return to Ask, identify the violated boundary, narrow the plan, remove unnecessary authority or context, and repeat the smallest relevant verification. Document the causal lesson rather than merely stating that the attempt failed.

## Independent challenge

Repair a defect whose first plausible hypothesis is wrong, preserving evidence that leads to the corrected plan.

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

[The Laws of Eldoria](../../01-basics/eldoria-laws/README.md)
