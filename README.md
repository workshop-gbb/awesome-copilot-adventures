<p align="center">
  <img src="./assets/images/legacy/copilot-adventures.png" width="880" alt="Fantasy adventurers exploring a luminous landscape of software engineering challenges">
</p>

<h1 align="center">Awesome Copilot Adventures</h1>

<p align="center">
  An evidence-first, fantasy-themed curriculum for agentic software engineering with GitHub Copilot.
</p>

<p align="center">
  <a href="https://workshop-gbb.github.io/awesome-copilot-adventures/"><img alt="GitHub Pages availability" src="https://img.shields.io/website?url=https%3A%2F%2Fworkshop-gbb.github.io%2Fawesome-copilot-adventures%2F&label=Pages"></a>
  <a href="./LICENSE"><img alt="MIT license" src="https://img.shields.io/badge/license-MIT-8250df"></a>
  <a href="./docs/feature-status.md"><img alt="Official documentation verified on 2026-09-05" src="https://img.shields.io/badge/official%20docs-verified%202026--09--05-0969da"></a>
</p>

<p align="center">
  <a href="https://workshop-gbb.github.io/awesome-copilot-adventures/"><strong>Explore the learning site</strong></a>
  ·
  <a href="https://codespaces.new/workshop-gbb/awesome-copilot-adventures?quickstart=1"><strong>Open in Codespaces</strong></a>
  ·
  <a href="./docs/curriculum-map.md"><strong>View the curriculum</strong></a>
</p>

> [!IMPORTANT]
> This curriculum teaches **agents and agentic engineering**, not deprecated custom chat modes. Ask, Plan, Agent, custom agents, harnesses, environments, and customization primitives are taught as separate concepts.

## The learning loop

Every adventure follows the same evidence-producing workflow:

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
    accTitle: Evidence-first development workflow
    accDescr: Investigation leads to planning, implementation, review and evidence; unresolved gaps return to investigation.
    A["Ask<br/>Investigate"] --> P["Plan<br/>Design"]
    P --> G["Agent<br/>Implement"]
    G --> R["Review<br/>Challenge"]
    R --> E["Evidence<br/>Prove"]
    E -. "gaps found" .-> A
```

**Legend.** Rectangles are workflow stages. Solid arrows show the normal progression; the dashed arrow returns unresolved evidence gaps to investigation.

**Explanation.** A fluent response is not completion. The loop ends only when the reviewed result meets the acceptance criteria and the recorded checks support it.

- **Ask** inspects facts, constraints, context, and unknowns.
- **Plan** defines scope, risks, trust boundaries, and validation.
- **Agent** edits, invokes tools, observes results, and iterates.
- **Review** challenges the result from a clean or specialized context.
- **Evidence** records commands, exit codes, diffs, limitations, and decisions.

> [!NOTE]
> A role is not a harness. Local and Copilot are VS Code agent harnesses; Cloud is a remote session target; Copilot CLI is a terminal surface; and the Copilot SDK embeds an agent runtime in an application. Availability depends on account, policy, client, and environment.

## Curriculum

| Level | Focus | Adventures |
| --- | --- | --- |
| **00 · Foundations** | Roles, harnesses, context, and evidence | [Portals of Nexus](./adventures/00-foundations/portals-of-nexus/) · [Context Mirrors](./adventures/00-foundations/context-mirrors/) |
| **01 · Basics** | Bounded loops and repository instructions | [Tempora Loop](./adventures/01-basics/tempora-loop/) · [Laws of Eldoria](./adventures/01-basics/eldoria-laws/) |
| **02 · Intermediate** | Skills, custom agents, and guardrails | [Skills of Algora](./adventures/02-intermediate/algora-skills/) · [Agents of Stellaris](./adventures/02-intermediate/stellaris-agents/) · [Guardrails of Stonevale](./adventures/02-intermediate/stonevale-guardrails/) |
| **03 · Advanced** | MCP, orchestration graphs, and parallel sessions | [MCP Cartographer](./adventures/03-advanced/cartographer-mcp/) · [Lumoria Graph](./adventures/03-advanced/lumoria-graph/) · [Parallel Mythos](./adventures/03-advanced/mythos-parallel/) |
| **04 · Surfaces** | Cloud agent, Copilot CLI, and Copilot SDK | [Cloud Citadel](./adventures/04-surfaces/cloud-citadel/) · [Terminal Gate](./adventures/04-surfaces/terminal-gate/) · [Automaton Foundry](./adventures/04-surfaces/automaton-foundry/) |
| **99 · Capstone** | End-to-end governed agentic delivery | [Convergence of Three Realms](./adventures/99-capstone/convergence-of-three-realms/) |

See the visual [Curriculum Map](./docs/curriculum-map.md) and current [Feature Status Matrix](./docs/feature-status.md).

## Hands-on companion track

The [Hands-on Labs](./mslearn-github-copilot/index.md) are numbered professional
exercises, **not new adventures**. They retain the imported exercise/task format
with revised explanations, local fixtures, negative cases, and safe reset.

- C# and Python: source investigation, book availability, tests and refactoring.
- Engineering: accessible prototyping, duplication, complex conditions and bounded profiling.
- Collaboration: local issue reproduction and credential-free secret-remediation practice.
- Spec Kit: **greenfield, brownfield feature work, and CSV-to-SQLite modernization**.
- Customization and SDK: instructions, prompts, skills, agent handoffs, restricted tools and lifecycle tests.

Read the [lab-by-lab audit](./mslearn-github-copilot/Instructions/Reference/AUDIT.md)
and [monochrome diagram standard](./docs/diagram-style.md). All Mermaid diagrams use
white, ice, grays and black, with accessible labels, legends and explanations.

## Customization primitives

Use the smallest primitive that supplies the missing behavior:

| Need | Primitive |
| --- | --- |
| Context applied automatically | Repository or path-specific instructions |
| A manually invoked repeatable task | Prompt file |
| Reusable expertise loaded when relevant | Agent Skill |
| A role with selected tools and optional handoffs | Custom agent |
| Access to an external capability | Model Context Protocol server |
| Deterministic lifecycle enforcement | Hook |

The [Customization Primitives guide](./docs/customization-primitives.md) includes a decision diagram and portability notes.

## Quick start

```bash
gh repo clone workshop-gbb/awesome-copilot-adventures
cd awesome-copilot-adventures
npm install
npm test
```

For the complete environment, reopen the repository in its Dev Container.

## Multilingual learning site

The Astro site contains the complete current learning library in
[English](https://workshop-gbb.github.io/awesome-copilot-adventures/en/),
[Spanish](https://workshop-gbb.github.io/awesome-copilot-adventures/es/) and
[Brazilian Portuguese](https://workshop-gbb.github.io/awesome-copilot-adventures/pt-br/).
Language switches preserve the document and its section.

The repository explorer includes original starters, tests, solutions, data,
customizations, media, licenses and clearly identified historical material.
Code and executable examples keep their original text. Downloads are checked
against their SHA-256 inventory before use.

```bash
npm run build:site
npm run check:astro
npm run check:site:rendered -- dist
npm run preview:site -- --host 127.0.0.1
```

The build is static, uses one page-rendering worker, and does not require Ruby,
Jekyll, a model API or a database. See the [publishing guide](docs/site-publishing.md)
and [design system](docs/DESIGN.md).

## Repository map

```text
adventures/           Current progressive curriculum and rubrics
labs/                 Starter exercises and deterministic verifiers
solutions/            Reference implementations for legacy challenges
.github/agents/       Reusable custom agents
.github/skills/       Progressively loaded Agent Skills
.github/prompts/      Manually invoked prompt files
.github/instructions/ Path-scoped instructions
.github/hooks/        Preview hook examples and guidance
docs/                 Canonical guide content
site/                 Astro layouts, components and routes
site-locales/          Reviewed Spanish and Brazilian Portuguese prose
site-generated/       Ignored, reproducible publication input
assets/               Current, legacy, and generated media
legacy/               Preserved version-one curriculum
shared/               Deterministic shared data
```

## Validation

```bash
npm test
dotnet build solutions/csharp/CopilotAdventures.sln
python solutions/python/test_gridlock_arena.py
```

The checks validate current Markdown links, curriculum structure, customization files, lab syntax, the Context Mirrors baseline, reference solutions, complete translation coverage and original-source integrity.

## Media

Production hero files are intentionally pending so unrelated artwork is never published under inaccurate alt text. The complete prompts for Banana Pro are in [Media Prompts](./docs/media-prompts.md), including:

- 14 adventure hero images;
- three site illustrations;
- five optional motion assets;
- filenames, dimensions, alt text, poster requirements, and reduced-motion guidance.

## Contributing

Read [CONTRIBUTING.md](./CONTRIBUTING.md) before proposing an adventure. Contributions must use current official GitHub or Microsoft sources, include deterministic evidence, mark preview behavior, and avoid unsupported availability or performance claims.

## Project policies

- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Security Policy](./SECURITY.md)
- [Support](./SUPPORT.md)
- [Attribution](./NOTICE.md)
- [MIT License](./LICENSE)

Historical Ask/Agent pairs remain under [legacy/adventures-v1](./legacy/adventures-v1/) for comparison, not as current product guidance.
