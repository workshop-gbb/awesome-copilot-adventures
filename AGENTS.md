# Copilot Adventures Development Guide

## Purpose

Copilot Adventures teaches agentic software engineering with GitHub Copilot. Optimize for correct mental models, reproducible laboratories, verifiable evidence, and current official terminology.

## Source of truth

- Current curriculum: `adventures/`
- Starter projects and verification: `labs/`
- Site: `docs/`
- Shared customizations: `.github/`
- Historical material: `legacy/`

Do not copy guidance from `legacy/` into current adventures without revalidating it against official GitHub or Microsoft documentation.

Do not enable a workspace-wide MCP server by default. MCP configuration belongs in a disposable lab workspace and must use a reviewed, bounded server.

## Adventure requirements

Each adventure directory contains:

- `README.md` with status, last verification date, prerequisites, guided mission, failure exercise, independent challenge, evidence, reset, and official references;
- `rubric.md` with observable completion criteria;
- a deterministic lab under `labs/` when code or configuration is modified;
- a hero reference under `assets/images/adventures/`.

Use one progressive workflow: Ask for investigation, Plan for design, Agent for implementation, and a clean review phase. Do not create parallel Ask-only and Agent-only copies.

## Terminology

- **Role:** Ask, Plan, Agent, or a custom agent.
- **Harness/surface:** VS Code Copilot agent host, VS Code local extension host, Copilot CLI, GitHub cloud agent, or an application built with the Copilot SDK.
- **Environment:** folder, worktree, Codespace, local machine, or remote ephemeral environment.
- **Instructions:** automatically applied context.
- **Prompt:** manually invoked task template.
- **Skill:** reusable expertise loaded when relevant.
- **Custom agent:** role, tools, instructions, and optional handoffs.
- **MCP:** Model Context Protocol.
- **Hook:** deterministic command around lifecycle events; label preview behavior explicitly.

## Content rules

- Use official GitHub and Microsoft documentation as primary references.
- Include `last_verified: 2026-09-05` or a newer real verification date.
- State preview or experimental status when the official documentation does.
- Never invent benchmark results, productivity percentages, compatibility, or tool availability.
- Explain what evidence proves completion.
- Use accessible language and meaningful alt text.
- Keep fantasy storytelling subordinate to the learning objective.

## Code rules

- Prefer standard libraries and deterministic local tests.
- Keep starter failures intentional and documented.
- Do not store credentials. Use environment variables and add `.env.example` only when a current lab genuinely requires named variables.
- Validate the smallest relevant surface before running broader checks.
- Preserve legacy files unless a migration explicitly replaces them.

## Validation

```bash
npm test
dotnet build solutions/csharp/CopilotAdventures.sln
python solutions/python/test_gridlock_arena.py
```

For site changes, also verify Markdown links and the Pages workflow.
