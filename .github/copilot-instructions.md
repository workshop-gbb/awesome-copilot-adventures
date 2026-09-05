# Repository instructions

This repository is an educational curriculum for agentic development with GitHub Copilot.

## Priorities

1. Technical accuracy against current official GitHub and Microsoft documentation.
2. Reproducible learning with observable evidence.
3. Clear separation of role, harness, execution environment, and customization primitive.
4. Accessible fantasy storytelling that supports rather than obscures the lesson.

## Structure

- Write current adventures in `adventures/<level>/<slug>/`.
- Put executable starters in `labs/<slug>/`.
- Put current site pages in `docs/`.
- Put generated media in `assets/`.
- Treat `legacy/` as read-only historical material unless the task explicitly targets it.

## Adventure format

Each adventure must include metadata, official references, story, objectives, prerequisites, concepts, Ask → Plan → Agent workflow, guided mission, intentional failure, independent challenge, evidence checklist, reset instructions, and a rubric.

## Guardrails

- Use “Model Context Protocol,” never “Model Control Protocol.”
- Use `.agent.md` for custom agents; do not teach deprecated custom chat modes.
- Mark hooks, memory, or experimental features with their documented status.
- Do not state that a tool, model, or target is universally available.
- Do not claim performance or productivity improvements without executed evidence.
- Never commit secrets or real API keys.

## Validation

Run `npm test` after documentation or JavaScript changes. Run the targeted language build/test when changing a solution.
