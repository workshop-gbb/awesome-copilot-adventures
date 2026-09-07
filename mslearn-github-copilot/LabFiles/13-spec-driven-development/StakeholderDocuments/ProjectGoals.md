# Project goals

Create a small, local RSS subscription component that demonstrates specification-
driven development with observable evidence.

## Scope

- Add a normalized HTTP(S) feed URL.
- List subscriptions in insertion order.
- Reject invalid or duplicate input without partial state.
- Return copies so callers cannot change stored records.

## Constraints

- Standard-library implementation for the primary Node exercise.
- No network requests, credentials, real user data, polling or persistence.
- No generated performance/productivity claims.
- One bounded implementation slice at a time.
- Keep acceptance tests unchanged unless a reviewed requirement changes.

## Completion

The supplied contract tests pass, an intentionally wrong implementation is rejected,
and the learner can trace each requirement to a spec, plan, task and executed check.
A UI, if added independently, requires its own accessibility and navigation evidence.

See [AppFeatures.md](AppFeatures.md) and [TechStack.md](TechStack.md).
