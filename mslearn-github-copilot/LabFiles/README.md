# Hands-on fixtures

Each fixture supports one numbered exercise in the [catalog](../index.md).
Use `scripts/prepare-hands-on.js` from the repository root to copy only the selected
fixture to an unused directory outside the curriculum.

## Behavior categories

- **Runnable baselines:** interface, library, cart, inventory and SDK offline tests.
- **Intentionally incomplete:** the issue equality boundary, greenfield store,
  brownfield metadata and modernization storage adapter.
- **Instructor references:** `reference/` directories; the preparation script omits
  them so the learner must implement the exercise.
- **Historical console illustrations:** example output and architecture notes are
  not executed evidence or coverage reports.

## Verification

The root `npm test` checks source links, metadata, diagrams and selected deterministic
Node fixtures. Python and .NET tests are executed separately using the commands in
the audit/reference guidance. No live model, provider or cloud operation is triggered
by the root test.

Use the [resource-limited setup](../Instructions/Reference/SETUP.md) before commands.
Retain the [license](../LICENSE) when redistributing a copy.
