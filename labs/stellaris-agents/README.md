# Agents of Stellaris lab

Define a focused custom agent using the current `.agent.md` customization format.

## Isolate the exercise

Copy this lab to a disposable location and open `starter/` as the workspace root. Start a new session so `.github/agents/test-scout.agent.md` is discovered from the correct root.

## Mission

Complete `starter/.github/agents/test-scout.agent.md`. It must include frontmatter fields for `name`, `description`, and `tools`, then instruct the agent to:

- inspect existing tests before recommending changes;
- remain read-only with respect to source edits and recommend only test-focused changes;
- run the smallest relevant test command;
- report evidence and remaining failures.
- hand off a concrete test plan to the built-in Agent role for implementation.

From `starter/`, run `node ../verify.js`. Record separate evidence that the agent appears in the selected harness and that its handoff is available where supported.
