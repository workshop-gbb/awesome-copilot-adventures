---
title: Learning order and scope
layout: default
nav_order: 4
permalink: /learning-path/
last_verified: "2026-09-07"
---

# One clear next step

You do not have to complete every language, install every runtime or use every
agent feature. Choose a path, prove its prerequisites and move on when the evidence
is ready. Course levels describe complexity, not a certification.

> [!TIP]
> **Recommended first route:** [Start here](start-here.md) → lab 01 → one language
> through labs 02–05 → customization → one advanced scenario.
> If you prefer short fantasy stories, take the adventure route instead.

## What is required?

| Label | Meaning | Example |
| --- | --- | --- |
| **Required** | Needed for the chosen exercise's acceptance criteria | Its runtime, baseline, scoped change, negative check, review and reset |
| **Optional** | Adds another experience without blocking the local lesson | A GitHub repository, second language, Codespace, UI or live integration explicitly labeled optional |
| **Advanced** | Requires earlier mental models and additional review | External tools, parallel ownership, SDK identity, cloud execution and modernization |
| **Maintainer** | Changes this curriculum, not the learner's application | Site builds, packaging, translations and publishing |

Copilot access is required for live AI practice, not for inspecting source or
running deterministic local checks. If access is unavailable, record that limit
instead of presenting a simulation as a real agent run.

## Route A — Professional hands-on practice

### Stage 1: orient yourself

1. Complete [Start here](start-here.md) for one verified change.
2. Complete [01 — Context and interface](../mslearn-github-copilot/Instructions/Labs/LAB_AK_01_examine_settings_interface.md).
3. Explain role, harness, environment and permissions using your own session.

**Exit evidence:** a passing baseline, a reviewed change, a negative assertion and
an honest record of which tools were available.

### Stage 2: choose one application language

| Order | C# route | Python route | Why this comes next |
| --- | --- | --- | --- |
| Prepare | [C# environment](../mslearn-github-copilot/Instructions/Labs/LAB_AK_00_configure_lab_environment.md) | [Python environment](../mslearn-github-copilot/Instructions/Labs/LAB_AK_00_configure_lab_environment_py.md) | Select the correct runtime and working directory |
| 02 | [Analyze/document](../mslearn-github-copilot/Instructions/Labs/LAB_AK_02_analyze_document_code.md) | [Analyze/document](../mslearn-github-copilot/Instructions/Labs/LAB_AK_02_analyze_document_code_py.md) | Understand the existing application before changing it |
| 03 | [Develop a feature](../mslearn-github-copilot/Instructions/Labs/LAB_AK_03_develop_code_features.md) | [Develop a feature](../mslearn-github-copilot/Instructions/Labs/LAB_AK_03_develop_code_features_py.md) | Connect acceptance criteria to an end-to-end behavior |
| 04 | [xUnit tests](../mslearn-github-copilot/Instructions/Labs/LAB_AK_04_develop_unit_tests_xunit.md) | [pytest tests](../mslearn-github-copilot/Instructions/Labs/LAB_AK_04_develop_unit_tests_pytest.md) | Learn whether tests actually detect a wrong result |
| 05 | [Safe refactoring](../mslearn-github-copilot/Instructions/Labs/LAB_AK_05_refactor_improve_existing_code.md) | [Safe refactoring](../mslearn-github-copilot/Instructions/Labs/LAB_AK_05_refactor_improve_existing_code_py.md) | Change structure while preserving observable behavior |

Each kit starts from its own declared baseline. Your solution from the previous
exercise is not silently required by the next kit. Do not overwrite one copy with
another; preserve the evidence from each attempt.

### Stage 3: practice an engineering decision

Choose the scenario that matches your work. They are not seven prerequisites for
every advanced lab.

| Labs | Scenario | Preparation |
| --- | --- | --- |
| [06](../mslearn-github-copilot/Instructions/Labs/LAB_AK_06_vibe_coding_prototype_ecommerce_app.md) | Accessible shopping prototype | Node, browser, small PRD |
| [07](../mslearn-github-copilot/Instructions/Labs/LAB_AK_07_consolidate_duplicate_code.md), [08](../mslearn-github-copilot/Instructions/Labs/LAB_AK_08_refactor_large_functions.md), [09](../mslearn-github-copilot/Instructions/Labs/LAB_AK_09_simplify_complex_conditionals.md) | Duplication, extraction and decision rules | C# basics and characterization tests |
| [10](../mslearn-github-copilot/Instructions/Labs/LAB_AK_10_implement_performance_profiling.md) | Bounded profiling | C#; a small workload and unchanged functional output |
| [11](../mslearn-github-copilot/Instructions/Labs/LAB_AK_11_resolve_github_issues.md) | Issue to reviewed change | Local regression test; remote PR optional |
| [12](../mslearn-github-copilot/Instructions/Labs/LAB_AK_12_resolve_github_secret_scanning_alerts.md) | Credential-free incident simulation | Node; no real token or provider operation |

### Stage 4: customization and advanced scenarios

Start with [15 — Customization](../mslearn-github-copilot/Instructions/Labs/LAB_AK_15_configure_customize_github_copilot_vscode.md)
once you can verify a small change. Then select a purpose, not simply the next number:

| Purpose | Sequence | Evidence boundary |
| --- | --- | --- |
| Specify a new product | [Spec Kit setup](../mslearn-github-copilot/Instructions/Labs/LAB_AK_00_configure_github_dev_kit_lab.md) → [13 — Greenfield](../mslearn-github-copilot/Instructions/Labs/LAB_AK_13_get-started-spec-driven-development.md) | Local RSS contract; no remote feed fetching |
| Add behavior to an existing app | Setup → [14 — Brownfield](../mslearn-github-copilot/Instructions/Labs/LAB_AK_14_implement-spec-driven-development.md) | Old and new contracts pass together |
| Change storage without changing consumers | Setup → [17 — Modernization](../mslearn-github-copilot/Instructions/Labs/LAB_AK_17_modernize_existing_app_spec_kit.md) | Data reconciliation, non-overwrite and rollback |
| Embed an agent runtime | [SDK setup](../mslearn-github-copilot/Instructions/Labs/LAB_AK_00_configure_github_copilot_sdk_lab.md) → [16 — SDK](../mslearn-github-copilot/Instructions/Labs/LAB_AK_16_develop_ai_enabled_apps_github_copilot_sdk.md) | Offline tool/lifecycle tests; authenticated inference recorded separately |

## Route B — Story-supported adventures

Use [the adventure map](curriculum-map.md) in this order:

| Stage | Sequence | Ready to continue when… |
| --- | --- | --- |
| Foundations | Portals of Nexus → Context Mirrors | You separate role, harness and environment and can ground an answer in files |
| Basics | Tempora Loop → Laws of Eldoria | You can bound iteration and write scoped, testable instructions |
| Intermediate | Skills of Algora → Agents of Stellaris → Guardrails of Stonevale | You distinguish expertise, role, handoff and deterministic policy |
| Advanced | MCP Cartographer → Lumoria Graph → Parallel Mythos | You can describe trust boundaries, dependencies and independent ownership |
| Surfaces | Cloud Citadel → Terminal Gate → Automaton Foundry | You distinguish contract validation from actual remote/runtime execution |
| Capstone | Convergence of Three Realms | You can map requirements to actors, environments, artifacts and reviewed evidence |

Every adventure includes a corresponding lab, a failure exercise and a rubric.
Download [one kit](downloads.md) at a time. The story is a memory aid; correctness
still comes from the lab's acceptance criteria.

## What “basic to advanced” does and does not mean

| Covered by this kit | Not automatically established |
| --- | --- |
| Investigation, planning, implementation, testing and review | Mastery of every programming language or every Copilot feature |
| Local exercises for instructions, skills, agents, MCP and parallel tasks | Universal host support or permission to install arbitrary servers |
| Spec-driven greenfield, feature and modernization workflows | A production migration or support for every data platform |
| SDK boundaries and optional live requests | Model quality across real users or production-scale traffic |
| Cloud-task contracts and optional authorized delegation | A cloud run merely because a JSON verifier passed |
| Accessible learning graphics and UI checks where relevant | A blanket accessibility certification of every student solution |

The kit teaches a method and supplies evidence-producing exercises. Additional
production concerns—operations, compliance, real identity, deployment and broader
evaluation—require their own requirements and verification.

## Pick a realistic stopping point

- **First session:** finish the greeting exercise and explain your evidence.
- **Application practice:** complete one language's 02–05 sequence.
- **Team workshop:** choose one engineering scenario, then a reviewed handoff.
- **Advanced practice:** complete one integration scenario and label local versus live evidence.

Do not rush to the capstone by skipping a failed prerequisite. Use the
[setup guide](../mslearn-github-copilot/Instructions/Reference/SETUP.md) for environment
blockers and the lesson's troubleshooting for behavior failures.

| Previous | Next |
| --- | --- |
| [Start here](start-here.md) | [Download your selected kit](downloads.md) |
