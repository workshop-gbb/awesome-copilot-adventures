# Automaton Foundry lab

> [!TIP]
> [Download the learner ZIP](../../assets/lab-kits/adventures/automaton-foundry.zip) or copy this whole lab to an unused folder. Read [setup and optional GitHub steps](../../docs/downloads.md) first.

## Before you run anything

| Item | Contract |
| --- | --- |
| Runtime | Node 24; live integrations are separate |
| Files to inspect | `starter/index.ts`, `starter/package.json`, `starter/evaluation.json`, `verify.js` |
| Verifier directory | Extracted kit root: `node verify.js`; from `starter/`: `node ../verify.js` |
| Starting state | Unfinished starter is rejected; preserve the diagnostic |
| Finish evidence | The structural verifier accepts the source and five declared cases; live results, if any, are recorded separately. |

**Concept in practice:** An application can send a prompt and print a response yet still fail on timeout or unsupported requests. Its evaluation plan must ask what evidence distinguishes these paths.


Build and evaluate a minimal TypeScript application with the GitHub Copilot SDK.

## Isolate the exercise

Copy this lab to a disposable location and open `starter/` as the workspace root. Do not add credentials to source files.

## Mission

1. Complete `starter/index.ts`:
   - read the prompt from command-line arguments;
   - create `CopilotClient`;
   - create a session with `model: "auto"`;
   - call `sendAndWait`;
   - print the returned content;
   - stop the client in `finally`.
2. Complete the five cases in `starter/evaluation.json`:
   - grounded explanation;
   - bounded plan;
   - verified implementation;
   - unsupported request;
   - controlled tool failure.
3. Run the deterministic structural verifier:

```bash
node ../verify.js
```

4. If Copilot CLI authentication is available, run the application:

```bash
npm install
npm start -- "Explain the evidence required before declaring a task complete."
```

Record the command, exit code, observed response, and authentication limitations. The verifier does not claim model quality or make a network call.

## Guided execution

1. Run the untouched verifier and record the expected initial state.
2. Ask for a source-grounded explanation of the relevant code and checks.
3. Plan: Complete the pinned TypeScript SDK lifecycle and CLI prompt input. Keep credentials out of source, stop the client in finally, and define five cases with expected evidence before any optional live request.
4. Implement only the approved slice, then rerun the same verifier.
5. Remove the client cleanup from the copied application and confirm structural rejection. Restore it; do not infer runtime cleanup merely from this static test.
6. Review the diff and record the limitation: The structural verifier does not measure model quality or authenticate the application. Follow the professional SDK lab for stronger offline tool and lifecycle tests.

## Completion and safe reset

- [ ] The required behavior and its negative case have observed evidence.
- [ ] The result distinguishes local verification from live host/runtime behavior.
- [ ] No credentials, unrelated files or services were changed.
- [ ] Evidence is saved before resetting the copied starter.

Use a new extraction for another attempt, or restore only named files from a Git baseline created in this copy. Never apply a curriculum-root restore command from an unrelated project.

Continue with [the adventure and rubric](../../adventures/04-surfaces/automaton-foundry/README.md).
