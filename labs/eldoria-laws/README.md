# Laws of Eldoria lab

Create repository instructions that give an agent durable, testable constraints.

## Isolate the exercise

Copy this lab to a disposable location and open `starter/` as the workspace root. Start a new session so `.github/copilot-instructions.md` is discovered from the correct root.

## Mission

Replace the placeholder in `starter/.github/copilot-instructions.md`. The instructions must explicitly require:

- deterministic local tests;
- no credentials in source;
- changes limited to `src/`;
- verification before completion.

From `starter/`, run `node ../verify.js`. Capture host discovery evidence separately; the verifier checks content, not whether a session loaded it.
