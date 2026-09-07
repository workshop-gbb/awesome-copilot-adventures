---
layout: default
title: Harness Guide
nav_order: 4
permalink: /harnesses/
---

# Harness guide

A **role** describes the responsibility. A **harness** supplies runtime, tools, permissions, context, and lifecycle. A **target** chooses where the session runs. An **environment** contains the files and processes.

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
flowchart TB
    accTitle: Session targets and agent harnesses
    accDescr: Local and Copilot targets select different runtimes, while the Cloud target selects an available remote agent.
    U["User goal"] --> T{"Session target"}
    T --> L["Local target"]
    T --> C["Copilot target"]
    T --> CL["Cloud target"]

    L --> LH["VS Code Local harness<br/>Extension host"]
    C --> CH["Copilot harness<br/>Agent Host + Copilot SDK"]
    CL --> CA["Available cloud agent<br/>Remote ephemeral environment"]

    LH --> R["Ask · Plan · Agent · Custom agent"]
    CH --> R
    CA --> PR["Branch and pull request"]
```

**Legend.** The diamond is the target-selection decision. Rectangles describe runtimes, agent roles and the remote review artifact; solid arrows show selection relationships.

**Explanation.** Local is a harness name, not all local execution. Roles, targets and runtimes answer different questions; a remote pull request is an output artifact.

> [!IMPORTANT]
> **Local** is the name of a VS Code harness, not a synonym for every local execution. **Cloud** is a remote target that can expose available cloud agents; it is not one universal harness.

## Decision guide

| Surface or harness | Consider it when | Verify before use |
| --- | --- | --- |
| **VS Code Local harness** | Work depends on editor state, extension-provided tools, or prompt files | Extensions, workspace trust, model, approvals, and local permissions |
| **VS Code Copilot harness** | Work needs Agent Host sessions, background execution, folder/worktree isolation, or portable skills | Tools, policies, model, session target, and isolation |
| **GitHub Copilot CLI** | Terminal-centered investigation and execution are appropriate | Current directory, approvals, environment variables, runtimes, and repository state |
| **Cloud target / cloud agent** | A bounded repository task can run remotely and return a reviewable pull request | Repository access, setup, secrets, network, branch protection, and review plan |
| **Copilot SDK application** | You are intentionally embedding an agent runtime in a product | Supported SDK, authentication, tenancy, tools, permissions, observability, and deployment |

## Isolation is not permission

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
    accTitle: Isolation and permission are different controls
    accDescr: Sessions isolate conversation, worktrees isolate code, sandboxes constrain processes and approvals express operation consent.
    S["Session"] --> C["Conversation isolation"]
    W["Worktree"] --> F["Code isolation"]
    B["Sandbox"] --> P["Process / filesystem policy"]
    A["Approvals"] --> O["Operation-level consent"]
```

**Legend.** Rectangles name controls and their responsibilities. Solid arrows connect each control with what it actually governs.

**Explanation.** A worktree is not a security sandbox. Code isolation, process policy and operation approval must each be considered when selecting an execution environment.

A worktree prevents branch collisions; it does not by itself restrict commands, network, or access outside the worktree.

## Before a handoff

- State the goal and non-goals.
- Name the repository, branch, and relevant paths.
- Provide setup and validation commands.
- Separate confirmed facts from assumptions.
- Define stop conditions and expected artifacts.
- Never place secrets in prompts, source files, or captured evidence.

Practice with [The Portals of Nexus](../adventures/00-foundations/portals-of-nexus/README.md).

## Official references

- [Agent harness concepts](https://code.visualstudio.com/docs/agents/concepts/agent-harnesses)
- [Run agents in different harnesses](https://code.visualstudio.com/docs/agents/run/agent-harnesses)
- [Agent Host architecture](https://code.visualstudio.com/docs/agents/concepts/agent-host)
- [Agent sessions](https://code.visualstudio.com/docs/agents/concepts/sessions)
- [GitHub Copilot CLI](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli)
- [GitHub Copilot cloud agent](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent)
