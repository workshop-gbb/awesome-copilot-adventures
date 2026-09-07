---
layout: default
title: Start Here
nav_order: 2
permalink: /start-here/
---

# Start here

## Choose an environment

| Option | Best for |
| --- | --- |
| [GitHub Codespaces](https://codespaces.new/workshop-gbb/awesome-copilot-adventures?quickstart=1) | Fastest reproducible setup |
| VS Code Dev Container | Local work with the repository-defined toolchain |
| Local clone | Learners who already have Node 24, Python 3.14, and .NET 10 |

> [!NOTE]
> GitHub Copilot features, models, targets, and preview capabilities can vary by account, organization policy, client version, and environment.

## Verify the repository

```bash
npm install
npm test
dotnet build solutions/csharp/CopilotAdventures.sln
python solutions/python/test_gridlock_arena.py
```

## Your first session

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
sequenceDiagram
    accTitle: Learner and agent role handoffs
    accDescr: The learner requests investigation, a bounded plan, implementation and independent review, receiving a different evidence artifact at each step.
    participant L as Learner
    participant A as Ask
    participant P as Plan
    participant G as Agent
    participant R as Reviewer

    L->>A: Investigate the current state
    A-->>L: Facts, constraints, unknowns
    L->>P: Design a bounded change
    P-->>L: Scope, risks, checks, reset
    L->>G: Implement the approved plan
    G-->>L: Diff and executed validation
    L->>R: Challenge the completion claim
    R-->>L: Findings and evidence gaps
```

**Legend.** Participants are the learner and agent roles. Solid arrows are requests; dashed arrows are returned findings, plans, changes or review results.

**Explanation.** The learner owns acceptance at each boundary. A role handoff carries task context, but it does not prove a test or review was executed.

1. Read the [Harness Guide](harness-guide.md).
2. Open [The Portals of Nexus](../adventures/00-foundations/portals-of-nexus/README.md).
3. Create a clean branch, disposable folder, or worktree.
4. Follow Ask → Plan → Agent → Review.
5. Save commands, exit codes, diffs, decisions, and limitations.
6. Complete the reset instructions.

## Completion evidence

- [ ] The starting state is documented.
- [ ] Scope and non-goals are explicit.
- [ ] The chosen harness and environment are justified.
- [ ] Relevant checks were actually run.
- [ ] Output and exit status were recorded.
- [ ] Review findings were resolved or accepted.
- [ ] Temporary resources and credentials were cleaned up.

Continue with the [Curriculum Map](curriculum-map.md) or browse the [Adventure Catalog](adventures/index.md).
