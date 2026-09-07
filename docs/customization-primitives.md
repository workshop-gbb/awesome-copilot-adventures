---
layout: default
title: Customization Primitives
nav_order: 5
permalink: /customization/
---

# Customization primitives

Choose the smallest primitive that reliably supplies the missing behavior.

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
    accTitle: Select the smallest customization primitive
    accDescr: Decide whether context is automatic, then choose a task prompt, reusable skill, role profile, external capability or deterministic check.
    N["What is missing?"] --> A{"Apply automatically?"}
    A -- Yes --> I["Instructions"]
    A -- No --> K{"What kind of need?"}
    K -- Repeatable command --> P["Prompt file"]
    K -- Reusable expertise --> S["Agent Skill"]
    K -- Role + tools --> C["Custom agent"]
    K -- External capability --> M["MCP server"]
    K -- Deterministic enforcement --> H["Hook"]
```

**Legend.** Diamonds are selection questions. Labeled arrows describe the need; rectangles are the customization primitives.

**Explanation.** Choose based on responsibility and invocation, not perceived sophistication. A skill is not a permission boundary and a prompt is not automatically applied context.

| Need | Primitive | Key boundary |
| --- | --- | --- |
| Context applied automatically | Repository or path-specific instructions | Keep scope explicit and avoid conflicts |
| A manually invoked task template | Prompt file | Local invocation is intentional, not automatic |
| Reusable expertise loaded when relevant | Agent Skill | Expertise is not a permanent persona |
| A role with tools and optional handoffs | Custom agent (`.agent.md`) | Tool access and handoffs must be explicit |
| Access to an external system | Model Context Protocol server | Trust, authentication, data exposure, and side effects vary |
| A deterministic lifecycle command | Hook | Preview schema, shell safety, timeout, and secret handling matter |

> [!IMPORTANT]
> Prompt files are supported by the VS Code Local harness, but agents running in the Agent Host do not use them. Use an Agent Skill when the behavior must travel to the Copilot harness.

> [!WARNING]
> Agent hooks in VS Code are **Preview** as of 2026-09-05. Review every command, input, output, timeout, and secret exposure path.

## Portability

| Primitive | VS Code Local | Copilot harness / Agent Host | Copilot CLI | Cloud agent |
| --- | --- | --- | --- | --- |
| Instructions | Yes, subject to scope | Yes, subject to discovery | Yes, subject to discovery | Yes, documented locations apply |
| Prompt files | Yes | No | Do not assume | Do not assume |
| Agent Skills | Yes | Yes | Yes | Yes |
| Custom agents | Yes | Yes | Yes | Yes, with property differences |
| MCP | Yes | Use portable configuration | Yes | Support and policy vary |
| Hooks | Preview | Preview | Documented support varies | Documented support varies |

Do not use deprecated custom chat modes as a substitute for custom agents. MCP means **Model Context Protocol**.

Practice with [Laws of Eldoria](../adventures/01-basics/eldoria-laws/README.md), [Skills of Algora](../adventures/02-intermediate/algora-skills/README.md), and [Agents of Stellaris](../adventures/02-intermediate/stellaris-agents/README.md).

## Official references

- [Customization concepts](https://code.visualstudio.com/docs/agents/concepts/customization)
- [Custom instructions](https://code.visualstudio.com/docs/agent-customization/custom-instructions)
- [Prompt files](https://code.visualstudio.com/docs/agent-customization/prompt-files)
- [Agent Skills](https://code.visualstudio.com/docs/agent-customization/agent-skills)
- [Custom agents](https://code.visualstudio.com/docs/agent-customization/custom-agents)
- [MCP servers](https://code.visualstudio.com/docs/agent-customization/mcp-servers)
- [Agent hooks — Preview](https://code.visualstudio.com/docs/agent-customization/hooks)
