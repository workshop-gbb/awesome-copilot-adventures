# Hooks lab

Hooks run deterministic commands at documented agent lifecycle events. They are useful when a rule must be enforced rather than merely suggested.

Hook support and configuration can vary by Copilot surface and may be preview. Before enabling the example from the Stonevale adventure:

1. verify the current [VS Code hooks documentation](https://code.visualstudio.com/docs/agent-customization/hooks);
2. confirm the event names and configuration location for the selected harness;
3. run only repository-owned scripts;
4. avoid printing secrets or unrestricted environment variables;
5. fail with a clear, actionable message.

`session-context.json` is a minimal, non-destructive `SessionStart` example. It validates the JSON received on standard input and injects repository guidance. The Stonevale lab then teaches a `PreToolUse` guardrail without enabling a command blocker globally.

Hooks are **Preview** in VS Code as of 2026-09-05. Verify the schema before extending the example.
