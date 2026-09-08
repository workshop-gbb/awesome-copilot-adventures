---
title: "The MCP Cartographer"
layout: default
parent: "Advanced"
grand_parent: "Adventure Catalog"
nav_order: 1
permalink: /adventures/03-advanced/cartographer-mcp/
level: "03-advanced"
slug: "cartographer-mcp"
status: "content-ready"
last_verified: "2026-09-05"
primary_capability: "Connecting tools with Model Context Protocol"
---

# The MCP Cartographer


> [!NOTE]
> **Status:** Content ready · **Media:** Generated cover and original SVG illustration · **Last verified:** 2026-09-05  
> **Primary capability:** Connecting tools with Model Context Protocol

![A cartographer works at a local map desk connected through a checkpoint and bridge to an external archive.](../../../assets/images/adventures/cartographer-mcp-hero.webp)

<details>
<summary>Original concept illustration (SVG)</summary>

![MCP client, Read-only server, Verified map illustrated through The MCP Cartographer.](../../../assets/images/adventures/cartographer-mcp-hero.svg)

</details>

> [!TIP]
> [Download this learner kit](../../../assets/lab-kits/adventures/cartographer-mcp.zip) and use
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
sequenceDiagram
    accTitle: The MCP Cartographer capability map
    accDescr: Discovery is not verification of the returned fact. Compare the structured result with the bundled source and keep host trust decisions separate.
    participant C as Local verifier
    participant S as MCP server
    C->>S: initialize
    S-->>C: Server identity and capabilities
    C->>S: tools/list
    S-->>C: read_map schema
    C->>S: tools/call read_map
    S-->>C: Synthetic realm data
```

**Legend.** Solid arrows are requests; dashed arrows are protocol results over the local stdio connection.

**Explanation.** Discovery is not verification of the returned fact. Compare the structured result with the bundled source and keep host trust decisions separate.

## Official references

These official sources are the authority for product behavior and availability. Recheck them when using a different surface or after a product update.

- [MCP servers in VS Code](https://code.visualstudio.com/docs/agent-customization/mcp-servers)
- [MCP configuration reference](https://code.visualstudio.com/docs/agents/reference/mcp-configuration)
- [Enhance agent mode with MCP](https://docs.github.com/en/copilot/tutorials/enhance-agent-mode-with-mcp)

## Story

The Cartographer’s atlas describes roads to distant instruments. Every route names its server, capability, trust boundary, and proof.

The fantasy is a memory aid; the engineering lesson requires observable, reproducible evidence.

## Learning objectives

- Describe MCP client, server, transport, discovery and tool call as separate parts.
- Configure the bundled local server with no network or credential requirement.
- Verify initialize, tools/list and the read_map result independently of host discovery.

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

**Evidence boundary:** The direct protocol check does not prove that a specific VS Code harness discovered this file. Use the supported host configuration only in this disposable workspace.

Estimated session: 45–75 minutes after prerequisites; actual duration varies. Never use production secrets or customer data.

## Concept explanation

Model Context Protocol standardizes how a host can discover capabilities exposed by servers. A host acts as an MCP client; servers may expose tools, resources, and prompts. MCP does not make a server trustworthy. Installation, authentication, network access, returned content, and side effects remain security decisions. Support varies by host and organization policy.

### Concrete use case

The cartographer reads a synthetic realm through a local process. The discovered read-only annotation is a hint; inspect the server code and returned data rather than trusting its name.

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

1. Download and extract the [cartographer-mcp kit](../../../assets/lab-kits/adventures/cartographer-mcp.zip) into a new work-drive directory.
2. Read `KIT-START.md` at its root. Open `starter/` as the VS Code workspace when testing discovery, but run the verifier from the kit root.
3. Inspect `starter/.mcp.json`, `starter/server.js`, `verify.js` before editing.
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
Configure exactly one local stdio map-reader server using node and server.js. Review server code, transport and data before running the verifier. Do not add credentials or remote URLs.
Do not implement yet. Identify affected files, the negative case and a safe reset.
```

### 3. Implement the reviewed slice

1. Approve only the named starter artifact and necessary focused tests.
2. Ask Agent to implement one slice; inspect proposed commands before execution.
3. Run `node verify.js` again from the kit root, or `node ../verify.js` from `starter/`.
4. Compare the exact result with the checkpoint below and review the complete diff.
5. Record host discovery or live activity separately when available. Do not enable extra services to manufacture a passing result.

> [!IMPORTANT]
> **Checkpoint:** The protocol verifier receives the expected server identity, read_map discovery and the nexus structured result.
> The direct protocol check does not prove that a specific VS Code harness discovered this file. Use the supported host configuration only in this disposable workspace.

### 4. Prove a check can reject a mistake

Change the configured argument to a different file and confirm configuration validation fails before a tool result is accepted. Restore server.js.

| Observation | Decision | Action | Evidence | Limitation |
| --- | --- | --- | --- | --- |
| Initial state and exact diagnostic | Why this change is needed | Named file and bounded change | Command, exit code and observed result | What the local check does not prove |

Finish with the adventure-specific capability evidence in [the rubric](rubric.md), not just the presence of a file.

## Intentional failure: The Uncharted Server

Perform this only in a disposable environment:

Consider installing a server based only on its name. Stop before installation and list unanswered publisher, permission, destination, and side-effect questions. Discovery without trust evaluation is unsafe.

### Recovery

Return to Ask, identify the violated boundary, narrow the plan, remove unnecessary authority or context, and repeat the smallest relevant verification. Document the causal lesson rather than merely stating that the attempt failed.

## Independent challenge

Compare two servers for the same task using capability fit, data exposure, authentication, and verifiability.

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

[The Knowledge Graph of Lumoria](../../03-advanced/lumoria-graph/README.md)
