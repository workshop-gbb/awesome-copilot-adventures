---
layout: default
title: Curriculum Map
nav_order: 3
permalink: /curriculum/
---

# Curriculum map

The path moves from mental models to a governed end-to-end delivery.

```mermaid
flowchart TB
    subgraph F["00 · Foundations"]
        N["Portals of Nexus<br/>roles · harnesses · targets"]
        X["Context Mirrors<br/>context experiments"]
        N --> X
    end

    subgraph B["01 · Basics"]
        T["Tempora Loop<br/>bounded iteration"]
        E["Laws of Eldoria<br/>instructions and scope"]
        T --> E
    end

    subgraph I["02 · Intermediate"]
        A["Skills of Algora<br/>reusable expertise"]
        S["Agents of Stellaris<br/>roles, tools, handoffs"]
        G["Guardrails of Stonevale<br/>hooks and policy"]
        A --> S --> G
    end

    subgraph D["03 · Advanced"]
        M["MCP Cartographer<br/>external capabilities"]
        L["Lumoria Graph<br/>dependency and impact graph"]
        Y["Parallel Mythos<br/>sessions and worktrees"]
        M --> L --> Y
    end

    subgraph U["04 · Surfaces"]
        C["Cloud Citadel<br/>cloud agent"]
        Q["Terminal Gate<br/>Copilot CLI"]
        K["Automaton Foundry<br/>Copilot SDK"]
        C --> Q --> K
    end

    Z["99 · Capstone<br/>Convergence of Three Realms"]

    X --> T
    E --> A
    G --> M
    Y --> C
    K --> Z
```

| Level | Focus | Catalog | Source |
| --- | --- | --- | --- |
| **00 · Foundations** | Roles, harnesses, targets, context, and evidence | [Foundations](adventures/foundations.md) | [Adventure files](https://github.com/paulasilvatech/awesome-copilot-adventures/tree/main/adventures/00-foundations) |
| **01 · Basics** | Instructions and bounded agent loops | [Basics](adventures/basics.md) | [Adventure files](https://github.com/paulasilvatech/awesome-copilot-adventures/tree/main/adventures/01-basics) |
| **02 · Intermediate** | Skills, custom agents, and guardrails | [Intermediate](adventures/intermediate.md) | [Adventure files](https://github.com/paulasilvatech/awesome-copilot-adventures/tree/main/adventures/02-intermediate) |
| **03 · Advanced** | Model Context Protocol, graphs, and parallel work | [Advanced](adventures/advanced.md) | [Adventure files](https://github.com/paulasilvatech/awesome-copilot-adventures/tree/main/adventures/03-advanced) |
| **04 · Surfaces** | CLI, cloud execution, and SDK applications | [Surfaces](adventures/surfaces.md) | [Adventure files](https://github.com/paulasilvatech/awesome-copilot-adventures/tree/main/adventures/04-surfaces) |
| **99 · Capstone** | Integrated agentic engineering | [Capstone](adventures/capstone.md) | [Adventure files](https://github.com/paulasilvatech/awesome-copilot-adventures/tree/main/adventures/99-capstone) |

> [!TIP]
> Follow the levels in order on a first pass. On later passes, repeat one lab in a different harness and compare the evidence rather than the fluency of the response.

Use the [Glossary](glossary.md) for terminology and the [Feature Status Matrix](feature-status.md) before relying on availability-sensitive capabilities.
