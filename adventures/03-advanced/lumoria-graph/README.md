---
title: "The Knowledge Graph of Lumoria"
layout: default
parent: "Advanced"
grand_parent: "Adventure Catalog"
nav_order: 2
level: "03-advanced"
slug: "lumoria-graph"
status: "content-ready"
last_verified: "2026-09-05"
primary_capability: "Modeling source-grounded repository relationships"
---

# The Knowledge Graph of Lumoria


> [!NOTE]
> **Status:** Content ready · **Media:** Pending · **Last verified:** 2026-09-05  
> **Primary capability:** Modeling source-grounded repository relationships

> [!TIP]
> Production hero media is intentionally pending. Use the specification in [Media Prompts](../../../docs/media-prompts.md) before adding a production hero asset.

```mermaid
flowchart LR
    A["Ask<br/>Investigate"] --> P["Plan<br/>Design"]
    P --> G["Agent<br/>Implement"]
    G --> R["Review<br/>Challenge"]
    R --> E["Evidence<br/>Prove"]
    E -. "gap found" .-> A
```

## Official references

These official sources are the authority for product behavior and availability. Recheck them when using a different surface or after a product update.

- [Run subagents](https://code.visualstudio.com/docs/agents/run/subagents)
- [Custom agents and handoffs](https://code.visualstudio.com/docs/agent-customization/custom-agents)
- [Agent sessions](https://code.visualstudio.com/docs/agents/concepts/sessions)

## Story

Lumoria’s libraries are linked by luminous threads: imports, calls, tests, owners, requirements, and runtime edges.

The fantasy is a memory aid; the engineering lesson requires observable, reproducible evidence.

## Learning objectives

By the end, you can:

- Explain the primary capability in precise product language.
- Separate role, harness, target, environment, and customization primitive.
- Complete a bounded Ask → Plan → Agent workflow.
- Review tool use, changes, and verification evidence independently.
- State unavailable, Preview, experimental, or unverified behavior without guessing.

## Prerequisites

- Completion of the preceding adventure, or equivalent familiarity.
- A disposable repository or authorized sandbox.
- Access appropriate to the selected Copilot surface; availability is not assumed.
- An existing test, build, lint, validation, or review mechanism where applicable.

Never use production secrets, customer data, or irreversible resources. Use the paper fallback when a named service is unavailable.

## Concept explanation

A repository knowledge graph models files, symbols, tests, services, owners, and requirements with typed edges. Imports are not runtime calls, and co-location is not ownership. Graphs help only when bounded, current, and source-anchored. Generated relationships can become stale, so planning decisions must be confirmed against current files and executable checks.

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

Open the [Lumoria Graph lab](https://github.com/paulasilvatech/awesome-copilot-adventures/blob/main/labs/lumoria-graph/README.md) and implement cycle-safe dependency traversal.

Choose one behavior and trace its entry point, definitions, references, tests, configuration, and external boundaries. Create a small typed Mermaid or text graph with source evidence for every node and edge. Predict impact, make a reversible change, rerun discovery and tests, then update the graph from observations.

Record each material step in this table:

| Observation | Decision | Action | Evidence | Limitation |
|---|---|---|---|---|
| What was inspected? | Why this next step? | What changed or ran? | What proves it? | What remains unknown? |

### Guided acceptance criteria

- The initial state is supported by current evidence.
- The plan is bounded and contains a reset path.
- Agent work stays inside the declared scope.
- Verification observes the requested behavior.
- Review is independent from the implementation claim.

## Intentional failure: The Decorative Constellation

Perform this only in a disposable environment:

Draw relationships from filenames and assumptions without reading sources. Unsupported edges create false confidence and an incorrect change plan.

### Recovery

Return to Ask, identify the violated boundary, narrow the plan, remove unnecessary authority or context, and repeat the smallest relevant verification. Document the causal lesson rather than merely stating that the attempt failed.

## Independent challenge

Model a feature crossing source, configuration, tests, and an external API, including confidence and verification for every edge.

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

1. Restore the starter with `git restore labs/lumoria-graph/starter/graph.js`.
2. Remove only generated graph artifacts named by your plan.
3. Confirm `git status --short -- labs/lumoria-graph` is empty.

Cleanup is part of completion. Do not leave billable resources, credentials, processes, branches, or worktrees behind.

## Next adventure

[The Parallel Trials of Mythos](../../03-advanced/mythos-parallel/README.md)
