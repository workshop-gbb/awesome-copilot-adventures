---
layout: default
title: Feature Status
nav_order: 6
permalink: /feature-status/
---

# Feature status matrix

**Last verified:** 2026-09-05

This page records the status explicitly documented by current official GitHub and Microsoft sources. “Documented” means the cited primary page does not label the capability Preview; it does not guarantee availability for every account, plan, policy, client, or environment.

| Capability | Documented status | Important boundary |
| --- | --- | --- |
| Local, Copilot, and Cloud targets | Documented; no general Preview label | Local and Copilot are harness choices; Cloud is a remote target |
| Ask, Plan, and Agent roles | Documented; no general Preview label | Additional tools for Plan are experimental |
| Custom agents in VS Code | Documented; no general Preview label | IDE and cloud properties can differ |
| Custom agents in JetBrains, Eclipse, and Xcode | Public preview | Check the IDE-specific documentation |
| Custom instructions | Documented; no general Preview label | Nested `AGENTS.md` behavior is experimental |
| Prompt files | Documented; no general Preview label | Agent Host sessions do not use prompt files |
| Prompt-to-skill migration | Experimental | Review generated skills before use |
| Agent Skills | Documented; no general Preview label | `gh skill` is public preview |
| Agent hooks in VS Code | **Preview** | Schema and behavior can change |
| MCP in VS Code | Documented; no general Preview label | Local servers execute code and require trust review |
| MCP in Copilot SDK | Evolving capability | Verify the current SDK feature page |
| Subagents in VS Code | Documented; no general Preview label | They consume separate context, time, and credits |
| Agents window | **Preview** | UI and behavior can change |
| Copilot CLI | Documented; no general Preview label | Local and cloud sandbox capabilities are public preview |
| Copilot cloud agent | Documented; no general Preview label | Availability, policy, network, and repository access vary |
| Teams and Slack research/planning integrations | Public preview | GitHub.com capabilities can have different status |
| Copilot SDK | No general lifecycle label on the overview | Language and feature support must be verified individually |

> [!WARNING]
> Never infer support in one harness from support in another. Verify the exact surface used by the learner.

## Primary references

- [Agent harnesses](https://code.visualstudio.com/docs/agents/concepts/agent-harnesses)
- [Planning with agents](https://code.visualstudio.com/docs/agents/run/planning)
- [Custom agents](https://code.visualstudio.com/docs/agent-customization/custom-agents)
- [Custom instructions](https://code.visualstudio.com/docs/agent-customization/custom-instructions)
- [Prompt files](https://code.visualstudio.com/docs/agent-customization/prompt-files)
- [Agent Skills](https://code.visualstudio.com/docs/agent-customization/agent-skills)
- [Agent hooks — Preview](https://code.visualstudio.com/docs/agent-customization/hooks)
- [MCP servers](https://code.visualstudio.com/docs/agent-customization/mcp-servers)
- [Subagents](https://code.visualstudio.com/docs/agents/run/subagents)
- [Agents window — Preview](https://code.visualstudio.com/docs/agents/run/agents-window)
- [Copilot CLI](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli)
- [Copilot cloud agent](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent)
- [Copilot SDK](https://docs.github.com/en/copilot/how-tos/copilot-sdk)
