---
title: "The Convergence of Three Realms Rubric"
layout: default
nav_exclude: true
status: "ready"
last_verified: "2026-09-05"
---

# Rubric: The Convergence of Three Realms

> [!IMPORTANT]
> Use observable evidence only. Confidence without a path, diff, command result, trace, or platform record earns no credit.

## Scoring

| Criterion | 0 — Missing | 1 — Emerging | 2 — Proficient | 3 — Exemplary |
|---|---|---|---|---|
| Technical model | Terms are missing or conflated. | Some terms are correct but boundaries are unclear. | Roles, harnesses, targets, environments, and relevant primitives are separated. | Boundaries and limitations are precise and justified with official documentation. |
| Capability evidence | No adventure-specific artifact or verifier output. | An artifact exists but does not prove the named capability. | The six-stage local, cloud, SDK, and human-review graph passes `node labs/convergence-of-three-realms/verify.js`. | The evidence also demonstrates limitations, failure recovery, and independent reproducibility. |
| Ask evidence | No investigation evidence. | Findings are mostly conversational. | Findings cite current repository or platform evidence. | Conflicts and uncertainty are resolved or explicitly carried forward. |
| Plan quality | No bounded plan or reset. | Scope, risks, or checks are incomplete. | Scope, non-goals, risks, verification, review, and reset are defined. | Authority is minimized and dependency, stop, and fallback gates are explicit. |
| Agent execution | No result or fallback. | Work is broad, incomplete, or weakly verified. | Work follows the plan and passes the relevant available check. | Iterations are surgical, evidence-rich, and free of unrelated changes. |
| Failure analysis | Failure exercise skipped. | Failure observed but not explained. | Root cause and recovery are correct. | The lesson becomes a reusable guardrail or decision rule. |
| Review and evidence | No independent review. | Outputs exist without criteria traceability. | Artifacts and checks are reviewed against acceptance criteria. | Evidence is reproducible and another learner can independently verify it. |
| Cleanup | Exercise state remains. | Cleanup is partial. | Reset is complete and clean state is verified. | Credentials, sessions, servers, and cloud resources are also accounted for. |

## Required evidence

- The six-stage local, cloud, SDK, and human-review graph passes `node labs/convergence-of-three-realms/verify.js`.

- Source-grounded Ask findings.
- A bounded Plan with acceptance criteria and reset.
- Agent output, diff, or documented paper fallback.
- Relevant verification output.
- Intentional-failure analysis and recovery.
- Independent challenge result.
- Explicit feature-status and availability notes.
- Verified cleanup record.

## Completion rule

- Score at least **16/24** overall.
- Score **2 or higher** for Capability evidence, Ask evidence, Plan quality, Agent execution, and Review and evidence.
- Any exposed secret, unapproved destructive action, fabricated result, or unsupported availability claim means **not complete**, regardless of score.

## Reviewer prompts

1. Is every important claim tied to current evidence?
2. Was the minimum necessary authority used?
3. Do the checks observe the requested behavior?
4. Are Preview, experimental, and unavailable capabilities labeled accurately?
5. Can another learner reproduce both the result and cleanup?

## Result

| Item | Value |
|---|---|
| Total score | /24 |
| Mandatory criteria met | Yes / No |
| Safety disqualifier present | Yes / No |
| Final decision | Complete / Revise |
| Reviewer evidence | |
