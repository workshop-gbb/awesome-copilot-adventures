---
layout: default
title: Home
nav_order: 1
permalink: /
description: "Awesome Copilot Adventures: an evidence-first curriculum for agentic software engineering."
---

# Awesome Copilot Adventures

Learn agentic software engineering through guided, fantasy-themed laboratories built around observable evidence.

> [!IMPORTANT]
> The curriculum teaches agent roles, harnesses, environments, and customization primitives as separate concepts. It does not teach deprecated custom chat modes.

## One progressive workflow

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
    accTitle: Evidence-first development workflow
    accDescr: Investigation leads to planning, implementation, review and evidence; unresolved gaps return to investigation.
    A["Ask<br/>Investigate"] --> P["Plan<br/>Design"]
    P --> G["Agent<br/>Implement"]
    G --> R["Review<br/>Challenge"]
    R --> E["Evidence<br/>Prove"]
    E -. "unresolved gap" .-> A
```

**Legend.** Rectangles are workflow stages. Solid arrows show the normal progression; the dashed arrow returns unresolved evidence gaps to investigation.

**Explanation.** A fluent response is not completion. The loop ends only when the reviewed result meets the acceptance criteria and the recorded checks support it.

Ask, Plan, and Agent are **roles**. Local and Copilot are VS Code **agent harnesses**. Cloud is a remote **session target**. A folder, worktree, Codespace, local machine, or remote ephemeral workspace is an **environment**.

## Begin the journey

| Destination | Use it for |
| --- | --- |
| [Start here](start-here.md) | Prepare the environment and first session |
| [Curriculum map](curriculum-map.md) | Follow the complete learning progression |
| [Harness guide](harness-guide.md) | Choose where and how an agent executes |
| [Customization primitives](customization-primitives.md) | Select instructions, prompts, skills, agents, MCP, or hooks |
| [Feature status](feature-status.md) | Check current availability and preview labels |
| [Adventure catalog](adventures/index.md) | Browse every guided mission |
| [Hands-on Labs](../mslearn-github-copilot/index.md) | Follow non-fantasy exercises, including Spec Kit modernization |
| [Diagram style](diagram-style.md) | Understand monochrome colors, legends and accessibility |

The executable source for each mission lives in the GitHub [adventure tree](https://github.com/workshop-gbb/awesome-copilot-adventures/tree/main/adventures) and [lab tree](https://github.com/workshop-gbb/awesome-copilot-adventures/tree/main/labs).

The multilingual site also includes a repository explorer for original code,
fixtures, solutions, customizations, media and historical material. Learning pages
are available in English, Spanish and Brazilian Portuguese; executable examples
and original licenses retain their source text.

> [!NOTE]
> Product guidance was last verified against current official GitHub and Microsoft documentation on **2026-09-05**. Recheck the linked source when availability or policy materially affects your task.
