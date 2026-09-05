---
layout: default
title: Glossary
nav_order: 7
permalink: /glossary/
---

# Glossary

| Term | Meaning |
| --- | --- |
| **Agent** | A system that pursues a goal, invokes permitted tools, observes results, and iterates within a harness. |
| **Ask / Plan / Agent** | Roles used to investigate, design, and execute. They are not environments or models. |
| **Context** | Information available to the current task, including conversation, files, instructions, selections, and tool results. |
| **Custom agent** | A `.agent.md` role definition with instructions, tools, and optional handoffs. |
| **Environment** | Where files and processes exist: folder, worktree, Codespace, local machine, or remote ephemeral workspace. |
| **Evidence** | Observable support for a claim: command output, exit status, test result, diff, trace, or review record. |
| **Harness** | Runtime that hosts an agent and mediates tools, permissions, context, sessions, and lifecycle. |
| **Handoff** | Transfer of a concrete task or artifact between roles, agents, harnesses, or environments. |
| **Hook** | Deterministic command invoked at a documented lifecycle event. Hooks are Preview in VS Code as of 2026-09-05. |
| **Instructions** | Guidance applied automatically, globally or for matching paths or tasks. |
| **Model Context Protocol (MCP)** | Protocol for connecting AI hosts to external tools, resources, and prompts. |
| **Prompt file** | Manually invoked reusable task template, primarily associated with the VS Code Local harness. |
| **Session** | Conversation, context, tool calls, and execution state managed by an agent harness. |
| **Skill** | Reusable expertise and resources loaded when relevant to a task. |
| **Subagent** | Focused agent invoked in separate context that returns a result to a coordinating agent. |
| **Target** | Destination selected for a session, such as Local, Copilot, or Cloud in VS Code. |
| **Tool** | Permitted operation such as reading, searching, editing, running a command, or calling an external system. |
| **Worktree** | Git working tree for a separate branch. It isolates code changes, not security permissions. |

> [!NOTE]
> **Model**, **role**, **harness**, **target**, and **environment** answer different questions. Avoid using “agent” as a catch-all for all five.
