# Stonevale Guardrails lab

Implement deterministic command guardrails before an automation step reaches a shell.

## Mission

Complete `starter/guard.js`. `isAllowed(command)` must return `true` only when:

- the input is a non-empty string;
- the executable is `node`;
- the script is `verify.js` or `test.js`;
- no shell operators, substitutions, absolute paths, or parent traversal appear.

Run `node verify.js`.
